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
import io.vengine.api.v1.mcl.dto.MclDocumentDto;
import io.vengine.api.v1.mcl.dto.MclOptionDto;
import io.vengine.api.v1.mcl.entity.MclOption;
import io.vengine.api.v1.mcl.mapper.MclMapper;
import io.vengine.api.v1.mcl.repository.MclOptionRepository;
import io.vengine.api.v1.mcl.service.MclService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Api(tags = {"17. MCL OPTION"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MclOptionController {
    private final ResponseService responseService;

    @Autowired
    MclService mclService;

    @Autowired
    MclOptionRepository mclOptionRepository;

    @ApiOperation(value = "CBD Cover ID로 Mcl Option 조회", notes = "cbdCoverId : CBD Cover Id 필수")
    @GetMapping(value = "/mcl/option/cbd/{cbdCoverId}")
    public ListResult<MclOptionDto.Option> findMclOptionByCbdCoverId(
            @ApiParam(value = "CBD Cover Id", required = true) @PathVariable @NotNull(message = "CBD Cover ID가 없습니다.") Long cbdCoverId
    ){
        return responseService.getListResult(MclMapper.INSTANCE.toOptionDto(
                mclService.findMclOptionByCbdCoverId(CBDMapper.INSTANCE.toCover(cbdCoverId))));
    }

    @ApiOperation(value = "ID로 Mcl Option 조회", notes = "id : Mcl Option Id 필수")
    @GetMapping(value = "/mcl/option/{mclOptionID}")
    public SingleResult<MclOptionDto.Option> findMclOptionById(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionID
    ){
        return responseService.getSingleResult(MclMapper.INSTANCE.toOptionDto(
                mclService.findMclOptionById(mclOptionID).orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND))));
    }

    @ApiOperation(value = "Mcl Option 저장", notes = "1. request: name(Mcl Option명), mclCoverId(mcl Cover Id는 필수), status(OPEN, CLOSE 2개만 허용, 대문자) \n")
    @PostMapping(value = "/mcl/option")
    public SingleResult<MclOptionDto.Option> saveMclOption(
            @Valid @RequestBody MclOptionDto.MclOptionRequest request,
            @AuthenticationPrincipal User user){
        MclOption mclOption = new MclOption();
        MclMapper.INSTANCE.toOption(request, user, mclOption);
        mclOption.setStatus(Status.OPEN);
        return responseService.getSingleResult(MclMapper.INSTANCE.toOptionDto(mclService.saveMclOption(mclOption)));
    }

    @ApiOperation(value = "Mcl Option 수정", notes = "1. id: mcl option id(필수)\n" +
            "2. request: name(Mcl Option name), mclCoverId(mcl Cover Id는 필수), status(OPEN, CLOSE 2개만 허용, 대문자) \n")
    @PutMapping(value = "/mcl/option/{id}")
    public SingleResult<MclOptionDto.Option> modifyMclOption(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "MCL Option ID가 없습니다.") Long id,
            @Valid @RequestBody MclOptionDto.MclOptionRequest request,
            @AuthenticationPrincipal User user){
        MclOption mclOption = mclService.findMclOptionById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        //MCL Option 수정 여부 체크
        //mcl option close, RM PO 가 있을 경우 체크
        if(mclOption.getStatus().equals(Status.CLOSE)){
            throw new BusinessException(ErrorCode.MCL_OPTION_CAN_NOT_MODIFY);
        }

        MclMapper.INSTANCE.toOption(request, user, mclOption);
        mclOption.setStatus(Status.ofStatusValue(request.getStatus()));
        return responseService.getSingleResult(MclMapper.INSTANCE.toOptionDto(mclService.saveMclOption(mclOption)));
    }

    @ApiOperation(value = "Mcl Option 삭제", notes = "1. mclOptionID: mcl option id (필수)\n")
    @DeleteMapping(value = "/mcl/option/{mclOptionID}")
    public CommonResult deleteMclOption(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionID,
            @AuthenticationPrincipal User user
    ){
        mclService.deleteMclOption(mclOptionID, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Option 상태 변경", notes = "1. mclOptionID: mcl option id (필수)\n")
    @PutMapping(value = "/mcl/option/status/{mclOptionID}")
    public CommonResult modifyMclOptionStatus(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionID,
            @ApiParam(value = "상태값", required = true) @RequestParam @NotNull(message = "상태값이 없습니다.") String status,
            @AuthenticationPrincipal User user
    ){
        MclOption mclOption = mclService.findMclOptionById(mclOptionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        if(mclOption.getStatus().equals(Status.ofStatusValue(status))){
            throw new BusinessException(ErrorCode.MCL_OPTION_STATUS_SAME);
        }

        mclOption.setStatus(Status.ofStatusValue(status));
        mclOption.setUser(user);
        mclOptionRepository.save(mclOption);

        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "MCL Document 조회", notes = "1. mclOptionID: mcl option id (필수)\n")
    @GetMapping(value = "/mcl/document/{mclOptionID}")
    public SingleResult<MclDocumentDto> findMclDocument(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionID
    ){
        MclOption mclOption = mclService.findMclOptionById(mclOptionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        return responseService.getSingleResult(mclService.findMclDocument(mclOption));
    }
}
