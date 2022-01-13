package io.vengine.api.v1.mcl.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.enums.Status;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.cbd.mapper.CBDMapper;
import io.vengine.api.v1.mcl.dto.*;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.mcl.mapper.MclMapper;
import io.vengine.api.v1.mcl.service.MclService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Api(tags = {"19. MCL FACTORY ALLOCATION"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MclFactoryAllocationController {
    private final ResponseService responseService;

    @Autowired
    MclService mclService;

    @ApiOperation(value = "Mcl Factory Allocation 조회 (By mcl option ID)", notes = "1. mclOptionId: Mcl Option Id (필수)\n")
    @GetMapping(value = "/mcl/factory_allocation/{mclOptionId}")
    public ListResult<MclFactoryAllocDto.FactoryAlloc> findMclFactoryAllocationByMclOption(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @AuthenticationPrincipal User user
    ){
        Map<String, Object>searchFilter = new HashMap<>();
        searchFilter.put("mclOptionID", mclOptionId);
        return responseService.getListResult(MclMapper.INSTANCE.toFactoryAllocDto(mclService.findMclFactoryAllocationByMclOption(searchFilter, user)));
    }

    @ApiOperation(value = "Mcl Factory Allocation 저장 및 수정", notes = "1. id: mcl factory allocation id(저장시 null)\n" +
            "2. mclOptionID : Mcl Option ID 필수 \n3. commonMaterialProductID: 생산 공정 필수\n" +
            "4. factoryID: 공장 필수\n5. unitPrice: 단가\n6. poTotalQty: 수량\n7. pcdDate: 작업 시작일\n")
    @PostMapping(value = "/mcl/factory_allocation")
    public SingleResult<MclFactoryAllocDto.FactoryAlloc> saveMclFactoryAllocation(
            @RequestBody @Valid MclFactoryAllocDto.FactoryAllocRequest  request,
            @AuthenticationPrincipal User user
    ){
        MclFactoryAlloc mclFactoryAlloc = new MclFactoryAlloc();
        if(request.getId() != null){
            mclFactoryAlloc = mclService.findMclFactoryAllocationById(request.getId());
        }
        MclMapper.INSTANCE.toFactoryAlloc(request, user, mclFactoryAlloc);
        return responseService.getSingleResult(MclMapper.INSTANCE.toFactoryAllocDto(mclService.saveMclFactoryAllocation(mclFactoryAlloc)));
    }

    @ApiOperation(value = "Mcl Factory Allocation 삭제", notes = "1. id: Mcl Factory Allocation Id (필수)\n")
    @DeleteMapping(value = "/mcl/factory_allocation/{id}")
    public CommonResult deleteMclFactoryAllocation(
            @ApiParam(value = "Mcl Factory Allocation Id", required = true) @PathVariable @NotNull(message = "Mcl Factory Allocation ID가 없습니다.") Long id,
            @AuthenticationPrincipal User user
    ){
        mclService.deleteMclFactoryAllocation(id, user);
        return responseService.getSuccessResult();
    }
}
