package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.companyInfo.dto.CompanyBizDto;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CompanyBizRelationRepositoryCustom {
    Page<CompanyBizDto> searchAll(String searchKeyword, Company company, Pageable pageable);
}
