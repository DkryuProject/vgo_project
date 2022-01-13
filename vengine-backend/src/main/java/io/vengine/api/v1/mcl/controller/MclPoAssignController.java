package io.vengine.api.v1.mcl.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.cbd.service.CBDService;
import io.vengine.api.v1.mcl.dto.AssignedPODto;
import io.vengine.api.v1.mcl.dto.MclAssignedPODto;
import io.vengine.api.v1.mcl.dto.MclPreBookingDto;
import io.vengine.api.v1.mcl.entity.MclPreBooking;
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
import java.util.Optional;

@Api(tags = {"21. MCL PO ASSIGN"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MclPoAssignController {
    private final ResponseService responseService;

    @Autowired
    MclService mclService;

    @Autowired
    CBDService cbdService;

    @ApiOperation(value = "Mcl Pre Booking 조회", notes = "1.mclOptionId: Mcl Option ID(필수)")
    @GetMapping(value = "/mcl/pre-bookings/{mclOptionId}")
    public ListResult<MclPreBookingDto.MclPreBooking> findMclPreBookingByMclOption(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @AuthenticationPrincipal User user
    ){
        if(!mclService.findMclOptionById(mclOptionId).isPresent()){
            throw new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND);
        }
        return responseService.getListResult(MclMapper.INSTANCE.toPreBookingDto(mclService.findMclPreBookingByMclOption(mclOptionId, user)));
    }

    @ApiOperation(value = "Mcl Pre Booking 저장", notes = "1.. mclOptionID : Mcl Option ID 필수 \n" +
            "2. shipDateFrom: 조건 시작일\n3. shipDateTo: 조건 마지막일\n" +
            "4. styleNumber: 스타일 번호\n5. companyProgramID: Company Program ID 필수\n")
    @PostMapping(value = "/mcl/pre-booking")
    public SingleResult<MclPreBookingDto.MclPreBooking> saveMclPreBooking(
            @RequestBody @Valid MclPreBookingDto.MclPreBookingRequest  request,
            @AuthenticationPrincipal User user
    ){
        if(!mclService.findMclOptionById(request.getMclOptionID()).isPresent()){
            throw new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND);
        }
        if(request.getCbdOptionId() != null && !cbdService.findOptionById(request.getCbdOptionId()).isPresent()){
            throw new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND);
        }

        MclPreBooking mclPreBooking = new MclPreBooking();
        MclMapper.INSTANCE.toPreBooking(request, user, mclPreBooking);
        return responseService.getSingleResult(MclMapper.INSTANCE.toPreBookingDto(mclService.saveMclPreBooking(mclPreBooking)));
    }

    @ApiOperation(value = "Mcl Pre Booking 수정", notes = "1. id: Mcl Pre Booking ID(필수)")
    @PutMapping(value = "/mcl/pre-booking/{id}")
    public CommonResult modifyMclPreBooking(
            @ApiParam(value = "Mcl Pre Booking ID", required = true) @PathVariable @NotNull(message = "Mcl Pre Booking ID가 없습니다.") Long id,
            @ApiParam(value = "Cbd Option ID", required = true) @RequestParam @NotNull(message = "Cbd Option ID가 없습니다.") Long cbdOptionID,
            @AuthenticationPrincipal User user
    ){
        MclPreBooking mclPreBooking = mclService.findMclPreBookingById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_PRE_BOOKING_NOT_FOUND));

        CBDOption cbdOption = cbdService.findOptionById(cbdOptionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_OPTION_NOT_FOUND) );

        mclPreBooking.setCbdOption(cbdOption);
        mclPreBooking.setUser(user);
        mclService.saveMclPreBooking(mclPreBooking);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Pre Booking 삭제", notes = "1. id: Mcl Pre Booking ID(필수)")
    @DeleteMapping(value = "/mcl/pre-booking/{id}")
    public CommonResult deleteMclPreBooking(
            @ApiParam(value = "Mcl Pre Booking ID", required = true) @PathVariable @NotNull(message = "Mcl Pre Booking ID가 없습니다.") Long id,
            @AuthenticationPrincipal User user
    ){
        if(!mclService.findMclPreBookingById(id).isPresent()){
            throw new BusinessException(ErrorCode.MCL_PRE_BOOKING_NOT_FOUND);
        }
        mclService.deleteMclPreBooking(id, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Pre Booking PO 조회", notes = "1.mclOptionId: Mcl Option ID(필수)")
    @GetMapping(value = "/mcl/assign/po/{mclOptionId}")
    public ListResult<AssignedPODto> findMclPreBookingPoByMclOption(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId
    ){
        return responseService.getListResult(mclService.findMclPreBookingPoByMclOption(mclOptionId));
    }

    @ApiOperation(value = "Mcl Pre Booking PO Assign", notes = "1. mclOptionId: mcl option ID(필수)\n")
    @PostMapping(value = "/mcl/assign/po/{id}")
    public CommonResult assignPoList(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long id,
            @RequestBody @Valid List<MclAssignedPODto.MclAssignedPORequest> request,
            @AuthenticationPrincipal User user
    ){
        mclService.saveAssignPO(id, request, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Pre Booking PO 삭제", notes = "1. id: Mcl Pre Booking PO ID(필수)\n" )
    @DeleteMapping(value = "/mcl/pre-booking-po/{id}")
    public CommonResult deleteMclPreBookingPo(
            @ApiParam(value = "Mcl Pre Booking PO Id", required = true) @PathVariable @NotNull(message = "Mcl Pre Booking PO ID가 없습니다.") Long id,
            @AuthenticationPrincipal User user
    ){
        mclService.deleteMclPreBookingPo(id, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Assigned Po Color 조회", notes = "1. id: Mcl Option ID(필수)")
    @GetMapping(value = "/mcl/assign/po/color/{id}")
    public ListResult<String> findAssignedPoItemColor(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long id
    ){
        return responseService.getListResult(mclService.findAssignedPoItemColor(id));
    }

    @ApiOperation(value = "Mcl Assigned Po Size 조회", notes = "1. id: Mcl Option ID(필수)")
    @GetMapping(value = "/mcl/assign/po/size/{id}")
    public ListResult<String> findAssignedPoItemSize(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long id
    ){
        return responseService.getListResult(mclService.findAssignedPoItemSize(id));
    }

    @ApiOperation(value = "Mcl Assigned Po Market 조회", notes = "1. id: Mcl Option ID(필수)")
    @GetMapping(value = "/mcl/assign/po/market/{id}")
    public ListResult<String> findAssignedPoMarket(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long id
    ){
        return responseService.getListResult(mclService.findAssignedPoMarket(id));
    }
}
