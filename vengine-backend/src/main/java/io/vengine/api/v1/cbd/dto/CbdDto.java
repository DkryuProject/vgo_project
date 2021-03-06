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

        @NotNull(message = "Byuer??? ???????????????.")
        private Long companyId;

        @NotNull(message = "Brand??? ???????????????.")
        private Long vendorBrandId;

        @NotNull(message = "Gender??? ???????????????.")
        private Long commonGenderId;

        @NotNull(message = "Category??? ???????????????.")
        private Long materialCategoryId;

        @NotNull(message = "Season??? ???????????????.")
        private Long seasonId;

        @PositiveOrZero(message = "???????????? ????????????.")
        @NotNull(message = "????????? ???????????????")
        private int seasonYear;

        @NotNull(message = "Order Type??? ???????????????")
        private Long commonOrderTypeId;

        @Size(min=0, max=50, message = "?????? 50????????? ?????????.")
        @NotEmpty(message = "Design Number??? ???????????????.")
        private String designNumber;

        @NotBlank(message = "CBD?????? ???????????????.")
        @Size(min=0, max=50, message = "?????? 50????????????.")
        private String cbdName;

        @NotNull(message = "Gament ????????? ???????????????.")
        private Long commonGarmentCategoryId;

        @NotNull(message = "????????? ???????????????.")
        private Long commonCurrencyId;

        @NotNull(message = "???????????? ?????? ?????????.")
        @Pattern(regexp = "(^[A-Z]*$)", message = "???????????? ????????????.")
        @ApiModelProperty(example = "OPEN")
        private String status;
    }


    @Getter
    @Setter
    public static class OptionRequest {
        private Long optionId;

        @NotBlank(message = "CBD OPTION?????? ???????????????.")
        @Size(min=0, max=100, message = "?????? 100????????? ?????????.")
        private String name;

        @Digits(integer=8, fraction=2, message = "?????? 8??????, ????????? 2???????????? ?????????.")
        private BigDecimal finalCost;

        @Digits(integer=3, fraction=2, message = "?????? 3??????, ????????? 2???????????? ?????????.")
        private BigDecimal profitCost;

        @PositiveOrZero(message = "???????????? ????????????.")
        private int goodsQuantity;

        @NotNull(message = "CBD Cover ID??? ?????? ?????????.")
        private Long cbdCoverId;

        @NotNull(message = "???????????? ?????? ?????????.")
        @Pattern(regexp = "(^[A-Z]*$)", message = "???????????? ????????????.")
        @ApiModelProperty(example = "OPEN")
        private String status;
    }

    @Getter
    @Setter
    public static class CbdCostingRequest {
        private Long cbdCostingId;

        @NotNull(message = "CBD Option ID??? ?????? ?????????.")
        private Long cbdOptionId;

        @NotNull(message = "Company Cost ID??? ?????? ?????????.")
        private Long companyCostId;

        @Digits(integer=13, fraction=2, message = "?????? 13??????, ????????? 2???????????? ?????????.")
        private BigDecimal costValue;

        @Size(min=0, max=20, message = "?????? 20????????? ?????????.")
        @NotBlank(message = "value ?????? ????????????.")
        @ApiModelProperty(example = "PERCENT")
        private String valueKind;

        @Size(min=0, max=20, message = "?????? 20????????? ?????????.")
        @NotBlank(message = "????????? ????????????.")
        @ApiModelProperty(example = "direct")
        private String type;
    }

    @Getter
    @Setter
    public static class CbdMaterialInfoRequest {
        private String usagePlace;

        @Digits(integer = 13, fraction = 5, message = "?????? 13??????, ????????? 5?????????????????????.")
        private BigDecimal unitPrice;

        @Digits(integer = 3, fraction = 3, message = "?????? 3??????, ????????? 3?????????????????????.")
        private BigDecimal netYy;

        @Digits(integer = 3, fraction = 2, message = "?????? 3??????, ????????? 2?????????????????????.")
        private BigDecimal tolerance;

        private String sizeMemo;

        private Long uomId;

        private Long materialOfferId;
    }
}
