package io.vengine.api.v1.buyer.controller;

import com.amazonaws.AmazonServiceException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.dto.ExcelResponse;
import io.vengine.api.common.utils.S3Uploader;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.buyer.dto.*;
import io.vengine.api.v1.buyer.entity.BuyerOrderInfo;
import io.vengine.api.v1.buyer.mapper.BuyerOrderMapper;
import io.vengine.api.v1.buyer.service.BuyerOrderService;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.cbd.service.CBDService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Api(tags = {"16. Buyer Order"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class BuyerOrderController {
    @Autowired
    ResponseService responseService;

    @Autowired
    BuyerOrderService buyerOrderService;

    @Autowired
    CBDService cbdService;

    @Autowired
    S3Uploader s3Uploader;

    @ApiOperation(value = "Buyer Order 조회")
    @GetMapping(value = "/buyer/orders")
    public PageResult<BuyerOrderDto> findPurchaseOrder(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @ApiParam(value = "Search KeyWord") @RequestParam(value="", required=false) String searchKeyWord,
            @AuthenticationPrincipal User user
    ){
        Page<BuyerOrderInfo> buyerOrderInfoPage = buyerOrderService.findAllBuyerOrder(searchKeyWord, page,size, user.getCompId());
        CommonDto.PageDto<BuyerOrderDto> pageDto = CommonDto.toPageDto(buyerOrderInfoPage, BuyerOrderMapper.INSTANCE.toBuyerOrderDTO(buyerOrderInfoPage.getContent()));
        return responseService.getPageResult(pageDto);
    }

    @ApiOperation(value = "Mcl Pre booking 에 대한 Buyer Order 조회", notes = "1. mclOptionId: mcl option ID 필수\n")
    @GetMapping(value = "/buyer/orders/{mclOptionId}")
    public ListResult<MappedOrderDto> findMappedPO(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(buyerOrderService.findMappedPO(mclOptionId, user));
    }

    @ApiOperation(value = "Garment PO 조회 (Style Number)", notes = "1. styleNumber: style number 필수\n")
    @GetMapping(value = "/garment/po/style/{styleNumber}")
    public SingleResult<GarmentPoDto> findGarmentPoByStyle(
            @ApiParam(value = "Style Number", required = true) @PathVariable @NotNull(message = "Style number 가 없습니다.") @NotEmpty(message = "Style number 가 없습니다.") String styleNumber,
            @AuthenticationPrincipal User user
    ){
        return responseService.getSingleResult(buyerOrderService.findGarmentPoByStyle(styleNumber, user));
    }

    @ApiOperation(value = "Garment PO 조회 (Design Number)", notes = "1. cbdCoverID: cbd cover ID 필수\n")
    @GetMapping(value = "/garment/po/design/{cbdCoverID}")
    private SingleResult<GarmentPoDto> findGarmentPoByDesign(
            @ApiParam(value = "CBD COver ID", required = true) @PathVariable @NotNull(message = "CBD Cover ID 가 없습니다..") Long cbdCoverID,
            @AuthenticationPrincipal User user
    ) {
        CBDCover cover = cbdService.findCoverById(cbdCoverID)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_COVER_NOT_FOUND));
        return responseService.getSingleResult(buyerOrderService.findGarmentPoByDesign(cover, user));
    }

    @ApiOperation(value = "Buyer APi Info 조회")
    @GetMapping(value = "/api/info")
    public ListResult<BuyerApiInfoResponse> findBuyerApiInfo(){
        return responseService.getListResult(buyerOrderService.findBuyerApiInfo());
    }

    @ApiOperation(value = "Buyer APi Info 저장")
    @PostMapping(value = "/api/info")
    public CommonResult saveBuyerApiInfo(
            @RequestBody BuyerApiInfoRequest buyerApiInfoRequest
    ){
        buyerOrderService.saveBuyerApiInfo(buyerApiInfoRequest);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Buyer Order Excel Upload")
    @PostMapping(value = "/order/excel/upload")
    public SingleResult<ExcelResponse> buyerOrderReadExcel(
            @ApiParam(value = "첨부파일", required = true) @RequestParam MultipartFile file
    ){
        return responseService.getSingleResult(buyerOrderService.buyerOrderReadExcel(file));
    }

    @ApiOperation(value = "Buyer Order Excel Data 저장")
    @PostMapping(value = "/order/excel")
    public CommonResult saveBuyerOrderExcel(
            @ApiParam(value = "Buyer Name", required = true) @RequestParam String buyer,
            @ApiParam(value = "Brand Name", required = true) @RequestParam String brand,
            @ApiParam(value = "Program Type", required = true) @RequestParam String programType,
            @ApiParam(value = "S3 Upload File Name", required = true) @RequestParam String fileName,
            @AuthenticationPrincipal User user
    ){
        buyerOrderService.saveBuyerOrderExcel(buyer, brand, programType, fileName, user);
        s3Uploader.deleteExcelData(fileName);
        return responseService.getSuccessResult();
    }
}
