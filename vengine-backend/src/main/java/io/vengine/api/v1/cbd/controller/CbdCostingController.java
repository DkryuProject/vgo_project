package io.vengine.api.v1.cbd.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.cbd.dto.CbdDto;
import io.vengine.api.v1.cbd.entity.CBDMaterialCosting;
import io.vengine.api.v1.cbd.mapper.CBDMapper;
import io.vengine.api.v1.cbd.service.CBDService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Api(tags = {"15. CBD COSTING"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class CbdCostingController {
    private final ResponseService responseService;

    @Autowired
    CBDService cbdService;

    @ApiOperation(value = "CBD Option ID로 Costing 조회", notes = "cbd option ID로 CBD Material Costing 을 조회한다\n" +
            "parameter\n1. optionID: cbd option id 필수\n2. costType: costing type 필수")
    @GetMapping(value = "/cbd/costing/{costType}/{optionID}")
    public ListResult<CbdDto.CbdCosting> findMaterialCostingByTypeAndCoverID(
            @ApiParam(value = "CBD Option ID", required = true) @PathVariable Long optionID,
            @ApiParam(value = "Cost Type: indirect, direct", required = true, defaultValue = "direct") @PathVariable String costType,
            @AuthenticationPrincipal User user){
        return responseService.getListResult(CBDMapper.INSTANCE.toCostingDTO(cbdService.findMaterialCostingByTypeAndCoverID(optionID, costType, user.getCompId())));
    }

    @ApiOperation(value = "CBD Material Costing ID로 조회", notes = "ID로 Material Costing를 조회한다\n" +
            "parameter\n1. id: cbd material costing id 필수\n")
    @GetMapping(value = "/cbd/costing/{id}")
    public SingleResult<CbdDto.CbdCosting> findMaterialCostingById(
            @ApiParam(value = "ID", required = true) @PathVariable Long id
    ){
        return responseService.getSingleResult(CBDMapper.INSTANCE.toCostingDTO(
                cbdService.findMaterialCostingById(id).orElseThrow(
                        ()-> new BusinessException(ErrorCode.CBD_COSTING_NOT_FOUND))));
    }

    @ApiOperation(value = "CBD Material Costing 등록 및 수정", notes = "CBD Material Costing을 등록 및 수정한다\n" +
            "cbdCostingId: 저장시 null, 수정시 cbd material costing id 필수\n")
    @PostMapping(value = "/cbd/costing")
    public SingleResult<CbdDto.CbdCosting> saveCbdMaterialCosting(
            @Valid @RequestBody CbdDto.CbdCostingRequest cbdCostingRequest,
            @AuthenticationPrincipal User user
    )
    {
        if(!"".equals(cbdCostingRequest.getValueKind()) && "".equals(cbdCostingRequest.getCostValue())){
            throw new BusinessException(ErrorCode.CBD_COSTING_INPUT_UNIT_PRICE);
        }
        CBDMaterialCosting cbdMaterialCosting = new CBDMaterialCosting();
        if(cbdCostingRequest.getCbdCostingId() != null){
            cbdMaterialCosting = cbdService.findMaterialCostingById(cbdCostingRequest.getCbdCostingId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.CBD_COSTING_NOT_FOUND));
        }
        CBDMapper.INSTANCE.toCosting(cbdCostingRequest, user, cbdMaterialCosting);
        return responseService.getSingleResult(CBDMapper.INSTANCE.toCostingDTO(cbdService.saveCbdMaterialCosting(cbdMaterialCosting)));
    }

    @ApiOperation(value = "CBD Material Costing 삭제", notes = "CBD Material Costing을 삭제한다")
    @DeleteMapping(value = "/cbd/costing")
    public CommonResult deleteCbdMatrialCosting(
            @RequestBody List<Long> ids,
            @AuthenticationPrincipal User user
    ){
        for (Long id : ids){
            cbdService.deleteFlagUpdateCbdCosting(id, user);
        }
        return responseService.getSuccessResult();
    }
}
