package io.vengine.api.v1.user.service;

import io.vengine.api.v1.user.dto.MailDto;
import io.vengine.api.v1.user.dto.UserDto;
import io.vengine.api.v1.user.entity.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface UserService {

    Optional<User> findEmail(String email);

    List<User> findUsers(Company companyData);

    Optional<UserLevel> findUserLevel(String name);

    Optional<User> findById(Long id);

    Page<User> findAllUser(int page, int size, Company company);

    void signUp(User toUser, Company toCompany, CompanyAddress companyAddress);

    void userConfirm(User user);

    void invite(List<UserDto.InviteRequest> inviteRequests, User user);

    List<UserLevel> userLevelList();

    User saveUser(User user);

    Optional<User> findFirstUser(Company company);

    String resetPassWord(User user);

    void saveUserMailSend(UserMailSend build);

    UserMailSend findSendEmail(Long id, int sendType);

    List<MailDto> findEmails(Long typeIdx, int sendType);
}
