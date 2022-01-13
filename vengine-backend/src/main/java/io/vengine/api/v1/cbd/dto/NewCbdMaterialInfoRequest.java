package io.vengine.api.v1.cbd.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.vengine.api.v1.material.dto.MaterialYarnRequest;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class NewCbdMaterialInfoRequest {
    @NotBlank(message = "Material name이 없습니다.")
    @Size(min = 0, max = 100)
    @JsonProperty("item_name")
    private String name;

    @NotNull(message = "회사 ID가 없습니다.")
    private Long supplierId;

    @NotNull(message = "Category를 선택하세요.")
    private Long categoryId;

    @Size(min = 0, max = 200)
    @JsonProperty("item_detail")
    private String subsidiaryDetail;

    @Size(max = 15)
    @JsonProperty("structure")
    private String constructionType;

    @Size(min = 0, max = 100)
    @JsonProperty("usage_type")
    private String usageType;

    @Size(min = 0, max = 100)
    @JsonProperty("sus_eco")
    private String susEco;

    @Size(min = 0, max = 100)
    @JsonProperty("application")
    private String application;

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

    @NotNull(message = "uom is null.")
    private Long uomId;

    @NotNull(message = "Unit Price is empty.")
    @Digits(integer=15, fraction=5)
    private BigDecimal unitPrice;

    private int mcq;

    private int moq;

    @Size(max = 10)
    private String size;

    private Long sizeUomId;

    private String usagePlace;

    @Digits(integer = 3, fraction = 3, message = "정수 3자리, 소숫점 3자리까지입니다.")
    private BigDecimal netYy;

    @Digits(integer = 3, fraction = 2, message = "정수 3자리, 소숫점 2자리까지입니다.")
    private BigDecimal tolerance;

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

    private String sizeMemo;
}
