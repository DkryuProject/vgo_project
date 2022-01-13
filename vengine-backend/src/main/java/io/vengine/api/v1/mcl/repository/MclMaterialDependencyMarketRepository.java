package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclGarmentMarket;
import io.vengine.api.v1.mcl.entity.MclMaterialDependencyMarket;
import io.vengine.api.v1.mcl.entity.MclMaterialInfo;
import io.vengine.api.v1.mcl.entity.MclOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.BitSet;
import java.util.List;
import java.util.Optional;

public interface MclMaterialDependencyMarketRepository extends JpaRepository<MclMaterialDependencyMarket, Long> {
    List<MclMaterialDependencyMarket> findByMclGarmentMarket(MclGarmentMarket mclGarmentMarket);

    List<MclMaterialDependencyMarket> findByMclOptionAndMclMaterialInfo(MclOption mclOption, MclMaterialInfo mclMaterialInfo);

    List<MclMaterialDependencyMarket> findByMclMaterialInfo(MclMaterialInfo mclMaterialInfo);

    Optional<MclMaterialDependencyMarket> findByMclMaterialInfoAndMclGarmentMarket(MclMaterialInfo mclMaterialInfo, MclGarmentMarket mclGarmentMarket);
}
