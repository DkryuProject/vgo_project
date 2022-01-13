package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclOrderQuantity;
import io.vengine.api.v1.mcl.entity.MclOrderQuantityOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MclOrderQuantityOptionRepository extends JpaRepository<MclOrderQuantityOption, Long> {
    MclOrderQuantityOption findByMclOrderQuantity(MclOrderQuantity mclOrderQuantity);
}
