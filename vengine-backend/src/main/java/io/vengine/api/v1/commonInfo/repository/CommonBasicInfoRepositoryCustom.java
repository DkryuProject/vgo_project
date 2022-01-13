package io.vengine.api.v1.commonInfo.repository;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;

import java.util.List;

public interface CommonBasicInfoRepositoryCustom {
    List<String> findTypes();

    List<CommonBasicInfo> findAllCountry();

    List<CommonDto.IdName> findCityByCountry(String country);

    List<CommonDto.IdName> findUomByGroup(String group);

    List<String> findGarmentSizeGroups();
}
