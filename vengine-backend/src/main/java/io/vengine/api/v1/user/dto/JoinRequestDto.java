package io.vengine.api.v1.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class JoinRequestDto {
    private Long id;
    private String name;
    private String email;
    private String status;
}
