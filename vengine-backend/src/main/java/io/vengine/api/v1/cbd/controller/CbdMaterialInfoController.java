package io.vengine.api.v1.cbd.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.utils.PatternUtil;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.cbd.dto.CbdDto;
import io.vengine.api.v1.cbd.dto.NewCbdMaterialInfoRequest;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.cbd.mapper.CBDMapper;
import io.vengine.api.v1.cbd.service.CBDService;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.material.service.MaterialService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Api(tags = {"14. CBD MATERIAL INFO"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class CbdMaterialInfoController {
    private final ResponseService responseService;

    @Autowired
    CBDService cbdService;

    @Autowired
    MaterialService materialService;

    @Autowired
    CommonService commonService;

    @ApiOperation(value = "CBD Material Info ID로 조회", notes = "ID로 Material Info를 조회한다\n" +
            "parameter\n1. id: cbd material info id 필수\n")
    @GetMapping(value = "/cbd/info/{id}")
    public SingleResult<CbdDto.CbdMaterialInfo> findCbdMaterialInfoById(
            @ApiParam(value = "ID", required = true) @PathVariable Long id
    ){
        return responseService.getSingleResult(CBDMapper.INSTANCE.toMaterialDTO(cbdService.findMaterialInfoById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_MATERIAL_INFO_NOT_FOUND))));
    }

    @ApiOperation(value = "CBD Material Info OptionID로 조회", notes = "CBD Option ID로 CBD Material Info를 조회한다\n" +
            "parameter\n1. optionID: cbd option id 필수\n2. type: 자재 유형 필수")
    @GetMapping(value = "/cbd/info/{type}/{optionID}")
    public ListResult<CbdDto.CbdMaterialInfo> findMaterialInfoByTypeAndOptionID(
            @ApiParam(value = "CBD Option ID", required = true) @PathVariable Long optionID,
            @ApiParam(value = "자재 유형", required = true, defaultValue = "fabric") @PathVariable String type,
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(CBDMapper.INSTANCE.toMaterialDTO(cbdService.findMaterialInfoByTypeAndOptionID(optionID, type)));
    }

    @ApiOperation(value = "Material Info Assigned", notes = "Material Info Assign하여 Cbd Material info에 저장한다.\n")
    @PostMapping(value = "/cbd/info/assign")
    public SingleResult<CbdDto.CbdMaterialInfo> assignCbdMaterialInfo(
            @ApiParam(value = "CBD Option ID", required = true) @RequestParam Long cbdOptionID,
            @ApiParam(value = "Material Offer ID", required = true) @RequestParam Long materialOfferID,
            @AuthenticationPrincipal User user
    ){
        CBDOption cbdOption = cbdService.findOptionById(cbdOptionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND));

        MaterialOffer materialOffer = materialService.findOfferById(materialOfferID)
                .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_OFFER_NOT_FOUND));

        return responseService.getSingleResult(CBDMapper.INSTANCE.toMaterialDTO(
                cbdService.assignCbdMaterialInfo(cbdOption, materialOffer, user)));
    }

    @ApiOperation(value = "신규 자재 등록 및 CBD 자재 등록 ", notes = "신규 자재 등록 및 CBD 자재 등록을 한다\n" +
            "1. materialInfoId, MaterialOptionId, materialYarnId, materialId: null")
    @PostMapping(value = "/cbd/info/{type}/{cbdOptionID}")
    public SingleResult<CbdDto.CbdMaterialInfo> saveMaterialAndCbdMaterial(
            @ApiParam(value = "Type", required = true) @PathVariable String type,
            @ApiParam(value = "CBD Option ID", required = true) @PathVariable Long cbdOptionID,
            @Valid @RequestBody NewCbdMaterialInfoRequest request,
            @AuthenticationPrincipal User user
    )
    {
        if(type.equals("fabric")){
            if(!PatternUtil.decimalPointCheck(request.getUnitPrice().toString(), 2)){
                throw new BusinessException("unit price decimal point have 2", ErrorCode.INTERNAL_SERVER_ERROR);
            }
            if(request.getMaterialYarnRequestList().size() == 0){
                throw new BusinessException(ErrorCode.MATERIAL_YARN_NOT_FOUND);
            }
            if(request.getConstructionType() == null
                    || request.getCw() == null
                    || request.getWeight() == null
            ){
                throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
            }
        }else{
            if(!PatternUtil.decimalPointCheck(request.getUnitPrice().toString(), 5)){
                throw new BusinessException("unit price decimal point have 5", ErrorCode.INTERNAL_SERVER_ERROR);
            }
            if(request.getSize() == null || request.getSize() =="" || request.getSizeUomId() == null){
                throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
            }
        }

        CBDOption cbdOption = cbdService.findOptionById(cbdOptionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND));

        return responseService.getSingleResult(CBDMapper.INSTANCE.toMaterialDTO(
                cbdService.saveMaterialAndCbdMaterial(cbdOption, request, type, user)
                )
        );
    }

    @ApiOperation(value = "CBD Material Info 수정", notes = "CBD Material Info룰 수정을 한다\n" +
            "1. id: CBD Material Info ID 필수\n")
    @PutMapping(value = "/cbd/info/{id}")
    public SingleResult<CbdDto.CbdMaterialInfo> modifyCbdMaterialInfo(
            @ApiParam(value = "CBD Material Info ID", required = true) @PathVariable Long id,
            @Valid @RequestBody CbdDto.CbdMaterialInfoRequest cbdMaterialInfoRequest,
            @AuthenticationPrincipal User user
    )
    {
        CBDMaterialInfo cbdMaterialInfo = cbdService.findMaterialInfoById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_MATERIAL_INFO_NOT_FOUND));

        CBDMapper.INSTANCE.toMaterial(cbdMaterialInfoRequest, user, cbdMaterialInfo);

        //CommonBasicInfo commonUom = commonService.findCommonBasicInfoById(cbdMaterialInfoRequest.getUomId());

        MaterialOffer materialOffer = cbdMaterialInfo.getMaterialOffer();
        if(cbdMaterialInfoRequest.getMaterialOfferId() != null){
            materialOffer = materialService.findOfferById(cbdMaterialInfoRequest.getMaterialOfferId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_OFFER_NOT_FOUND));
        }
        /*
        //offer의 단가와 요청 단가가 다르면 offer 새로 생성
        if(materialOffer.getUnitPrice().doubleValue() != cbdMaterialInfoRequest.getUnitPrice().doubleValue()
                || materialOffer.getCommonUom().getId() != commonUom.getId()
        ){
            materialOffer = materialService.saveMaterialOffer(
                    MaterialMapper.INSTANCE.toMaterialOffer(
                            materialOffer, commonUom, cbdMaterialInfoRequest.getUnitPrice(), user.getCompId()), user
            );
        }
        */
        CBDMapper.INSTANCE.toMaterial(materialOffer, cbdMaterialInfo);
        return responseService.getSingleResult(CBDMapper.INSTANCE.toMaterialDTO(cbdService.modifyCbdMaterialInfo(cbdMaterialInfo, user)));
    }

    @ApiOperation(value = "CBD Material Info 삭제", notes = "CBD Material Info를 삭제 상태로 변경한다")
    @DeleteMapping(value = "/cbd/info/{id}")
    public CommonResult deleteCbdMaterialInfo(
            @ApiParam(value = "CBD Material Info ID", required = true) @PathVariable Long id,
            @AuthenticationPrincipal User user
    ){
        cbdService.deleteFlagUpdateCbdMaterialInfo(id, user);
        return responseService.getSuccessResult();
    }
}
