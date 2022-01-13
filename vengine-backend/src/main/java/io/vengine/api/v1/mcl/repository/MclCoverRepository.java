package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclCover;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MclCoverRepository extends JpaRepository<MclCover, Long> {
}
