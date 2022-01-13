package io.vengine.api.v1.commonInfo.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class NoticeRequest {
    @NotNull(message = "Category is null")
    private int category;

    @NotEmpty(message = "Event is empty")
    private String event;

    @NotEmpty(message = "Detail is empty")
    private String detail;

    private int status;
}
