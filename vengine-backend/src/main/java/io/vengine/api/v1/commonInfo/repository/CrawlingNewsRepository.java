package io.vengine.api.v1.commonInfo.repository;

import io.vengine.api.v1.commonInfo.entity.CrawlingNews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrawlingNewsRepository extends JpaRepository<CrawlingNews, Long>, CrawlingNewsRepositoryCustom {
}
