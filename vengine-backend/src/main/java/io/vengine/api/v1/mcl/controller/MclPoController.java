package io.vengine.api.v1.mcl.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.material.service.MaterialService;
import io.vengine.api.v1.mcl.dto.*;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.mcl.mapper.MclMapper;
import io.vengine.api.v1.mcl.repository.MclMaterialPurchaseOrderDependencyItemRepository;
import io.vengine.api.v1.mcl.repository.MclMaterialPurchaseOrderItemRepository;
import io.vengine.api.v1.mcl.repository.MclMaterialPurchaseOrderStyleRepository;
import io.vengine.api.v1.mcl.service.MclService;
import io.vengine.api.v1.mcl.service.SupplyOrderService;
import io.vengine.api.v1.supplier.service.SupplierPoService;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.entity.UserMailSend;
import io.vengine.api.v1.user.service.CompanyService;
import io.vengine.api.v1.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Api(tags = {"24. MCL PO"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MclPoController {
    private final ResponseService responseService;

    @Autowired
    MclService mclService;

    @Autowired
    SupplyOrderService supplyOrderService;

    @Autowired
    SupplierPoService supplierPoService;

    @Autowired
    CompanyService companyService;

    @Autowired
    UserService userService;

    @Autowired
    MaterialService materialService;

    @Autowired
    MclMaterialPurchaseOrderItemRepository mclMaterialPurchaseOrderItemRepository;

    @Autowired
    MclMaterialPurchaseOrderDependencyItemRepository mclMaterialPurchaseOrderDependencyItemRepository;

    @Autowired
    MclMaterialPurchaseOrderStyleRepository mclMaterialPurchaseOrderStyleRepository;

    @ApiOperation(value = "Mcl Order 저장", notes = "1.mclOptionId: Mcl Option ID(필수)")
    @PostMapping(value = "/mcl/order/{mclOptionId}")
    public SingleResult<Long> saveMclPurchaseOrder(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @RequestBody @Valid MclOrderRequestDto request,
            @AuthenticationPrincipal User user
    ){
        MclOption mclOption = mclService.findMclOptionById(mclOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        return responseService.getSingleResult(supplyOrderService.saveMclPurchaseOrder(mclOption, request, user));
    }

    @ApiOperation(value = "Mcl Order 수정", notes = "1. id: Mcl Purchase Order ID(필수)")
    @PutMapping(value = "/mcl/order/{id}")
    public CommonResult modifyMclPurchaseOrder(
            @ApiParam(value = "Mcl Purchase Order ID", required = true) @PathVariable @NotNull(message = "Mcl Purchase Order ID가 없습니다.") Long id,
            @RequestBody @Valid MclOrderRequestDto request,
            @AuthenticationPrincipal User user
    ){
        MclMaterialPurchaseOrder order = supplyOrderService.findOrder(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        if(!order.getStatus().equals(OrderStatus.Draft)){
            throw new BusinessException(ErrorCode.MCL_PUBLISHED_ORDER_NOT_MODIFY);
        }
        supplyOrderService.modifyMclPurchaseOrder(order, request, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Order 재수정", notes = "1. id: Mcl Purchase Order ID(필수)")
    @PostMapping(value = "/mcl/reorder/{id}")
    public SingleResult<Long> saveRePurchaseOrder(
            @ApiParam(value = "Mcl Purchase Order ID", required = true) @PathVariable @NotNull(message = "Mcl Purchase Order ID가 없습니다.") Long id,
            @RequestBody @Valid MclOrderRequestDto request,
            @AuthenticationPrincipal User user
    ){
        MclMaterialPurchaseOrder order = supplyOrderService.findOrder(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        if(!order.getStatus().equals(OrderStatus.Published)
                && !order.getStatus().equals(OrderStatus.Confirm)
                && !order.getStatus().equals(OrderStatus.Revert)
        ){
            throw new BusinessException(ErrorCode.MCL_ORDER_NOT_NOT_PUBLISHED);
        }

        return responseService.getSingleResult(supplyOrderService.saveRePurchaseOrder(order, request, user));
    }

    @ApiOperation(value = "Mcl Order 삭제", notes = "1. id: Mcl Purchase Order ID(필수)")
    @DeleteMapping(value = "/mcl/order/{id}")
    @Transactional
    public CommonResult deleteMclPurchaseOrder(
            @ApiParam(value = "Mcl Purchase Order ID", required = true) @PathVariable @NotNull(message = "Mcl Purchase Order ID가 없습니다.") Long id,
            @AuthenticationPrincipal User user
    ){
        MclMaterialPurchaseOrder order = supplyOrderService.findOrder(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        if(!order.getStatus().equals(OrderStatus.Draft)){
            throw new BusinessException(ErrorCode.MCL_ORDER_ONLY_DRAFT_DELETE);
        }

        order.setDelFlag("D");
        order.setUser(user);
        supplyOrderService.saveMclPurchaseOrder(order);

        List<MclMaterialPurchaseOrderItem> items = mclMaterialPurchaseOrderItemRepository.findByMclMaterialPurchaseOrder(order);

        for (MclMaterialPurchaseOrderItem item: items){
            item.setDelFlag("D");
            item.setUser(user);
            mclMaterialPurchaseOrderItemRepository.save(item);

            List<MclMaterialPurchaseOrderDependencyItem> dependencyItems = mclMaterialPurchaseOrderDependencyItemRepository.findByMclMaterialPurchaseOrderItem(item);

            for (MclMaterialPurchaseOrderDependencyItem dependencyItem: dependencyItems){
                dependencyItem.setDelFlag("D");
                mclMaterialPurchaseOrderDependencyItemRepository.save(dependencyItem);
            }
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Order 조회", notes = "1.id: Mcl Purchase Order ID(필수)")
    @GetMapping(value = "/mcl/order/detail/{id}")
    public SingleResult<MclOrderDto.Order> findMclPurchaseOrder(
            @ApiParam(value = "Mcl Purchase Order ID", required = true) @PathVariable @NotNull(message = "Mcl Purchase Order ID가 없습니다.") Long id
    ){
        MclMaterialPurchaseOrder order = supplyOrderService.findOrder(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        return responseService.getSingleResult(MclMapper.INSTANCE.toOrderDetailDto(order));
    }

    @ApiOperation(value = "Mcl Order Item 대상 조회", notes = "1.id: Mcl Purchase Order ID(필수)")
    @GetMapping(value = "/mcl/order/item/{id}")
    public ListResult<MclOrderItemDto.OrderItem> findMclMaterialInfoForOrder(
            @ApiParam(value = "Mcl Purchase Order ID", required = true) @PathVariable @NotNull(message = "Mcl Purchase Order ID가 없습니다.") Long id
    ){
        MclMaterialPurchaseOrder order = supplyOrderService.findOrder(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        List<MclOrderItemDto.OrderItem> listResult = mclService.findMclMaterialInfoByOrderItem(order);
        return responseService.getListResult(listResult);
    }

    @ApiOperation(value = "Mcl Order Item 저장", notes = "1.id: Mcl Purchase Order ID(필수)")
    @PostMapping(value = "/mcl/order/item/{id}")
    public CommonResult saveMclPurchaseOrderItem(
            @ApiParam(value = "Mcl Purchase Order ID", required = true) @PathVariable @NotNull(message = "Mcl Purchase Order ID가 없습니다.") Long id,
            @RequestBody @Valid List<MclOrderItemRequestDto.ItemMatchingRequest> requests,
            @AuthenticationPrincipal User user
    ){
        MclMaterialPurchaseOrder order = supplyOrderService.findOrder(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        supplyOrderService.saveMclPurchaseOrderItem(order, requests, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Order Item 수정", notes = "1.id: Mcl Purchase Order ID(필수)\n" +
            "2.PurchaseOrderOptionRequest.name : Upcharge, Discount on Sale 만 허용\n" +
            "3.PurchaseOrderOptionRequest.type : Num, Percentage 만 허용\n" +
            "4.PurchaseOrderOptionRequest.value : Num(소수점 2자리), Percentage(정수)\n")
    @PutMapping(value = "/mcl/order/item/{id}")
    public CommonResult modifyMclPurchaseOrderItem(
            @ApiParam(value = "Mcl Purchase Order ID", required = true) @PathVariable @NotNull(message = "Mcl Purchase Order ID가 없습니다.") Long id,
            @RequestBody @Valid MclOrderItemRequestDto request,
            @AuthenticationPrincipal User user
    ){
        MclMaterialPurchaseOrder order = supplyOrderService.findOrder(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        supplyOrderService.modifyMclPurchaseOrderItem(order, request, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Order Item 재수정", notes = "1. id: Mcl Purchase Order ID(필수)")
    @PostMapping(value = "/mcl/reorder/item/{newOrderId}/{oldOrderId}")
    public CommonResult saveRePurchaseOrderItem(
            @ApiParam(value = "신규 Mcl Purchase Order ID", required = true) @PathVariable @NotNull(message = "신규 Mcl Purchase Order ID가 없습니다.") Long newOrderId,
            @ApiParam(value = "이전 Mcl Purchase Order ID", required = true) @PathVariable @NotNull(message = "이전 Mcl Purchase Order ID가 없습니다.") Long oldOrderId,
            @RequestBody @Valid List<MclOrderItemRequestDto.ItemMatchingRequest> requests,
            @AuthenticationPrincipal User user
    ){
        MclMaterialPurchaseOrder newOrder = supplyOrderService.findOrder(newOrderId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        MclMaterialPurchaseOrder oldOrder = supplyOrderService.findOrder(oldOrderId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        if(!newOrder.getStatus().equals(OrderStatus.Draft) && !oldOrder.getStatus().equals(OrderStatus.Revised)){
            throw new BusinessException(ErrorCode.MCL_ORDER_STATUS_ERROR);
        }
        supplyOrderService.saveRePurchaseOrderItem(newOrder, oldOrder, requests, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Order Item 삭제", notes = "1.ids: Mcl Purchase Order Item List (필수)")
    @DeleteMapping(value = "/mcl/order/item")
    @Transactional
    public CommonResult deleteMclPurchaseOrderItem(
            @RequestBody List<Long> ids,
            @AuthenticationPrincipal User user
    ){
        for(Long id: ids){
            MclMaterialPurchaseOrderItem orderItem = mclMaterialPurchaseOrderItemRepository.findById(id)
                    .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_ITEM_NOT_FOUND));

            orderItem.setDelFlag("D");
            orderItem.setUser(user);
            mclMaterialPurchaseOrderItemRepository.save(orderItem);

            for (MclMaterialPurchaseOrderDependencyItem dependencyItem: orderItem.getMclMaterialPurchaseOrderDependencyItems()){
                dependencyItem.setDelFlag("D");
                mclMaterialPurchaseOrderDependencyItemRepository.save(dependencyItem);
            }
        }

        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Order Item 조회", notes = "1.id: Mcl Purchase Order ID(필수)")
    @GetMapping(value = "/mcl/order/item/detail/{id}")
    public SingleResult<MclOrderItemDto> findMclPurchaseOrderItem(
            @ApiParam(value = "Mcl Purchase Order ID", required = true) @PathVariable @NotNull(message = "Mcl Purchase Order ID가 없습니다.") Long id
    ){
        MclMaterialPurchaseOrder order = supplyOrderService.findOrder(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        return responseService.getSingleResult(supplyOrderService.findOrderItem(order));
    }

    @ApiOperation(value = "Mcl Order 전체 조회", notes = "1.mclOptionId: Mcl Option ID(필수)\n" +
            "2. status: Published, Draft, Canceled, Revised (필수 아님)")
    @GetMapping(value = "/mcl/order/{mclOptionId}")
    public PageResult<MclOrderDto> findMclPurchaseOrderByMclOption(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionId,
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @ApiParam(value = "Status") @RequestParam(value="", required=false) String status,
            @ApiParam(value = "Search KeyWord") @RequestParam(value="", required=false) String searchKeyWord,
            @AuthenticationPrincipal User user
    ){
        MclOption mclOption = mclService.findMclOptionById(mclOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        Page<MclMaterialPurchaseOrder> orderPage = supplyOrderService.findAllOrder(mclOption, searchKeyWord, status,  page,size, user.getCompId(),"vendor");
        CommonDto.PageDto<MclOrderDto> pageDto = CommonDto.toPageDto(orderPage,
                MclMapper.INSTANCE.toOrderDto(orderPage.getContent()
                        .stream()
                        .map(item ->{
                            item.setRevertMemo(supplierPoService.findRevertMemo(item));
                            LocalDateTime emailSendDate = userService.findSendEmail(item.getId(), 1).getCreatedAt();
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

    @ApiOperation(value = "Mcl Style Number 조회", notes = "1. id: Mcl Option ID(필수)")
    @GetMapping(value = "/mcl/styleNumber/{mclOptionID}")
    public ListResult<BigInteger> findStyleNumber(
            @ApiParam(value = "Mcl Option Id", required = true) @PathVariable @NotNull(message = "Mcl Option ID가 없습니다.") Long mclOptionID
    ){
        return responseService.getListResult(mclService.findStyleNumber(mclOptionID));
    }

    @ApiOperation(value = "Mcl Order 취소")
    @PutMapping(value = "/mcl/order/canceled")
    @Transactional
    public CommonResult canceledMclPurchaseOrder(
            @RequestBody List<Long> orderIds,
            @AuthenticationPrincipal User user
    ){
        for (Long orderId : orderIds){
            MclMaterialPurchaseOrder order = supplyOrderService.findOrder(orderId)
                    .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

            order.setStatus(OrderStatus.Canceled);
            order.setUser(user);
            supplyOrderService.saveMclPurchaseOrder(order);

            //published order 처리
            Optional<MclMaterialPurchaseOrderPublish> orderPublish = supplyOrderService.findOrderPublish(order);

            if(orderPublish.isPresent()){
                supplyOrderService.deletePublishedOrder(orderPublish.get());
            }
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Mcl Order 발행", notes = "1. id: Mcl Purchase Order ID(필수)")
    @PutMapping(value = "/mcl/order/publish/{id}")
    @Transactional
    public CommonResult publishMclPurchaseOrder(
            @ApiParam(value = "Mcl Purchase Order ID", required = true) @PathVariable @NotNull(message = "Mcl Purchase Order ID가 없습니다.") Long id,
            @AuthenticationPrincipal User user
    ){
        MclMaterialPurchaseOrder order = supplyOrderService.findOrder(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        if(order.getMclMaterialPurchaseOrderItems().size() == 0){
            throw new BusinessException(ErrorCode.MCL_ORDER_ITEM_EMPTY);
        }

        if(!order.getStatus().equals(OrderStatus.Draft)
        ){
            throw new BusinessException(ErrorCode.MCL_ORDER_ONLY_DRAFT);
        }

        //order published material offer의 unit price가 po의 unit price가 다를 경우 offer 생성 필요
        order.getMclMaterialPurchaseOrderItems()
                .stream()
                .map(item-> {
                    if(item.getMclMaterialInfo().getMaterialOffer() != null){
                        if(item.getMclMaterialInfo().getMaterialOffer().getUnitPrice().doubleValue() != item.getUnitPrice().doubleValue()
                                || item.getMclMaterialInfo().getMaterialOffer().getCommonUom().getId() != item.getOrderedUom().getId()
                        ){
                            materialService.saveMaterialOffer(
                                    MaterialMapper.INSTANCE.toMaterialOffer(
                                            item.getMclMaterialInfo().getMaterialOffer(), item.getOrderedUom(), item.getUnitPrice(), user.getCompId()), user
                            );
                        }
                    }
                    return item;
                })
                .collect(Collectors.toList());

        order.setStatus(OrderStatus.Published);
        order.setUser(user);

        //order 저장
        supplyOrderService.saveMclPurchaseOrder(order);

        //order item issued qty 처리
        for(MclMaterialPurchaseOrderItem orderItem: order.getMclMaterialPurchaseOrderItems()){
            orderItem.setIssuedQty(
                    orderItem.getMclMaterialInfo().getMclMaterialPurchaseOrderItems()
                            .stream().filter(item -> item.getMclMaterialPurchaseOrder().getStatus().equals(OrderStatus.Published)
                            || item.getMclMaterialPurchaseOrder().getStatus().equals(OrderStatus.Confirm))
                            .map(MclMaterialPurchaseOrderItem::getPurchaseQty)
                            .reduce(0, (a,b)-> (a == null ? 0:a)+(b == null ? 0:b))
            );
            mclMaterialPurchaseOrderItemRepository.save(orderItem);
        }
        //publish 처리
        supplyOrderService.publishMclPurchaseOrder(order);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Publish Order 조회(by publish order Id)")
    @GetMapping(value = "/mcl/order/publish/{id}")
    public SingleResult<MclOrderDetailDto> findAdhocOrderById(
            @ApiParam(value = "PUBLISH PO ID", required = true) @PathVariable Long id
    ){
        MclMaterialPurchaseOrderPublish order = supplyOrderService.findPublishOrder(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        return responseService.getSingleResult(new MclOrderDetailDto(
                MclMapper.INSTANCE.toOrderDetailDto(order.getMclMaterialPurchaseOrder()),
                supplyOrderService.findOrderItem(order.getMclMaterialPurchaseOrder())
                )
        );
    }

    @ApiOperation(value = "Order email 발송")
    @PostMapping(value = "/mcl/order/email/{id}")
    public CommonResult sendOrderEmail(
            @ApiParam(value = "PO ID", required = true) @PathVariable @NotNull Long id,
            @RequestBody List<String> emails
    ){
        MclMaterialPurchaseOrder order = supplyOrderService.findOrder(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_INFO_NOT_FOUND));

        for(String email: emails){
            userService.saveUserMailSend(
                    UserMailSend.builder()
                            .email(email)
                            .sendType(1 )
                            .typeIdx(order.getId())
                            .status(0)
                            .build()
            );
        }
        return responseService.getSuccessResult();
    }
}
