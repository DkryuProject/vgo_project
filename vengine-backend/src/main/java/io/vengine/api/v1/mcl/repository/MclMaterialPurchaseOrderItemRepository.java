package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclMaterialInfo;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrder;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MclMaterialPurchaseOrderItemRepository extends JpaRepository<MclMaterialPurchaseOrderItem, Long> {
    List<MclMaterialPurchaseOrderItem> findByMclMaterialPurchaseOrder(MclMaterialPurchaseOrder mclMaterialPurchaseOrder);

    List<MclMaterialPurchaseOrderItem> findByMclMaterialPurchaseOrderAndMclMaterialInfo(MclMaterialPurchaseOrder order, MclMaterialInfo materialInfo);
}
