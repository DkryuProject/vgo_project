package io.vengine.api.v1.mcl.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MclOrderDetailDto {
    private MclOrderDto.Order order;
    private MclOrderItemDto orderItem;
}
