package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.companyInfo.entity.CompanyUsage;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyUsageRepository extends JpaRepository<CompanyUsage, Long>, JpaSpecificationExecutor<CompanyUsage> {
    Page<CompanyUsage> findByCompanyAndDelFlagNot(Company company, String delFlag, Pageable pageable);
}
