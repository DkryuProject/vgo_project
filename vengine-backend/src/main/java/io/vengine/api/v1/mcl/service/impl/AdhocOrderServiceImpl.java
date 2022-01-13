package io.vengine.api.v1.mcl.service.impl;

import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.common.filters.MclSpecification;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.companyInfo.entity.CompanyOrderType;
import io.vengine.api.v1.companyInfo.service.CompanyInfoService;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.material.service.MaterialService;
import io.vengine.api.v1.mcl.dto.AdhocOrderRequestDto;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderItemPublish;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderPublish;
import io.vengine.api.v1.mcl.mapper.AdhocOrderMapper;
import io.vengine.api.v1.mcl.repository.MclMaterialAdhocPurchaseOrderPublishRepository;
import io.vengine.api.v1.mcl.service.AdhocOrderService;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdhocOrderServiceImpl implements AdhocOrderService {
    @Autowired
    MclMaterialAdhocPurchaseOrderPublishRepository mclMaterialAdhocPurchaseOrderPublishRepository;

    @Autowired
    CompanyInfoService companyInfoService;

    @Autowired
    CompanyService companyService;

    @Autowired
    MaterialService materialService;

    @Autowired
    CommonService commonService;

    @Override
    @Transactional
    public void saveAdhocPurchaseOrder(AdhocOrderRequestDto request, User user) {
        MclMaterialAdhocPurchaseOrderPublish order = new MclMaterialAdhocPurchaseOrderPublish();

        AdhocOrderMapper.INSTANCE.toOrder(request.getOrderInfo(), user, order);

        //order 저장
        order.setMaterialPurchaseCompanyAddress(
              companyService.findRepresentativeAddress(user.getCompId())
        );

        String lCode = "";
        if(user.getCompId().getLCode() != null){
            lCode = user.getCompId().getLCode();
        }
        order.setMaterialPurchaseOrderNumber("RM_"+lCode+"_"+companyInfoService.findDocumentNumberIdx(user.getCompId(), "Raw Material Purchase Order"));
        order.setStatus(OrderStatus.Published);
        order.setUser(user);

        List<MclMaterialAdhocPurchaseOrderItemPublish> items = setItem(order, request.getOrderItemInfos(), user);
        order.setMclMaterialAdhocPurchaseOrderItemPublishes(items);
        order.setTerms(
                companyInfoService.getTerms(
                        items
                                .stream()
                                .map(i -> i.getMaterialType())
                                .distinct()
                                .collect(Collectors.toList()), user.getCompId(), "ADHOC")
        );

        mclMaterialAdhocPurchaseOrderPublishRepository.save(order);
    }

    @Override
    public Page<MclMaterialAdhocPurchaseOrderPublish> findAdhocOrder(String searchKeyWord, String status, int page, int size, Company company) {
        if(searchKeyWord == null){
            searchKeyWord = "";
        }

        if(status == null){
            status = "";
        }

        Specification<MclMaterialAdhocPurchaseOrderPublish> specification = MclSpecification.searchOrder(searchKeyWord, status, company);
        return mclMaterialAdhocPurchaseOrderPublishRepository.findAll(specification, PageRequest.of((page == 0) ? 0 : (page - 1), size));
    }

    @Override
    public MclMaterialAdhocPurchaseOrderPublish findAdhocOrderById(Long orderId) {
        return mclMaterialAdhocPurchaseOrderPublishRepository.findById(orderId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ADHOC_ORDER_NOT_FOUND));
    }

    @Override
    @Transactional
    public void saveRePurchaseOrder(MclMaterialAdhocPurchaseOrderPublish order, AdhocOrderRequestDto request, User user) {
        MclMaterialAdhocPurchaseOrderPublish newOrderPublish = new MclMaterialAdhocPurchaseOrderPublish();
        AdhocOrderMapper.INSTANCE.toOrder(request.getOrderInfo(), user, newOrderPublish);

        //이전 order 처리
        order.setStatus(OrderStatus.Revised);
        order.setUser(user);
        mclMaterialAdhocPurchaseOrderPublishRepository.save(order);

        //재발행된 order 처리
        //이전 발행된 order 갯수 체크
        String[] orderNumber = order.getMaterialPurchaseOrderNumber().split("-");
        List<MclMaterialAdhocPurchaseOrderPublish> orderList = mclMaterialAdhocPurchaseOrderPublishRepository
                .findByMaterialPurchaseOrderNumberStartsWithOrderById(orderNumber[0]);

        if(orderList.size()==1){
            newOrderPublish.setMaterialPurchaseOrderNumber(order.getMaterialPurchaseOrderNumber()+"-"+orderList.size());
        }else if(orderList.size() > 1){
            newOrderPublish.setMaterialPurchaseOrderNumber(orderList.get(0).getMaterialPurchaseOrderNumber() + "-"+orderList.size());
        }else{
            throw new BusinessException(ErrorCode.MCL_ORDER_NUMBER_ERROR);
        }

        List<MclMaterialAdhocPurchaseOrderItemPublish> items = setItem(newOrderPublish, request.getOrderItemInfos(), user);

        order.setMaterialPurchaseCompanyAddress(
                companyService.findRepresentativeAddress(user.getCompId())
        );
        newOrderPublish.setStatus(OrderStatus.Published);
        newOrderPublish.setUser(user);
        newOrderPublish.setMaterialPurchaseCompanyAddress(
                companyService.findRepresentativeAddress(user.getCompId())
        );
        newOrderPublish.setMclMaterialAdhocPurchaseOrderItemPublishes(items);

        mclMaterialAdhocPurchaseOrderPublishRepository.save(newOrderPublish);
    }

    private List<MclMaterialAdhocPurchaseOrderItemPublish> setItem(
            MclMaterialAdhocPurchaseOrderPublish order, List<AdhocOrderRequestDto.OrderItemInfo> orderItemInfos, User user
    ) {
        List<MclMaterialAdhocPurchaseOrderItemPublish> itemPublishs = new ArrayList<>();
        for (AdhocOrderRequestDto.OrderItemInfo itemInfo: orderItemInfos ){
            MaterialInfo materialInfo = materialService.findMaterialInfoById(itemInfo.getMaterialInfoID())
                    .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_INFO_NOT_FOUND));

            //CommonBasicInfo commonUom = commonService.findCommonBasicInfoById(itemInfo.getOrderUomId());

            MaterialOffer  materialOffer = materialService.findOfferById(itemInfo.getMaterialOfferID())
                    .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_OFFER_NOT_FOUND));
            /*
            //offer의 단가와 요청 단가가 다르면 offer 새로 생성
            if(materialOffer.getUnitPrice().doubleValue() != itemInfo.getUnitPrice().doubleValue()
                    || materialOffer.getCommonUom().getId() != commonUom.getId()
            ){
                materialOffer = materialService.saveMaterialOffer(
                        MaterialMapper.INSTANCE.toMaterialOffer(
                                materialOffer, commonUom, itemInfo.getUnitPrice(), user.getCompId()), user
                );
            }
            */
            MclMaterialAdhocPurchaseOrderItemPublish itemPublish = AdhocOrderMapper.INSTANCE.toOrderItem(itemInfo, materialInfo, materialOffer);

            CompanyOrderType companyOrderType = companyInfoService.findOrderByName("BULK", user.getCompId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_ORDER_TYPE_NOT_FOUND));

            itemPublish.setCompanyOrderType(companyOrderType);

            itemPublish.setUser(user);
            itemPublish.setMclMaterialAdhocPurchaseOrderPublish(order);
            itemPublishs.add(itemPublish);
        }
        return itemPublishs;
    }
}
