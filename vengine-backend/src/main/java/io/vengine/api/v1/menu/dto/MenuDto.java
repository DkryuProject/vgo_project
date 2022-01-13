package io.vengine.api.v1.menu.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class MenuDto {
    private String menu;
    private List<MMenuDto> MMenus;
}
