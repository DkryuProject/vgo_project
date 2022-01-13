package io.vengine.api.v1.mcl.service;

import io.vengine.api.v1.mcl.dto.MclOrderItemDto;
import io.vengine.api.v1.mcl.dto.MclOrderItemRequestDto;
import io.vengine.api.v1.mcl.dto.MclOrderRequestDto;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrder;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderPublish;
import io.vengine.api.v1.mcl.entity.MclOption;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface SupplyOrderService {
    Page<MclMaterialPurchaseOrder> findAllOrder(MclOption mclOption, String searchKeyWord, String status, int page, int size, Company company, String type);

    Long saveMclPurchaseOrder(MclOption mclOption, MclOrderRequestDto request, User user);

    Long saveRePurchaseOrder(MclMaterialPurchaseOrder order, MclOrderRequestDto request, User user);

    void saveMclPurchaseOrder(MclMaterialPurchaseOrder order);

    Optional<MclMaterialPurchaseOrder> findOrder(Long id);

    void modifyMclPurchaseOrder(MclMaterialPurchaseOrder order, MclOrderRequestDto request, User user);

    void publishMclPurchaseOrder(MclMaterialPurchaseOrder order);

    void saveMclPurchaseOrderItem(MclMaterialPurchaseOrder order, List<MclOrderItemRequestDto.ItemMatchingRequest> requests, User user);

    void modifyMclPurchaseOrderItem(MclMaterialPurchaseOrder order, MclOrderItemRequestDto request, User user);

    MclOrderItemDto findOrderItem(MclMaterialPurchaseOrder order);

    Optional<MclMaterialPurchaseOrderPublish> findOrderPublish(MclMaterialPurchaseOrder order);

    void deletePublishedOrder(MclMaterialPurchaseOrderPublish mclMaterialPurchaseOrderPublish);

    void saveRePurchaseOrderItem(MclMaterialPurchaseOrder newOrder, MclMaterialPurchaseOrder oldOrder, List<MclOrderItemRequestDto.ItemMatchingRequest> requests, User user);

    Optional<MclMaterialPurchaseOrderPublish> findPublishOrder(Long id);
}
