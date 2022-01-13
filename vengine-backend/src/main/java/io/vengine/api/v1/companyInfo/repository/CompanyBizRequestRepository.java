package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.companyInfo.entity.CompanyBizRequest;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyBizRequestRepository extends JpaRepository<CompanyBizRequest, Long> {
    Page<CompanyBizRequest> findByResponseCompany(Company company, Pageable pageable);
}
