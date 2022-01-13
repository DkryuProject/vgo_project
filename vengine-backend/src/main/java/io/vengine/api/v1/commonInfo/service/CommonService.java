package io.vengine.api.v1.commonInfo.service;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.commonInfo.entity.*;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface CommonService {

    List<CommonBasicInfo> findCommonBasicInfoByType(String type);

    CommonBasicInfo findCommonBasicInfoById(Long id);

    List<CommonBasicInfo> saveCommonBasicInfo(List<CommonBasicInfo> commonBasicInfos, User user);

    CommonBasicInfo findBasicInfoById(Long id);

    List findCommonInfoTypes();

    Page<CommonBasicInfo> findCommonBasicInfoByType( String searchKeyWord, String type, int page, int size);

    Page<CommonMaterialType> findAllCommonMaterialType(int page, int size);

    List<CommonMaterialType> findAllCommonMaterialType();

    CommonMaterialType findCommonMaterialTypeById(Long id);

    List<CommonMaterialType> saveCommonMaterialType(List<CommonMaterialType> list);

    CommonMaterialType saveCommonMaterialType(CommonMaterialType commonMaterialType);

    List<String> findAllCommonMaterialType(String categoryA);

    List<String> findAllCommonMaterialType(String categoryA, String categoryB);

    List<CommonBasicInfo> findAllCountry();

    List<CommonDto.IdName> findCityByCountry(String country);

    List<CommonDto.IdName> findUomByGroup(String group);

    List<CommonBasicInfo> findPortByCountryID(Long countryID, String searchKeyWord);

    List<CommonBasicInfo> searchPort(String searchKeyWord);

    Optional<CommonBasicInfo> findCommonBasicInfoByTypeAndCmName1(String type, String name1);

    Optional<CommonBasicInfo> findCommonBasicInfoByTypeAndCmName2(String type, String name2);

    Optional<CommonBasicInfo> findCommonBasicInfoByTypeAndCmName3(String type, String name3);

    Optional<CommonBasicInfo> findCommonBasicInfoByTypeAndCmName2NotAndCmName3(String type, String name2, String name3);

    List<String> findGarmentSizeGroups();

    List<CommonBasicInfo> findGarmentSizeBySizeGroup(String groupName);

    List<CommonMaterialType> findCommonMaterialType(String categoryA, String categoryB);

    Optional<CommonMaterialType> findCommonMaterialType(String categoryA, String categoryB, String categoryC);

    CommonBasicInfo saveCommonBasicInfo(CommonBasicInfo commonBasicInfo);
}
