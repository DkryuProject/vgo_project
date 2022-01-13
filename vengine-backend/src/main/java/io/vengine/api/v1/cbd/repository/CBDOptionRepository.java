package io.vengine.api.v1.cbd.repository;

import io.vengine.api.common.enums.Status;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.cbd.entity.CBDOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CBDOptionRepository extends JpaRepository<CBDOption, Long>, JpaSpecificationExecutor<CBDOption>, CBDOptionRepositoryCustom {
    Optional<CBDOption> findByCbdCoverIdAndName(CBDCover coverById, String name);

    List<CBDOption> findByCbdCoverId(CBDCover cover);

    List<CBDOption> findByCbdCoverIdAndStatus(CBDCover cbdCover, Status close);
}
