package io.vengine.api.v1.commonInfo.service.impl;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.filters.CommonInfoSpecification;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.commonInfo.entity.*;
import io.vengine.api.v1.commonInfo.repository.*;
import io.vengine.api.v1.commonInfo.service.CodeGeneratedService;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommonServiceImpl implements CommonService, CodeGeneratedService {
    @Autowired
    CommonMaterialTypeRepository commonMaterialTypeRepository;

    @Autowired
    CommonBasicInfoRepository commonBasicInfoRepository;

    @Autowired
    CodeGeneratedRepository codeGeneratedRepository;

    @Override
    public List<CommonBasicInfo> findCommonBasicInfoByType(String type) {
        return commonBasicInfoRepository.findByType(type);
    }

    @Override
    public CommonBasicInfo findCommonBasicInfoById(Long id) {
        return commonBasicInfoRepository.findById(id).orElseThrow(()->new BusinessException("Common Basic Info Not Found", ErrorCode.INTERNAL_SERVER_ERROR));
    }

    @Override
    public List<CommonBasicInfo> saveCommonBasicInfo(List<CommonBasicInfo> commonBasicInfos, User user) {
        return commonBasicInfoRepository.saveAll(commonBasicInfos);
    }

    @Override
    public CommonBasicInfo saveCommonBasicInfo(CommonBasicInfo commonBasicInfo) {
        return commonBasicInfoRepository.save(commonBasicInfo);
    }

    @Override
    public CommonBasicInfo findBasicInfoById(Long id) {
        return commonBasicInfoRepository.findById(id)
                .orElseThrow(()->new BusinessException("Basic Info Not Found", ErrorCode.INTERNAL_SERVER_ERROR));
    }

    @Override
    public List findCommonInfoTypes() {
        return commonBasicInfoRepository.findTypes();
    }

    @Override
    public Page<CommonBasicInfo> findCommonBasicInfoByType( String searchKeyWord, String type, int page, int size) {
        if(searchKeyWord == null){
            searchKeyWord = "";
        }
        Specification<CommonBasicInfo> specification = CommonInfoSpecification.searchCommonInfo(searchKeyWord, type);
        return commonBasicInfoRepository.findAll(specification, PageRequest.of((page == 0) ? 0 : (page - 1), size));
    }

    @Override
    public Page<CommonMaterialType> findAllCommonMaterialType(int page, int size) {
        return commonMaterialTypeRepository.findAll(PageRequest.of((page == 0) ? 0 : (page - 1), size));
    }

    @Override
    public List<CommonMaterialType> findAllCommonMaterialType() {
        return commonMaterialTypeRepository.findAll();
    }

    @Override
    public CommonMaterialType findCommonMaterialTypeById(Long id) {
        return commonMaterialTypeRepository.findById(id)
                .orElseThrow(()->new BusinessException("Company Material Type Not Found", ErrorCode.INTERNAL_SERVER_ERROR));
    }

    @Override
    public List<CommonMaterialType> saveCommonMaterialType(List<CommonMaterialType> list) {
        return commonMaterialTypeRepository.saveAll(list);
    }

    @Override
    public CommonMaterialType saveCommonMaterialType(CommonMaterialType commonMaterialType) {
        return commonMaterialTypeRepository.save(commonMaterialType);
    }

    @Override
    public List<CommonMaterialType> findCommonMaterialType(String categoryA, String categoryB) {
        return commonMaterialTypeRepository.findByCategoryAAndCategoryB(categoryA, categoryB);
    }

    @Override
    public Optional<CommonMaterialType> findCommonMaterialType(String categoryA, String categoryB, String categoryC) {
        return commonMaterialTypeRepository.findByCategoryAAndCategoryBAndCategoryC(categoryA, categoryB, categoryC);
    }

    @Override
    public List<String> findAllCommonMaterialType(String categoryA) {
        return commonMaterialTypeRepository.findByCategoryA(categoryA)
                .stream()
                .distinct()
                .map(CommonMaterialType::getCategoryB)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> findAllCommonMaterialType(String categoryA, String categoryB) {
        return commonMaterialTypeRepository.findByCategoryAAndCategoryB(categoryA, categoryB)
                .stream()
                .distinct()
                .map(CommonMaterialType::getCategoryC)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommonBasicInfo> findAllCountry() {
        return commonBasicInfoRepository.findAllCountry();
    }

    @Override
    public List<CommonDto.IdName> findCityByCountry(String country) {
        return commonBasicInfoRepository.findCityByCountry(country);
    }

    @Override
    public List<CommonDto.IdName> findUomByGroup(String group) {
        return commonBasicInfoRepository.findUomByGroup(group);
    }

    @Override
    public List<CommonBasicInfo> findPortByCountryID(Long countryID, String searchKeyWord) {
        if(searchKeyWord == null){
            searchKeyWord = "";
        }

        CommonBasicInfo country = findBasicInfoById(countryID);
        return commonBasicInfoRepository.findAll(CommonInfoSpecification.searchCommonInfo(searchKeyWord,"port").and(CommonInfoSpecification.searchCommonInfo(countryID)))
                //commonBasicInfoRepository.findByTypeAndCmName6("port", countryID)
                .stream()
                .map(i -> {
                    i.setCmName3(country.getCmName1());
                    i.setCmName4(i.getCmName2()+country.getCmName2());
                    return i;
                }).collect(Collectors.toList());
    }

    @Override
    public List<CommonBasicInfo> searchPort(String searchKeyWord) {
        if(searchKeyWord == null){
            searchKeyWord = "";
        }

        return commonBasicInfoRepository.findAll(CommonInfoSpecification.searchCommonInfo(searchKeyWord,"port"))
                .stream()
                .map(i -> {
                    CommonBasicInfo country = findBasicInfoById(i.getCmName6());
                    if(country != null){
                        i.setCmName3(country.getCmName1());
                        i.setCmName4(i.getCmName2()+country.getCmName2());
                    }
                    return i;
                }).collect(Collectors.toList());
    }

    @Override
    public Optional<CommonBasicInfo> findCommonBasicInfoByTypeAndCmName1(String type, String cmName1) {
        return commonBasicInfoRepository.findByTypeAndCmName1(type, cmName1);
    }

    @Override
    public List<String> findGarmentSizeGroups() {
        return commonBasicInfoRepository.findGarmentSizeGroups();
    }

    @Override
    public List<CommonBasicInfo> findGarmentSizeBySizeGroup(String groupName) {
        return commonBasicInfoRepository.findByCmName1(groupName);
    }

    @Override
    public Optional<CommonBasicInfo> findCommonBasicInfoByTypeAndCmName3(String type, String name3) {
        return commonBasicInfoRepository.findByTypeAndCmName3(type, name3);
    }

    @Override
    public Optional<CommonBasicInfo> findCommonBasicInfoByTypeAndCmName2NotAndCmName3(String type, String name2, String name3) {
        return commonBasicInfoRepository.findByTypeAndCmName2NotAndCmName3(type, name2, name3);
    }

    @Override
    public Optional<CommonBasicInfo> findCommonBasicInfoByTypeAndCmName2(String type, String name2) {
        return commonBasicInfoRepository.findByTypeAndCmName2(type, name2).stream().findFirst();
    }

    @Override
    public String getHiddenCode() throws Exception {
        CodeGenerated codeGenerated = codeGeneratedRepository.findByUsed(0)
                .stream()
                .sorted(Comparator.comparing(CodeGenerated::getId))
                .findFirst()
                .orElse(null);

        if(codeGenerated == null){
            throw new Exception("Generated code is null");
        }
        codeGenerated.setUsed(1);
        codeGeneratedRepository.save(codeGenerated);
        return codeGenerated.getCode();
    }
}
