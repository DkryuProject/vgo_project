package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.companyInfo.entity.CompanyOrderType;
import io.vengine.api.v1.companyInfo.entity.CompanyPurchaseOrderType;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyOrderTypeRepository extends JpaRepository<CompanyOrderType, Long>, JpaSpecificationExecutor<CompanyOrderType> {

    Page<CompanyOrderType> findByCompanyAndDelFlagNot(Company company, String delFlag, Pageable pageable);

    Optional<CompanyOrderType> findByNameAndCompany(String name, Company company);
}
