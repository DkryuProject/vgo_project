package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import io.vengine.api.v1.companyInfo.dto.CompanyTermsResponse;
import io.vengine.api.v1.companyInfo.entity.CompanyTerms;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyTermsRepository extends JpaRepository<CompanyTerms, Long>, JpaSpecificationExecutor<CompanyTerms> {
    Page<CompanyTerms> findByCompany(Company company, Pageable pageable);

    List<CompanyTerms> findByDocumentTypeAndMaterialTypeAndCompany(CommonBasicInfo documentType, CommonBasicInfo materialType, Company company);

    List<CompanyTerms> findByCompany(Company company);
}
