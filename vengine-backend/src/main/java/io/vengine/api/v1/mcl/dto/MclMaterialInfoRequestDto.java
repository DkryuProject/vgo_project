package io.vengine.api.v1.mcl.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class MclMaterialInfoRequestDto {
    private Long materialOfferId;

    private String usagePlace;

    @Digits(integer = 13, fraction = 5, message = "정수 13자리, 소숫점 5자리까지입니다.")
    private BigDecimal unitPrice;

    @Digits(integer = 3, fraction = 3, message = "정수 3자리, 소숫점 3자리까지입니다.")
    private BigDecimal netYy;

    @Digits(integer = 3, fraction = 2, message = "정수 3자리, 소숫점 2자리까지입니다.")
    private BigDecimal tolerance;

    private String itemColor;
    private Long actualColor;
    private String sizeMemo;

    private DependencyInfoRequest colorDependency;
    private DependencyInfoRequest sizeDependency;
    private DependencyInfoRequest marketDependency;

    private Long mclMaterialUomId;

    private String status;

    @Getter
    @Setter
    public static class DependencyInfoRequest {
        private String type;
        private List<Long> ids;
    }
}
