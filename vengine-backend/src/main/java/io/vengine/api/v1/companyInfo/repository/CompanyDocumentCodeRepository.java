package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.companyInfo.entity.CompanyDocumentCode;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyDocumentCodeRepository extends JpaRepository<CompanyDocumentCode, Long> {
    Optional<CompanyDocumentCode> findByCompanyAndCommonDocInfo(Company company, CommonBasicInfo docInfo);

    List<CompanyDocumentCode> findByCompany(Company company);
}
