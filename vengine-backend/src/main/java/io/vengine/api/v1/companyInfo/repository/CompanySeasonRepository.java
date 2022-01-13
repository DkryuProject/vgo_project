package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.companyInfo.entity.CompanySeason;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CompanySeasonRepository extends JpaRepository<CompanySeason, Long>, JpaSpecificationExecutor<CompanySeason> {
    Page<CompanySeason> findByCompanyAndDelFlagNot(Company company, String delFlag, Pageable pageable);
}
