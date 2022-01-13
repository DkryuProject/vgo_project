package io.vengine.api.v1.material.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Getter
@Setter
public class MaterialYarnRequest {
    @NotNull(message = "원사 ID가 없습니다.")
    private Long contentsId;

    @NotNull(message = "비율이 없습니다.")
    @Digits(integer=5, fraction=2)
    private BigDecimal rate;
}
