package io.vengine.api.v1.mcl.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;

@Getter
@Setter
public class MclPurchaseOrderOptionRequest {
    @Pattern(regexp = "(Upcharge|Discount on Sale)")
    private String name;
    @Pattern(regexp = "(Num|Percentage)")
    private String type;
    @Digits(integer=12, fraction=2)
    private BigDecimal value;
}
