package io.vengine.api.v1.commonInfo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NoticeResponse {
    private Long id;

    private int category;

    private String event;

    private String detail;

    private int status;

    private String created;

    private String updated;
}
