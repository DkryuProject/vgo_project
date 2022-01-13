package io.vengine.api.v1.supplier.repository;

import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderPublish;
import io.vengine.api.v1.supplier.entity.SupplierAdhocPoChecking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierAdhocPoCheckingRepository extends JpaRepository<SupplierAdhocPoChecking, Long>, SupplierAdhocPoCheckingRepositoryCustom {
    Optional<SupplierAdhocPoChecking> findByAndMclMaterialAdhocPurchaseOrderPublish(MclMaterialAdhocPurchaseOrderPublish mclMaterialAdhocPurchaseOrderPublish);
}
