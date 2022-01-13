package io.vengine.api.v1.user.service.Impl;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.enums.UserStatus;
import io.vengine.api.common.filters.UserSpecification;
import io.vengine.api.common.utils.S3Uploader;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.companyInfo.service.CompanyInfoService;
import io.vengine.api.v1.etc.service.MailService;
import io.vengine.api.v1.user.dto.CompanyDto;
import io.vengine.api.v1.user.entity.*;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import io.vengine.api.v1.user.mapper.UserMapper;
import io.vengine.api.v1.user.repository.*;
import io.vengine.api.v1.user.service.CompanyService;
import io.vengine.api.v1.user.service.DepartmentService;
import io.vengine.api.v1.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService {
    @Value("${admin.mail}")
    private String adminMail;

    @Autowired
    private S3Uploader s3Uploader;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    CompanyAddressRepository companyAddressRepository;

    @Autowired
    CommonService commonService;

    @Autowired
    TempCompanyRepository tempCompanyRepository;

    @Autowired
    TempUserRepository tempUserRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    MailService mailService;

    @Autowired
    DepartmentService departmentService;

    @Autowired
    UserService userService;

    @Autowired
    CompanyInfoService companyInfoService;

    @Override
    public List<Company> findAllCompany() {
        return companyRepository.findAll();
    }

    @Override
    public Company findCompany(Long companyId) {
        return companyRepository.findById(companyId)
                .filter(m-> !m.getDelFlag().equals("D"))
                .orElseThrow(()->new BusinessException(ErrorCode.COMPANYID_NOT_FOUND));
    }

    @Override
    public Company saveCompany(Company company) {
        if(findCompanyByName(company.getName()).isPresent()){
            throw new BusinessException(ErrorCode.COMPANY_NAME_DUPLICATION);
        }
        company.setStatus(0); //최초 로그인시 회사 수정 삭제
        return companyRepository.save(company);
    }

    @Override
    @Transactional
    public Company modifyCompany(CompanyDto.CompanyRequest companyRequest, User user) {
        Company company = findCompany(companyRequest.getId());

        for(CompanyDto.AddressRequest addressRequest: companyRequest.getCompanyAddressList()){
            CompanyAddress companyAddress = new CompanyAddress();
            if(addressRequest.getId() != null){
                companyAddress = findCompanyAddressById(addressRequest.getId())
                        .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_ADDRESS_NOT_FOUND));
            }
            CompanyMapper.INSTANCE.toAddress(addressRequest, companyAddress);

            companyAddress.setCompany(company);
            companyAddress.setCommonBizType(company.getCommonBizType());
            companyAddress.setUser(user);
            companyAddress.setDepartment(user.getDeptId());
            companyAddress.setCompanyInfo(user.getCompId());
            saveCompanyAddress(companyAddress);

            if(companyAddress.getRepresentitive() == 1){
                companyAddressRepository.updateRepresentitive(companyAddress);
            }
        }
        CompanyMapper.INSTANCE.toCompany(companyRequest, company);
        //company.setStatus(0);
        return companyRepository.save(company);
    }

    @Override
    public void saveCompanyAddress(CompanyAddress companyAddress) {
        companyAddressRepository.save(companyAddress);
    }

    @Override
    public Optional<CompanyAddress> findCompanyAddressById(Long id) {
        return companyAddressRepository.findById(id);
    }

    @Override
    public String companyFileUpload(MultipartFile file) {
        String urlPath;
        try {
            urlPath = s3Uploader.upload(file, "company");
        }catch (Exception e){
            e.printStackTrace();
            throw new BusinessException(ErrorCode.MATERIAL_INFO_FiILE_UPLOAD_ERROR);
        }
        return urlPath;
    }

    @Override
    public Optional<Company> findCompanyByName(String companyName) {
        return companyRepository.findByName(companyName);
    }

    @Override
    public CommonDto.PageDto<CompanyDto> findCompanyByLikeName(String searchKeyword, Pageable pageable) {
        Page<Company> pageResult = companyRepository.findByNameContaining(searchKeyword, pageable);

        CommonDto.PageDto pageDto= new CommonDto.PageDto();
        pageDto.setContent(CompanyMapper.INSTANCE.toCompanyDTO(pageResult.getContent()));
        pageDto.setTotalElements(pageResult.getTotalElements());
        pageDto.setTotalPages(pageResult.getTotalPages());
        pageDto.setSize(pageResult.getSize());
        pageDto.setNumber(pageResult.getNumber()+1);
        return pageDto;
    }

    @Override
    public List<CompanyAddress> companyAddressList(Company company) {
        return companyAddressRepository.findByCompanyInfo(company)
                .stream()
                .filter(i-> "A".equals(i.getStatus()))
                .collect(Collectors.toList());
    }

    @Override
    public CompanyAddress findRepresentativeAddress(Company company) {
        return companyAddressRepository.findByCompanyInfoAndRepresentitive(company, 1)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_ADDRESS_NOT_FOUND));
    }

    @Override
    public CommonDto.PageDto<CompanyDto> searchCompany(String type, String searchKeyword, User user, Pageable pageable) {
        if(searchKeyword == null){
            searchKeyword = "";
        }
        Specification<Company> companySpecification = UserSpecification.searchCompany(type, searchKeyword, user);
        Page<Company> pageResult = companyRepository.findAll(companySpecification, pageable);

        CommonDto.PageDto pageDto= new CommonDto.PageDto();
        pageDto.setContent(CompanyMapper.INSTANCE.toCompanyDTO(pageResult.getContent()));
        pageDto.setTotalElements(pageResult.getTotalElements());
        pageDto.setTotalPages(pageResult.getTotalPages());
        pageDto.setSize(pageResult.getSize());
        pageDto.setNumber(pageResult.getNumber()+1);
        return pageDto;
    }

    @Override
    public Optional<TempCompany> findTempCompanyByName(String companyName) {
        return tempCompanyRepository.findByName(companyName);
    }

    @Override
    @Transactional
    public void signUp(CompanyDto.CompanySignUp companySignUp, String type) {
        List<TempUser> tempUsers = new ArrayList<>();

        TempCompany tempCompany = CompanyMapper.INSTANCE.toTempCompany(companySignUp);

        for (String email: companySignUp.getEmails()){
            Optional<TempUser> tempUserOptional = tempUserRepository.findByEmail(email);

            if(tempUserOptional.isPresent()){
                if("P".equals(tempUserOptional.get().getStatus())){
                    throw new BusinessException(String.format(ErrorCode.USER_PENDING.getMessage(), email), ErrorCode.USER_PENDING);
                }else{
                    throw new BusinessException(String.format(ErrorCode.USER_CONFIRM.getMessage(), email), ErrorCode.USER_CONFIRM);
                }
            }

            Optional<User> userOptional = userRepository.findByEmail(email);

            if(userOptional.isPresent()){
                throw new BusinessException(String.format(ErrorCode.USER_STATUS.getMessage(), email, userOptional.get().getStatus().getValue())
                        , ErrorCode.USER_STATUS);
            }

            TempUser tempUser = new TempUser();
            tempUser.setTempCompany(tempCompany);
            tempUser.setEmail(email);
            tempUser.setMenuType(CommonMapper.INSTANCE.toCommonBasic(companySignUp.getCommonBizType()));
            tempUser.setStatus("P");
            tempUser.setTermsAgree(0);
            tempUsers.add(tempUser);
        }

        TempCompanyAddress tempCompanyAddress = CompanyMapper.INSTANCE.toCompanyAddress(companySignUp);
        tempCompanyAddress.setTempCompany(tempCompany);
        tempCompanyAddress.setCommonBizType(CommonMapper.INSTANCE.toCommonBasic(companySignUp.getCommonBizType()));
        tempCompanyAddress.setWorkPlace("Main Office");
        tempCompanyAddress.setStatus(2);

        int sendType = 0;
        if(type.equals("partner")){
            User registerUser = userService.findById(companySignUp.getUserID())
                    .orElseThrow(()-> new BusinessException(ErrorCode.USERID_NOT_FOUND));

            tempCompanyAddress.setCompany(registerUser.getCompId());
            tempCompanyAddress.setDepartment(registerUser.getDeptId());
            tempCompanyAddress.setUser(registerUser);
        }

        tempCompany.setStatus(2);
        tempCompany.setTempCompanyAddress(tempCompanyAddress);
        tempCompany.setTempUsers(tempUsers);
        if(type.equals("partner")){
            tempCompany.setRelationType(companySignUp.getRelationType());
        }
        Long companyID = tempCompanyRepository.save(tempCompany).getId();

        //메일 전송 테이블에 저장
        //1분마다 배치가 돌면서 발송
        userService.saveUserMailSend(
                UserMailSend.builder()
                .email(adminMail).sendType(2)
                .typeIdx(companyID).status(0)
                .build()
        );

        /*
        try{
            mailService.signUpRequest(tempCompany);
        }catch (Exception e){
            e.printStackTrace();
        }
        */
    }

    @Override
    @Transactional
    public void companyConfirm(TempCompany tempCompany) {
        Department  department = departmentService.getId(Long.valueOf(1))
                .orElseThrow(()-> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND));

        UserLevel userLevel = userService.findUserLevel("Manager")
                .orElseThrow(()-> new BusinessException(ErrorCode.MANAGER_USER_LEVEL_NOT_FOUND));

        //user company save
        Company company = saveCompany(CompanyMapper.INSTANCE.toCompany(tempCompany, 0));

        //user company address save
        CompanyAddress companyAddress = CompanyMapper.INSTANCE.toCompanyAddress(tempCompany.getTempCompanyAddress());

        //user info save
        List<User> users = new ArrayList<>();
        for(TempUser tempUser: tempCompany.getTempUsers()){
            User user = userService.findEmail(tempUser.getEmail()).orElse(null);
            if(user == null){
                user = UserMapper.INSTANCE.toUser(tempUser);
                user.setCompId(company);
            }else{
                user.setCompId(company);
            }
            user.setLevelId(userLevel);
            user.setDeptId(department);
            user.setMenuType(company.getCommonBizType());
            user.setManager(1);
            user.setStatus(UserStatus.A); //사용자 상태(A=active, D=detach, W=waiting)
            user.setUserType("C");
            //password는 메일 발송시 처리
            //user.setPassword(passwordEncoder.encode(user.getEmail().split("@")[0]+"1234"));
            users.add(userService.saveUser(user));
        }

        companyAddress.setCompanyInfo(company);
        companyAddress.setDepartment(department);
        companyAddress.setRepresentitive(1);
        companyAddress.setStatus("A");
        //파트너 등록시 구분 필요
        if(tempCompany.getRelationType() != null && tempCompany.getTempCompanyAddress().getUser() != null){
            companyAddress.setCompany(tempCompany.getTempCompanyAddress().getCompany());
            companyAddress.setUser(tempCompany.getTempCompanyAddress().getUser());
        }else{
            companyAddress.setCompany(company);
            companyAddress.setUser(users.get(0));
        }
        saveCompanyAddress(companyAddress);

        //파트너 등록 후 company biz relation처리
        int sendType = 3;
        if(tempCompany.getRelationType() != null && tempCompany.getTempCompanyAddress().getUser() != null){
            companyInfoService.saveCompanyBizRelation(tempCompany.getRelationType(), company, tempCompany.getTempCompanyAddress().getUser());
            sendType = 5;
        }

        //임시 테이블 상태값 처리
        TempCompanyAddress tempCompanyAddress = tempCompany.getTempCompanyAddress();
        tempCompanyAddress.setStatus(0);

        List<TempUser> tempUsers = tempCompany.getTempUsers();
        for (TempUser tempUser: tempUsers){
            tempUser.setStatus("A");
        }

        tempCompany.setTempCompanyAddress(tempCompanyAddress);
        tempCompany.setTempUsers(tempUsers);
        tempCompany.setStatus(0);
        tempCompanyRepository.save(tempCompany);

        for (User user: users){
            if(user.getMenuType().getCmName1().equals("VENDOR")
                    || user.getMenuType().getCmName1().equals("SUPPLIER")
            ){
                userService.saveUserMailSend(
                        UserMailSend.builder()
                                .email(user.getEmail())
                                .sendType(sendType)
                                .typeIdx(user.getId())
                                .status(0)
                                .build()
                );
            }

            /*
            try{
                mailService.userConfirm(user.getEmail(), user.getEmail().split("@")[0]+"1234", "confirm");
            }catch (Exception e){
                e.printStackTrace();
            }
            */
        }
    }
}
