package io.vengine.api.v1.etc.controller;

import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.etc.service.MailService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

@ApiIgnore
@RestController
@AllArgsConstructor
@RequestMapping(value = "/v1")
public class MailController {

    private final MailService mailService;

    @PostMapping("/mail/errorIF")
    public void interfaceErrorMail(String email){
        try{
            mailService.interfaceErrorMail(email);
        }catch (Exception e){
            e.printStackTrace();
            throw new BusinessException("Mail Send Error", ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/mail/send")
    public void sendMail(@RequestParam String email, String title, String contents){
        try{
            mailService.sendMail(email, title, contents);
        }catch (Exception e){
            e.printStackTrace();
            throw new BusinessException("Mail Send Error", ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
