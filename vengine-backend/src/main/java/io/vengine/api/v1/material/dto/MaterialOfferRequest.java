package io.vengine.api.v1.material.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@Getter
@Setter
@ToString
public class MaterialOfferRequest {
    @Size(max = 20, message = "최대 20자리까지 입니다.")
    private String materialNo;

    private Long recipientId;

    private Long buyerId;

    private Long brandId;

    @Size(max = 100)
    private String finishing;

    @Size(max = 100)
    private String dyeing;

    @Size(max = 100)
    private String printing;

    @Digits(integer=13, fraction=2, message = "정수 13자리, 소숫점 2자리까지입니다.")
    private BigDecimal weight;

    private Long weightUomId;

    @Digits(integer=11, fraction=0, message = "정수 11자리까지입니다.")
    private BigDecimal cw;

    private Long cwUomId;

    @NotNull(message = "Offer uom is null.")
    private Long uomId;

    @NotNull(message = "Currency is null.")
    private Long currencyId;

    @NotNull(message = "Unit Price is empty.")
    @Digits(integer=15, fraction=5)
    private BigDecimal unitPrice;

    private int mcq;

    private int moq;

    @Size(max = 10)
    private String size;

    @Size(max = 255)
    private String characteristic;

    @Size(max = 255)
    @JsonProperty("solid_pattern")
    private String solidPattern;

    @Size(max = 255)
    private String function;

    @Size(max = 255)
    private String performance;

    @Size(max = 255)
    private String stretch;

    @Size(max = 100)
    @JsonProperty("lead_time")
    private String leadTime;

    private Long sizeUomId;

    private Integer seasonYear;

    private Long seasonID;

    private Integer fabricFullWidth;

    private Long fullWidthUomId;
}
