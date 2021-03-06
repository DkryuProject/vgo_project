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

    @ApiOperation(value = "?????????", notes = "???????????? ?????? ???????????? ??????.\n????????? ????????? ????????? ????????????.")
    @PostMapping(value = "/signin")
    public SingleResult<String> signIn(
            @ApiParam(value = "?????????", required = true) @RequestParam @Email @NotBlank String email,
            @ApiParam(value = "????????????", required = true) @RequestParam @NotBlank String password
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

    @ApiOperation(value = "?????? ?????? ??????", notes = "1. email : ?????? ????????? ?????? ??????\n" +
            "2. businessNumber: business number\n3. name: ?????????\n4. termsAgree: ????????????(?????? 1:, ?????????: 0)\n" +
            "5. commonBizType: ???????????? ??????(??????)\n6. countryId: ??????\n7. city: ?????????\n8. state: ???\n" +
            "9. etc: ????????????\n10. zipCode: ????????????\n11.businessFileUrl: ???????????? ??????\n")
    @PostMapping(value = "/signup/{type}")
    public CommonResult companySignUp(
            @ApiParam(value = "?????? ?????? ??????(new, partner)", required = true) @PathVariable @NotEmpty String type,
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

    @ApiOperation(value = "?????? ?????? ??????", notes = "1. email : ?????? ????????? ?????? ??????\n" +
            "2. name : ????????? ??????\n" +
            "3. password : ????????????\n" +
            "4. terms_agree : ?????? ?????? ??????\n")
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

        //?????? ??????
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

    @ApiOperation(value = "?????? ??????", notes = "1. companyName : ?????? ?????? ?????? (??????)\n")
    @PutMapping(value = "/sign/confirm")
    public CommonResult companyConfirm(
            @ApiParam(value = "?????????", required = true) @RequestParam @NotBlank String companyName,
            @AuthenticationPrincipal User user
    ) {
        TempCompany tempCompany = companyService.findTempCompanyByName(companyName)
                .orElseThrow(()-> new BusinessException(String.format(ErrorCode.COMPANY_NOT_FOUND.getMessage(), companyName), ErrorCode.COMPANY_NOT_FOUND));

        companyService.companyConfirm(tempCompany);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "?????? ??????", notes = "1. email : ?????? ????????? ?????? ??????\n")
    @PostMapping(value = "/sign/confirm/{email}")
    public CommonResult userConfirm(
            @ApiParam(value = "?????????", required = true) @PathVariable @Email @NotBlank String email
    ) {
        User user = userService.findEmail(email)
                .orElseThrow(()-> new BusinessException(ErrorCode.USERID_NOT_FOUND));
        userService.userConfirm(user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "????????? ??????", notes = "????????? ?????????????????? ????????????.")
    @GetMapping(value = "/emailcheck")
    public SingleResult<UserDto.UserInfo> emailCheck(@ApiParam(value = "?????????", required = true)
                                                @RequestParam("email")
                                                @NotBlank(message = "???????????? ???????????????.")
                                                @Email String email) {

        return responseService.getSingleResult(UserMapper.INSTANCE.toUserInfoDTO(
                userService.findEmail(email).orElseThrow(()->new BusinessException(ErrorCode.USERID_NOT_FOUND))));
    }

    @ApiOperation(value = "????????? ??????", notes = "????????? ?????? ????????? ????????????")
    @PostMapping("/mail/verify")
    public void sendVerifyMail(@ApiParam(value = "?????????", required = true) @RequestParam String email){
        try{
            mailService.verifyEmail(email);
        }catch (Exception e){
            e.printStackTrace();
            throw new BusinessException("Mail Send Error: "+e.getMessage(), ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "???????????? ??????", notes = "???????????? ?????? ?????? ??????????????? ????????????")
    @PostMapping("/verify")
    public CommonResult verifyCode(
            @ApiParam(value = "?????????", required = true) @NotEmpty @RequestParam String email,
            @ApiParam(value = "????????????", required = true) @NotEmpty @RequestParam String code
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

    @ApiOperation(value = "????????????", notes = "\n" +
            "1. email: ?????????\n" +
            "2. levelID: ?????? ID\n" +
            "3. status : ?????? ??????(A-Active, D-Deactive, W-Waiting)\n")
    @PostMapping("/invite")
    public CommonResult invite(
            @RequestBody List<UserDto.InviteRequest> inviteRequests,
            @AuthenticationPrincipal User user
    ){
        userService.invite(inviteRequests, user);
        return responseService.getSuccessResult();
    }
}
