package io.vengine.api.v1.cbd.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CbdOptionSimulationDto {
    private double cost;
    private double targetProfit;
}
