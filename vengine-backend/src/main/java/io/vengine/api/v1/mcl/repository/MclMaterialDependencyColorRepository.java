package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclGarmentColor;
import io.vengine.api.v1.mcl.entity.MclMaterialDependencyColor;
import io.vengine.api.v1.mcl.entity.MclMaterialInfo;
import io.vengine.api.v1.mcl.entity.MclOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MclMaterialDependencyColorRepository extends JpaRepository<MclMaterialDependencyColor, Long> {

    List<MclMaterialDependencyColor> findByMclOptionAndMclMaterialInfo(MclOption mclOption, MclMaterialInfo mclMaterialInfo);

    List<MclMaterialDependencyColor> findByMclGarmentColor(MclGarmentColor mclGarmentColor);

    List<MclMaterialDependencyColor> findByMclMaterialInfo(MclMaterialInfo mclMaterialInfo);

    Optional<MclMaterialDependencyColor> findByMclMaterialInfoAndMclGarmentColor(MclMaterialInfo mclMaterialInfo, MclGarmentColor mclGarmentColor);
}
