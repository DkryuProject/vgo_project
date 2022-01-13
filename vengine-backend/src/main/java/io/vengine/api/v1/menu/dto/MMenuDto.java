package io.vengine.api.v1.menu.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class MMenuDto {
    private String mMenu;
    private List<String> sMenus;
}
