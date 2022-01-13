package io.vengine.api.v1.mcl.dto;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class MclFactoryAllocDto {
    @Getter
    @Setter
    public static class FactoryAlloc {
        private Long id;
        private CommonInfoDto.BasicInfo commonMaterialProduct;
        private CommonDto.IdName factory;
        private int poTotalQuantity;
        private String updated;
        private CommonDto.CreatedBy createdBy;
    }

    @Getter
    @Setter
    public static class FactoryAllocRequest {
        private Long id;

        @NotNull(message = "Mcl Option Id가 없습니다.")
        private Long mclOptionID;

        @NotNull(message = "생산 공정이 없습니다.")
        private Long commonMaterialProductID;

        @NotNull(message = "공장이 없습니다.")
        private Long factoryID;

        @Digits(integer=15, fraction=2)
        private BigDecimal unitPrice;

        @Digits(integer=11, fraction=0)
        private Integer poTotalQty;
    }
}
