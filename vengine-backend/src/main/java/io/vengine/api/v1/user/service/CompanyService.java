package io.vengine.api.v1.user.service;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.user.dto.CompanyDto;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.CompanyAddress;
import io.vengine.api.v1.user.entity.TempCompany;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Optional;

public interface CompanyService {
    List<Company> findAllCompany();

    Company findCompany(Long companyId);

    Company saveCompany(Company insertCompanyInfo);

    Company modifyCompany(CompanyDto.CompanyRequest companyRequest, User user);

    Optional<Company> findCompanyByName(String companyName);

    void saveCompanyAddress(CompanyAddress toAddress);

    Optional<CompanyAddress> findCompanyAddressById(Long id);

    String companyFileUpload(MultipartFile file);

    CommonDto.PageDto<CompanyDto> findCompanyByLikeName(String searchKeyword, Pageable pageable);

    List<CompanyAddress> companyAddressList(Company company);

    CompanyAddress findRepresentativeAddress(Company company);

    CommonDto.PageDto<CompanyDto> searchCompany(String type, String searchKeyword, User user, Pageable pageable);

    Optional<TempCompany> findTempCompanyByName(String companyName);

    void signUp(CompanyDto.CompanySignUp companyRequest, String type);

    void companyConfirm(TempCompany tempCompany);
}
