package io.vengine.api.v1.commonInfo.entity;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.sun.xml.fastinfoset.util.StringArray;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "crawling_word")
public class CrawlingWord {
    @Id
    @Column(name = "created_at", unique = true, nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_at")
    private LocalDateTime updatedDate;

    @Column(name = "word_nouns", length = 2000)
    private String wordNouns;

    @Column(name = "country", length = 10, nullable = false)
    private String country;

    @Transient
    private Map<String, Integer> map;

    public Map<String, Integer> getMap() {

        Pattern pattern = Pattern.compile("(?<=[(\\[])[^()\\[\\]]*(?=[)\\]])");
        Matcher m = pattern.matcher(this.wordNouns);
        Map< String, Integer> map = new HashMap<>();
        while (m.find()) {
            String word = m.group();
            String[] wordArray = word.split(",");
            map.put(wordArray[0].replaceAll("[^\\uAC00-\\uD7A30-9a-zA-Z]",""), Integer.valueOf(wordArray[1].trim()));
        }
        return map;
    }
}
