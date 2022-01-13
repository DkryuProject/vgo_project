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
import io.vengine.api.v1.mcl.dto.MclOrderQtyDto;
import io.vengine.api.v1.mcl.dto.MclOrderQtyOptionDto;
import io.vengine.api.v1.mcl.dto.MclOrderQtyRequestDto;
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
import java.util.Map;
import java.util.prefs.BackingStoreException;

@Api(tags = {"22. MCL PO QTY"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MclOrderQtyController {
    private final ResponseService responseService;

    @Autowired
    MclService mclService;

    @ApiOperation(value = "Mcl Order Qty 조회", notes = "1.mclOptionId: Mcl Option ID(필수)")
    @GetMapping(value = "/mcl/order/qty/{mclOptionId}")
    public SingleResult<MclOrderQtyDto> findMclOrderQtyForColorByMclOption(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId
    ){
        return responseService.getSingleResult(mclService.findMclOrderQtyByMclOption(mclOptionId));
    }

    @ApiOperation(value = "Mcl Order Qty 저장 및 수정", notes = "1.mclOptionId: Mcl Option ID(필수)\n")
    @PostMapping(value = "/mcl/order/qty/{mclOptionId}")
    public CommonResult saveMclOrderQty(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @RequestBody @Valid MclOrderQtyRequestDto request,
            @AuthenticationPrincipal User user
    ){
        if(!mclService.findMclOptionById(mclOptionId).isPresent()){
            throw new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND);
        }
        mclService.saveMclOrderQty(mclOptionId, request, user);
        return responseService.getSuccessResult();
    }
}
