package io.vengine.api.v1.cbd.controller;

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
import io.vengine.api.v1.cbd.dto.CbdDocumentDto;
import io.vengine.api.v1.cbd.dto.CbdDto;
import io.vengine.api.v1.cbd.dto.CbdOptionSimulationDto;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.cbd.mapper.CBDMapper;
import io.vengine.api.v1.cbd.repository.CBDOptionRepository;
import io.vengine.api.v1.cbd.service.CBDService;
import io.vengine.api.v1.commonInfo.enums.CostingType;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Api(tags = {"13. CBD OPTION"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class CbdOptionController {
    private final ResponseService responseService;

    @Autowired
    CBDService cbdService;

    @Autowired
    CBDOptionRepository cbdOptionRepository;

    @ApiOperation(value = "CBD Option ID로 조회", notes = "CBD Option ID로 CBD Option을 조회한다\n" +
            "parameter\n1. id: cbd option id 필수\n")
    @GetMapping(value = "/cbd/option/{id}")
    public SingleResult<CbdDto.Option> findCbdOptionById(
            @ApiParam(value = "CBD Option ID", required = true) @PathVariable Long id
    ){
        return responseService.getSingleResult(CBDMapper.INSTANCE.toOptionDTO(cbdService.findOptionById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND))));
    }

    @ApiOperation(value = "CBD Cover ID로 조회", notes = "CBD Cover ID로 CBD Option을 조회한다\n" +
            "parameter\1. coverID: cbd cover id 필수")
    @GetMapping(value = "/cbd/option/cover/{coverID}")
    public ListResult<CbdDto.Option> findOptionByCoverId(
            @ApiParam(value = "CBD Cover ID", required = true) @PathVariable Long coverID
    ){
        CBDCover cbdCover = cbdService.findCoverById(coverID)
                .orElseThrow(()-> new  BusinessException(ErrorCode.CBD_COVER_NOT_FOUND));

        return responseService.getListResult(CBDMapper.INSTANCE.toOptionDTO(cbdCover.getCbdOptions()));
    }

    @ApiOperation(value = "CBD Option 등록 및 수정", notes = "CBD Option을 등록 및 수정을한다\n" +
            "1. 등록시 optionId값은 null, 수정시 optionId값은 필수\n")
    @PostMapping(value = "/cbd/option")
    public SingleResult<CbdDto.Option> saveCbdOption(
            @Valid @RequestBody CbdDto.OptionRequest optionRequest,
            @AuthenticationPrincipal User user
    )
    {
        CBDOption cbdOption = new CBDOption();
        if(optionRequest.getOptionId() != null){
            cbdOption = cbdService.findOptionById(optionRequest.getOptionId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND));
            cbdOption.setStatus(optionRequest.getStatus().equals(Status.OPEN.getKey()) ? Status.OPEN : Status.CLOSE);
/*
            if(cbdOption.getCbdMaterialCostings().size()>0
                    || cbdOption.getCbdMaterialInfos().size()>0
                    || cbdOption.getMclCbdAssigns().size()>0
            ){
                throw new BusinessException(ErrorCode.CBD_OPTION_CAN_NOT_MODIFY);
            }
 */
        }else{
            if(cbdService.findOptionByCbdCoverAndName(optionRequest.getCbdCoverId(), optionRequest.getName()).isPresent()){
                throw new BusinessException(ErrorCode.CBD_OPTION_NAME_DUPLICATION);
            }
            cbdOption.setStatus(Status.OPEN);
        }
        CBDMapper.INSTANCE.toOption(optionRequest, user, cbdOption);
        return responseService.getSingleResult(CBDMapper.INSTANCE.toOptionDTO(cbdService.saveCbdOption(cbdOption, user)));
    }

    @ApiOperation(value = "CBD Option 삭제", notes = "CBD Option을 삭제한다")
    @DeleteMapping(value = "/cbd/option/{id}")
    public CommonResult deleteCbdOption(
            @ApiParam(value = "CBD Option ID", required = true) @PathVariable Long id,
            @AuthenticationPrincipal User user
    ){
        cbdService.deleteFlagUpdateCbdOption(id, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "CBD Option Status 변경", notes = "CBD Option 상태값을 변경한다")
    @PutMapping(value = "/cbd/option/status/{id}")
    public CommonResult modifyCbdOptionStatus(
            @ApiParam(value = "CBD Option ID", required = true) @PathVariable Long id,
            @ApiParam(value = "상태", required = true) @RequestParam String status,
            @AuthenticationPrincipal User user
    ){
        CBDOption cbdOption = cbdService.findOptionById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND));

        if("CLOSE".equals(status)){
            for (CBDMaterialInfo  cbdMaterialInfo: cbdOption.getCbdMaterialInfos()){
                if(cbdMaterialInfo.getUsagePlace() == null){
                    throw new BusinessException("CBD Material Usage Place is null", ErrorCode.INTERNAL_SERVER_ERROR);
                }

                if(cbdMaterialInfo.getCbdMaterialUom() == null){
                    throw new BusinessException("CBD Material Uom is null", ErrorCode.INTERNAL_SERVER_ERROR);
                }

                if(cbdMaterialInfo.getUnitPrice() == null || cbdMaterialInfo.getUnitPrice() == BigDecimal.ZERO){
                    throw new BusinessException("CBD Material Unit Price is null", ErrorCode.INTERNAL_SERVER_ERROR);
                }

                if(cbdMaterialInfo.getNetYy() == null || cbdMaterialInfo.getNetYy() == BigDecimal.ZERO){
                    throw new BusinessException("CBD Material NetYy is null", ErrorCode.INTERNAL_SERVER_ERROR);
                }
            }
        }

        cbdOption.setStatus(Status.ofStatusValue(status));
        cbdOption.setUser(user);
        cbdOptionRepository.save(cbdOption);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "CBD Document 조회", notes = "1. id: cbd option id 필수\n")
    @GetMapping(value = "/cbd/document/{cbdOptionId}")
    public SingleResult<CbdDocumentDto> findCbdDocument(
            @ApiParam(value = "CBD Option ID", required = true) @PathVariable Long cbdOptionId
    ){
        CbdDocumentDto cbdDocumentDto = new CbdDocumentDto();
        CBDOption cbdOption = cbdService.findOptionById(cbdOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND));

        cbdDocumentDto.setCbdHeader(cbdService.findCbdDocumentHeader(cbdOption));
        cbdDocumentDto.setCbdDetails(cbdService.findCbdDocumentDetails(cbdOption));
        return responseService.getSingleResult(cbdDocumentDto);
    }

    @ApiOperation(value = "CBD Option Simulation 조회", notes = "1. id: cbd option id 필수\n")
    @GetMapping(value = "/cbd/option/simulation/{cbdOptionId}")
    public ListResult<CbdOptionSimulationDto> findCbdOptionSimulation(
            @ApiParam(value = "CBD Option ID", required = true) @PathVariable Long cbdOptionId,
            @ApiParam(value = "Target Profit", required = true) @RequestParam double targetProfit
    ){
        CBDOption cbdOption = cbdService.findOptionById(cbdOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND));

        return responseService.getListResult(cbdService.findCbdOptionSimulation(cbdOption, targetProfit));
    }

    @ApiOperation(value = "CBD Option Copy", notes = "1. id: cbd option id 필수\n")
    @PostMapping(value = "/cbd/option/copy/{cbdOptionId}")
    public CommonResult copyCbdOption(
            @ApiParam(value = "복사할 CBD Option ID", required = true) @PathVariable Long cbdOptionId,
            @ApiParam(value = "복사할 위치의 CBD Cover ID", required = true) @RequestParam Long cbdCoverId,
            @ApiParam(value = "CBD Option Name", required = true) @RequestParam String cbdOptionName,
            @ApiParam(value = "Target Profit", required = true) @RequestParam double targetProfit,
            @AuthenticationPrincipal User user
    ){
        CBDCover cbdCover = cbdService.findCoverById(cbdCoverId)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_COVER_NOT_FOUND));

        CBDOption cbdOption = cbdService.findOptionById(cbdOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND));

        //cbd option copy시 name 중복 체크
        if(cbdOption.getName().equals(cbdOptionName)){
            throw new BusinessException(ErrorCode.CBD_OPTION_NAME_DUPLICATION);
        }

        cbdService.copyCbdOption(cbdOption, cbdCover, cbdOptionName, targetProfit, user);
        return responseService.getSuccessResult();
    }


}
