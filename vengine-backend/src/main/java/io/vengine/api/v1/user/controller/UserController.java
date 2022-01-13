package io.vengine.api.v1.user.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.enums.UserStatus;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.user.dto.JoinRequestDto;
import io.vengine.api.v1.user.dto.MailDto;
import io.vengine.api.v1.user.dto.UserDto;
import io.vengine.api.v1.user.entity.*;
import io.vengine.api.v1.user.mapper.UserMapper;
import io.vengine.api.v1.user.repository.TempUserRepository;
import io.vengine.api.v1.user.repository.UserLevelRepository;
import io.vengine.api.v1.user.repository.UserPersonalPendingRepository;
import io.vengine.api.v1.user.repository.UserRepository;
import io.vengine.api.v1.user.service.CompanyService;
import io.vengine.api.v1.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Api(tags = {"02. USER"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class UserController {

    private final UserRepository userRepository;
    private final UserLevelRepository userLevelRepository;
    private final UserPersonalPendingRepository userPersonalPendingRepository;
    private final ResponseService responseService;
    private final UserService userService;
    private final CompanyService companyService;
    private final TempUserRepository tempUserRepository;

    private final PasswordEncoder passwordEncoder;

    @ApiOperation(value = "멤버 전체 조회", notes = "회원 조회 (ALL)")
    @GetMapping(value = "/users")
    public PageResult<UserDto.UserInfo> findAllUser(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @AuthenticationPrincipal User user
    ) {
        Page<User> userPage = userService.findAllUser(page, size, user.getCompId());
        CommonDto.PageDto<UserDto.UserInfo> pageDto = CommonDto.toPageDto(userPage, UserMapper.INSTANCE.toUserInfoDTO(userPage.getContent()));
        return responseService.getPageResult(pageDto);
    }

    @ApiOperation(value = "멤버 조회", notes = "멤버번호로 멤버 조회")
    @GetMapping(value = "/user")
    public SingleResult<UserDto.UserInfo> findUserById(
            @ApiParam(value = "멤버 번호", required = true) @RequestParam Long id
    ) {
        return responseService.getSingleResult(UserMapper.INSTANCE.toUserInfoDTO(userRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.USERID_NOT_FOUND))));
    }

    @ApiOperation(value = "멤버 조회(이메일)", notes = "이메일로 멤버 조회")
    @GetMapping(value = "/user/email")
    public SingleResult<UserDto.UserInfo> findUserByEmail(
            @ApiParam(value = "이메일", required = true) @RequestParam String email
    ) {
        return responseService.getSingleResult(UserMapper.INSTANCE.toUserInfoDTO(userRepository.findByEmail(email)
                .orElseThrow(()-> new BusinessException(ErrorCode.USERID_NOT_FOUND))));
    }

    @ApiOperation(value = "멤버 수정", notes = "멤버정보를 수정")
    @PutMapping(value = "/user")
    public SingleResult<UserDto.UserInfo> modify(
            @Valid @RequestBody UserDto.UserRequest userRequest
    ) {
        User user = userRepository.findById(userRequest.getUserID())
                .orElseThrow(() -> new BusinessException(ErrorCode.USERID_NOT_FOUND));
        UserMapper.INSTANCE.toUser(userRequest, user);
        if(userRequest.getPassword() != null){
            user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }
        return responseService.getSingleResult(UserMapper.INSTANCE.toUserInfoDTO(userRepository.save(user)));
    }

    @ApiOperation(value = "합류 요청")
    @PostMapping(value = "/user/{userID}/join/{companyID}")
    public CommonResult joinRequest(
            @ApiParam(value = "User ID", required = true) @PathVariable Long userID,
            @ApiParam(value = "Company ID", required = true) @PathVariable Long companyID
    ) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new BusinessException(ErrorCode.USERID_NOT_FOUND));

        if(user.getUserType().equals("C")){
            throw new BusinessException("Personal User not", ErrorCode.INTERNAL_SERVER_ERROR);
        }

        Company company = companyService.findCompany(companyID);

        UserPersonalPending userPersonalPending = userPersonalPendingRepository.save(
                UserPersonalPending.builder()
                .user(user)
                .company(company)
                .status("P")
                .build()
        );

        for(User companyUser : userPersonalPending.getCompany().getUsers()
                .stream().filter(i-> i.getLevelId().getName().equals("Manager")).collect(Collectors.toList())
        ){
            //요청 메일 발송
            userService.saveUserMailSend(
                    UserMailSend.builder()
                            .email(companyUser.getEmail())
                            .sendType(15)
                            .typeIdx(userPersonalPending.getId())
                            .status(0)
                            .build()
            );
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "합류 요청 정보 및 회사 등록 여부 체크")
    @GetMapping(value = "/user/check")
    public SingleResult<Map<String, Object>> findCheck(
            @AuthenticationPrincipal User user
    ) {
        Map<String, Object> joinMap = new HashMap<>();
        Map<String, Object> registerMap = new HashMap<>();
        Map<String, Object> result = new HashMap<>();

        UserPersonalPending userPersonalPending = userPersonalPendingRepository.findByUserAndStatus(user,"P");

        if(userPersonalPending != null){
            joinMap.put("join_company",userPersonalPending.getCompany().getName());
            joinMap.put("join_status",userPersonalPending.getStatus());
        }

        Optional<TempUser> tempUser = tempUserRepository.findByEmail(user.getEmail());

        TempCompany tempCompany = new TempCompany();
        if(tempUser.isPresent()){
            tempCompany = tempUser.get().getTempCompany();
            registerMap.put("register_company", tempCompany.getName());
            registerMap.put("register_status", tempCompany.getStatus());
        }
        result.put("join_check", joinMap);
        result.put("register_check", registerMap);
        return responseService.getSingleResult(result);
    }

    @ApiOperation(value = "합류 요청 조회")
    @GetMapping(value = "/user/personal/list")
    public PageResult<JoinRequestDto> joinRequestList(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @AuthenticationPrincipal User user
    ) {
        Page<UserPersonalPending> userPage = userPersonalPendingRepository.findByCompanyAndStatus(user.getCompId(), "P", PageRequest.of((page == 0) ? 0 : (page - 1), size));
        CommonDto.PageDto<JoinRequestDto> pageDto = CommonDto.toPageDto(userPage, UserMapper.INSTANCE.toJoinRequestDTO(userPage.getContent()));
        return responseService.getPageResult(pageDto);
    }

    @ApiOperation(value = "합류 요청 승인 및 거절")
    @PutMapping(value = "/user/join/{status}")
    public CommonResult joinRequestProcess(
            @ApiParam(value = "승인 및 거절 (confirm: 승인, reject: 거절)", required = true) @PathVariable @Pattern(regexp = "(confirm|reject)") String status,
            @Valid @RequestBody List<Long> ids
    ) {
        for (Long id: ids){
            UserPersonalPending userPersonalPending = userPersonalPendingRepository.findById(id)
                    .orElseThrow(()-> new BusinessException("User Personal Data is not", ErrorCode.INTERNAL_SERVER_ERROR));

            int send_type=0;
            if("confirm".equals(status)){
                User user = userPersonalPending.getUser();
                Company company = userPersonalPending.getCompany();
                user.setCompId(company);
                user.setMenuType(company.getCommonBizType());
                user.setStatus(UserStatus.A);
                user.setUserType("C");
                userRepository.save(user);

                userPersonalPending.setStatus("A");
                userPersonalPendingRepository.save(userPersonalPending);
                send_type = 16;
            }else if("reject".equals(status)){
                userPersonalPending.setStatus("R");
                userPersonalPendingRepository.save(userPersonalPending);
                send_type = 17;
            }

            userService.saveUserMailSend(
                    UserMailSend.builder()
                            .email(userPersonalPending.getUser().getEmail())
                            .sendType(send_type)
                            .typeIdx(userPersonalPending.getId())
                            .status(0)
                            .build()
            );
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "유저 상태 처리", notes = "\n" +
            "1. userID: user ID 필수\n" +
            "2. levelID: 레벨 ID\n" +
            "3. status : 유저 상태(A-Active, D-Deactive, W-Waiting)\n")
    @PutMapping(value = "/user/status")
    public CommonResult modifyStatusUser(
            @RequestBody List<UserDto.UserStatusRequest> userStatusRequests
    ) {
        for (UserDto.UserStatusRequest userStatusRequest: userStatusRequests ){
            User updateUser = userRepository.findById(userStatusRequest.getUserID())
                    .orElseThrow(() -> new BusinessException(ErrorCode.USERID_NOT_FOUND));

            updateUser.setStatus(UserStatus.of(userStatusRequest.getStatus()));
            updateUser.setLevelId(userLevelRepository.findById(userStatusRequest.getLevelID())
                    .orElseThrow(()-> new BusinessException(ErrorCode.LEVEL_NOT_FOUND)));

            userRepository.save(updateUser);
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "멤버 삭제", notes = "멤버번호로 삭제")
    @DeleteMapping(value = "/user")
    public CommonResult delete(
            @ApiParam(value = "멤버번호", required = true) @RequestParam Long id
    ) {
        userRepository.deleteById(id);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "패스워드 체크")
    @GetMapping(value = "/password/check")
    public SingleResult<Boolean> checkPassword(
            @ApiParam(value = "패스워드", required = true) @RequestParam String password,
            @AuthenticationPrincipal User user
    ) {
        boolean result = false;
        if (passwordEncoder.matches(password, user.getPassword())){
            result = true;
        }
        return responseService.getSingleResult(result);
    }

    @ApiOperation(value = "유저 레벨 리스트 조회")
    @GetMapping(value = "/user/level/list")
    public ListResult<UserDto.UserLevel> userLevelListResult ()
    {
        return responseService.getListResult(UserMapper.INSTANCE.toUserLevelDTO(userService.userLevelList()));
    }

    @ApiOperation(value = "비밀 번호 초기화")
    @GetMapping(value = "/user/reset/{email}")
    public CommonResult resetPassword (
            @ApiParam(value = "이메일", required = true) @PathVariable String email
    )
    {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new BusinessException(ErrorCode.USERID_NOT_FOUND));

        //비밀번호 초기화 메일 저장
        userService.saveUserMailSend(
                UserMailSend.builder()
                        .email(user.getEmail())
                        .sendType(8)
                        .typeIdx(user.getId())
                        .status(0)
                        .build()
        );
        return responseService.getSuccessResult();
    }

    @ApiIgnore
    @ApiOperation(value = "비밀 번호 Setting")
    @GetMapping(value = "/user/password/{email}")
    public SingleResult<String> savePassword (
            @ApiParam(value = "이메일", required = true) @PathVariable String email
    )
    {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new BusinessException(ErrorCode.USERID_NOT_FOUND));

        return responseService.getSingleResult(userService.resetPassWord(user));
    }

    @ApiOperation(value = "type idx에 해당하는 메일 List 조회", notes = "typeIdx : type idx (example: order id)\n" +
            "example ( order id)\n")
    @GetMapping(value = "/email/{typeIdx}")
    public ListResult<MailDto> findEmails (
            @ApiParam(value = "Type Idx", required = true) @PathVariable Long typeIdx,
            @ApiParam(value = "Send Type", required = true) @RequestParam int sendType
    )
    {
        return responseService.getListResult(userService.findEmails(typeIdx, sendType));
    }
}
