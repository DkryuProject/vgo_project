package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrder;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.BitSet;
import java.util.Collection;
import java.util.List;

@Repository
public interface MclMaterialPurchaseOrderRepository extends JpaRepository<MclMaterialPurchaseOrder, Long>, JpaSpecificationExecutor<MclMaterialPurchaseOrder>, MclMaterialPurchaseOrderRepositoryCustom {
    List<MclMaterialPurchaseOrder> findByMaterialPurchaseOrderNumberStartsWithOrderById(String s);

    List<MclMaterialPurchaseOrder> findByMaterialPurchaseOrderNumberContaining(String value);
}
