package io.vengine.api.v1.commonInfo.repository;

import io.vengine.api.v1.commonInfo.entity.CrawlingWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CrawlingWordRepository extends JpaRepository<CrawlingWord, LocalDate> {
    List<CrawlingWord> findByCountryAndCreatedDateBetween(String country, LocalDateTime startDate, LocalDateTime endDate);
}
