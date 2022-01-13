package io.vengine.api.v1.etc.service;

import io.vengine.api.v1.user.entity.TempCompany;
import io.vengine.api.v1.user.entity.User;

import java.util.List;

public interface MailService {
    void verifyEmail(String email) throws Exception;

    String getVerifyCode();

    void interfaceErrorMail(String email) throws Exception;

    void sendMail(String email, String title, String contents) throws Exception;

    void signUpRequest(TempCompany tempCompany) throws Exception;

    void userConfirm(String email, String password, String type) throws Exception;
}
