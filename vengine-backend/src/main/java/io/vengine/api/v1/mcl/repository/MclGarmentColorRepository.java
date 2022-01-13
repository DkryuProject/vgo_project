package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclGarmentColor;
import io.vengine.api.v1.mcl.entity.MclOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MclGarmentColorRepository extends JpaRepository<MclGarmentColor, Long>, JpaSpecificationExecutor<MclGarmentColor> {
    List<MclGarmentColor> findByMclOption(MclOption mclOption);

    Optional<MclGarmentColor> findByMclOptionAndGarmentColor(MclOption mclOption, String garmentColor);
}
