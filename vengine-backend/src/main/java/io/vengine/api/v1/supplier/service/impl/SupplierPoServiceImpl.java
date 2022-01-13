package io.vengine.api.v1.supplier.service.impl;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.common.filters.SupplierPoSpecification;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.mcl.repository.MclMaterialAdhocPurchaseOrderPublishRepository;
import io.vengine.api.v1.mcl.repository.MclMaterialPurchaseOrderItemPublishRepository;
import io.vengine.api.v1.mcl.repository.MclMaterialPurchaseOrderPublishRepository;
import io.vengine.api.v1.mcl.repository.MclMaterialPurchaseOrderRepository;
import io.vengine.api.v1.supplier.dto.SupplierInvoiceResponse;
import io.vengine.api.v1.supplier.dto.SupplierPoItemResponse;
import io.vengine.api.v1.supplier.dto.SupplierPoRequest;
import io.vengine.api.v1.supplier.dto.SupplierPoResponse;
import io.vengine.api.v1.supplier.entity.SupplierPoChecking;
import io.vengine.api.v1.supplier.mapper.SupplierPoMapper;
import io.vengine.api.v1.supplier.repository.SupplierAdhocPoCheckingRepository;
import io.vengine.api.v1.supplier.repository.SupplierPoCheckingRepository;
import io.vengine.api.v1.supplier.service.SupplierPoService;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SupplierPoServiceImpl implements SupplierPoService {

    @Autowired
    MclMaterialPurchaseOrderPublishRepository mclMaterialPurchaseOrderPublishRepository;

    @Autowired
    MclMaterialAdhocPurchaseOrderPublishRepository mclMaterialAdhocPurchaseOrderPublishRepository;

    @Autowired
    SupplierPoCheckingRepository supplierPoCheckingRepository;

    @Autowired
    SupplierAdhocPoCheckingRepository supplierAdhocPoCheckingRepository;

    @Autowired
    MclMaterialPurchaseOrderRepository mclMaterialPurchaseOrderRepository;

    @Autowired
    MclMaterialPurchaseOrderItemPublishRepository mclMaterialPurchaseOrderItemPublishRepository;

    @Override
    public CommonDto.PageDto<Map<String, Object>> findSupplierOrder(String status, String searchKeyWord, int page, int size, Company company) {
        if(searchKeyWord == null){
            searchKeyWord = "";
        }

        if(status == null){
            status = "";
        }

        Page<Map<String, Object>> supplierPoPage = mclMaterialPurchaseOrderPublishRepository
                .findAll(status, searchKeyWord, company, PageRequest.of((page == 0) ? 0 : (page - 1), size));

        CommonDto.PageDto<Map<String, Object>> pageDto = CommonDto.toPageDto(supplierPoPage,
                supplierPoPage.getContent()
        );
        return pageDto;
    }

    @Override
    public Optional<SupplierPoChecking> findByPublishOrder(MclMaterialPurchaseOrderPublish purchaseOrderPublish) {
        return supplierPoCheckingRepository.findByMclMaterialPurchaseOrderPublish(purchaseOrderPublish);
    }

    @Override
    @Transactional
    public void saveSupplierPoChecking(List<SupplierPoRequest> supplierPoRequests, User user) {
        for (SupplierPoRequest supplierPoRequest: supplierPoRequests){
            if("mcl".equals(supplierPoRequest.getPoType())){
                MclMaterialPurchaseOrderPublish mclMaterialPurchaseOrderPublish = mclMaterialPurchaseOrderPublishRepository.findById(supplierPoRequest.getPublishedOrderId())
                        .orElseThrow(()-> new BusinessException(ErrorCode.MCL_PUBLISHED_ORDER_NOT_FOUND));

                if(supplierPoCheckingRepository.findByMclMaterialPurchaseOrderPublish(mclMaterialPurchaseOrderPublish).isPresent()){
                    throw new BusinessException(ErrorCode.SUPPLIER_PO_CHECKING_IS);
                }

                MclMaterialPurchaseOrder order = mclMaterialPurchaseOrderPublish.getMclMaterialPurchaseOrder();
                supplierPoCheckingRepository.save(SupplierPoMapper.INSTANCE.toSupplierPoChecking(supplierPoRequest, mclMaterialPurchaseOrderPublish, user));

                if(supplierPoRequest.getPoConfirm() == 1){
                    order.setStatus(OrderStatus.Confirm);
                }else if(supplierPoRequest.getPoConfirm() == 2){
                    order.setStatus(OrderStatus.Revert);
                }
                mclMaterialPurchaseOrderRepository.save(order);
            }else if("adhoc".equals(supplierPoRequest.getPoType())){
                MclMaterialAdhocPurchaseOrderPublish mclMaterialAdhocPurchaseOrderPublish = mclMaterialAdhocPurchaseOrderPublishRepository.findById(supplierPoRequest.getPublishedOrderId())
                        .orElseThrow(()-> new BusinessException(ErrorCode.MCL_PUBLISHED_ORDER_NOT_FOUND));

                if(supplierAdhocPoCheckingRepository.findByAndMclMaterialAdhocPurchaseOrderPublish(mclMaterialAdhocPurchaseOrderPublish).isPresent()){
                    throw new BusinessException(ErrorCode.SUPPLIER_PO_CHECKING_IS);
                }

                supplierAdhocPoCheckingRepository.save(SupplierPoMapper.INSTANCE.toSupplierAdhocPoChecking(supplierPoRequest, mclMaterialAdhocPurchaseOrderPublish, user));

                if(supplierPoRequest.getPoConfirm() == 1){
                    mclMaterialAdhocPurchaseOrderPublish.setStatus(OrderStatus.Confirm);
                }else if(supplierPoRequest.getPoConfirm() == 2){
                    mclMaterialAdhocPurchaseOrderPublish.setStatus(OrderStatus.Revert);
                }
                mclMaterialAdhocPurchaseOrderPublishRepository.save(mclMaterialAdhocPurchaseOrderPublish);
            }
        }
    }

    @Override
    public String findRevertMemo(MclMaterialPurchaseOrder mclMaterialPurchaseOrder) {
        Optional<MclMaterialPurchaseOrderPublish> mclMaterialPurchaseOrderPublish =
                mclMaterialPurchaseOrderPublishRepository.findByMclMaterialPurchaseOrder(mclMaterialPurchaseOrder);

        if(!mclMaterialPurchaseOrderPublish.isPresent()){
            return null;
        }

        Optional<SupplierPoChecking> supplierPoChecking = supplierPoCheckingRepository.findByMclMaterialPurchaseOrderPublish(mclMaterialPurchaseOrderPublish.get());
        if(!supplierPoChecking.isPresent()){
            return null;
        }

        return supplierPoChecking.get().getRevertMemo();
    }

    @Override
    public CommonDto.PageDto<SupplierPoItemResponse> findSupplierPoMaterialItem(int page, int size, String supplierName, Company company) {
        Specification<MclMaterialPurchaseOrderItemPublish> poItemSpecification = Specification.where(SupplierPoSpecification.searchPoItemByCompany(company));

        if(supplierName != null){
            poItemSpecification = poItemSpecification.and(SupplierPoSpecification.searchPoItemBySupplier(supplierName));
        }

        Page<MclMaterialPurchaseOrderItemPublish> itemPublishPage =
                mclMaterialPurchaseOrderItemPublishRepository.findAll(poItemSpecification, PageRequest.of((page == 0) ? 0 : (page - 1), size));
        return CommonDto.toPageDto(
                itemPublishPage,
                itemPublishPage.getContent()
                .stream()
                .map(i-> {
                    Long materialOfferID = null;
                    String materialNo = "";
                    String materialCategory = i.getCommonMaterialType().getCategoryA();
                    String itemDetail = "";
                    String itemName = "";
                    CommonInfoDto.BasicInfo itemUom =new CommonInfoDto.BasicInfo();

                    if(i.getMclMaterialInfo() != null){
                        if(i.getMclMaterialInfo().getMaterialOffer() != null){
                            materialOfferID = i.getMclMaterialInfo().getMaterialOffer().getId();
                            materialNo = i.getMclMaterialInfo().getMaterialOffer().getMyMillarticle();
                            itemUom = CommonMapper.INSTANCE.toBasicInfoDto(i.getMclMaterialInfo().getMaterialOffer().getCommonUom());
                        }

                        if(i.getMclMaterialInfo().getMaterialInfo() != null){
                            itemName = i.getMclMaterialInfo().getMaterialInfo().getName();
                            if(i.getMaterialType().equals("fabric")){
                                if(i.getMclMaterialInfo().getMaterialInfo().getMaterialYarns() != null){
                                    itemDetail = i.getMclMaterialInfo().getMaterialInfo().getMaterialYarns()
                                            .stream()
                                            .map(yarn-> yarn.getCommonMaterialYarn().getCmName1() +" "+yarn.getUsed()+"%")
                                            .collect(Collectors.joining(", "));
                                }
                            }else{
                                itemDetail = i.getMclMaterialInfo().getMaterialInfo().getSubsidiaryDetail();
                            }
                        }
                    }

                    SupplierPoItemResponse supplierPoItemResponse = SupplierPoItemResponse.builder()
                            .materialOfferID(materialOfferID)
                            .materialNo(materialNo)
                            .category(materialCategory)
                            .itemDetail(itemDetail)
                            .itemName(itemName)
                            .uom(itemUom)
                            .build();

                    return supplierPoItemResponse;
                })
                .collect(Collectors.toList())
        );
    }

    @Override
    public List<String> findSupplierPoDesignNumbers(String supplierName, Company company) {
        Specification<MclMaterialPurchaseOrderItemPublish> poItemSpecification = Specification.where(SupplierPoSpecification.searchPoItemByCompany(company));

        if(supplierName != null){
            poItemSpecification = poItemSpecification.and(SupplierPoSpecification.searchPoItemBySupplier(supplierName));
        }
        return getDesignNumbers(mclMaterialPurchaseOrderItemPublishRepository.findAll(poItemSpecification));
    }

    @Override
    public List<String> findSupplierPoNumbers(String supplierName, Company company) {
        Specification<MclMaterialPurchaseOrderItemPublish> poItemSpecification = Specification.where(SupplierPoSpecification.searchPoItemByCompany(company));

        if(supplierName != null){
            poItemSpecification = poItemSpecification.and(SupplierPoSpecification.searchPoItemBySupplier(supplierName));
        }
        return getPoNumbers(mclMaterialPurchaseOrderItemPublishRepository.findAll(poItemSpecification));
    }

    private List<String> getPoNumbers(List<MclMaterialPurchaseOrderItemPublish> poItems) {
        return poItems.stream()
                .map(item->item.getMclMaterialPurchaseOrderPublish().getMaterialPurchaseOrderNumber())
                .distinct()
                .collect(Collectors.toList());
    }

    private List<String> getDesignNumbers(List<MclMaterialPurchaseOrderItemPublish> poItems) {
        return poItems.stream()
                .map(item->item.getMclMaterialPurchaseOrderPublish().getCbdCover().getDesignNumber())
                .distinct()
                .collect(Collectors.toList());
    }
}
