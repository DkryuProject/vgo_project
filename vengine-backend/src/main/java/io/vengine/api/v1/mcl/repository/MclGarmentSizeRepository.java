package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.mcl.entity.MclGarmentSize;
import io.vengine.api.v1.mcl.entity.MclOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MclGarmentSizeRepository extends JpaRepository<MclGarmentSize, Long>, JpaSpecificationExecutor<MclGarmentSize> {

    List<MclGarmentSize> findByMclOptionOrderBySize(MclOption mclOption);

    List<MclGarmentSize> findByMclOption(MclOption mclOption);

    Optional<MclGarmentSize> findByMclOptionAndSize(MclOption mclOption, CommonBasicInfo size);
}
