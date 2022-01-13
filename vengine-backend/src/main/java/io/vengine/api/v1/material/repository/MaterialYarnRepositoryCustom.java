package io.vengine.api.v1.material.repository;

import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.user.entity.Company;

import java.util.List;

public interface MaterialYarnRepositoryCustom {
    List<CommonBasicInfo> findChiefContents(Company company);
}
