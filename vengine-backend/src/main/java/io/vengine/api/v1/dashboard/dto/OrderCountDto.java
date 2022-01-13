package io.vengine.api.v1.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderCountDto {

    private int created;

    //private int canceled;

    //private int published;

    private int confirm;

    private int revert;
}
