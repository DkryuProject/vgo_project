package io.vengine.api.v1.mcl.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.material.dto.MaterialYarnRequest;
import io.vengine.api.v1.material.service.MaterialService;
import io.vengine.api.v1.mcl.dto.AdhocOrderDto;
import io.vengine.api.v1.mcl.dto.AdhocOrderRequestDto;
import io.vengine.api.v1.mcl.dto.NewAdhocMaterialInfoRequest;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderPublish;
import io.vengine.api.v1.mcl.mapper.AdhocOrderMapper;
import io.vengine.api.v1.mcl.repository.MclMaterialAdhocPurchaseOrderPublishRepository;
import io.vengine.api.v1.mcl.service.AdhocOrderService;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.entity.UserMailSend;
import io.vengine.api.v1.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Api(tags = {"26. MCL ADHOC PO"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MclAdhocPoController {
    private final ResponseService responseService;

    @Autowired
    AdhocOrderService adhocOrderService;

    @Autowired
    MaterialService materialService;

    @Autowired
    UserService userService;

    @Autowired
    MclMaterialAdhocPurchaseOrderPublishRepository mclMaterialAdhocPurchaseOrderPublishRepository;

    @ApiOperation(value = "Adhoc Order 저장")
    @PostMapping(value = "/adhoc/order")
    public CommonResult saveAdhocPurchaseOrder(
            @RequestBody @Valid AdhocOrderRequestDto request,
            @AuthenticationPrincipal User user
    ){
        if(request.getOrderItemInfos().size() == 0){
            throw new BusinessException(ErrorCode.NO_ITEMS);
        }

        if(request.getOrderItemInfos().size() > 1){
            throw new BusinessException(ErrorCode.ONLY_ONE_ITEM);
        }
        adhocOrderService.saveAdhocPurchaseOrder(request, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Adhoc Order 전체 조회", notes = "1. status: Published, Draft, Canceled, Revised (필수 아님)")
    @GetMapping(value = "/adhoc/order")
    public PageResult<AdhocOrderDto.AdhocOrder> findAdhocOrder(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @ApiParam(value = "Status") @RequestParam(value="", required=false) String status,
            @ApiParam(value = "Search KeyWord") @RequestParam(value="", required=false) String searchKeyWord,
            @AuthenticationPrincipal User user
    ){
        Page<MclMaterialAdhocPurchaseOrderPublish> orderPage = adhocOrderService.findAdhocOrder(searchKeyWord, status,  page,size, user.getCompId());
        CommonDto.PageDto<AdhocOrderDto.AdhocOrder> pageDto = CommonDto.toPageDto(orderPage,
                AdhocOrderMapper.INSTANCE.toAdhocOrderDto(orderPage.getContent()
                        .stream()
                        .map(item ->{
                            LocalDateTime emailSendDate = userService.findSendEmail(item.getId(), 6).getCreatedAt();
                            if(emailSendDate != null){
                                item.setEmailSendDate(
                                        emailSendDate.format(DateTimeFormatter.ofPattern(("yyyy-MM-dd HH:mm:ss")))
                                );
                            }
                            return item;
                        }).collect(Collectors.toList())
                ));
        return responseService.getPageResult(pageDto);
    }

    @ApiOperation(value = "Adhoc Order 조회(by order Id)")
    @GetMapping(value = "/adhoc/order/{orderId}")
    public SingleResult<AdhocOrderDto> findAdhocOrderById(
            @ApiParam(value = "ADHOC PO ID", required = true) @PathVariable Long orderId
    ){
        return responseService.getSingleResult(AdhocOrderMapper.INSTANCE.toAdhocOrderDetailDto(adhocOrderService.findAdhocOrderById(orderId)));
    }

    @ApiOperation(value = "Adhoc Order 취소")
    @PutMapping(value = "/adhoc/order/canceled")
    @Transactional
    public CommonResult canceledAdhocPurchaseOrder(
            @RequestBody List<Long> orderIds,
            @AuthenticationPrincipal User user
    ){
        for (Long orderId : orderIds){
            MclMaterialAdhocPurchaseOrderPublish order = adhocOrderService.findAdhocOrderById(orderId);

            order.setStatus(OrderStatus.Canceled);
            order.setUser(user);
            mclMaterialAdhocPurchaseOrderPublishRepository.save(order);
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Adhoc Order 재수정", notes = "1. id: Adhoc Purchase Order ID(필수)")
    @PostMapping(value = "/adhoc/reorder/{id}")
    public CommonResult saveRePurchaseOrder(
            @ApiParam(value = "Mcl Adhoc Purchase Order ID", required = true) @PathVariable @NotNull(message = "Mcl Adhoc Purchase Order ID가 없습니다.") Long id,
            @RequestBody @Valid AdhocOrderRequestDto request,
            @AuthenticationPrincipal User user
    ){
        MclMaterialAdhocPurchaseOrderPublish order = adhocOrderService.findAdhocOrderById(id);

        if(!order.getStatus().equals(OrderStatus.Published)
                && !order.getStatus().equals(OrderStatus.Confirm)
                && !order.getStatus().equals(OrderStatus.Revert)
        ){
            throw new BusinessException(ErrorCode.MCL_ORDER_NOT_NOT_PUBLISHED);
        }

        adhocOrderService.saveRePurchaseOrder(order, request, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Adhoc new material info 저장")
    @PostMapping(value = "/adhoc/order/material")
    public CommonResult saveAdhocMaterialInfo(
            @RequestBody @Valid NewAdhocMaterialInfoRequest request,
            @AuthenticationPrincipal User user
    ){
        try {
            materialInfoValidationCheck(request);
        } catch (Exception e) {
            throw new BusinessException(e.getMessage(), ErrorCode.INTERNAL_SERVER_ERROR);
        }

        if("fabric".equals(request.getType())){
            //Fabric Material Info Check
            if(materialService.findMaterialInfo(request.getName(), request.getSupplierId(), request.getCategoryId(),
                    request.getYarnSizeWrap(), request.getYarnSizeWeft()
                    ,request.getConstructionEpi(), request.getConstructionPpi()
            ).isPresent()){
                throw new BusinessException(ErrorCode.MATERIAL_INFO_IS_SAME.getMessage(), ErrorCode.INTERNAL_SERVER_ERROR);
            }
        }else{
            //Trim, Accessories Material Info Check
            if(materialService.findMaterialInfo(request.getName(), request.getSupplierId()
                    , request.getCategoryId(), request.getSubsidiaryDetail()
            ).isPresent()){
                throw new BusinessException(ErrorCode.MATERIAL_INFO_IS_SAME.getMessage(), ErrorCode.INTERNAL_SERVER_ERROR);
            }
        }

        materialService.saveNewMaterialInfo(request, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Adhoc Order email 발송")
    @PostMapping(value = "/adhoc/order/email/{id}")
    public CommonResult sendOrderEmail(
            @ApiParam(value = "PUBLISH PO ID", required = true) @PathVariable @NotNull Long id,
            @RequestBody List<String> emails
    ){
        MclMaterialAdhocPurchaseOrderPublish order = adhocOrderService.findAdhocOrderById(id);

        for(String email: emails){
            userService.saveUserMailSend(
                    UserMailSend.builder()
                            .email(email)
                            .sendType(6)
                            .typeIdx(order.getId())
                            .status(0)
                            .build()
            );
        }
        return responseService.getSuccessResult();
    }

    private void materialInfoValidationCheck(NewAdhocMaterialInfoRequest materialInfoRequest) throws Exception {
        if("fabric".equals(materialInfoRequest.getType())){
            if(materialInfoRequest.getMaterialYarnRequestList().size() ==0){
                throw new Exception(ErrorCode.MATERIAL_YARN_NOT_FOUND.getMessage());
            }else{
                double sum = 0;
                for (MaterialYarnRequest materialYarnRequest: materialInfoRequest.getMaterialYarnRequestList()){
                    sum += materialYarnRequest.getRate().doubleValue();
                }
                if(sum > 100){
                    throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
                }
            }
            if(materialInfoRequest.getYarnSizeWrap() == null || materialInfoRequest.getYarnSizeWrap() == ""){
                throw new Exception("Yarn size warp is null");
            }
            if(materialInfoRequest.getYarnSizeWeft() == null || materialInfoRequest.getYarnSizeWeft() == ""){
                throw new Exception("Yarn size welt is null");
            }

        }else{
            if(materialInfoRequest.getSubsidiaryDetail() == null || materialInfoRequest.getSubsidiaryDetail() == ""){
                throw new Exception("Item Detail: "+ErrorCode.DATA_NOT_FOUND.getMessage());
            }
        }
    }
}
