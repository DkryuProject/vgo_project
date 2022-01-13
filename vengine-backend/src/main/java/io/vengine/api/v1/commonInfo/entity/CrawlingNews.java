package io.vengine.api.v1.commonInfo.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "crawling_news")
public class CrawlingNews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "article_num", length = 10, nullable = false)
    private String articleNum;

    @Column(name = "country", length = 10, nullable = false)
    private String country;

    //카테고리
    @Column(name = "category_name", length = 100)
    private String categoryName;

    //언론사
    @Column(name = "outlets", length = 100)
    private String outlets;

    //기자, 기자메일, 소속, 출처 등등
    @Column(name = "reporter", length = 200)
    private String reporter;

    //타이틀
    @Column(name = "headline", length = 200)
    private String headline;

    //내용
    @Column(name = "sentence", columnDefinition="TEXT")
    private String sentence;

    //이미지 url
    @Column(name = "image_url", length = 255)
    private String imageUrl;

    //기사 url
    @Column(name = "content_url", length = 255)
    private String contentUrl;

    @CreatedDate
    @Column(name = "create_date")
    private LocalDateTime createDate;
}
