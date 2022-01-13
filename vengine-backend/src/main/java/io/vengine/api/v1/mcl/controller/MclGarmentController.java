package io.vengine.api.v1.mcl.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.mcl.dto.AvailableSettingDto;
import io.vengine.api.v1.mcl.dto.MclCommonDto;
import io.vengine.api.v1.mcl.entity.MclOption;
import io.vengine.api.v1.mcl.mapper.MclMapper;
import io.vengine.api.v1.mcl.service.MclService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Api(tags = {"20. MCL GARMENT"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MclGarmentController {
    private final ResponseService responseService;

    @Autowired
    MclService mclService;

    @ApiOperation(value = "Mcl Garment Color 저장 및 수정", notes = "1. mclOptionId : Mcl Option ID (필수)\n" +
            "2. colorRequests: id는 저장시 null\n")
    @PostMapping(value = "/mcl/color/{mclOptionId}")
    public CommonResult saveMclGarmentColor(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @RequestBody @Valid List<MclCommonDto.ColorRequest> colorRequests,
            @AuthenticationPrincipal User user
    ){
        mclService.saveMclGarmentColor(mclOptionId, colorRequests, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Garment Color 삭제")
    @DeleteMapping(value = "/mcl/color")
    public CommonResult deleteMclGarmentColor(
            @RequestBody @Valid List<Long> mclGarmentColorIds,
            @AuthenticationPrincipal User user
    ){
        mclService.deleteMclGarmentColor(mclGarmentColorIds, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Garment Color 조회(By Mcl Option ID)", notes = "1. mclOptionID : Mcl Option ID (필수)\n")
    @GetMapping(value = "/mcl/color/{mclOptionID}")
    public ListResult<MclCommonDto> findMclGarmentColorByMclOptionID(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionID
    ){
        return responseService.getListResult(mclService.findMclGarmentColorByMclOptionID(mclOptionID));
    }

    @ApiOperation(value = "Mcl Garment Size 저장 및 수정", notes = "1. mclOptionId : Mcl Option ID (필수)\n2. sizeID: Garment Size ID (필수)\n")
    @PostMapping(value = "/mcl/size/{mclOptionId}")
    public CommonResult saveMclGarmentSize(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @RequestBody List<MclCommonDto.SizeRequest> sizeRequests,
            @AuthenticationPrincipal User user
    ){
        mclService.saveMclGarmentSize(mclOptionId, sizeRequests, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Garment Size 삭제")
    @DeleteMapping(value = "/mcl/size")
    public CommonResult deleteMclGarmentSize(
            @RequestBody List<Long> mclGarmentSizeIds,
            @AuthenticationPrincipal User user
    ){
        mclService.deleteMclGarmentSize(mclGarmentSizeIds, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Garment Size 조회(By Mcl Option ID)", notes = "1. mclOptionID : Mcl Option ID (필수)\n")
    @GetMapping(value = "/mcl/size/{mclOptionID}")
    public ListResult<MclCommonDto> findMclGarmentSizeByMclOptionID(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionID
    ){
        return responseService.getListResult(mclService.findMclGarmentSizeByMclOptionID(mclOptionID));
    }

    @ApiOperation(value = "Mcl Garment Market 저장 및 수정", notes = "1. mclOptionId : Mcl Option ID (필수)\n2. marketID: Company Garment Market ID (필수)\n")
    @PostMapping(value = "/mcl/market/{mclOptionId}")
    public CommonResult saveMclGarmentMarket(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @RequestBody List<MclCommonDto.MarketRequest> marketRequests,
            @AuthenticationPrincipal User user
    ){
        mclService.saveMclGarmentMarket(mclOptionId, marketRequests, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Garment Market 삭제", notes = "1. marketID: Mcl Garment Market ID (필수)\n")
    @DeleteMapping(value = "/mcl/market")
    public CommonResult deleteMclGarmentMarket(
            @RequestBody List<Long> marketIds,
            @AuthenticationPrincipal User user
    ){
        mclService.deleteMclGarmentMarket(marketIds, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Garment Market 조회(By Mcl Option ID)", notes = "1. mclOptionID : Mcl Option ID (필수)\n")
    @GetMapping(value = "/mcl/market/{mclOptionID}")
    public ListResult<MclCommonDto> findMclGarmentMarketByMclOptionID(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionID
    ){
        return responseService.getListResult(mclService.findMclGarmentMarketByMclOptionID(mclOptionID));
    }

    @ApiOperation(value = "Available Setting Item 조회(By Mcl Option ID)", notes = "1. mclOptionID : Mcl Option ID (필수)\n")
    @GetMapping(value = "/mcl/available/{mclOptionID}")
    public SingleResult<AvailableSettingDto> findAvailableSettingItems(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionID
    ){
        MclOption mclOption = mclService.findMclOptionById(mclOptionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        return responseService.getSingleResult(mclService.findAvailableSettingItems(mclOption));
    }
}
