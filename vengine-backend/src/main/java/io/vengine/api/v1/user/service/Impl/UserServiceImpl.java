package io.vengine.api.v1.user.service.Impl;

import io.vengine.api.common.enums.UserStatus;
import io.vengine.api.common.utils.GenerateCertCharacter;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.etc.service.MailService;
import io.vengine.api.v1.user.dto.MailDto;
import io.vengine.api.v1.user.dto.UserDto;
import io.vengine.api.v1.user.entity.*;
import io.vengine.api.v1.user.repository.UserLevelRepository;
import io.vengine.api.v1.user.repository.UserMailSendRepository;
import io.vengine.api.v1.user.repository.UserRepository;
import io.vengine.api.v1.user.service.CompanyService;
import io.vengine.api.v1.user.service.DepartmentService;
import io.vengine.api.v1.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserLevelRepository userLevelRepository;

    @Autowired
    CompanyService companyService;

    @Autowired
    DepartmentService departmentService;

    @Autowired
    UserMailSendRepository userMailSendRepository;

    @Autowired
    private MailService mailService;

    @Override
    public Optional<User> findEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> findUsers(Company company) {
        return userRepository.findByCompId(company);
    }

    @Override
    public Optional<UserLevel> findUserLevel(String name) {
        return userLevelRepository.findByName(name);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Page<User> findAllUser(int page, int size, Company company) {
        return userRepository.findByCompId(company, PageRequest.of((page == 0) ? 0 : (page - 1), size));
    }

    @Override
    @Transactional
    public void signUp(User toUser, Company toCompany, CompanyAddress toAddress) {
        Company company = companyService.saveCompany(toCompany);

        if(findEmail(toUser.getEmail()).isPresent()){
            throw new BusinessException(ErrorCode.EMAIL_DUPLICATION);
        }

        toUser.setManager(1);
        toUser.setStatus(UserStatus.W); //사용자 상태(A=active, D=detach, W=waiting)
        toUser.setCompId(company);
        toUser.setLevelId(findUserLevel("Manager")
                .orElseThrow(()-> new BusinessException(ErrorCode.MANAGER_USER_LEVEL_NOT_FOUND)));
        toUser.setDeptId(departmentService.getId(Long.valueOf(1))
                .orElseThrow(()-> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND)));

        User user = userRepository.save(toUser);

        toAddress.setWorkPlace(company.getName());
        toAddress.setCompany(company);
        toAddress.setCompanyInfo(company);
        toAddress.setDepartment(toUser.getDeptId());
        toAddress.setUser(user);
        toAddress.setRepresentitive(1);
        toAddress.setStatus("A");
        companyService.saveCompanyAddress(toAddress);
/*
        try{
            mailService.signUpRequest(user);
        }catch (Exception e){
            e.printStackTrace();
        }
 */
    }

    @Override
    public void userConfirm(User user) {
        if("A".equals(user.getStatus())){
            throw new BusinessException(ErrorCode.CONFIRM_USER);
        }
        String password = "";
        if(user.getPassword() == null){
            GenerateCertCharacter generateCertCharacter = new GenerateCertCharacter();
            password = generateCertCharacter.excuteGenerate();
            if(password.equals("")){
                throw new BusinessException(ErrorCode.PASSWORD_EMPTY);
            }
            user.setPassword(passwordEncoder.encode(password));
        }
        user.setStatus(UserStatus.A); //승인 처리
        userRepository.save(user);
        try{
            mailService.userConfirm(user.getEmail(), password, "confirm");
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    @Transactional
    public void invite(List<UserDto.InviteRequest> inviteRequests, User user) {
        Company company = companyService.findCompany(user.getCompId().getId());

        UserLevel  userLevel = new UserLevel();

        for (UserDto.InviteRequest inviteRequest : inviteRequests){
            Optional<User> checkUser = findEmail(inviteRequest.getEmail());
            if(!checkUser.isPresent()){
                User inviteUser = new User();

                inviteUser.setEmail(inviteRequest.getEmail());
                inviteUser.setManager(0); //일반
                inviteUser.setStatus(UserStatus.A);
                inviteUser.setCompId(company);
                inviteUser.setMenuType(company.getCommonBizType());
                inviteUser.setUserType("C");
                if(inviteRequest.getLevelID() != null){
                    userLevel = userLevelRepository.findById(inviteRequest.getLevelID())
                            .orElseThrow(()-> new BusinessException(ErrorCode.LEVEL_NOT_FOUND));
                }else{
                    userLevel = userLevelRepository.findByName("Member")
                            .orElseThrow(()-> new BusinessException(ErrorCode.LEVEL_NOT_FOUND));
                }
                inviteUser.setLevelId(userLevel);
                inviteUser.setDeptId(departmentService.getId(Long.valueOf(1))
                        .orElseThrow(()-> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND)));

                Long inviteUserID = userRepository.save(inviteUser).getId();

                saveUserMailSend(
                        UserMailSend.builder()
                                .email(inviteUser.getEmail())
                                .sendType(0)
                                .typeIdx(inviteUserID)
                                .status(0)
                                .build()
                );
            }else{
                saveUserMailSend(
                        UserMailSend.builder()
                                .email(inviteRequest.getEmail())
                                .sendType(0)
                                .typeIdx(checkUser.get().getId())
                                .status(0)
                                .build()
                );
            }
        }
    }

    @Override
    public List<UserLevel> userLevelList() {
        return userLevelRepository.findAll()
                .stream()
                .filter(v-> !v.getName().equals("System"))
                .collect(Collectors.toList());
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findFirstUser(Company company) {
        return userRepository.findFirstByCompIdOrderByCreatedAtDesc(company);
    }

    @Override
    public String resetPassWord(User user) {
        GenerateCertCharacter generateCertCharacter = new GenerateCertCharacter();
        String password = generateCertCharacter.excuteGenerate();

        if(password.equals("")){
            throw new BusinessException(ErrorCode.PASSWORD_EMPTY);
        }
        user.setPassword(passwordEncoder.encode(password));
        user.setStatus(UserStatus.A);
        userRepository.save(user);

        return password;
    }

    @Override
    public void saveUserMailSend(UserMailSend userMailSend) {
        userMailSendRepository.save(userMailSend);
    }

    @Override
    public UserMailSend findSendEmail(Long typeIdx, int sendType) {
        return userMailSendRepository.findByTypeIdxAndSendTypeAndStatus(typeIdx, sendType, 1)
                .stream()
                .sorted(Comparator.comparing(UserMailSend::getCreatedAt).reversed())
                .findFirst()
                .orElse(new UserMailSend());
    }

    @Override
    public List<MailDto> findEmails(Long typeIdx, int sendType) {
        return userMailSendRepository.findByTypeIdxAndSendType(typeIdx, sendType)
                .stream()
                .map(m-> new MailDto(m.getEmail(), MailDto.EmailType.of(m.getSendType()),
                        MailDto.EmailStatus.of(m.getStatus()), m.getSendDate()))
                .collect(Collectors.toList());
    }
}
