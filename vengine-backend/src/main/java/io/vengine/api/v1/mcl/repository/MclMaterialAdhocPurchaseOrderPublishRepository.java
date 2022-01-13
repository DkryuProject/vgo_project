package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderPublish;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.BitSet;
import java.util.List;

public interface MclMaterialAdhocPurchaseOrderPublishRepository extends JpaRepository<MclMaterialAdhocPurchaseOrderPublish, Long>
        , JpaSpecificationExecutor<MclMaterialAdhocPurchaseOrderPublish>
        , MclMaterialAdhocPurchaseOrderPublishRepositoryCustom
{
    List<MclMaterialAdhocPurchaseOrderPublish> findByMaterialPurchaseOrderNumberStartsWithOrderById(String s);

    List<MclMaterialAdhocPurchaseOrderPublish> findByMaterialPurchaseOrderNumberContaining(String value);
}
