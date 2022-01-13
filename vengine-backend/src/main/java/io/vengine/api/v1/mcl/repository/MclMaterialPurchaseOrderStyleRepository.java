package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderItem;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderStyle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MclMaterialPurchaseOrderStyleRepository extends JpaRepository<MclMaterialPurchaseOrderStyle, Long> {
    List<MclMaterialPurchaseOrderStyle> findByMclMaterialPurchaseOrderItem(MclMaterialPurchaseOrderItem mclMaterialPurchaseOrderItem);
}
