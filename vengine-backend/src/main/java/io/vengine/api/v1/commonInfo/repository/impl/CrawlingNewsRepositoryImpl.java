package io.vengine.api.v1.commonInfo.repository.impl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQueryFactory;
import io.vengine.api.v1.commonInfo.entity.CrawlingNews;
import io.vengine.api.v1.commonInfo.entity.QCrawlingNews;
import io.vengine.api.v1.commonInfo.repository.CrawlingNewsRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class CrawlingNewsRepositoryImpl extends QuerydslRepositorySupport implements CrawlingNewsRepositoryCustom {
    public CrawlingNewsRepositoryImpl() {
        super(CrawlingNews.class);
    }

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<CrawlingNews> searchNews(String country, String start, String end, String searchKeyWord, Pageable pageable) {
        JPAQueryFactory queryFactory = new JPAQueryFactory(this.getEntityManager());
        BooleanBuilder builder = new BooleanBuilder();
        BooleanBuilder orBuilder = new BooleanBuilder();

        QCrawlingNews news = QCrawlingNews.crawlingNews;

        if(start != null){
            LocalDate startDate = LocalDate.parse(start, DateTimeFormatter.ISO_DATE);
            builder.and(news.createDate.goe(startDate.atStartOfDay()));
        }
        if(end != null){
            LocalDate endDate = LocalDate.parse(end, DateTimeFormatter.ISO_DATE);
            builder.and(news.createDate.loe(LocalDateTime.of(endDate, LocalTime.MAX)));
        }
        if(searchKeyWord != null){
            orBuilder.or(news.headline.contains(searchKeyWord));
            orBuilder.or(news.sentence.contains(searchKeyWord));
            builder.and(orBuilder);
        }
        QueryResults<CrawlingNews> result = queryFactory
                .from(news)
                .select(news)
                .where(news.country.eq(country),
                        news.imageUrl.isNotNull(),
                        builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(news.createDate.desc())
                .fetchResults();

        return new PageImpl<>(result.getResults(), pageable, result.getTotal());
    }
}
