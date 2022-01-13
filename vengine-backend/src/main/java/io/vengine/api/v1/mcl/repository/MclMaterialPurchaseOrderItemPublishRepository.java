package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderItemPublish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MclMaterialPurchaseOrderItemPublishRepository extends JpaRepository<MclMaterialPurchaseOrderItemPublish, Long>, JpaSpecificationExecutor<MclMaterialPurchaseOrderItemPublish> {
}
