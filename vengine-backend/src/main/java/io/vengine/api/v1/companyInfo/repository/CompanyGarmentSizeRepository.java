package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.companyInfo.entity.CompanyGarmentSize;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CompanyGarmentSizeRepository extends JpaRepository<CompanyGarmentSize, Long>,
        JpaSpecificationExecutor<CompanyGarmentSize>, CompanyGarmentSizeRepositoryCustom {
}
