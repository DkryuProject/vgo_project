package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MclOrderQuantityRepository extends JpaRepository<MclOrderQuantity, Long>, MclOrderQuantityRepositoryCustom {
    List<MclOrderQuantity> findByMclOption(MclOption mclOption);

    List<MclOrderQuantity> findByMclGarmentColor(MclGarmentColor mclGarmentColor);

    List<MclOrderQuantity> findByMclGarmentSize(MclGarmentSize mclGarmentSize);

    List<MclOrderQuantity> findByMclGarmentMarket(MclGarmentMarket mclGarmentMarket);
}
