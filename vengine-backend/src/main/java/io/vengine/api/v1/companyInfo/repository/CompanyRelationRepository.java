package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.companyInfo.entity.CompanyRelation;
import io.vengine.api.v1.user.dto.CompanyDto;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.BitSet;
import java.util.List;

@Repository
public interface CompanyRelationRepository extends JpaRepository<CompanyRelation, Long>, JpaSpecificationExecutor<CompanyRelation> {
    Page<CompanyRelation> findByCompanyAndDelFlagNot(Company company, String delFlag, Pageable pageable);

    List<CompanyRelation> findByCompany(Company company);

    List<CompanyRelation> findByBuyerCompany(Company buyer);

    List<CompanyRelation> findByBuyerCompanyAndCompany(Company buyer, Company company);
}
