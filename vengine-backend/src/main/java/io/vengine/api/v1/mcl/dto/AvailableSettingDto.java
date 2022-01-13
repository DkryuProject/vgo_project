package io.vengine.api.v1.mcl.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AvailableSettingDto {
    private AvailableItem color;
    private AvailableItem size;
    private AvailableItem market;

    @Getter
    @Setter
    public static class AvailableItem {
        private int itemCount;
        private String ItemName;
    }
}
