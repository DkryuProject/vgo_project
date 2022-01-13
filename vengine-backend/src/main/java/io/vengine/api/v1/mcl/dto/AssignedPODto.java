package io.vengine.api.v1.mcl.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class AssignedPODto {
    private Long id;
    private String styleNo;
    private String poNo;
    private String shipStart;
    private String shipEnd;
    private String market;
    private Integer orderQty;
    private BigDecimal orderAmount;
    private Long orderId;
    private String items;
    private String manufacture;
}
