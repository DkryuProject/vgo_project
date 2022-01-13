package io.vengine.api.v1.supplier.repository;

import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderPublish;
import io.vengine.api.v1.supplier.entity.SupplierPoChecking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierPoCheckingRepository extends JpaRepository<SupplierPoChecking, Long>, SupplierPoCheckingRepositoryCustom {
    Optional<SupplierPoChecking> findByMclMaterialPurchaseOrderPublish(MclMaterialPurchaseOrderPublish mclMaterialPurchaseOrderPublish);
}
