package io.vengine.api.v1.user.repository;

import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.CompanyAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface CompanyAddressRepository extends JpaRepository<CompanyAddress, Long>, JpaSpecificationExecutor<CompanyAddress>, CompanyAddressRepositoryCustom {
    List<CompanyAddress> findByCompany(Company company);

    CompanyAddress findByCompanyAndRepresentitive(Company company, int i);

    Optional<CompanyAddress> findByCompanyInfoAndRepresentitive(Company company, int i);

    List<CompanyAddress> findByCompanyInfo(Company company);
}
