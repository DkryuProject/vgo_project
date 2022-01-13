package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclGarmentMarket;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderDependencyItem;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MclMaterialPurchaseOrderDependencyItemRepository extends JpaRepository<MclMaterialPurchaseOrderDependencyItem, Long>,
        MclMaterialPurchaseOrderDependencyItemRepositoryCustom
{
    List<MclMaterialPurchaseOrderDependencyItem> findByMclGarmentMarket(MclGarmentMarket mclGarmentMarket);

    List<MclMaterialPurchaseOrderDependencyItem> findByMclMaterialPurchaseOrderItem(MclMaterialPurchaseOrderItem mclMaterialPurchaseOrderItem);
}
