package io.vengine.api.v1.user.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.enums.UserStatus;
import io.vengine.api.common.utils.GenerateCertCharacter;
import io.vengine.api.config.security.JwtTokenProvider;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.etc.service.MailService;
import io.vengine.api.v1.user.dto.CompanyDto;
import io.vengine.api.v1.user.dto.UserDto;
import io.vengine.api.v1.user.entity.*;
import io.vengine.api.v1.user.exception.PasswordNotMatchException;
import io.vengine.api.v1.user.exception.UserEntityNotFoundException;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import io.vengine.api.v1.user.mapper.UserMapper;
import io.vengine.api.v1.user.repository.UserRepository;
import io.vengine.api.v1.user.service.CompanyService;
import io.vengine.api.v1.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@Api(tags = {"01. SIGN"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
@Validated
public class SignController {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final ResponseService responseService;
    private final PasswordEncoder passwordEncoder;

    private final UserService userService;

    private final MailService mailService;

    private final CompanyService companyService;

    @ApiOperation(value = "로그인", notes = "이메일로 회원 로그인을 한다.\n로그인 성공시 토큰을 반환한다.")
    @PostMapping(value = "/signin")
    public SingleResult<String> signIn(
            @ApiParam(value = "이메일", required = true) @RequestParam @Email @NotBlank String email,
            @ApiParam(value = "비밀번호", required = true) @RequestParam @NotBlank String password
    ) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserEntityNotFoundException(email));
        if(user.getPassword() == null){
            throw new BusinessException(ErrorCode.PASSWORD_NOT_MATCH);
        }
        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new PasswordNotMatchException(email, ErrorCode.PASSWORD_NOT_MATCH);

        if(UserStatus.D.equals(user.getStatus())){
            throw new BusinessException(ErrorCode.DETACH_USER);
        }
        if(UserStatus.W.equals(user.getStatus())){
            throw new BusinessException(ErrorCode.WAIT_USER);
        }
        if(!user.getCompId().getCommonBizType().getCmName1().equals("VENDOR") && !user.getCompId().getCommonBizType().getCmName1().equals("SUPPLIER") && !user.getCompId().getCommonBizType().getCmName1().equals("CUSTOM")){
            throw new BusinessException(ErrorCode.USER_LOGIN_AVAILABLE);
        }

        return responseService.getSingleResult(jwtTokenProvider.createToken(user.getEmail()));
    }

    @ApiOperation(value = "회사 가입 요청", notes = "1. email : 가입 요청자 메일 필수\n" +
            "2. businessNumber: business number\n3. name: 회사명\n4. termsAgree: 약관동의(동의 1:, 미동의: 0)\n" +
            "5. commonBizType: 비즈니스 타입(필수)\n6. countryId: 국가\n7. city: 도시명\n8. state: 주\n" +
            "9. etc: 상세주소\n10. zipCode: 우편번호\n11.businessFileUrl: 비지니스 파일\n")
    @PostMapping(value = "/signup/{type}")
    public CommonResult companySignUp(
            @ApiParam(value = "가입 요청 타입(new, partner)", required = true) @PathVariable @NotEmpty String type,
            @Valid @RequestBody CompanyDto.CompanySignUp companyRequest
    ) {
        Optional<TempCompany> tempCompanyOptional = companyService.findTempCompanyByName(companyRequest.getName());

        if(type.equals("partner")){
            if(companyRequest.getUserID() == null){
                throw new BusinessException(ErrorCode.PARTNER_REGISTER_USER_NULL);
            }

            if(companyRequest.getRelationType() == null){
                throw new BusinessException(ErrorCode.PARTNER_RELATION_TYPE_NULL);
            }
        }
        if(tempCompanyOptional.isPresent()){
            if(tempCompanyOptional.get().getStatus() == 2){
                throw new BusinessException(ErrorCode.COMPANY_PENDING);
            }else{
                throw new BusinessException(ErrorCode.COMPANY_CONFIRM);
            }
        }

        Optional<Company> companyOptional = companyService.findCompanyByName(companyRequest.getName());

        if(companyOptional.isPresent()){
            throw new BusinessException(ErrorCode.COMPANY_CONFIRM);
        }

        if(companyRequest.getEmails().size() == 0){
            throw new BusinessException(ErrorCode.EMAIL_EMPTY);
        }

        companyService.signUp(companyRequest, type);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "회원 가입 요청", notes = "1. email : 가입 요청자 메일 필수\n" +
            "2. name : 가입자 이름\n" +
            "3. password : 비밀번호\n" +
            "4. terms_agree : 약관 동의 여부\n")
    @PostMapping(value = "/user/signup")
    public CommonResult userSignUp(
            @Valid @RequestBody UserDto.UserSignUp userSignUp
    ) {
        if(userRepository.findByEmail(userSignUp.getEmail()).isPresent()){
            throw new BusinessException(ErrorCode.EMAIL_DUPLICATION);
        }

        UserLevel userLevel = userService.findUserLevel("Member")
                .orElseThrow(()-> new BusinessException(ErrorCode.MANAGER_USER_LEVEL_NOT_FOUND));

        User user = UserMapper.INSTANCE.toUser(
                userSignUp,
                1L, 1L, 6L,
                userLevel,
                new GenerateCertCharacter().verifyCodeGenerate(),
                "P",
                UserStatus.W);
        user.setPassword(passwordEncoder.encode(userSignUp.getPassword()));

        //user info save
        user = userRepository.save(user);

        //메일 발송
        userService.saveUserMailSend(
                UserMailSend.builder()
                        .email(user.getEmail())
                        .sendType(12)
                        .typeIdx(user.getId())
                        .status(0)
                        .build()
        );
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "회사 승인", notes = "1. companyName : 요청 회사 이름 (필수)\n")
    @PutMapping(value = "/sign/confirm")
    public CommonResult companyConfirm(
            @ApiParam(value = "이메일", required = true) @RequestParam @NotBlank String companyName,
            @AuthenticationPrincipal User user
    ) {
        TempCompany tempCompany = companyService.findTempCompanyByName(companyName)
                .orElseThrow(()-> new BusinessException(String.format(ErrorCode.COMPANY_NOT_FOUND.getMessage(), companyName), ErrorCode.COMPANY_NOT_FOUND));

        companyService.companyConfirm(tempCompany);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "가입 승인", notes = "1. email : 가입 요청자 메일 필수\n")
    @PostMapping(value = "/sign/confirm/{email}")
    public CommonResult userConfirm(
            @ApiParam(value = "이메일", required = true) @PathVariable @Email @NotBlank String email
    ) {
        User user = userService.findEmail(email)
                .orElseThrow(()-> new BusinessException(ErrorCode.USERID_NOT_FOUND));
        userService.userConfirm(user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "이메일 체크", notes = "등록된 이메일이인지 체크한다.")
    @GetMapping(value = "/emailcheck")
    public SingleResult<UserDto.UserInfo> emailCheck(@ApiParam(value = "이메일", required = true)
                                                @RequestParam("email")
                                                @NotBlank(message = "이메일을 입력하세요.")
                                                @Email String email) {

        return responseService.getSingleResult(UserMapper.INSTANCE.toUserInfoDTO(
                userService.findEmail(email).orElseThrow(()->new BusinessException(ErrorCode.USERID_NOT_FOUND))));
    }

    @ApiOperation(value = "이메일 인증", notes = "이메일 인증 메일을 전송한다")
    @PostMapping("/mail/verify")
    public void sendVerifyMail(@ApiParam(value = "이메일", required = true) @RequestParam String email){
        try{
            mailService.verifyEmail(email);
        }catch (Exception e){
            e.printStackTrace();
            throw new BusinessException("Mail Send Error: "+e.getMessage(), ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "인증코드 확인", notes = "이메일로 전송 받은 인증코드를 확인한다")
    @PostMapping("/verify")
    public CommonResult verifyCode(
            @ApiParam(value = "이메일", required = true) @NotEmpty @RequestParam String email,
            @ApiParam(value = "인증코드", required = true) @NotEmpty @RequestParam String code
    )
    {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new BusinessException(ErrorCode.USERID_NOT_FOUND));

        if(user.getSecretKey() == null){
            throw  new BusinessException(ErrorCode.DATA_IS_NULL);
        }
        if(!user.getSecretKey().equals(code)){
            throw new BusinessException(ErrorCode.VERIFY_CODE_NOT_MATCH);
        }

        user.setStatus(UserStatus.A);
        userRepository.save(user);

        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "초대하기", notes = "\n" +
            "1. email: 이메일\n" +
            "2. levelID: 레벨 ID\n" +
            "3. status : 유저 상태(A-Active, D-Deactive, W-Waiting)\n")
    @PostMapping("/invite")
    public CommonResult invite(
            @RequestBody List<UserDto.InviteRequest> inviteRequests,
            @AuthenticationPrincipal User user
    ){
        userService.invite(inviteRequests, user);
        return responseService.getSuccessResult();
    }
}
