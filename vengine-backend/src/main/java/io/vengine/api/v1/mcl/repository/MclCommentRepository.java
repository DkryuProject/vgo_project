package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MclCommentRepository extends JpaRepository<MclComment, Long>, JpaSpecificationExecutor<MclComment> {
}
