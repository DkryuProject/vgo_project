package io.vengine.api.v1.cbd.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModelProperty;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.material.dto.MaterialResponse;
import io.vengine.api.v1.mcl.dto.MclCoverDto;
import lombok.*;

import javax.validation.constraints.*;
import java.math.BigDecimal;

public class CbdDto extends CommonDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Cover {
        private Long coverId;
        private IdName buyer;
        private IdName brand;
        private CommonInfoDto.BasicInfo gender;

        @JsonIgnoreProperties({"createdInfo"})
        private CommonInfoDto.MaterialTypeResponse materialCategory;
        private CompanyInfoDto.Response season;
        private int seasonYear;
        private CompanyInfoDto.Response orderType;
        private String designNumber;
        private String cbdName;
        private CommonInfoDto.BasicInfo garmentCategory;
        private String imagPath;
        private CommonInfoDto.BasicInfo commonCurrency;

        @JsonIgnoreProperties({"created", "createdBy"})
        private MclCoverDto mclCover;
        private String status;
        private String useYN;
        private String updated;
        private CreatedBy createdBy;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Option {
        private Long optionId;
        private String name;
        private BigDecimal finalCost;
        private BigDecimal targetProfit;
        private double profit;
        private int goodsQuantity;
        private String status;
        private ItemPortion itemPortion;
        private String useYN;
        private String updated;
        private CreatedBy createdBy;
    }

    @Getter
    @Setter
    public static class ItemPortion {
        private double fabric;
        private double trim;
        private double accessories;
        private double direct;
        private double indirect;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CbdCosting {
        private Long cbdCostingId;
        private String type;
        @JsonIgnoreProperties({"createdInfo"})
        private CompanyInfoDto.Response companyCost;
        private BigDecimal costValue;
        private double amount;
        private String valueKind;
        private String updated;
        private CreatedBy createdBy;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CbdMaterialInfo {
        private Long cbdMaterialInfoId;
        @JsonIgnoreProperties({"createdBy","created"})
        private Option cbdOption;
        private String type;
        private String fabricWeight;
        private CommonInfoDto.BasicInfo fabricWeightUom;
        private String fabricCw;
        private CommonInfoDto.BasicInfo fabricCwUom;
        private String supplierMaterial;
        private BigDecimal unitPrice;
        private String usagePlace;
        private BigDecimal netYy;
        private BigDecimal tolerance;
        private double grossYy;
        private double amount;
        private CommonInfoDto.BasicInfo cbdMaterialUom;

        @JsonIgnoreProperties({"createdBy","updated"})
        private MaterialResponse.MaterialInfo materialInfo;

        @JsonProperty("material_offer_uom")
        private CommonInfoDto.BasicInfo offerUom;

        private String materialAfterManufacturingDyeing;
        private String materialAfterManufacturingFashion;
        private String materialAfterManufacturingFinishing;
        private String subsidiarySize;
        private CommonInfoDto.BasicInfo subsidiarySizeUom;
        private String characteristic;
        @JsonProperty("solid_pattern")
        private String solidPattern;
        private String function;
        private String performance;
        private String stretch;
        @JsonProperty("lead_time")
        private String leadTime;
        private String sizeMemo;

        private String subsidiaryDetail;
        private String useYN;
        private String updated;
        private CreatedBy createdBy;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoverRequest {
        private Long coverId;

        @NotNull(message = "Byuer를 선택하세요.")
        private Long companyId;

        @NotNull(message = "Brand를 선택하세요.")
        private Long vendorBrandId;

        @NotNull(message = "Gender를 선택하세요.")
        private Long commonGenderId;

        @NotNull(message = "Category를 선택하세요.")
        private Long materialCategoryId;

        @NotNull(message = "Season을 선택하세요.")
        private Long seasonId;

        @PositiveOrZero(message = "음수값은 안됩니다.")
        @NotNull(message = "년도를 입력하세요")
        private int seasonYear;

        @NotNull(message = "Order Type을 선택하세요")
        private Long commonOrderTypeId;

        @Size(min=0, max=50, message = "최대 50자까지 입니다.")
        @NotEmpty(message = "Design Number를 입력하세요.")
        private String designNumber;

        @NotBlank(message = "CBD명을 입력하세요.")
        @Size(min=0, max=50, message = "최대 50자입니다.")
        private String cbdName;

        @NotNull(message = "Gament 종류를 선택하세요.")
        private Long commonGarmentCategoryId;

        @NotNull(message = "통화를 선택하세요.")
        private Long commonCurrencyId;

        @NotNull(message = "상태값은 필수 입니다.")
        @Pattern(regexp = "(^[A-Z]*$)", message = "대문자가 아닙니다.")
        @ApiModelProperty(example = "OPEN")
        private String status;
    }


    @Getter
    @Setter
    public static class OptionRequest {
        private Long optionId;

        @NotBlank(message = "CBD OPTION명을 입력하세요.")
        @Size(min=0, max=100, message = "최대 100자까지 입니다.")
        private String name;

        @Digits(integer=8, fraction=2, message = "정수 8자리, 소숫점 2자리까지 입니다.")
        private BigDecimal finalCost;

        @Digits(integer=3, fraction=2, message = "정수 3자리, 소숫점 2자리까지 입니다.")
        private BigDecimal profitCost;

        @PositiveOrZero(message = "음수값은 안됩니다.")
        private int goodsQuantity;

        @NotNull(message = "CBD Cover ID는 필수 입니다.")
        private Long cbdCoverId;

        @NotNull(message = "상태값은 필수 입니다.")
        @Pattern(regexp = "(^[A-Z]*$)", message = "대문자가 아닙니다.")
        @ApiModelProperty(example = "OPEN")
        private String status;
    }

    @Getter
    @Setter
    public static class CbdCostingRequest {
        private Long cbdCostingId;

        @NotNull(message = "CBD Option ID는 필수 입니다.")
        private Long cbdOptionId;

        @NotNull(message = "Company Cost ID는 필수 입니다.")
        private Long companyCostId;

        @Digits(integer=13, fraction=2, message = "정수 13자리, 소숫점 2자리까지 입니다.")
        private BigDecimal costValue;

        @Size(min=0, max=20, message = "최대 20자까지 입니다.")
        @NotBlank(message = "value 값이 없습니다.")
        @ApiModelProperty(example = "PERCENT")
        private String valueKind;

        @Size(min=0, max=20, message = "최대 20자까지 입니다.")
        @NotBlank(message = "타입이 없습니다.")
        @ApiModelProperty(example = "direct")
        private String type;
    }

    @Getter
    @Setter
    public static class CbdMaterialInfoRequest {
        private String usagePlace;

        @Digits(integer = 13, fraction = 5, message = "정수 13자리, 소숫점 5자리까지입니다.")
        private BigDecimal unitPrice;

        @Digits(integer = 3, fraction = 3, message = "정수 3자리, 소숫점 3자리까지입니다.")
        private BigDecimal netYy;

        @Digits(integer = 3, fraction = 2, message = "정수 3자리, 소숫점 2자리까지입니다.")
        private BigDecimal tolerance;

        private String sizeMemo;

        private Long uomId;

        private Long materialOfferId;
    }
}
