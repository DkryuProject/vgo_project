package io.vengine.api.v1.mcl.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class MclOrderQtyOptionDto {
    private Long id;
    private Integer registerOption;
    private BigDecimal increaseQuantityPercent;
}
