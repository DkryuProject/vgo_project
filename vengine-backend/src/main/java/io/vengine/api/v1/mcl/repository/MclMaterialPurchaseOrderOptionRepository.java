package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MclMaterialPurchaseOrderOptionRepository extends JpaRepository<MclMaterialPurchaseOrderOption, Long> {

}
