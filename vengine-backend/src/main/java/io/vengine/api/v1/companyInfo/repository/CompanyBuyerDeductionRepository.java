package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.companyInfo.entity.CompanyBuyer;
import io.vengine.api.v1.companyInfo.entity.CompanyBuyerDeduction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyBuyerDeductionRepository extends JpaRepository<CompanyBuyerDeduction, Long> {
}
