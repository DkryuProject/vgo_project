package io.vengine.api.v1.mcl.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.mcl.dto.MclCbdAssignDto;
import io.vengine.api.v1.mcl.entity.MclOption;
import io.vengine.api.v1.mcl.service.MclService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Api(tags = {"18. MCL CBD ASSIGN"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MclCbdAssignController {
    private final ResponseService responseService;

    @Autowired
    MclService mclService;

    @ApiOperation(value = "Mcl CBD Assign 조회( by mcl option ID )", notes = "1. mclOptionId : Mcl Option ID (필수)\n")
    @GetMapping(value = "/mcl/assign/cbd/{mclOptionId}")
    public ListResult<MclCbdAssignDto> findMclCbdAssignByMclOption(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId
    ){
        return responseService.getListResult(mclService.findMclCbdAssignByMclOption(mclOptionId));
    }

    @ApiOperation(value = "Mcl CBD Assign 저장 및 수정", notes = "1. mclOptionId : Mcl Option ID (필수)\n" +
            "2. request: cbd option id(필수), fabricCheck, trimsCheck, accessoriesCheck: 선택을 하였을 경우 1, 선택하지 않을 경우 0\n")
    @PostMapping(value = "/mcl/assign/cbd/{mclOptionId}")
    public CommonResult assignMclCbdAssign(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @RequestBody @Valid List<MclCbdAssignDto.CbdAssignRequest> requests,
            @AuthenticationPrincipal User user
    ){
        MclOption mclOption =mclService.findMclOptionById(mclOptionId).orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));
        mclService.assignMclCbdAssign(mclOption, requests, user);
        return responseService.getSuccessResult();
    }
}
