package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.companyInfo.entity.CompanyGarmentSize;
import io.vengine.api.v1.user.entity.Company;

import java.util.List;

public interface CompanyGarmentSizeRepositoryCustom {
    List<String> findGarmentSizeGroups(Company company);

    List<CompanyInfoDto.Response> findGarmentSizeBySizeGroup(String groupName);
}
