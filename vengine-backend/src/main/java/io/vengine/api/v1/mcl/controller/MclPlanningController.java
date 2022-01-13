package io.vengine.api.v1.mcl.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.enums.Status;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.material.service.MaterialService;
import io.vengine.api.v1.mcl.dto.MclMaterialInfoDto;
import io.vengine.api.v1.mcl.dto.MclMaterialInfoRequestDto;
import io.vengine.api.v1.mcl.dto.NewMclMaterialInfoRequest;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.mcl.mapper.MclMapper;
import io.vengine.api.v1.mcl.repository.MclMaterialDependencyColorRepository;
import io.vengine.api.v1.mcl.repository.MclMaterialDependencyMarketRepository;
import io.vengine.api.v1.mcl.repository.MclMaterialDependencySizeRepository;
import io.vengine.api.v1.mcl.repository.MclMaterialInfoRepository;
import io.vengine.api.v1.mcl.service.MclService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Api(tags = {"23. MCL PLANNING"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MclPlanningController {
    private final ResponseService responseService;

    @Autowired
    MclService mclService;

    @Autowired
    MaterialService materialService;

    @Autowired
    MclMaterialInfoRepository mclMaterialInfoRepository;

    @Autowired
    MclMaterialDependencyColorRepository mclMaterialDependencyColorRepository;

    @Autowired
    MclMaterialDependencySizeRepository mclMaterialDependencySizeRepository;

    @Autowired
    MclMaterialDependencyMarketRepository mclMaterialDependencyMarketRepository;

    @ApiOperation(value = "Mcl Material Info 조회", notes = "1.mclOptionId: Mcl Option ID(필수)")
    @GetMapping(value = "/mcl/material/{mclOptionId}")
    public SingleResult<MclMaterialInfoDto> findMclMaterialInfoByMclOption(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @AuthenticationPrincipal User user
    ){
        return responseService.getSingleResult(mclService.findMclMaterialInfoByMclOption(mclOptionId, user));
    }

    @ApiOperation(value = "Mcl Material Info 상세 조회", notes = "1. id: Mcl Material Info ID(필수)")
    @GetMapping(value = "/mcl/material/detail/{id}")
    public SingleResult<MclMaterialInfoDto.MaterialInfo> findMclMaterialInfoById(
            @ApiParam(value = "Mcl Material Info ID", required = true) @PathVariable @NotNull(message = "Mcl Material Info ID가 없습니다.") Long id
    ){
        MclMaterialInfo mclMaterialInfo = mclMaterialInfoRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_MATERIAL_INFO_NOT_FOUND));

        List<MclGarmentColor> colors = mclMaterialInfo.getMclMaterialDependencyColors()
                .stream()
                .map(item -> item.getMclGarmentColor()).collect(Collectors.toList());

        List<MclGarmentSize> sizes = mclMaterialInfo.getMclMaterialDependencySizes()
                .stream()
                .map(item -> item.getMclGarmentSize()).collect(Collectors.toList());

        List<MclGarmentMarket> markets = mclMaterialInfo.getMclMaterialDependencyMarkets()
                .stream()
                .map(item -> item.getMclGarmentMarket()).collect(Collectors.toList());

        return responseService.getSingleResult(MclMapper.INSTANCE.toMaterialInfoDto(mclMaterialInfo, colors, sizes, markets));
    }

    @ApiOperation(value = "Mcl Material Info 추가", notes = "1. mclOptionId: Mcl Option Id(필수)")
    @PostMapping(value = "/mcl/material/{mclOptionId}")
    public CommonResult addMclMaterialInfo(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @RequestBody List<Long> materialOfferIds,
            @AuthenticationPrincipal User user
    ){
        if(materialOfferIds.size()==0){
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

         MclOption mclOption = mclService.findMclOptionById(mclOptionId)
               .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        mclService.addMclMaterialInfo(mclOption, materialOfferIds, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Material Info 수정", notes = "1. id: Mcl Material Info ID(필수)")
    @PutMapping(value = "/mcl/material/{id}")
    public CommonResult modifyMclMaterialInfo(
            @ApiParam(value = "Mcl Material Info ID", required = true) @PathVariable @NotNull(message = "Mcl Material Info ID가 없습니다.") Long id,
            @RequestBody @Valid MclMaterialInfoRequestDto request,
            @AuthenticationPrincipal User user
    ){
        MclMaterialInfo mclMaterialInfo = mclService.findMclMaterialInfoById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_MATERIAL_INFO_NOT_FOUND));

        mclService.modifyMclMaterialInfo(mclMaterialInfo, request, user);
        return responseService.getSuccessResult();
    }

    @ApiIgnore
    @ApiOperation(value = "Mcl Material Info 수정 및 복사", notes = "1. id: Mcl Material Info ID(필수)")
    @PutMapping(value = "/mcl/material/{materialId}/copy/{times}")
    public CommonResult modifyAndCopyMclMaterialInfo(
            @ApiParam(value = "Mcl Material Info ID", required = true) @PathVariable @NotNull(message = "Mcl Material Info ID가 없습니다.") Long materialId,
            @ApiParam(value = "복사 횟수", required = true) @PathVariable @NotNull(message = "복사 횟수가 없습니다.") int times,
            @RequestBody @Valid MclMaterialInfoRequestDto request,
            @AuthenticationPrincipal User user
    ){
        MclMaterialInfo mclMaterialInfo = mclService.findMclMaterialInfoById(materialId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_MATERIAL_INFO_NOT_FOUND));

        mclService.modifyMclMaterialInfo(mclMaterialInfo, request, user);
        //복사 횟수사 0보다 크면 복사 시작
        for (int i = 0; i< times; i++){
            MclMaterialInfo copyMclMaterial = MclMapper.INSTANCE.toCopyMclMaterial(mclMaterialInfo);
            mclService.copyMclMaterialInfo(copyMclMaterial, request, user);
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Material Info 상태값 변경", notes = "1. id: Mcl Material Info ID(필수)")
    @PutMapping(value = "/mcl/material/status/{id}")
    public CommonResult modifyMclMaterialInfoStatus(
            @ApiParam(value = "Mcl Material Info ID", required = true) @PathVariable @NotNull(message = "Mcl Material Info ID가 없습니다.") Long id,
            @ApiParam(value = "상태값", required = true) @RequestParam @NotNull(message = "상태값이 없습니다.") String status,
            @AuthenticationPrincipal User user
    ){
        MclMaterialInfo mclMaterialInfo = mclService.findMclMaterialInfoById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_MATERIAL_INFO_NOT_FOUND));

        if(mclMaterialInfo.getStatus() == null){
            throw new BusinessException(ErrorCode.DATA_IS_NULL);
        }

        if(mclMaterialInfo.getStatus().equals(Status.ofStatusValue(status))){
            throw new BusinessException(ErrorCode.MCL_MATERIAL_STATUS_SAME);
        }

        if("CLOSE".equals(status)){
            if(mclMaterialInfo.getUsagePlace() == null){
                throw new BusinessException(ErrorCode.USAGE_PLACE_NULL);
            }

            if(mclMaterialInfo.getMclMaterialUom() == null){
                throw new BusinessException(String.format(ErrorCode.UOM_IS_NULL.getMessage(), "Material"), ErrorCode.UOM_IS_NULL);
            }

            if(mclMaterialInfo.getUnitPrice() == null || mclMaterialInfo.getUnitPrice() == BigDecimal.ZERO){
                throw new BusinessException(ErrorCode.UNIT_PRICE_IS_NULL);
            }

            if(mclMaterialInfo.getNetYy() == null || mclMaterialInfo.getNetYy() == BigDecimal.ZERO){
                throw new BusinessException(ErrorCode.NETYY_IS_NULL);
            }
        }
        mclMaterialInfo.setStatus(Status.ofStatusValue(status));
        mclMaterialInfo.setUser(user);

        if(mclMaterialInfo.getStatus().equals(Status.CLOSE)){
            if(mclMaterialInfo.getNetYy() == null){
                throw new BusinessException(ErrorCode.NETYY_IS_NULL);
            }
        }
        mclMaterialInfoRepository.save(mclMaterialInfo);

        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Material Info 삭제", notes = "1. id: Mcl Material Info ID(필수)")
    @DeleteMapping(value = "/mcl/material/{id}")
    public CommonResult deleteMclMaterialInfo(
            @ApiParam(value = "Mcl Material Info ID", required = true) @PathVariable @NotNull(message = "Mcl Material Info ID가 없습니다.") Long id,
            @AuthenticationPrincipal User user
    ){
        MclMaterialInfo mclMaterialInfo = mclService.findMclMaterialInfoById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_MATERIAL_INFO_NOT_FOUND));

        mclService.deleteMclMaterialInfo(mclMaterialInfo, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Material Info Copy", notes = "1. id: Mcl Material Info ID(필수)")
    @PostMapping(value = "/mcl/material/copy/{id}")
    public CommonResult copyMclMaterialInfo(
            @ApiParam(value = "Mcl Material Info ID", required = true) @PathVariable @NotNull(message = "Mcl Material Info ID가 없습니다.") Long id,
            @RequestBody @Valid MclMaterialInfoRequestDto request,
            @AuthenticationPrincipal User user
    ){
        MclMaterialInfo copyMclMaterial = MclMapper.INSTANCE.toCopyMclMaterial(mclService.findMclMaterialInfoById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_MATERIAL_INFO_NOT_FOUND)));

        mclService.copyMclMaterialInfo(copyMclMaterial, request, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "New Mcl Material Info 생성", notes = "1.mclOptionId: Mcl Option ID(필수)")
    @PostMapping(value = "/mcl/material/new/{type}/{mclOptionId}")
    public CommonResult newMclMaterialInfo(
            @ApiParam(value = "Type", required = true) @PathVariable @NotNull(message = "타입이 없습니다.") String type,
            @ApiParam(value = "Mcl Option ID", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @RequestBody @Valid NewMclMaterialInfoRequest request,
            @AuthenticationPrincipal User user
    ){
        MclOption mclOption = mclService.findMclOptionById(mclOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        if(type.equals("fabric")){
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
            if(request.getSize() == null || request.getSize() =="" || request.getSizeUomId() == null){
                throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
            }
        }

        mclService.newMclMaterialInfo(type, mclOption, request, user);
        return responseService.getSuccessResult();
    }
}
