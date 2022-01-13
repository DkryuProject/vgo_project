package io.vengine.api.v1.mcl.service.impl;

import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.common.filters.MclSpecification;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.companyInfo.service.CompanyInfoService;
import io.vengine.api.v1.mcl.dto.MclOrderItemDto;
import io.vengine.api.v1.mcl.dto.MclOrderItemRequestDto;
import io.vengine.api.v1.mcl.dto.MclOrderRequestDto;
import io.vengine.api.v1.mcl.dto.MclPurchaseOrderOptionRequest;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.mcl.mapper.MclMapper;
import io.vengine.api.v1.mcl.repository.*;
import io.vengine.api.v1.mcl.service.MclService;
import io.vengine.api.v1.mcl.service.SupplyOrderService;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.service.CompanyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SupplyOrderServiceImpl implements SupplyOrderService {
    @Autowired
    MclMaterialPurchaseOrderRepository mclMaterialPurchaseOrderRepository;

    @Autowired
    MclMaterialPurchaseOrderItemRepository mclMaterialPurchaseOrderItemRepository;

    @Autowired
    MclMaterialPurchaseOrderDependencyItemRepository mclMaterialPurchaseOrderDependencyItemRepository;

    @Autowired
    MclMaterialPurchaseOrderStyleRepository mclMaterialPurchaseOrderStyleRepository;

    @Autowired
    MclMaterialPurchaseOrderDependencyItemPublishRepository mclMaterialPurchaseOrderDependencyItemPublishRepository;

    @Autowired
    MclMaterialPurchaseOrderStylePublishRepository mclMaterialPurchaseOrderStylePublishRepository;

    @Autowired
    MclMaterialPurchaseOrderItemPublishRepository mclMaterialPurchaseOrderItemPublishRepository;

    @Autowired
    MclMaterialPurchaseOrderPublishRepository mclMaterialPurchaseOrderPublishRepository;

    @Autowired
    MclOrderQuantityRepository mclOrderQuantityRepository;

    @Autowired
    MclMaterialPurchaseOrderOptionRepository mclMaterialPurchaseOrderOptionRepository;

    @Autowired
    CompanyInfoService companyInfoService;

    @Autowired
    CompanyService companyService;

    @Autowired
    MclService mclService;

    @Autowired
    CommonService commonService;

    @Override
    public Page<MclMaterialPurchaseOrder> findAllOrder(MclOption mclOption, String searchKeyWord, String status, int page, int size, Company company, String type) {
        if(searchKeyWord == null){
            searchKeyWord = "";
        }

        if(status == null){
            status = "";
        }

        Specification<MclMaterialPurchaseOrder> specification = MclSpecification.searchOrder(mclOption, searchKeyWord, status, company, type);
        return mclMaterialPurchaseOrderRepository.findAll(specification, PageRequest.of((page == 0) ? 0 : (page - 1), size));
    }

    @Override
    @Transactional
    public Long saveMclPurchaseOrder(MclOption mclOption, MclOrderRequestDto request, User user) {
        MclMaterialPurchaseOrder order = new MclMaterialPurchaseOrder();
        MclMapper.INSTANCE.toOrder(mclOption, request, user, order);

        //order 저장
        CBDCover cover = mclOption.getMclCover().getCbdCover();
        String season = cover.getSeason().getName()+(cover.getSeasonYear()%100);

        String orderNumber = "RM_"+season+"_"+companyInfoService.findDocumentNumberIdx(user.getCompId(), "Raw Material Purchase Order");
        order.setMaterialPurchaseOrderNumber(orderNumber);
        order.setStatus(OrderStatus.Draft);
        order.setUserName(user.getFullName());
        order.setMaterialPurchaseCompanyAddress(companyService.findRepresentativeAddress(user.getCompId()));
        MclMaterialPurchaseOrder purchaseOrder = mclMaterialPurchaseOrderRepository.save(order);
        return purchaseOrder.getId();
    }

    @Override
    @Transactional
    public Long saveRePurchaseOrder(MclMaterialPurchaseOrder order, MclOrderRequestDto request, User user) {
        MclMaterialPurchaseOrder mclMaterialPurchaseOrder = new MclMaterialPurchaseOrder();
        MclMapper.INSTANCE.toOrder(order.getMclOption(), request, user, mclMaterialPurchaseOrder);

        //재발행된 order 처리
        //이전 발행된 order 갯수 체크
        String[] orderNumber = order.getMaterialPurchaseOrderNumber().split("-");
        List<MclMaterialPurchaseOrder> orderList = mclMaterialPurchaseOrderRepository
                .findByMaterialPurchaseOrderNumberStartsWithOrderById(orderNumber[0]);

        if(orderList.size()==1){
            mclMaterialPurchaseOrder.setMaterialPurchaseOrderNumber(order.getMaterialPurchaseOrderNumber()+"-"+orderList.size());
        }else if(orderList.size() > 1){
            mclMaterialPurchaseOrder.setMaterialPurchaseOrderNumber(orderList.get(0).getMaterialPurchaseOrderNumber() + "-"+orderList.size());
        }else{
            throw new BusinessException(ErrorCode.MCL_ORDER_NUMBER_ERROR);
        }
        mclMaterialPurchaseOrder.setMaterialPurchaseCompanyAddress(
                companyService.findRepresentativeAddress(user.getCompId())
        );
        mclMaterialPurchaseOrder.setStatus(OrderStatus.Draft);
        mclMaterialPurchaseOrder.setUserName(user.getFullName());

        //이전 order 처리
        order.setStatus(OrderStatus.Revised);
        order.setUser(user);
        mclMaterialPurchaseOrderRepository.save(order);

        //pre order publish 삭제
        Optional<MclMaterialPurchaseOrderPublish> orderPublish = mclMaterialPurchaseOrderPublishRepository.findByMclMaterialPurchaseOrder(order);
        if(orderPublish.isPresent()){
            orderPublish.get().setDelFlag("D");
            mclMaterialPurchaseOrderPublishRepository.save(orderPublish.get());
        }

        MclMaterialPurchaseOrder newOrder = mclMaterialPurchaseOrderRepository.save(mclMaterialPurchaseOrder);

        //이전 order item 복사
        List<MclMaterialPurchaseOrderItem> oldOrderItemList = order.getMclMaterialPurchaseOrderItems();

        MclMaterialPurchaseOrderItem newOrderItem = null;
        for(MclMaterialPurchaseOrderItem oldOrderItem : oldOrderItemList){
            newOrderItem = MclMapper.INSTANCE.toOrderItem(newOrder, oldOrderItem.getMclMaterialInfo(), user);

            //Style 저장
            List<MclMaterialPurchaseOrderStyle> orderStyles = new ArrayList<>();
            for(MclMaterialPurchaseOrderStyle mclMaterialPurchaseOrderStyle : oldOrderItem.getMclMaterialPurchaseOrderStyles()){
                MclMaterialPurchaseOrderStyle newStyle = MclMapper.INSTANCE.toOrderStyle(mclMaterialPurchaseOrderStyle.getStyleNumber(), user);
                newStyle.setMclMaterialPurchaseOrderItem(newOrderItem);
                orderStyles.add(newStyle);
            }

            //Dependency 저장
            List<MclMaterialPurchaseOrderDependencyItem> dependencyItems = new ArrayList<>();
            for( MclMaterialPurchaseOrderDependencyItem oldDependencyItem : oldOrderItem.getMclMaterialPurchaseOrderDependencyItems()){
                MclMaterialPurchaseOrderDependencyItem newDependencyItem = new MclMaterialPurchaseOrderDependencyItem();
                newDependencyItem.setCbdOption(oldDependencyItem.getCbdOption());
                newDependencyItem.setMclMaterialInfo(oldDependencyItem.getMclMaterialInfo());
                newDependencyItem.setMclMaterialType(oldDependencyItem.getMclMaterialType());
                newDependencyItem.setMclGarmentColor(oldDependencyItem.getMclGarmentColor());
                newDependencyItem.setMclGarmentSize(oldDependencyItem.getMclGarmentSize());
                newDependencyItem.setMclGarmentMarket(oldDependencyItem.getMclGarmentMarket());
                newDependencyItem.setOrderedQty(oldDependencyItem.getOrderedQty());
                newDependencyItem.setOrderedUom(oldDependencyItem.getOrderedUom());
                newDependencyItem.setMclMaterialPurchaseOrderItem(newOrderItem);
                dependencyItems.add(newDependencyItem);
            }

            newOrderItem.setCompanyOrderType(oldOrderItem.getCompanyOrderType());
            newOrderItem.setUnitPrice(oldOrderItem.getUnitPrice());
            newOrderItem.setOrderedUom(oldOrderItem.getOrderedUom());
            newOrderItem.setOrderedAdjUom(oldOrderItem.getOrderedAdjUom());
            newOrderItem.setPurchaseQty(oldOrderItem.getPurchaseQty());
            newOrderItem.setIssuedQty(oldOrderItem.getIssuedQty());
            newOrderItem.setPreProductionOrderType(oldOrderItem.getPreProductionOrderType());
            newOrderItem.setPreProductionQty(oldOrderItem.getPreProductionQty());
            newOrderItem.setPreProductionUnitPrice(oldOrderItem.getPreProductionUnitPrice());
            newOrderItem.setPreProductionUom(oldOrderItem.getPreProductionUom());
            newOrderItem.setAdvertisementOrderType(oldOrderItem.getAdvertisementOrderType());
            newOrderItem.setAdvertisementQty(oldOrderItem.getAdvertisementQty());
            newOrderItem.setAdvertisementUnitPrice(oldOrderItem.getAdvertisementUnitPrice());
            newOrderItem.setAdvertisementUom(oldOrderItem.getAdvertisementUom());
            newOrderItem.setMclMaterialPurchaseOrderStyles(orderStyles);
            newOrderItem.setMclMaterialPurchaseOrderDependencyItems(dependencyItems);
            mclMaterialPurchaseOrderItemRepository.save(newOrderItem);
        }
        return newOrder.getId();
    }

    @Override
    public Optional<MclMaterialPurchaseOrder> findOrder(Long id) {
        return mclMaterialPurchaseOrderRepository.findById(id);
    }

    @Override
    @Transactional
    public void modifyMclPurchaseOrder(MclMaterialPurchaseOrder order, MclOrderRequestDto request, User user) {
        MclMapper.INSTANCE.toOrder(order.getMclOption(), request, user, order);

        //order 저장
        //order.setMaterialPurchaseCompanyAddress(companyService.findRepresentativeAddress(order.getMaterialPurchaseCompany()));
        //order.setMaterialSellingCompanyAddress(companyService.findRepresentativeAddress(order.getMaterialSellingCompany()));
        //order.setConsigneeCompanyAddress(companyService.findRepresentativeAddress(order.getConsigneeCompany()));
        //order.setShipperCompanyAddress(companyService.findRepresentativeAddress(order.getShipperCompany()));
        //order.setForwarderCompanyAddress(companyService.findRepresentativeAddress(order.getForwarder()));

        mclMaterialPurchaseOrderRepository.save(order);
    }

    @Override
    public void saveMclPurchaseOrder(MclMaterialPurchaseOrder order) {
        mclMaterialPurchaseOrderRepository.save(order);
    }

    @Override
    @Transactional
    public void publishMclPurchaseOrder(MclMaterialPurchaseOrder mclMaterialPurchaseOrder) {
        //order 저장
        MclMaterialPurchaseOrderPublish orderPublish = MclMapper.INSTANCE.toOrderPublish(mclMaterialPurchaseOrder);

        List<MclMaterialPurchaseOrderOptionPublish> mclMaterialPurchaseOrderOptionPublishes = new ArrayList<>();
        if(mclMaterialPurchaseOrder.getMclMaterialPurchaseOrderOptions() != null){
            for (MclMaterialPurchaseOrderOption mclMaterialPurchaseOrderOption: mclMaterialPurchaseOrder.getMclMaterialPurchaseOrderOptions()){
                mclMaterialPurchaseOrderOptionPublishes.add(MclMapper.INSTANCE.toPurchaseOrderOptionPublish(orderPublish, mclMaterialPurchaseOrderOption));
            }
        }

        orderPublish.setMclMaterialPurchaseOrderOptionPublishes(mclMaterialPurchaseOrderOptionPublishes);

        orderPublish.setCbdSeasonName(
                mclMaterialPurchaseOrder.getMclOption().getMclCover().getCbdCover().getSeason().getName()+
                        String.valueOf(mclMaterialPurchaseOrder.getMclOption().getMclCover().getCbdCover().getSeasonYear()).substring(2));

        orderPublish.setTerms(
                companyInfoService.getTerms(
                        mclMaterialPurchaseOrder.getMclMaterialPurchaseOrderItems()
                                .stream()
                                .map(i -> i.getMaterialType())
                                .distinct()
                                .collect(Collectors.toList()), mclMaterialPurchaseOrder.getCompany(), "Raw")
        );
        MclMaterialPurchaseOrderPublish publishOrder = mclMaterialPurchaseOrderPublishRepository.save(orderPublish);

        //item 저장
        for (MclMaterialPurchaseOrderItem item: mclMaterialPurchaseOrder.getMclMaterialPurchaseOrderItems() ){
            //dependency 저장
            for (MclMaterialPurchaseOrderDependencyItem dependencyItem: item.getMclMaterialPurchaseOrderDependencyItems()){
                mclMaterialPurchaseOrderDependencyItemPublishRepository.save(MclMapper.INSTANCE.toDependencyItemPublish(dependencyItem));
            }

            //style 저장
            for (MclMaterialPurchaseOrderStyle style: item.getMclMaterialPurchaseOrderStyles()){
                mclMaterialPurchaseOrderStylePublishRepository.save(MclMapper.INSTANCE.toOrderStylePublish(style));
            }

            MclMaterialPurchaseOrderItemPublish itemPublish = MclMapper.INSTANCE.toOrderItemPublish(item);
            itemPublish.setMclMaterialPurchaseOrderPublish(publishOrder);
            mclMaterialPurchaseOrderItemPublishRepository.save(itemPublish);
        }
    }

    @Override
    @Transactional
    public void saveMclPurchaseOrderItem(MclMaterialPurchaseOrder order, List<MclOrderItemRequestDto.ItemMatchingRequest> requests, User user) {
        for (MclOrderItemRequestDto.ItemMatchingRequest itemRequest: requests){
            MclMaterialInfo materialInfo = mclService.findMclMaterialInfoById(itemRequest.getMclMaterialInfoID())
                    .orElseThrow(()-> new BusinessException(ErrorCode.MCL_MATERIAL_INFO_NOT_FOUND));

            //if(mclMaterialPurchaseOrderItemRepository.findByMclMaterialPurchaseOrderAndMclMaterialInfo(order, materialInfo).size()>0){
            //   throw new BusinessException(ErrorCode.MCL_ORDER_SAME_MATERIAL_INFO);
            //}

            MclMaterialPurchaseOrderItem orderItem = MclMapper.INSTANCE.toOrderItem(order, materialInfo, user);

            //Style 저장
            List<MclMaterialPurchaseOrderStyle> orderStyles = new ArrayList<>();
            for(BigInteger styleNumber : itemRequest.getStyleNumbers()){
                MclMaterialPurchaseOrderStyle style = MclMapper.INSTANCE.toOrderStyle(styleNumber, user);
                style.setMclMaterialPurchaseOrderItem(orderItem);
                orderStyles.add(style);
            }

            //Dependency 저장
            List<MclMaterialPurchaseOrderDependencyItem> dependencyItems = new ArrayList<>();
            for(MclOrderItemRequestDto.DependencyItemRequest dependencyItemRequest : itemRequest.getDependencyItems()){
                MclMaterialPurchaseOrderDependencyItem dependencyItem = MclMapper.INSTANCE.toDependencyItem(dependencyItemRequest, materialInfo, user);
                dependencyItem.setMclMaterialPurchaseOrderItem(orderItem);
                dependencyItems.add(dependencyItem);
            }

            orderItem.setCompanyOrderType(companyInfoService.findOrderByName("BULK", user.getCompId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_ORDER_TYPE_NOT_FOUND)));
            orderItem.setPreProductionOrderType(commonService.findCommonBasicInfoByTypeAndCmName1("purchase_order_type","PP")
                    .orElseThrow(()-> new BusinessException(ErrorCode.DATA_NOT_FOUND)));
            orderItem.setAdvertisementOrderType(commonService.findCommonBasicInfoByTypeAndCmName1("purchase_order_type","AD")
                    .orElseThrow(()-> new BusinessException(ErrorCode.DATA_NOT_FOUND)));
            orderItem.setPurchaseQty(0);
            orderItem.setMclMaterialPurchaseOrderStyles(orderStyles);
            orderItem.setMclMaterialPurchaseOrderDependencyItems(dependencyItems);
            mclMaterialPurchaseOrderItemRepository.save(orderItem);
        }
        order.setStatus(OrderStatus.Draft);
        mclMaterialPurchaseOrderRepository.save(order);

        //Publish 처리
        //publishMclPurchaseOrder(order);
    }

    @Override
    @Transactional
    public void modifyMclPurchaseOrderItem(MclMaterialPurchaseOrder order, MclOrderItemRequestDto request, User user) {
        for (MclOrderItemRequestDto.ItemRequest itemRequest: request.getOrderItemList()){
            if(itemRequest.getOrderItemId() == null){
                throw new BusinessException(ErrorCode.MCL_ORDER_ITEM_ID_NULL);
            }

            MclMaterialPurchaseOrderItem item = mclMaterialPurchaseOrderItemRepository.findById(itemRequest.getOrderItemId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_ITEM_NOT_FOUND));

            item.setUnitPrice(itemRequest.getUnitPrice());
            item.setOrderedAdjUom(CommonMapper.INSTANCE.toCommonBasic(itemRequest.getOrderedAdjUomID()));
            item.setPurchaseQty(itemRequest.getPurchaseQty());
            item.setFromToUom(itemRequest.getFromToUom());
            mclMaterialPurchaseOrderItemRepository.save(item);

            item.setPreProductionQty(itemRequest.getSampleOrder().getPreProductionQty());
            item.setPreProductionUom(CommonMapper.INSTANCE.toCommonBasic(itemRequest.getSampleOrder().getPreProductionUom()));
            item.setPreProductionUnitPrice(itemRequest.getSampleOrder().getPreProductionUnitPrice());
            item.setAdvertisementQty(itemRequest.getSampleOrder().getAdvertisementQty());
            item.setAdvertisementUom(CommonMapper.INSTANCE.toCommonBasic(itemRequest.getSampleOrder().getAdvertisementUom()));
            item.setAdvertisementUnitPrice(itemRequest.getSampleOrder().getAdvertisementUnitPrice());

            if(itemRequest.getDependencyItems() != null){
                for(MclOrderItemRequestDto.DependencyItemRequest dependencyItemRequest : itemRequest.getDependencyItems()){
                    MclMaterialPurchaseOrderDependencyItem dependencyItem =
                            mclMaterialPurchaseOrderDependencyItemRepository.findById(dependencyItemRequest.getDependencyItemId())
                                    .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_DEPENDENCY_ITEM_NOT_FOUND));

                    dependencyItem.setOrderedQty(dependencyItemRequest.getPurchaseQty());
                    dependencyItem.setOrderedUom(CommonMapper.INSTANCE.toCommonBasic(dependencyItemRequest.getOrderedUomId()));
                    mclMaterialPurchaseOrderDependencyItemRepository.save(dependencyItem);
                }
            }
        }
        //order option
        mclMaterialPurchaseOrderOptionRepository.deleteAll(order.getMclMaterialPurchaseOrderOptions());

        List<MclMaterialPurchaseOrderOption> mclMaterialPurchaseOrderOptions = new ArrayList<>();
        if(request.getOrderOption() != null){
            for (MclPurchaseOrderOptionRequest orderOptionRequest: request.getOrderOption()){
                if(orderOptionRequest.getType().equals("Percentage")){
                    if(!Pattern.matches("^[0-9]*$", orderOptionRequest.getValue().toString())){
                        throw new BusinessException(ErrorCode.PERCENTAGE_ONLY_INTEGER);
                    }
                }
                mclMaterialPurchaseOrderOptions.add(MclMapper.INSTANCE.toPurchaseOrderOption(order, orderOptionRequest, user));
            }
        }
        order.setMclMaterialPurchaseOrderOptions(mclMaterialPurchaseOrderOptions);

        order.setExchangeRate(request.getExchangeRate());
        order.setStatus(OrderStatus.Draft);
        mclMaterialPurchaseOrderRepository.save(order);

        //Publish 처리
        //publishMclPurchaseOrder(order);
    }

    @Override
    public MclOrderItemDto findOrderItem(MclMaterialPurchaseOrder mclMaterialPurchaseOrder) {
        List<MclMaterialPurchaseOrderItem> items = mclMaterialPurchaseOrder.getMclMaterialPurchaseOrderItems();

        List<MclOrderItemDto.OrderItem> orderItems = new ArrayList<>();
        for (MclMaterialPurchaseOrderItem item: items){
            List<MclOrderItemDto.DependencyItem> dependencyItems =MclMapper.INSTANCE.toDependencyItemDto(item.getMclMaterialPurchaseOrderDependencyItems());
            MclOrderItemDto.OrderItem itemDto = MclMapper.INSTANCE.toOrderItemDto(mclMaterialPurchaseOrder, item, dependencyItems);
            orderItems.add(itemDto);
        }
        MclOrderItemDto mclOrderItemDto = new MclOrderItemDto();
        mclOrderItemDto.setExchangeRate(mclMaterialPurchaseOrder.getExchangeRate());
        mclOrderItemDto.setOption(MclMapper.INSTANCE.toPurchaseOrderOptionDto(mclMaterialPurchaseOrder.getMclMaterialPurchaseOrderOptions()));
        mclOrderItemDto.setOrderItemList(orderItems);
        return mclOrderItemDto;
    }

    @Override
    public Optional<MclMaterialPurchaseOrderPublish> findOrderPublish(MclMaterialPurchaseOrder order) {
        return mclMaterialPurchaseOrderPublishRepository.findByMclMaterialPurchaseOrder(order);
    }

    @Override
    public void deletePublishedOrder(MclMaterialPurchaseOrderPublish mclMaterialPurchaseOrderPublish) {
        mclMaterialPurchaseOrderPublish.setDelFlag("D");
        mclMaterialPurchaseOrderPublishRepository.save(mclMaterialPurchaseOrderPublish);
    }

    @Override
    @Transactional
    public void saveRePurchaseOrderItem(MclMaterialPurchaseOrder newOrder, MclMaterialPurchaseOrder oldOrder,
                                        List<MclOrderItemRequestDto.ItemMatchingRequest> requests, User user)
    {
        //이전 order item 복사
        List<MclMaterialPurchaseOrderItem> newOrderItemList = new ArrayList<>();
        List<MclMaterialPurchaseOrderItem> oldOrderItemList = oldOrder.getMclMaterialPurchaseOrderItems();

        MclMaterialPurchaseOrderItem newOrderItem = null;
        for(MclMaterialPurchaseOrderItem oldOrderItem : oldOrderItemList){
            newOrderItem = MclMapper.INSTANCE.toOrderItem(newOrder, oldOrderItem.getMclMaterialInfo(), user);

            //Style 저장
            List<MclMaterialPurchaseOrderStyle> orderStyles = new ArrayList<>();
            for(MclMaterialPurchaseOrderStyle mclMaterialPurchaseOrderStyle : oldOrderItem.getMclMaterialPurchaseOrderStyles()){
                MclMaterialPurchaseOrderStyle newStyle = MclMapper.INSTANCE.toOrderStyle(mclMaterialPurchaseOrderStyle.getStyleNumber(), user);
                newStyle.setMclMaterialPurchaseOrderItem(newOrderItem);
                orderStyles.add(newStyle);
            }

            //Dependency 저장
            List<MclMaterialPurchaseOrderDependencyItem> dependencyItems = new ArrayList<>();
            for( MclMaterialPurchaseOrderDependencyItem oldDependencyItem : oldOrderItem.getMclMaterialPurchaseOrderDependencyItems()){
                MclMaterialPurchaseOrderDependencyItem newDependencyItem = new MclMaterialPurchaseOrderDependencyItem();
                newDependencyItem.setCbdOption(oldDependencyItem.getCbdOption());
                newDependencyItem.setMclMaterialInfo(oldDependencyItem.getMclMaterialInfo());
                newDependencyItem.setMclMaterialType(oldDependencyItem.getMclMaterialType());
                newDependencyItem.setMclGarmentColor(oldDependencyItem.getMclGarmentColor());
                newDependencyItem.setMclGarmentSize(oldDependencyItem.getMclGarmentSize());
                newDependencyItem.setMclGarmentMarket(oldDependencyItem.getMclGarmentMarket());
                newDependencyItem.setOrderedQty(oldDependencyItem.getOrderedQty());
                newDependencyItem.setOrderedUom(oldDependencyItem.getOrderedUom());
                newDependencyItem.setMclMaterialPurchaseOrderItem(newOrderItem);
                dependencyItems.add(newDependencyItem);
            }

            newOrderItem.setCompanyOrderType(oldOrderItem.getCompanyOrderType());
            newOrderItem.setUnitPrice(oldOrderItem.getUnitPrice());
            newOrderItem.setFromToUom(oldOrderItem.getFromToUom());
            newOrderItem.setOrderedUom(oldOrderItem.getOrderedUom());
            newOrderItem.setOrderedAdjUom(oldOrderItem.getOrderedAdjUom());
            newOrderItem.setPurchaseQty(oldOrderItem.getPurchaseQty());
            newOrderItem.setIssuedQty(oldOrderItem.getIssuedQty());
            newOrderItem.setMclMaterialPurchaseOrderStyles(orderStyles);
            newOrderItem.setMclMaterialPurchaseOrderDependencyItems(dependencyItems);
            newOrderItemList.add(newOrderItem);
        }

        //아이템 추가 저장
        for (MclOrderItemRequestDto.ItemMatchingRequest itemRequest: requests){
            MclMaterialInfo materialInfo = mclService.findMclMaterialInfoById(itemRequest.getMclMaterialInfoID())
                    .orElseThrow(()-> new BusinessException(ErrorCode.MCL_MATERIAL_INFO_NOT_FOUND));

            if(mclMaterialPurchaseOrderItemRepository.findByMclMaterialPurchaseOrderAndMclMaterialInfo(newOrder, materialInfo).size()>0){
                throw new BusinessException(ErrorCode.MCL_ORDER_SAME_MATERIAL_INFO);
            }

            MclMaterialPurchaseOrderItem orderItem = MclMapper.INSTANCE.toOrderItem(newOrder, materialInfo, user);

            //Style 저장
            List<MclMaterialPurchaseOrderStyle> orderStyles = new ArrayList<>();
            for(BigInteger styleNumber : itemRequest.getStyleNumbers()){
                MclMaterialPurchaseOrderStyle style = MclMapper.INSTANCE.toOrderStyle(styleNumber, user);
                style.setMclMaterialPurchaseOrderItem(orderItem);
                orderStyles.add(style);
            }

            //Dependency 저장
            List<MclMaterialPurchaseOrderDependencyItem> dependencyItems = new ArrayList<>();
            for(MclOrderItemRequestDto.DependencyItemRequest dependencyItemRequest : itemRequest.getDependencyItems()){
                MclMaterialPurchaseOrderDependencyItem dependencyItem = MclMapper.INSTANCE.toDependencyItem(dependencyItemRequest, materialInfo, user);
                dependencyItem.setMclMaterialPurchaseOrderItem(orderItem);
                dependencyItems.add(dependencyItem);
            }

            orderItem.setCompanyOrderType(companyInfoService.findOrderByName("BULK", user.getCompId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_ORDER_TYPE_NOT_FOUND)));
            orderItem.setPreProductionOrderType(commonService.findCommonBasicInfoByTypeAndCmName1("purchase_order_type","PP")
                    .orElseThrow(()-> new BusinessException(ErrorCode.DATA_NOT_FOUND)));
            orderItem.setAdvertisementOrderType(commonService.findCommonBasicInfoByTypeAndCmName1("purchase_order_type","AD")
                    .orElseThrow(()-> new BusinessException(ErrorCode.DATA_NOT_FOUND)));
            orderItem.setMclMaterialPurchaseOrderStyles(orderStyles);
            orderItem.setMclMaterialPurchaseOrderDependencyItems(dependencyItems);
            newOrderItemList.add(orderItem);
        }

        mclMaterialPurchaseOrderItemRepository.saveAll(newOrderItemList);
    }

    @Override
    public Optional<MclMaterialPurchaseOrderPublish> findPublishOrder(Long id) {
        return mclMaterialPurchaseOrderPublishRepository.findById(id);
    }
}
