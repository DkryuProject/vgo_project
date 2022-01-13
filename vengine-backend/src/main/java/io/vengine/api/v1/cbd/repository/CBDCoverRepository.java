package io.vengine.api.v1.cbd.repository;

import io.vengine.api.v1.cbd.entity.CBDCover;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CBDCoverRepository extends JpaRepository<CBDCover, Long>, JpaSpecificationExecutor<CBDCover>, CBDCoverRepositoryCustom {
    Optional<CBDCover> findByCbdName(String cbdName);

    List<CBDCover> findByDesignNumber(String designNumber);
}
