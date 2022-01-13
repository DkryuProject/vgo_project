package io.vengine.api.v1.cbd.service.impl;

import io.vengine.api.common.enums.DelFlag;
import io.vengine.api.common.enums.Status;
import io.vengine.api.common.filters.CbdSpecification;
import io.vengine.api.common.utils.FormattingUtil;
import io.vengine.api.common.utils.S3Uploader;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.cbd.dto.CbdDocumentDto;
import io.vengine.api.v1.cbd.dto.CbdOptionSimulationDto;
import io.vengine.api.v1.cbd.dto.NewCbdMaterialInfoRequest;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.cbd.entity.CBDMaterialCosting;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.cbd.mapper.CBDMapper;
import io.vengine.api.v1.cbd.repository.CBDCoverRepository;
import io.vengine.api.v1.cbd.repository.CBDMaterialCostingRepository;
import io.vengine.api.v1.cbd.repository.CBDMaterialInfoRepository;
import io.vengine.api.v1.cbd.repository.CBDOptionRepository;
import io.vengine.api.v1.cbd.service.CBDService;
import io.vengine.api.v1.commonInfo.enums.CostingType;
import io.vengine.api.v1.material.dto.MaterialYarnRequest;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.material.service.MaterialService;
import io.vengine.api.v1.mcl.service.MclService;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CBDServiceImpl implements CBDService {
    @Autowired
    private S3Uploader s3Uploader;

    @Autowired
    CBDCoverRepository cbdCoverRepository;

    @Autowired
    CBDMaterialCostingRepository cbdMaterialCostingRepository;

    @Autowired
    CBDMaterialInfoRepository cbdMaterialInfoRepository;

    @Autowired
    CBDOptionRepository cbdOptionRepository;

    @Autowired
    MaterialService materialService;

    @Autowired
    MclService mclService;

    @Override
    public Optional<CBDCover> findCoverById(Long id) {
        return cbdCoverRepository.findById(id).filter(y -> !y.getDelFlag().equals("D"));
    }

    @Override
    public Optional<CBDMaterialCosting> findMaterialCostingById(Long id) {
        return cbdMaterialCostingRepository.findById(id);
    }

    @Override
    public Optional<CBDMaterialInfo> findMaterialInfoById(Long id) {
        return cbdMaterialInfoRepository.findById(id);
    }

    @Override
    public Optional<CBDOption> findOptionById(Long id) {
        return cbdOptionRepository.findById(id);
    }

    @Override
    public Page<CBDCover> findAllCover(String searchKeyWord, int page, int size, User user) {
        if(searchKeyWord == null){
            searchKeyWord = "";
        }
        Specification<CBDCover> specification = CbdSpecification.serchCbdCover(searchKeyWord, user);
        return cbdCoverRepository.findAll(specification, PageRequest.of((page == 0) ? 0 : (page - 1), size));
    }

    @Override
    @Transactional
    public CBDCover saveCbdCover(CBDCover cbdCover, User user, String saveType) {
        cbdCover.setUser(user);
        CBDCover result = cbdCoverRepository.save(cbdCover);

        //MCL COVER 등록
        if("save".equals(saveType) && result.getId() != null){
            try {
                mclService.saveMclCover(result, user);
            }catch (Exception e) {
                e.printStackTrace();
                throw new BusinessException(ErrorCode.CBD_MCL_SAVE_ERROR);
            }
        }
        return result;
    }

    @Override
    public CBDCover saveCbdCoverImage(Long id, MultipartFile file, User user) {
        CBDCover cbdCover = findCoverById(id)
                .filter(m-> !m.getDelFlag().equals("D")).orElseThrow(()-> new BusinessException(ErrorCode.CBD_COVER_NOT_FOUND));
        try {
            String imgPath = s3Uploader.upload(file, "cbd");
            cbdCover.setCbdImg(imgPath);
        }catch (Exception e){
            e.printStackTrace();
            throw new BusinessException(ErrorCode.CBD_FiILE_UPLOAD_ERROR);
        }
        return cbdCoverRepository.save(cbdCover);
    }

    @Override
    public CBDOption saveCbdOption(CBDOption cbdOption, User user) {
        if(!findCoverById(cbdOption.getCbdCoverId().getId()).isPresent()){
            throw new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND);
        }
        return cbdOptionRepository.save(cbdOption);
    }

    @Override
    public CBDMaterialCosting  saveCbdMaterialCosting(CBDMaterialCosting cbdMaterialCosting) {
        if(!findOptionById(cbdMaterialCosting.getCbdOptionId().getId()).isPresent()){
            throw new BusinessException(ErrorCode.CBD_COSTING_NOT_FOUND);
        }
        return cbdMaterialCostingRepository.save(cbdMaterialCosting);
    }

    @Override
    public void deleteFlagUpdateCbdCover(Long id) {
        CBDCover updateData =  findCoverById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_COVER_NOT_FOUND));

        if(updateData.getCbdOptions().size() > 0){
            throw new BusinessException(ErrorCode.CBD_COVER_CAN_NOT_DELETE);
        }

        updateData.setDelFlag(DelFlag.D.getKey());
        updateData.setDelDate(LocalDateTime.now());
        cbdCoverRepository.save(updateData);
    }

    @Override
    public List<CBDOption> findOptionByCoverId(CBDCover cbdCover) {
        return cbdOptionRepository.findByCbdCoverId(cbdCover);
    }

    @Override
    public void deleteFlagUpdateCbdOption(Long id, User user) {
        CBDOption cbdOption = findOptionById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND));

        if(cbdOption.getCbdMaterialCostings().size()>0
                || cbdOption.getCbdMaterialInfos().size()>0
                || cbdOption.getMclCbdAssigns().size()>0
                || cbdOption.getMclPreBookings().size()>0
        ){
            throw new BusinessException(ErrorCode.CBD_OPTION_CAN_NOT_DELETE);
        }

        cbdOption.setDelFlag(DelFlag.D.getKey());
        cbdOption.setUser(user);
        cbdOptionRepository.save(cbdOption);
    }

    @Override
    public void deleteFlagUpdateCbdCosting(Long id, User user) {
        CBDMaterialCosting cbdMaterialCosting = findMaterialCostingById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_COSTING_NOT_FOUND));

        cbdMaterialCosting.setDelFlag(DelFlag.D.getKey());
        cbdMaterialCosting.setUser(user);
        cbdMaterialCostingRepository.save(cbdMaterialCosting);
    }

    @Override
    public List<CBDMaterialCosting> findMaterialCostingByTypeAndCoverID(Long optionID, String type, Company company) {
        CBDOption cbdOption = findOptionById(optionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND));

        return cbdOption.getCbdMaterialCostings()
                .stream()
                .filter(item -> item.getType() == CostingType.valueOf(type))
                .collect(Collectors.toList());

//        return cbdOption.getCbdMaterialCostings()
//                .stream()
//                .filter(item-> item.getCompany().getId().equals(user.getCompId().getId())
//                        && item.getType().equals(CostingType.valueOf(type)))
//                .collect(Collectors.toList());


    }

    @Override
    public CBDMaterialInfo modifyCbdMaterialInfo(CBDMaterialInfo cbdMaterialInfo, User user) {
        findOptionById(cbdMaterialInfo.getCbdOption().getId());
        cbdMaterialInfo.setUser(user);
        return cbdMaterialInfoRepository.save(cbdMaterialInfo);
    }

    @Override
    public void deleteFlagUpdateCbdMaterialInfo(Long id, User user) {
        CBDMaterialInfo cbdMaterialInfo = findMaterialInfoById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_MATERIAL_INFO_NOT_FOUND));

        if(cbdMaterialInfo.getMclMaterialInfos().size() > 0){
            throw new BusinessException("Cbd Material info can't delete!",ErrorCode.INTERNAL_SERVER_ERROR);
        }

        cbdMaterialInfo.setDelFlag(DelFlag.D.getKey());
        cbdMaterialInfo.setUser(user);
        cbdMaterialInfoRepository.save(cbdMaterialInfo);
    }

    @Override
    public List<CBDMaterialInfo> findMaterialInfoByTypeAndOptionID(Long optionID, String type) {
        CBDOption cbdOption = findOptionById(optionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND));

        return cbdOption.getCbdMaterialInfos()
                .stream()
                .filter(item -> item.getType().equals(type))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CBDCover> findCoverByCbdName(String cbdName) {
        return cbdCoverRepository.findByCbdName(cbdName);
    }

    @Override
    public Optional<CBDOption> findOptionByCbdCoverAndName(Long cbdCoverID, String name) {
        return cbdOptionRepository.findByCbdCoverIdAndName(findCoverById(cbdCoverID).orElseThrow(()-> new BusinessException(ErrorCode.CBD_COVER_NOT_FOUND)), name);
    }

    @Override
    @Transactional
    public CBDMaterialInfo assignCbdMaterialInfo(CBDOption cbdOption, MaterialOffer materialOffer, User user) {
        return cbdMaterialInfoRepository.save(
                CBDMapper.INSTANCE.toMaterial(cbdOption, materialOffer.getMaterialInfo(), materialOffer, user)
        );
    }

    @Override
    @Transactional
    public CBDMaterialInfo saveMaterialAndCbdMaterial(CBDOption cbdOption, NewCbdMaterialInfoRequest request, String type, User user) {
        //material info save
        MaterialInfo materialInfo =  materialService.saveMaterialInfo(MaterialMapper.INSTANCE.toMaterialInfo(type, request, "NEW", user));

        //material yarn save
        if(request.getMaterialYarnRequestList() != null){
            for (MaterialYarnRequest materialYarnRequest: request.getMaterialYarnRequestList()){
                materialService.saveMaterialYarn(MaterialMapper.INSTANCE.toMaterialYarn(materialYarnRequest, materialInfo), user);
            }
        }

        //material offer save
        MaterialOffer materialOffer = materialService.saveMaterialOffer(
                MaterialMapper.INSTANCE.toMaterialOffer(request,
                        materialInfo,
                        cbdOption.getCbdCoverId().getBuyer(),
                        cbdOption.getCbdCoverId().getVendorBrandId(),
                        cbdOption.getCbdCoverId().getCommonCurrencyId(),
                        user.getCompId()
                ), user
        );

        return cbdMaterialInfoRepository.save(
                CBDMapper.INSTANCE.toMaterial(request, cbdOption, materialOffer.getMaterialInfo(), materialOffer, user)
        );
    }

    @Override
    public List<CBDOption> findCbdOptionForMclAssign(Long mclOptionId) {
        return cbdOptionRepository.findCbdOptionForMclAssign(mclOptionId);
    }

    @Override
    public void modifyCbdCoverStatus(Long id, String status) {
        CBDCover cover = findCoverById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_COVER_NOT_FOUND));
        cover.setStatus(Status.ofStatusValue(status));
        cbdCoverRepository.save(cover);
    }

    @Override
    public List<CBDOption> findClosedCbdOptionByCover(CBDCover cbdCover) {
        return cbdOptionRepository.findByCbdCoverIdAndStatus(cbdCover, Status.CLOSE);
    }

    @Override
    public List<CBDCover> findCoverByDesignNumber(String designNumber) {
        return cbdCoverRepository.findByDesignNumber(designNumber);
    }

    @Override
    public CbdDocumentDto.CbdHeader findCbdDocumentHeader(CBDOption cbdOption) {
        return CBDMapper.INSTANCE.toDocumentHeader(cbdOption);
    }

    @Override
    public List<CbdOptionSimulationDto> findCbdOptionSimulation(CBDOption cbdOption, double targetProfit) {
        List<CbdOptionSimulationDto> simulations = new ArrayList<>();

        double totalAmount = cbdOption.getCbdMaterialInfos().stream().mapToDouble(CBDMaterialInfo::getAmount).sum()
                + cbdOption.getCbdMaterialCostings().stream().mapToDouble(CBDMaterialCosting::getAmount).sum();

        for(double i = targetProfit-5; i< targetProfit+5; i++ ){
            simulations.add(CbdOptionSimulationDto.builder()
                    .cost(FormattingUtil.withMathRound( totalAmount/(1-i/100),2))
                    .targetProfit(FormattingUtil.withMathRound(i,2))
                    .build());
        }
        return simulations;
    }

    @Override
    public List<CbdDocumentDto.CbdDetail> findCbdDocumentDetails(CBDOption cbdOption) {
        List<CbdDocumentDto.CbdDetail> cbdDetails = new ArrayList<>();

        List<CBDMaterialInfo> fabricMaterials = cbdOption.getCbdMaterialInfos()
                .stream()
                .filter(item -> item.getType().equals("fabric"))
                .collect(Collectors.toList());

        List<CBDMaterialInfo> trimMaterials = cbdOption.getCbdMaterialInfos()
                .stream()
                .filter(item -> item.getType().equals("trim"))
                .collect(Collectors.toList());

        List<CBDMaterialInfo> accessoriesMaterials = cbdOption.getCbdMaterialInfos()
                .stream()
                .filter(item -> item.getType().equals("accessories"))
                .collect(Collectors.toList());

        List<CBDMaterialCosting> directCostings = cbdOption.getCbdMaterialCostings()
                .stream()
                .filter(item -> item.getType().equals(CostingType.direct))
                .collect(Collectors.toList());

        List<CBDMaterialCosting> indirectCostings = cbdOption.getCbdMaterialCostings()
                .stream()
                .filter(item -> item.getType().equals(CostingType.indirect))
                .collect(Collectors.toList());

        if(fabricMaterials.size() > 0){
            for (CBDMaterialInfo fabricMaterialInfo: fabricMaterials ){
                cbdDetails.add(CBDMapper.INSTANCE.toDocumentDetail(fabricMaterialInfo));
            }
            CbdDocumentDto.CbdDetail fabricTotal = new CbdDocumentDto.CbdDetail();
            fabricTotal.setUsage("FABRIC TOTAL");
            fabricTotal.setAmount(FormattingUtil.withBigDecimal(fabricMaterials.stream().mapToDouble(CBDMaterialInfo::getAmount).sum(),2));
            fabricTotal.setPortion(FormattingUtil.withBigDecimal(fabricMaterials.stream().mapToDouble(CBDMaterialInfo::getPortion).sum(),2));
            cbdDetails.add(fabricTotal);
        }

        if(trimMaterials.size()>0){
            for (CBDMaterialInfo trimMaterialInfo: trimMaterials ){
                cbdDetails.add(CBDMapper.INSTANCE.toDocumentDetail(trimMaterialInfo));
            }
            CbdDocumentDto.CbdDetail trimTotal = new CbdDocumentDto.CbdDetail();
            trimTotal.setUsage("TRIM TOTAL");
            trimTotal.setAmount(FormattingUtil.withBigDecimal(trimMaterials.stream().mapToDouble(CBDMaterialInfo::getAmount).sum(),5));
            trimTotal.setPortion(FormattingUtil.withBigDecimal(trimMaterials.stream().mapToDouble(CBDMaterialInfo::getPortion).sum(),2));
            cbdDetails.add(trimTotal);
        }

        if(accessoriesMaterials.size()>0){
            for (CBDMaterialInfo accessoriesMaterialInfo: accessoriesMaterials ){
                cbdDetails.add(CBDMapper.INSTANCE.toDocumentDetail(accessoriesMaterialInfo));
            }
            CbdDocumentDto.CbdDetail accessoriesTotal = new CbdDocumentDto.CbdDetail();
            accessoriesTotal.setUsage("ACCESSORIES TOTAL");
            accessoriesTotal.setAmount(FormattingUtil.withBigDecimal(accessoriesMaterials.stream().mapToDouble(CBDMaterialInfo::getAmount).sum(),5));
            accessoriesTotal.setPortion(FormattingUtil.withBigDecimal(accessoriesMaterials.stream().mapToDouble(CBDMaterialInfo::getPortion).sum(),2));
            cbdDetails.add(accessoriesTotal);
        }

        if(directCostings.size()>0){
            for (CBDMaterialCosting cbdMaterialCosting: directCostings ){
                cbdDetails.add(CBDMapper.INSTANCE.toDocumentDetail(cbdMaterialCosting));
            }
            CbdDocumentDto.CbdDetail directTotal = new CbdDocumentDto.CbdDetail();
            directTotal.setUsage("DIRECT TOTAL");
            directTotal.setAmount(FormattingUtil.withBigDecimal(directCostings.stream().mapToDouble(CBDMaterialCosting::getAmount).sum(),2));
            directTotal.setPortion(FormattingUtil.withBigDecimal(directCostings.stream().mapToDouble(CBDMaterialCosting::getPortion).sum(),2));
            cbdDetails.add(directTotal);
        }

        if(indirectCostings.size()>0){
            for (CBDMaterialCosting cbdMaterialCosting: indirectCostings ){
                cbdDetails.add(CBDMapper.INSTANCE.toDocumentDetail(cbdMaterialCosting));
            }
            CbdDocumentDto.CbdDetail indirectTotal = new CbdDocumentDto.CbdDetail();
            indirectTotal.setUsage("INDIRECT TOTAL");
            indirectTotal.setAmount(FormattingUtil.withBigDecimal(indirectCostings.stream().mapToDouble(CBDMaterialCosting::getAmount).sum(),2));
            indirectTotal.setPortion(FormattingUtil.withBigDecimal(indirectCostings.stream().mapToDouble(CBDMaterialCosting::getPortion).sum(),2));
            cbdDetails.add(indirectTotal);
        }

        return cbdDetails;
    }

    @Override
    public void copyCbdOption(CBDOption cbdOption, CBDCover cbdCover, String cbdOptionName, double targetProfit, User user) {
        //CBD Option copy
        CBDOption copyCbdOption =  cbdOptionRepository.save(
                CBDMapper.INSTANCE.toCopyOption(cbdCover, cbdOption, cbdOptionName, targetProfit, Status.OPEN, user)
        );

        //cbd material info copy
        for (CBDMaterialInfo cbdMaterialInfo: cbdOption.getCbdMaterialInfos()){
            cbdMaterialInfoRepository.save(
                    CBDMapper.INSTANCE.toCopyMaterialInfo(copyCbdOption, cbdMaterialInfo, user)
            );
        }

        //cbd material costing copy
        for (CBDMaterialCosting cbdMaterialCosting: cbdOption.getCbdMaterialCostings()){
            cbdMaterialCostingRepository.save(
                    CBDMapper.INSTANCE.toCopyMaterialCosting(copyCbdOption, cbdMaterialCosting, user)
            );
        }
    }

    @Override
    public List<CBDCover> findAllCover(Map<String, Object> searchFilter, User user) {
        return cbdCoverRepository.findAll(CbdSpecification.searchCbdCover(searchFilter, user.getCompId()));
    }
}
