package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclGarmentSize;
import io.vengine.api.v1.mcl.entity.MclMaterialDependencySize;
import io.vengine.api.v1.mcl.entity.MclMaterialInfo;
import io.vengine.api.v1.mcl.entity.MclOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.BitSet;
import java.util.List;
import java.util.Optional;

public interface MclMaterialDependencySizeRepository extends JpaRepository<MclMaterialDependencySize, Long> {
    List<MclMaterialDependencySize> findByMclGarmentSize(MclGarmentSize mclGarmentSize);

    List<MclMaterialDependencySize> findByMclOptionAndMclMaterialInfo(MclOption mclOption, MclMaterialInfo mclMaterialInfo);

    List<MclMaterialDependencySize> findByMclMaterialInfo(MclMaterialInfo mclMaterialInfo);

    Optional<MclMaterialDependencySize> findByMclMaterialInfoAndMclGarmentSize(MclMaterialInfo mclMaterialInfo, MclGarmentSize size);
}
