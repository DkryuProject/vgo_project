package io.vengine.api.v1.buyer.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MappedOrderDto {
    private String styleNo;
    private String poNo;
    private String shipStart;
    private String shipEnd;
    private String market;
    private Integer orderQty;
    private BigDecimal orderAmount;
    private Long orderId;
    private Long mclPreBookingId;
    private String manufacture;
    private String itemIds;
}
