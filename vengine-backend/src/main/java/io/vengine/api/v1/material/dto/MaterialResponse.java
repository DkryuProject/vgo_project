package io.vengine.api.v1.material.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class MaterialResponse {
    private MaterialInfo materialInfo;
    private List<MaterialOffer> materialOffers;

    @Getter
    @Setter
    public static class MaterialInfo {
        private Long id;
        @JsonProperty("item_name")
        private String name;

        @JsonIgnoreProperties({"createdInfo"})
        private CommonInfoDto.MaterialTypeResponse category;

        private List<MaterialYarn> fabricContents;

        private String type;
        @JsonProperty("structure")
        private String constructionType;
        private String yarnSizeWrap;
        private String yarnSizeWeft;
        private int constructionEpi;
        private int constructionPpi;
        private BigDecimal shrinkagePlus;
        private BigDecimal shrinkageMinus;
        @JsonProperty("item_detail")
        private String subsidiaryDetail;
        @JsonProperty("usage_type")
        private String usageType;
        @JsonProperty("sus_eco")
        private String susEco;
        private String application;
        private CommonDto.IdName supplier;
        private String imagePath;
        private String useYN;
        private String updated;
        private CommonDto.CreatedBy createdBy;
    }

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public static class MaterialYarn {
        private Long id;
        private CommonDto.IdName contents;
        private BigDecimal rate;
    }

    @Getter
    @Setter
    public static class MaterialOffer {
        private Long id;
        private String originalMaterialNo;
        private String materialNo;
        private CommonDto.IdName recipient;
        private CommonDto.IdName brand;
        private CommonDto.IdName buyer;
        private BigDecimal unitPrice;
        private String characteristic;
        @JsonProperty("solid_pattern")
        private String solidPattern;
        private String function;
        private String performance;
        private String stretch;
        @JsonProperty("lead_time")
        private String leadTime;
        private int mcq;
        private int moq;
        private CommonInfoDto.BasicInfo uom;
        private CommonInfoDto.BasicInfo currency;
        private ItemOption itemOption;
        private ItemSizeOption itemSizeOption;
        @JsonProperty("season_year")
        private Integer seasonYear;
        @JsonIgnoreProperties({"updated","createdInfo"})
        private CompanyInfoDto.Response season;
        private Integer fabricFullWidth;
        private CommonInfoDto.BasicInfo fullWidthUom;
        private String updated;
        private CommonDto.CreatedBy createdBy;
        private CommonDto.IdName deputyCompany;
        private String useYN;
    }

    @Getter
    @Setter
    public static class ItemOption {
        private String dyeing;
        private String printing;
        private String finishing;
        private BigDecimal weight;
        private CommonInfoDto.BasicInfo weightUom;
        private BigDecimal cw;
        private CommonInfoDto.BasicInfo cwUom;
    }

    @Getter
    @Setter
    public static class ItemSizeOption {
        private String size;
        private CommonInfoDto.BasicInfo sizeUom;
    }
}
