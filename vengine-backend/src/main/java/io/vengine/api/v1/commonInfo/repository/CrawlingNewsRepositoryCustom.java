package io.vengine.api.v1.commonInfo.repository;

import io.vengine.api.v1.commonInfo.entity.CrawlingNews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CrawlingNewsRepositoryCustom {
    Page<CrawlingNews> searchNews(String country, String start, String end, String searchKeyWord, Pageable pageable);
}
