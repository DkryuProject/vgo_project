package io.vengine.api.v1.commonInfo.repository;

import io.vengine.api.v1.commonInfo.entity.CommonNotice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommonNoticeRepository extends JpaRepository<CommonNotice, Long> {
}
