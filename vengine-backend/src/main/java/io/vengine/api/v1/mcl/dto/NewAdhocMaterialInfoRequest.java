package io.vengine.api.v1.mcl.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModelProperty;
import io.vengine.api.v1.material.dto.MaterialYarnRequest;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class NewAdhocMaterialInfoRequest {
    @NotBlank(message = "Material name이 없습니다.")
    @Size(min = 0, max = 100)
    @JsonProperty("item_name")
    private String name;

    @NotBlank(message = "Type을 입력하세요.")
    @ApiModelProperty(example = "fabric")
    @Size(min = 0, max = 20)
    private String type;

    @NotNull(message = "회사 ID가 없습니다.")
    private Long supplierId;

    @NotNull(message = "Category를 선택하세요.")
    private Long categoryId;

    @Size(max = 15)
    @JsonProperty("structure")
    private String constructionType;

    @Size(max = 15)
    private String yarnSizeWrap;

    @Size(max = 15)
    private String yarnSizeWeft;

    @Digits(integer=3, fraction=0)
    private int constructionEpi;

    @Digits(integer=3, fraction=0)
    private int constructionPpi;

    @Digits(integer=5, fraction=1)
    private BigDecimal shrinkagePlus;

    @Digits(integer=5, fraction=1)
    private BigDecimal shrinkageMinus;

    @Size(min = 0, max = 200)
    @JsonProperty("item_detail")
    private String subsidiaryDetail;

    private List<MaterialYarnRequest> materialYarnRequestList;

    @Size(max = 20)
    private String materialNo;

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

    @Size(max = 10)
    private String size;

    private Long sizeUomId;

    @Size(min = 0, max = 100)
    @JsonProperty("usage_type")
    private String usageType;

    @Size(min = 0, max = 100)
    @JsonProperty("sus_eco")
    private String susEco;

    @Size(min = 0, max = 100)
    @JsonProperty("application")
    private String application;

    @Size(max = 100)
    private String characteristic;

    @Size(max = 100)
    @JsonProperty("solid_pattern")
    private String solidPattern;

    @Size(max = 100)
    private String function;

    @Size(max = 100)
    private String performance;

    @Size(max = 10)
    private String stretch;

    @Size(max = 10)
    @JsonProperty("lead_time")
    private String leadTime;

    private Integer seasonYear;

    private Long seasonID;

    private Integer fabricFullWidth;

    private Long fullWidthUomId;

    private int mcq;

    private int moq;
}
