package io.vengine.api.v1.supplier.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.mcl.dto.MclOrderDto;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrder;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderItem;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderPublish;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderStyle;
import io.vengine.api.v1.mcl.mapper.MclMapper;
import io.vengine.api.v1.mcl.service.SupplyOrderService;
import io.vengine.api.v1.supplier.dto.*;
import io.vengine.api.v1.supplier.entity.SupplierInvoice;
import io.vengine.api.v1.supplier.entity.SupplierPoChecking;
import io.vengine.api.v1.supplier.mapper.SupplierInvoiceMapper;
import io.vengine.api.v1.supplier.mapper.SupplierPoMapper;
import io.vengine.api.v1.supplier.service.SupplierInvoiceService;
import io.vengine.api.v1.supplier.service.SupplierPoService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Api(tags = {"25. Supplier"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1/supplier")
public class SupplierController {
    private final ResponseService responseService;

    private final SupplierInvoiceService supplierInvoiceService;

    @Autowired
    SupplierPoService supplierPoService;

    @ApiOperation(value = "supplier order 전체 조회")
    @GetMapping(value = "/order")
    public PageResult<Map<String, Object>> findSupplierOrder(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @ApiParam(value = "Search KeyWord") @RequestParam(value="", required=false) String searchKeyWord,
            @ApiParam(value = "상태") @RequestParam(value="", required=false) String status,
            @AuthenticationPrincipal User user
    ){
        CommonDto.PageDto<Map<String, Object>> orderPage = supplierPoService.findSupplierOrder(status, searchKeyWord, page,size,user.getCompId());

        return responseService.getPageResult(orderPage);
    }

    @ApiOperation(value = "supplier po confirm or revert")
    @PostMapping(value = "/order")
    public CommonResult saveSupplierPoChecking(
            @RequestBody @Valid List<SupplierPoRequest> supplierPoRequests,
            @AuthenticationPrincipal User user
    ){
        supplierPoService.saveSupplierPoChecking(supplierPoRequests, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "supplier po material item 조회")
    @GetMapping(value = "/rm-order/material/{supplierName}")
    public PageResult<SupplierPoItemResponse> findSupplierPoMaterialItem(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @ApiParam(value = "Supplier Name") @PathVariable String supplierName,
            @AuthenticationPrincipal User user
    ){
        CommonDto.PageDto<SupplierPoItemResponse> poItemResponsePage = supplierPoService.findSupplierPoMaterialItem(page, size, supplierName,  user.getCompId());
        return responseService.getPageResult(poItemResponsePage);
    }

    @ApiOperation(value = "supplier po design number 조회")
    @GetMapping(value = "/rm-order/design/{supplierName}")
    public ListResult<String> findSupplierPoDesignNumbers(
            @ApiParam(value = "Supplier Name") @PathVariable String supplierName,
            @AuthenticationPrincipal User user
    ){
        List<String> designNumbers = supplierPoService.findSupplierPoDesignNumbers(supplierName, user.getCompId());
        return responseService.getListResult(designNumbers);
    }

    @ApiOperation(value = "supplier po number 조회")
    @GetMapping(value = "/rm-order/poNumbers/{supplierName}")
    public ListResult<String> findSupplierPoNumbers(
            @ApiParam(value = "Supplier Name") @PathVariable String supplierName,
            @AuthenticationPrincipal User user
    ){
        List<String> poNumbers = supplierPoService.findSupplierPoNumbers(supplierName,  user.getCompId());
        return responseService.getListResult(poNumbers);
    }

    @ApiOperation(value = "supplier invoice 전체 조회")
    @GetMapping(value = "/invoice")
    public PageResult<SupplierInvoiceResponse> findSupplierInvoice(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @ApiParam(value = "Supplier Name") @RequestParam(value="", required=false) String supplierName,
            @AuthenticationPrincipal User user
    ){
        Page<SupplierInvoice> supplierInvoicePage = supplierInvoiceService.findSupplierInvoice(page, size, supplierName, user.getCompId());
        CommonDto.PageDto<SupplierInvoiceResponse> pageDto = CommonDto.toPageDto(supplierInvoicePage, SupplierInvoiceMapper.INSTANCE.toInvoiceResponse(supplierInvoicePage.getContent()));
        return responseService.getPageResult(pageDto);
    }

    @ApiOperation(value = "supplier invoice 저장")
    @PostMapping(value = "/invoice")
    public CommonResult saveSupplierInvoice(
            @RequestBody SupplierInvoiceRequest supplierInvoiceRequest,
            @AuthenticationPrincipal User user
    ){
        supplierInvoiceService.saveSupplierInvoice(supplierInvoiceRequest, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "supplier invoice 삭제")
    @DeleteMapping(value = "/invoice/{id}")
    public CommonResult deleteSupplierInvoice(
            @ApiParam(value = "Invoice ID") @PathVariable Long id
    ){
        supplierInvoiceService.deleteSupplierInvoice(id);
        return responseService.getSuccessResult();
    }
}
