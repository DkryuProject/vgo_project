package io.vengine.api.v1.material.service.impl;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import io.vengine.api.common.ValidationCheck;
import io.vengine.api.common.dto.ExcelReaderErrorField;
import io.vengine.api.common.enums.DelFlag;
import io.vengine.api.common.enums.ExcelReaderFieldError;
import io.vengine.api.common.enums.RelationType;
import io.vengine.api.common.filters.MaterialSpecification;
import io.vengine.api.common.utils.S3Uploader;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.companyInfo.entity.CompanyBizRelation;
import io.vengine.api.v1.companyInfo.service.CompanyInfoService;
import io.vengine.api.v1.etc.dto.excel.Accessories;
import io.vengine.api.v1.etc.dto.excel.Fabric;
import io.vengine.api.v1.etc.dto.excel.Trim;
import io.vengine.api.v1.material.dto.*;
import io.vengine.api.v1.material.entity.*;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.material.repository.*;
import io.vengine.api.v1.material.service.MaterialService;
import io.vengine.api.v1.mcl.dto.NewAdhocMaterialInfoRequest;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.repository.CompanyRepository;
import io.vengine.api.v1.user.service.CompanyService;
import io.vengine.api.v1.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Repository
@Slf4j
public class MaterialServiceImpl implements MaterialService {

    @Autowired
    private S3Uploader s3Uploader;

    @Autowired
    MaterialRepository materialRepository;

    @Autowired
    MaterialYarnRepository materialYarnRepository;

    @Autowired
    MaterialFabricOfferRepository materialFabricOfferRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    UserService userService;

    @Autowired
    CompanyService companyService;

    @Autowired
    CommonService commonService;

    @Autowired
    CompanyInfoService companyInfoService;

    @Override
    @Transactional
    public MaterialInfo saveMaterialInfo(MaterialInfoRequest materialInfoRequest, User user) {
        MaterialInfo materialInfo =  materialRepository.save(MaterialMapper.INSTANCE.toMaterialInfo(materialInfoRequest, "NEW", user));
        if("fabric".equals(materialInfoRequest.getType())){
            for (MaterialYarnRequest materialYarnRequest : materialInfoRequest.getMaterialYarnRequestList()){
                saveMaterialYarn(MaterialMapper.INSTANCE.toMaterialYarn(materialYarnRequest, materialInfo), user);
            }
        }
        return materialInfo;
    }

    @Override
    @Transactional
    public void modifyMaterialInfo(MaterialInfo materialInfo, MaterialInfoRequest materialInfoRequest, User user) {
        MaterialMapper.INSTANCE.toMaterialInfo(materialInfoRequest, user, materialInfo);
        materialRepository.save(materialInfo);

        if("fabric".equals(materialInfo.getType())){
            //Material Yarn 삭제 후 저장 처리
            materialYarnRepository.saveAll(
                    materialYarnRepository.findByMaterialInfo(materialInfo)
                            .stream()
                            .map(item-> {
                                item.setDelFlag("D");
                                return item;
                            })
                            .collect(Collectors.toList())
            );
            for (MaterialYarnRequest materialYarnRequest : materialInfoRequest.getMaterialYarnRequestList()){
                saveMaterialYarn(MaterialMapper.INSTANCE.toMaterialYarn(materialYarnRequest, materialInfo), user);
            }
        }
    }

    @Override
    public void saveMaterialYarn(MaterialYarn materialYarn, User user) {
        if(materialYarn.getMaterialInfo().getSupplierCompany().getId().longValue() == user.getCompId().getId().longValue()){
            materialYarn.setUser(user);
            materialYarn.setDeputyCompany(user.getCompId());
            materialYarn.setDeputyDepartment(user.getDeptId());
            materialYarn.setDeputyUser(user);
        }else{
            User supplierUser = userService.findFirstUser(materialYarn.getMaterialInfo().getSupplierCompany())
                    .orElseThrow(()-> new BusinessException(ErrorCode.USERID_NOT_FOUND));
            materialYarn.setUser(supplierUser);
            materialYarn.setDeputyCompany(user.getCompId());
            materialYarn.setDeputyDepartment(user.getDeptId());
            materialYarn.setDeputyUser(user);
        }
        materialYarnRepository.save(materialYarn);
    }

    @Override
    public List<MaterialYarn> saveMaterialYarn(List<MaterialYarn> materialYarns, User user) {
        for(MaterialYarn materialYarn : materialYarns){
            if(materialYarn.getMaterialInfo().getSupplierCompany().getId().longValue() == user.getCompId().getId().longValue()){
                materialYarn.setUser(user);
                materialYarn.setDeputyCompany(user.getCompId());
                materialYarn.setDeputyDepartment(user.getDeptId());
                materialYarn.setDeputyUser(user);
            }else{
                User supplierUser = userService.findFirstUser(materialYarn.getMaterialInfo().getSupplierCompany())
                        .orElseThrow(()-> new BusinessException(ErrorCode.USERID_NOT_FOUND));
                materialYarn.setUser(supplierUser);
                materialYarn.setDeputyCompany(user.getCompId());
                materialYarn.setDeputyDepartment(user.getDeptId());
                materialYarn.setDeputyUser(user);
            }
            materialYarnRepository.save(materialYarn);
        }
        return materialYarns;
    }

    @Override
    public List<MaterialYarn> findYarnByMaterialId(Long yarnMaterialInfoId, User user) {
        MaterialInfo materialInfo = materialRepository.findById(yarnMaterialInfoId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_INFO_NOT_FOUND));
        return materialInfo.getMaterialYarns()
                .stream()
                .sorted(Comparator.comparing(MaterialYarn::getUsed).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public Page<MaterialInfo> findAllMaterialInfo(String searchKeyWord, String type, int page, int size, User user) {
        if(searchKeyWord == null){
            searchKeyWord = "";
        }
        if(type == null){
            type = "";
        }
        List<Company> suppliers = companyInfoService.findCompanyByRelationType("SUPPLIER", user.getCompId())
                .stream()
                .filter(item ->  item.getBizCompany().getId().longValue() != user.getCompId().getId().longValue()
                        && item.getStatus().equals("A")
                )
                .map(CompanyBizRelation::getBizCompany)
                .collect(Collectors.toList());

        Specification<MaterialInfo> specification = MaterialSpecification.searchMaterialInfo(searchKeyWord, type, user, suppliers);
        return materialRepository.findAll(specification, PageRequest.of((page == 0) ? 0 : (page - 1), size));
    }

    @Override
    public List<MaterialInfo> findAllMaterialInfo(Map<String, Object> searchFilter, User user) {
        List<Company> suppliers = companyInfoService.findCompanyByRelationType("SUPPLIER", user.getCompId())
                .stream()
                .filter(item -> item.getBizCompany().getId().longValue() != user.getCompId().getId().longValue()
                        && item.getStatus().equals("A")
                )
                .map(CompanyBizRelation::getBizCompany)
                .collect(Collectors.toList());

        Specification<MaterialInfo> specification = MaterialSpecification.searchMaterialInfo(searchFilter, user.getCompId(), suppliers);
        return materialRepository.findAll(specification);
    }

    @Override
    public MaterialOffer saveMaterialOffer(MaterialOffer materialOffer, User user) {
        if(materialOffer == null){
            throw new BusinessException(ErrorCode.MATERIAL_OFFER_IS_NULL);
        }

        if(materialOffer.getMaterialInfo().getSupplierCompany().equals(user.getCompId())){
            materialOffer.setUser(user);
            materialOffer.setDeputyCompany(user.getCompId());
            materialOffer.setDeputyDepartment(user.getDeptId());
            materialOffer.setDeputyUser(user);
        }else{
            User supplierUser = userService.findFirstUser(materialOffer.getMaterialInfo().getSupplierCompany())
                    .orElseThrow(()-> new BusinessException(ErrorCode.USERID_NOT_FOUND));
            materialOffer.setUser(supplierUser);
            materialOffer.setDeputyCompany(user.getCompId());
            materialOffer.setDeputyDepartment(user.getDeptId());
            materialOffer.setDeputyUser(user);
        }
        return materialFabricOfferRepository.saveAndFlush(materialOffer);
    }

    @Override
    public void modifyMaterialOffer(MaterialOffer materialOffer, User user) {
        if(materialOffer == null){
            throw new BusinessException(ErrorCode.MATERIAL_OFFER_IS_NULL);
        }
        materialOffer.setUser(user);
        materialFabricOfferRepository.saveAndFlush(materialOffer);
    }

    @Override
    public List<MaterialOffer> findOfferByMaterialId(Long materialInfoId, User user) {
        MaterialInfo materialInfo = materialRepository.findById(materialInfoId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_INFO_NOT_FOUND));

        return materialInfo.getMaterialOffers()
                .stream()
                .filter(item->{
                    boolean result = false;
                    if(user.getCompId().getId().longValue() != materialInfo.getSupplierCompany().getId().longValue()){
                        if(item.getRecipient() == null || item.getRecipient().getId().longValue() == user.getCompId().getId().longValue()){
                            result = true;
                        }else{
                          result = false;
                        }
                    }else{
                        result = true;
                    }
                    return result;
                })
                .map(item -> {
                    if(item.getOriginalMillarticleId() != null){
                        item.setOriginalMaterialNo(findOriginalMaterialNo(item.getOriginalMillarticleId()));
                    }
                    return item;
                })
                .collect(Collectors.toList());
    }

    private String findOriginalMaterialNo(Long offerId) {
        return materialFabricOfferRepository.findById(offerId).orElse(null).getMyMillarticle();
    }

    @Override
    public List<MaterialOffer> findMyOwnMaterialOfferList(MaterialInfo materialInfo, Company company) {
        List<MaterialOffer> materialOffers = new ArrayList<>();

        for(MaterialOffer originalMaterialOffer: materialInfo.getMaterialOffers()){
            materialOffers.addAll(materialFabricOfferRepository.findByOriginalMillarticleId(originalMaterialOffer.getId())
                    .stream()
                    .filter(i-> i.getMaterialInfo().getSupplierCompany().getId().longValue() == company.getId().longValue())
                    .map(m-> {
                        m.setOriginalMaterialNo(originalMaterialOffer.getMyMillarticle());
                        return m;
                    })
                    .collect(Collectors.toList())
            );
        }
        return materialOffers;
    }

    @Override
    public Optional<MaterialOffer> findOfferById(Long id) {
        return materialFabricOfferRepository.findById(id)
                .map(item-> {
                    if(item.getOriginalMillarticleId() != null){
                        item.setOriginalMaterialNo(findOriginalMaterialNo(item.getOriginalMillarticleId()));
                    }
                    return item;
                });
    }

    @Override
    public Optional<MaterialInfo> findMaterialInfoById(Long id) {
        return materialRepository.findById(id);
    }

    @Override
    public MaterialInfo saveMaterialImage(Long id, MultipartFile file) {
        MaterialInfo materialInfo = findMaterialInfoById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_INFO_NOT_FOUND));
        try {
            String imgPath = s3Uploader.upload(file, "material");
            materialInfo.setMaterialPic(imgPath);
        }catch (Exception e){
            e.printStackTrace();
            throw new BusinessException(ErrorCode.MATERIAL_INFO_FiILE_UPLOAD_ERROR);
        }
        return materialRepository.save(materialInfo);
    }

    @Override
    public void deleteFlagUpdateMaterialOffer(Long id, User user) {
        MaterialOffer updateData = findOfferById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_OFFER_NOT_FOUND));

        if(materialFabricOfferRepository.findByOriginalMillarticleId(updateData.getId()).size()>0){
            throw new BusinessException(ErrorCode.MATERIAL_OFFER_CAN_NOT_DELETE);
        }

        if(updateData.getCbdMaterialInfos().size()>0
                || updateData.getMclMaterialInfos().size()>0
        ){
            throw new BusinessException(ErrorCode.MATERIAL_OFFER_CAN_NOT_DELETE);
        }
        //나의 회사 자재가 아니면 삭제 불가
        if(updateData.getMaterialInfo().getSupplierCompany().getId().longValue() != user.getCompId().getId().longValue()){
            throw new BusinessException(ErrorCode.MATERIAL_OFFER_CAN_NOT_DELETE);
        }

        //if(updateData.getOriginalMillarticleId() != null){
        //    throw new BusinessException(ErrorCode.MATERIAL_OFFER_CAN_NOT_DELETE);
        //}

        updateData.setDelFlag(DelFlag.D.getKey());
        updateData.setUser(user);
        materialFabricOfferRepository.save(updateData);
    }

    @Override
    public void deleteFlagUpdateMaterialYarn(Long id, User user) {
        MaterialYarn updateData = materialYarnRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_YARN_NOT_FOUND));

        //등록한 회사랑 다르면 삭제 불가
        if(updateData.getCompany().getId().longValue() != user.getCompId().getId().longValue()){
            throw new BusinessException(ErrorCode.MATERIAL_YARN_CAN_NOT_DELETE);
        }

        if(updateData.getMaterialInfo().getCbdMaterialInfos().size()>0
                || updateData.getMaterialInfo().getMclMaterialInfos().size()>0
        ){
            throw new BusinessException(ErrorCode.MATERIAL_YARN_CAN_NOT_DELETE);
        }

        updateData.setDelFlag(DelFlag.D.getKey());
        updateData.setUser(user);
        materialYarnRepository.save(updateData);
    }

    @Override
    public void deleteFlagUpdateMaterialInfo(Long id, User user) {
        MaterialInfo updateData = findMaterialInfoById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_INFO_NOT_FOUND));

        if(updateData.getCbdMaterialInfos().size()>0
                || updateData.getMclMaterialInfos().size()>0
                || updateData.getMaterialOffers().size()>0
        ){
            throw new BusinessException(ErrorCode.MATERIAL_INFO_CAN_NOT_DELETE);
        }
        //Material Yarn  Update
        for(MaterialYarn materialYarn: updateData.getMaterialYarns()){
                materialYarn.setDeputyUser(user);
                materialYarn.setDelFlag(DelFlag.D.getKey());
                materialYarnRepository.save(materialYarn);
        }

        //Material Info Update
        updateData.setDelFlag(DelFlag.D.getKey());
        updateData.setUser(user);
        materialRepository.save(updateData);
    }

    @Override
    public List<CommonBasicInfo> findChiefContents(User user) {
        return materialYarnRepository.findChiefContents(user.getCompId());
    }

    @Override
    @Transactional
    public void saveNewMaterialInfo(NewAdhocMaterialInfoRequest request, User user) {
        MaterialInfo materialInfo =  materialRepository.save(MaterialMapper.INSTANCE.toMaterialInfo(request, "NEW", user));
        if("fabric".equals(request.getType())){
            for (MaterialYarnRequest materialYarnRequest : request.getMaterialYarnRequestList()){
                saveMaterialYarn(MaterialMapper.INSTANCE.toMaterialYarn(materialYarnRequest, materialInfo), user);
            }
        }

        try {
            ValidationCheck.unitPricePointCheck(materialInfo.getType(), request.getUnitPrice().toString());
        } catch (Exception e) {
            throw new BusinessException(e.getMessage(), ErrorCode.POINT_CHECK);
        }

        saveMaterialOffer(MaterialMapper.INSTANCE.toMaterialOffer(request, materialInfo, user.getCompId()), user);
    }

    @Override
    @Transactional
    public void saveFabricMaterialExcel(String excelDataJson, User user) {
        List<Fabric> fabricMaterialExcelList = new Gson().fromJson(excelDataJson, new TypeToken<List<Fabric>>(){}.getType());

        for (Fabric fabricMaterialExcel: fabricMaterialExcelList){
            Company supplier = companyService.findCompanyByName(fabricMaterialExcel.getSupplier())
                    .orElseThrow(()-> new BusinessException(ErrorCode.COMPANYID_NOT_FOUND));
            CommonMaterialType materialType = materialTypeCheck("fabric", fabricMaterialExcel.getItemCategory());

            MaterialInfo materialInfo = materialRepository.findMaterialInfo(
                    fabricMaterialExcel.getItemName(), supplier.getId(), materialType.getId(), fabricMaterialExcel.getYarnSizeWrap(), fabricMaterialExcel.getYarnSizeWeft()
                    ,Integer.parseInt(fabricMaterialExcel.getEpi()), Integer.parseInt(fabricMaterialExcel.getPpi())
            ).orElse(null);

            //material info 가 없을 경우 자재 저장, 있을 경우 무시
            if(materialInfo == null){
                //material type 체크하여 없으면 저장, 있을 경우 데이터 그대로
                materialInfo = materialRepository.save(MaterialMapper.INSTANCE.toMaterialInfo(supplier, materialType, fabricMaterialExcel, "fabric", "NEW", user));

                //material yarn
                List<MaterialYarn> materialYarns = new ArrayList<>();
                BigDecimal rate = null;
                if(fabricMaterialExcel.getFabricContents1() != null){
                    CommonBasicInfo commonMaterialYarn = commonYarnCheck(fabricMaterialExcel.getFabricContents1());
                    rate = BigDecimal.ZERO;
                    if(fabricMaterialExcel.getValue1() != null){
                        rate = new BigDecimal(fabricMaterialExcel.getValue1());
                    }
                    materialYarns.add(MaterialMapper.INSTANCE.toMaterialYarn(commonMaterialYarn, rate, materialInfo));
                }
                if(fabricMaterialExcel.getFabricContents2() != null){
                    CommonBasicInfo commonMaterialYarn = commonYarnCheck(fabricMaterialExcel.getFabricContents2());
                    rate = BigDecimal.ZERO;
                    if(fabricMaterialExcel.getValue2() != null){
                        rate = new BigDecimal(fabricMaterialExcel.getValue2());
                    }
                    materialYarns.add(MaterialMapper.INSTANCE.toMaterialYarn(commonMaterialYarn, rate, materialInfo));
                }
                if(fabricMaterialExcel.getFabricContents3() != null){
                    CommonBasicInfo commonMaterialYarn = commonYarnCheck(fabricMaterialExcel.getFabricContents3());
                    rate = BigDecimal.ZERO;
                    if(fabricMaterialExcel.getValue3() != null){
                        rate = new BigDecimal(fabricMaterialExcel.getValue3());
                    }
                    materialYarns.add(MaterialMapper.INSTANCE.toMaterialYarn(commonMaterialYarn, rate, materialInfo));
                }
                if(fabricMaterialExcel.getFabricContents4() != null){
                    CommonBasicInfo commonMaterialYarn = commonYarnCheck(fabricMaterialExcel.getFabricContents4());
                    rate = BigDecimal.ZERO;
                    if(fabricMaterialExcel.getValue4() != null){
                        rate = new BigDecimal(fabricMaterialExcel.getValue4());
                    }
                    materialYarns.add(MaterialMapper.INSTANCE.toMaterialYarn(commonMaterialYarn, rate, materialInfo));
                }

                saveMaterialYarn(materialYarns, user);
            }

            //material offer
            saveFabricMaterialOffer(materialInfo, fabricMaterialExcel, user);
        }
    }

    private void saveFabricMaterialOffer(MaterialInfo materialInfo, Fabric fabricMaterialExcel, User user) {
        Company recipientCompany = null;
        if(fabricMaterialExcel.getBuyer() != null) {
            recipientCompany = companyRepository.findByName(fabricMaterialExcel.getBuyer()).orElse(null);
        }

        CommonBasicInfo currencyObject = null;
        if(fabricMaterialExcel.getCurrency() != null){
            currencyObject = commonService.findCommonBasicInfoByTypeAndCmName2("currency", fabricMaterialExcel.getCurrency()).orElse(null);
        }

        CommonBasicInfo offerUom = null;
        if(fabricMaterialExcel.getOriginalUom() != null){
            offerUom = commonUomCheck(fabricMaterialExcel.getOriginalUom());
        }

        BigDecimal price = new BigDecimal(fabricMaterialExcel.getPrice());

        BigDecimal width = BigDecimal.ZERO;
        if(fabricMaterialExcel.getWidth() != null){
            width = new BigDecimal(fabricMaterialExcel.getWidth());
        }
        CommonBasicInfo widthUom = null;
        if(fabricMaterialExcel.getWidthUom() != null){
            widthUom = commonUomCheck(fabricMaterialExcel.getWidthUom());
        }

        BigDecimal weight = BigDecimal.ZERO;
        if(fabricMaterialExcel.getWeight() != null){
            weight = new BigDecimal(fabricMaterialExcel.getWeight());
        }
        CommonBasicInfo weightUom = null;
        if(fabricMaterialExcel.getWeightUom() != null){
            weightUom = commonUomCheck(fabricMaterialExcel.getWeightUom());
        }

        Integer fullWidth = 0;
        if(fabricMaterialExcel.getFullWidth() != null){
            fullWidth = Integer.parseInt(fabricMaterialExcel.getFullWidth());
        }
        CommonBasicInfo fullWidthUom = null;
        if(fabricMaterialExcel.getFullWidthUom() != null){
            fullWidthUom = commonUomCheck(fabricMaterialExcel.getFullWidthUom());
        }

        Integer moq = 0;
        if(fabricMaterialExcel.getMcq() != null){
            moq = Integer.parseInt(fabricMaterialExcel.getMoq());
        }

        Integer mcq = 0;
        if(fabricMaterialExcel.getMcq() != null){
            mcq = Integer.parseInt(fabricMaterialExcel.getMcq());
        }
        saveMaterialOffer(
                MaterialOffer.builder()
                        .materialInfo(materialInfo)
                        .myMillarticle(fabricMaterialExcel.getMaterialNo())
                        .recipient(recipientCompany)
                        .currency(currencyObject)
                        .unitPrice(price)
                        .commonUom(offerUom)
                        .materialAfterManufacturingDyeing(fabricMaterialExcel.getDyeing())
                        .materialAfterManufacturingFashion(fabricMaterialExcel.getPrinting())
                        .materialAfterManufacturingFinishing(fabricMaterialExcel.getPostProcessing())
                        .fabricCw(width)
                        .commonFabricCwUom(widthUom)
                        .fabricWeight(weight)
                        .commonFabricWeightUom(weightUom)
                        .fabricFullWidth(fullWidth)
                        .commonFabricFullWeightUom(fullWidthUom)
                        .mcqQuantity(moq)
                        .moqQuantity(mcq)
                        .build()
                , user);
    }

    @Override
    @Transactional
    public void saveTrimMaterialExcel(String excelDataJson, User user) {
        List<Trim> trimMaterialExcelList = new Gson().fromJson(excelDataJson, new TypeToken<List<Trim>>(){}.getType());
        log.info("excel data: {}", trimMaterialExcelList);

        for (Trim trimMaterialExcel: trimMaterialExcelList){
            Company supplier = companyService.findCompanyByName(trimMaterialExcel.getSupplier())
                    .orElseThrow(()-> new BusinessException(ErrorCode.COMPANYID_NOT_FOUND));

            CommonMaterialType materialType = materialTypeCheck("trim", trimMaterialExcel.getItemCategory());

            MaterialInfo materialInfo = materialRepository.findMaterialInfo(
                    trimMaterialExcel.getItemName(), supplier.getId(), materialType.getId(), trimMaterialExcel.getItemDetail()
            ).orElse(null);

            //material info 가 없을 경우 자재 저장, 있을 경우 무시
            if(materialInfo == null){
                //material type 체크하여 없으면 저장, 있을 경우 데이터 그대로
                materialInfo = materialRepository.save(MaterialMapper.INSTANCE.toMaterialInfo(supplier, materialType, trimMaterialExcel, "trim", "NEW", user));
            }

            //material offer
            saveTrimMaterialOffer(materialInfo, trimMaterialExcel, user);
        }
    }

    private void saveTrimMaterialOffer(MaterialInfo materialInfo, Trim trimMaterialExcel, User user) {
        Company recipientCompany = null;
        if(trimMaterialExcel.getBuyer() != null) {
            recipientCompany = companyRepository.findByName(trimMaterialExcel.getBuyer()).orElse(null);
        }

        CommonBasicInfo currencyObject = null;
        if(trimMaterialExcel.getCurrency() != null){
            currencyObject = commonService.findCommonBasicInfoByTypeAndCmName2("currency", trimMaterialExcel.getCurrency()).orElse(null);
        }

        CommonBasicInfo offerUom = null;
        if(trimMaterialExcel.getOriginalUom() != null){
            offerUom = commonUomCheck(trimMaterialExcel.getOriginalUom());
        }

        CommonBasicInfo sizeUom = null;
        if(trimMaterialExcel.getItemSizeUom() != null){
            sizeUom = commonUomCheck(trimMaterialExcel.getItemSizeUom());
        }

        BigDecimal price = new BigDecimal(trimMaterialExcel.getPrice());
        BigDecimal width = null;
        if(trimMaterialExcel.getWidth() != null){
            width = new BigDecimal(trimMaterialExcel.getWidth());
        }
        CommonBasicInfo widthUom = null;
        if(trimMaterialExcel.getWidthUom() != null){
            widthUom = commonUomCheck(trimMaterialExcel.getWidthUom());
        }

        BigDecimal weight = BigDecimal.ZERO;
        if(trimMaterialExcel.getWeight() != null){
            weight = new BigDecimal(trimMaterialExcel.getWeight());
        }
        CommonBasicInfo weightUom = null;
        if(trimMaterialExcel.getWeightUom() != null){
            weightUom = commonUomCheck(trimMaterialExcel.getWeightUom());
        }

        Integer fullWidth = 0;
        if(trimMaterialExcel.getFullWidth() != null){
            fullWidth = Integer.parseInt(trimMaterialExcel.getFullWidth());
        }
        CommonBasicInfo fullWidthUom = null;
        if(trimMaterialExcel.getFullWidthUom() != null){
            fullWidthUom = commonUomCheck(trimMaterialExcel.getFullWidthUom());
        }

        Integer moq = 0;
        if(trimMaterialExcel.getMcq() != null){
            moq = Integer.parseInt(trimMaterialExcel.getMoq());
        }

        Integer mcq = 0;
        if(trimMaterialExcel.getMcq() != null){
            mcq = Integer.parseInt(trimMaterialExcel.getMcq());
        }

        saveMaterialOffer(
                MaterialOffer.builder()
                        .materialInfo(materialInfo)
                        .myMillarticle(trimMaterialExcel.getMaterialNo())
                        .recipient(recipientCompany)
                        .currency(currencyObject)
                        .unitPrice(price)
                        .commonUom(offerUom)
                        .size(trimMaterialExcel.getItemSize())
                        .commonSubsidiarySizeUom(sizeUom)
                        .materialAfterManufacturingFinishing(trimMaterialExcel.getPostProcessing())
                        .fabricCw(width)
                        .commonFabricCwUom(widthUom)
                        .fabricWeight(weight)
                        .commonFabricWeightUom(weightUom)
                        .fabricFullWidth(fullWidth)
                        .commonFabricFullWeightUom(fullWidthUom)
                        .mcqQuantity(mcq)
                        .moqQuantity(moq)
                        .build()
                , user);
    }

    @Override
    @Transactional
    public void saveAccessoriesMaterialExcel(String excelDataJson, User user) {
        List<Accessories> accessoriesMaterialExcelList = new Gson().fromJson(excelDataJson, new TypeToken<List<Accessories>>(){}.getType());
        log.info("excel data: {}", accessoriesMaterialExcelList);

        for (Accessories accessoriesMaterialExcel: accessoriesMaterialExcelList){
            Company supplier = companyService.findCompanyByName(accessoriesMaterialExcel.getSupplier())
                    .orElseThrow(()-> new BusinessException(ErrorCode.COMPANYID_NOT_FOUND));
            CommonMaterialType materialType = materialTypeCheck("Accessories", accessoriesMaterialExcel.getItemType(),accessoriesMaterialExcel.getItemCategory());

            MaterialInfo materialInfo = materialRepository.findMaterialInfo(
                    accessoriesMaterialExcel.getItemName(), supplier.getId(), materialType.getId(), accessoriesMaterialExcel.getItemDetail()
            ).orElse(null);

            //material info 가 없을 경우 자재 저장, 있을 경우 무시
            if(materialInfo == null){
                //material type 체크하여 없으면 저장, 있을 경우 데이터 그대로
                materialInfo = materialRepository.save(MaterialMapper.INSTANCE.toMaterialInfo(supplier, materialType, accessoriesMaterialExcel, "accessories", "NEW", user));
            }

            //material offer
            saveAccessoriesMaterialOffer(materialInfo, accessoriesMaterialExcel, user);
        }
    }

    private void saveAccessoriesMaterialOffer(MaterialInfo materialInfo, Accessories accessoriesMaterialExcel, User user) {
        Company recipientCompany = null;
        if(accessoriesMaterialExcel.getBuyer() != null) {
            recipientCompany = companyRepository.findByName(accessoriesMaterialExcel.getBuyer()).orElse(null);
        }

        CommonBasicInfo currencyObject = null;
        if(accessoriesMaterialExcel.getCurrency() != null){
            currencyObject = commonService.findCommonBasicInfoByTypeAndCmName2("currency", accessoriesMaterialExcel.getCurrency()).orElse(null);
        }

        CommonBasicInfo offerUom = null;
        if(accessoriesMaterialExcel.getOriginalUom() != null){
            offerUom = commonUomCheck(accessoriesMaterialExcel.getOriginalUom());
        }

        CommonBasicInfo sizeUom = null;
        if(accessoriesMaterialExcel.getItemSizeUom() != null){
            sizeUom = commonUomCheck(accessoriesMaterialExcel.getItemSizeUom());
        }

        BigDecimal price = new BigDecimal(accessoriesMaterialExcel.getPrice());
        Integer moq = 0;
        if(accessoriesMaterialExcel.getMcq() != null){
            moq = Integer.parseInt(accessoriesMaterialExcel.getMoq());
        }
        Integer mcq = 0;
        if(accessoriesMaterialExcel.getMcq() != null){
            mcq = Integer.parseInt(accessoriesMaterialExcel.getMcq());
        }

        saveMaterialOffer(
                MaterialOffer.builder()
                        .materialInfo(materialInfo)
                        .myMillarticle(accessoriesMaterialExcel.getMaterialNo())
                        .recipient(recipientCompany)
                        .currency(currencyObject)
                        .unitPrice(price)
                        .commonUom(offerUom)
                        .size(accessoriesMaterialExcel.getItemSize())
                        .commonSubsidiarySizeUom(sizeUom)
                        .mcqQuantity(mcq)
                        .moqQuantity(moq)
                        .build()
                , user);
    }

    private CommonBasicInfo commonUomCheck(String uomName) {
        return commonService.findCommonBasicInfoByTypeAndCmName2NotAndCmName3("uom", "time" ,uomName).orElse(null);
    }

    private CommonBasicInfo commonYarnCheck(String contents) {
        CommonBasicInfo commonMaterialYarn = commonService.findCommonBasicInfoByTypeAndCmName1(contents, "yarn").orElse(null);
        if(commonMaterialYarn == null){
            return commonService.saveCommonBasicInfo(
                    CommonBasicInfo.builder().type("yarn").cmName1(contents).build()
            );
        }
        return commonMaterialYarn;
    }

    private CommonMaterialType materialTypeCheck(String categoryA, String categoryB) {
        log.info("Category : {},{}", categoryA, categoryB);
        CommonMaterialType result = commonService.findCommonMaterialType(categoryA, categoryB).get(0);

        if(result == null){
            return commonService.saveCommonMaterialType(
                    CommonMaterialType.builder().categoryA(categoryA).categoryB(categoryB).build()
            );
        }
        return result;
    }

    private CommonMaterialType materialTypeCheck(String categoryA, String categoryB, String categoryC) {
        CommonMaterialType result = commonService.findCommonMaterialType(categoryA, categoryB, categoryC)
                .orElse(null);

        if(result == null){
            return commonService.saveCommonMaterialType(
                    CommonMaterialType.builder().categoryA(categoryA).categoryB(categoryB).categoryC(categoryC).build()
            );
        }
        return result;
    }

    @Override
    public Optional<MaterialInfo> findMaterialInfo(String name, Long supplierId, Long categoryId
            , String yarnSizeWrap, String yarnSizeWeft, int constructionEpi, int constructionPpi)
    {
        return materialRepository.findMaterialInfo(name, supplierId, categoryId, yarnSizeWrap, yarnSizeWeft
                ,constructionEpi, constructionPpi
        );
    }

    @Override
    public Optional<MaterialInfo> findMaterialInfo(String name, Long supplierId, Long categoryId, String subsidiaryDetail) {
        return materialRepository.findMaterialInfo(name, supplierId, categoryId, subsidiaryDetail);
    }

    @Override
    public MaterialInfo saveMaterialInfo(MaterialInfo materialInfo) {
        return materialRepository.save(materialInfo);
    }

    @Override
    public void assignedMaterialOffer(Long materialOfferId, MaterialInfo copyMaterialInfo, User user) {
        if(materialFabricOfferRepository.findByMaterialInfoAndOriginalMillarticleId(copyMaterialInfo, materialOfferId).isPresent()){
            throw new BusinessException(ErrorCode.MATERIAL_OFFER_IS_SAME);
        }

        MaterialOffer materialOffer = findOfferById(materialOfferId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MATERIAL_INFO_NOT_FOUND));

        saveMaterialOffer(MaterialMapper.INSTANCE.toMaterialOffer(materialOffer, copyMaterialInfo, user.getCompId()), user);
    }
}
