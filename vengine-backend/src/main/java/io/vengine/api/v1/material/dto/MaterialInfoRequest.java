package io.vengine.api.v1.material.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModelProperty;
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
public class MaterialInfoRequest {
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

    @Size(min = 0, max = 255)
    @JsonProperty("usage_type")
    private String usageType;

    @Size(min = 0, max = 255)
    @JsonProperty("sus_eco")
    private String susEco;

    @Size(min = 0, max = 255)
    @JsonProperty("application")
    private String application;

    private List<MaterialYarnRequest> materialYarnRequestList;
}
