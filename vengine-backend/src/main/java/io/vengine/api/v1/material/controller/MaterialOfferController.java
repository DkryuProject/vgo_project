package io.vengine.api.v1.material.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.ValidationCheck;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.commonInfo.service.CodeGeneratedService;
import io.vengine.api.v1.material.dto.MaterialOfferRequest;
import io.vengine.api.v1.material.dto.MaterialResponse;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.material.entity.MaterialYarn;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.material.service.MaterialService;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.List;

@Api(tags = {"08. MATERIAL OFFER"}, consumes = "application/json")
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MaterialOfferController {
    private final ResponseService responseService;

    @Autowired
    MaterialService materialService;

    @Autowired
    CodeGeneratedService codeGeneratedService;

    @ApiOperation(value = "자재 Offer 등록", notes = "자재 Offer를 등록한다")
    @PostMapping(value = "/material/offer/{materialInfoId}")
    @Transactional
    public CommonResult saveMaterialOffer(
            @ApiParam(value = "Material Info ID", required = true) @PathVariable Long materialInfoId,
            @Valid @RequestBody MaterialOfferRequest materialOfferRequest,
            @AuthenticationPrincipal User user
    )
    {
        MaterialInfo materialInfo = materialService.findMaterialInfoById(materialInfoId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_INFO_NOT_FOUND));

        try {
            ValidationCheck.unitPricePointCheck(materialInfo.getType(), materialOfferRequest.getUnitPrice().toString());
        } catch (Exception e) {
            throw new BusinessException(e.getMessage(), ErrorCode.POINT_CHECK);
        }

        MaterialOffer materialOffer = MaterialMapper.INSTANCE.toMaterialOffer(materialOfferRequest, materialInfo);

        materialService.saveMaterialOffer(materialOffer, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "자재 Offer 수정", notes = "자재 Offer를 수정한다")
    @PutMapping(value = "/material/offer/{id}")
    public CommonResult modifyMaterialOffer(
            @ApiParam(value = "Material Offer ID", required = true) @PathVariable Long id,
            @Valid @RequestBody MaterialOfferRequest materialOfferRequest,
            @AuthenticationPrincipal User user
    )
    {
        MaterialOffer materialOffer = materialService.findOfferById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_OFFER_NOT_FOUND));

        //나의 회사 자재가 아니면 수정 불가
        if(materialOffer.getMaterialInfo().getSupplierCompany().getId().longValue() != user.getCompId().getId().longValue()){
            throw new BusinessException(ErrorCode.MATERIAL_OFFER_CAN_NOT_MODIFY);
        }

        /*
        if(materialOffer.getCbdMaterialInfos().size()>0
                || materialOffer.getMclMaterialInfos().size()>0
        ){
            throw new BusinessException(ErrorCode.MATERIAL_OFFER_CAN_NOT_DELETE);
        }
        */

        //if(materialOffer.getOriginalMillarticleId() != null){
        //    throw new BusinessException(ErrorCode.MATERIAL_OFFER_CAN_NOT_MODIFY);
        //}

        try {
            ValidationCheck.unitPricePointCheck(materialOffer.getMaterialInfo().getType(), materialOfferRequest.getUnitPrice().toString());
        } catch (Exception e) {
            throw new BusinessException(e.getMessage(), ErrorCode.POINT_CHECK);
        }
        MaterialMapper.INSTANCE.toMaterialOffer(materialOfferRequest, materialOffer);

        if(materialOfferRequest.getRecipientId() == null){
            materialOffer.setRecipient(null);
        }
        materialService.modifyMaterialOffer(materialOffer, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Material Offer MaterialInfoId로 조회", notes = "MaterialInfoId로 Material Offer 조회한다")
    @GetMapping(value = "/material/offer/info/{materialInfoId}")
    public ListResult<MaterialResponse.MaterialOffer> findOfferByMaterialId(
            @ApiParam(value = "Material Info ID", required = true) @PathVariable Long materialInfoId,
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(MaterialMapper.INSTANCE.toMaterialOfferDto(
                materialService.findOfferByMaterialId(materialInfoId, user)));
    }

    @ApiOperation(value = "Material Offer MaterialInfoId로 조회", notes = "MaterialInfoId로 Material Offer 조회한다")
    @GetMapping(value = "/material/offer/own/{materialInfoId}")
    public ListResult<MaterialResponse.MaterialOffer> findMyOwnMaterialOfferList(
            @ApiParam(value = "Material Info ID", required = true) @PathVariable Long materialInfoId,
            @AuthenticationPrincipal User user
    ){
        MaterialInfo materialInfo = materialService.findMaterialInfoById(materialInfoId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_INFO_NOT_FOUND));

        return responseService.getListResult(MaterialMapper.INSTANCE.toMaterialOfferDto(
                materialService.findMyOwnMaterialOfferList(materialInfo, user.getCompId())));
    }

    @ApiOperation(value = "Material Offer ID로 조회", notes = "ID로 Material Offer 조회한다")
    @GetMapping(value = "/material/offer/{id}")
    public SingleResult<MaterialResponse.MaterialOffer> findOfferById(
            @ApiParam(value = "ID", required = true) @PathVariable Long id
    ){
        return responseService.getSingleResult(MaterialMapper.INSTANCE.toMaterialOfferDto(
                materialService.findOfferById(id).orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_OFFER_NOT_FOUND))));
    }

    @ApiOperation(value = "Material Offer 삭제", notes = "Material Offer를 삭제 상태 업데이트한다")
    @DeleteMapping(value = "/material/offer")
    @Transactional
    public CommonResult deleteOffer(
            @RequestBody List<Long> ids,
            @AuthenticationPrincipal User user
    ){
        for (Long id : ids){
            materialService.deleteFlagUpdateMaterialOffer(id, user);
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "자재 Offer Assigned")
    @PostMapping(value = "/material/offer/assigned")
    @Transactional
    public CommonResult AssignedMaterialOffer(
            @RequestBody List<Long> ids,
            @AuthenticationPrincipal User user
    )
    {
        if(ids.size() == 0){
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }

        MaterialOffer materialOffer = materialService.findOfferById(ids.get(0))
                .orElseThrow(() -> new BusinessException(ErrorCode.MATERIAL_INFO_NOT_FOUND));

        if(user.getCompId().getId().longValue() == materialOffer.getMaterialInfo().getSupplierCompany().getId().longValue()){
            throw new BusinessException(ErrorCode.MATERIAL_OFFER_CAN_NOT_ASSIGNED);
        }

        MaterialInfo copyMaterialInfo = null;
        //동일한 material info check 없으면 복사할 material info 생성
        if("fabric".equals(materialOffer.getMaterialInfo().getType())){
            copyMaterialInfo = materialService.findMaterialInfo(materialOffer.getMaterialInfo().getName(), user.getCompId().getId(), materialOffer.getMaterialInfo().getMaterialCategory().getId()
                    ,materialOffer.getMaterialInfo().getYarnSizeWrap(), materialOffer.getMaterialInfo().getYarnSizeWeft()
                    ,materialOffer.getMaterialInfo().getConstructionEpi(), materialOffer.getMaterialInfo().getConstructionPpi()
            ).orElse(null);
        }else{
            copyMaterialInfo = materialService.findMaterialInfo(materialOffer.getMaterialInfo().getName(), user.getCompId().getId()
                    , materialOffer.getMaterialInfo().getMaterialCategory().getId(), materialOffer.getMaterialInfo().getSubsidiaryDetail()
            ).orElse(null);
        }

        if(copyMaterialInfo == null){
            copyMaterialInfo = materialService.saveMaterialInfo(MaterialMapper.INSTANCE.toAssignedMaterialInfo(materialOffer.getMaterialInfo(), user));

            if(materialOffer.getMaterialInfo().getMaterialYarns() != null){
                for(MaterialYarn materialYarn: materialOffer.getMaterialInfo().getMaterialYarns()){
                    materialService.saveMaterialYarn(MaterialMapper.INSTANCE.toAssignedMaterialYarn(materialYarn, copyMaterialInfo),user);
                }
            }
        }

        for (Long id : ids){
            materialService.assignedMaterialOffer(id, copyMaterialInfo, user);
        }

        return responseService.getSuccessResult();
    }
}
