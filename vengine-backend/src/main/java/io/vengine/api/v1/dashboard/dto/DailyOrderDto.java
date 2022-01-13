package io.vengine.api.v1.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class DailyOrderDto {
    @JsonProperty("order_id")
    private Long orderID;
    @JsonProperty("po_number")
    private String poNumber;
    private String type;
    private LocalDateTime date;
}
