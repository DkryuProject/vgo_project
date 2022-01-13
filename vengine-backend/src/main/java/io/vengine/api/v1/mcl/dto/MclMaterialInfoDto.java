package io.vengine.api.v1.mcl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.material.dto.MaterialResponse;
import io.vengine.api.v1.user.dto.CompanyDto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class MclMaterialInfoDto {
    private List<MaterialInfo> fabricMaterialInfos;
    private List<MaterialInfo> trimsMaterialInfos;
    private List<MaterialInfo> accessoriesMaterialInfos;

    @Getter
    @Setter
    public static class MaterialInfo {
        private Long id;
        private String status;

        @JsonIgnoreProperties({"mclCbdAssigns","factoryAlloc","createdBy","created"})
        private MclOptionDto.Option mclOption;

        private String fabricWeight;
        private CommonInfoDto.BasicInfo fabricWeightUom;
        private String fabricCw;
        private CommonInfoDto.BasicInfo fabricCwUom;
        private String supplierMaterial;
        private BigDecimal unitPrice;
        private String usagePlace;
        private BigDecimal netYy;
        private double grossYy;
        private BigDecimal tolerance;

        private DependencyInfo colorDependency;
        private DependencyInfo sizeDependency;
        private DependencyInfo marketDependency;

        @JsonIgnoreProperties({"createdBy","updated","materialOptions"})
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

        private String subsidiaryDetail;
        private String sizeMemo;
        private String fabricColorName;
        private CommonInfoDto.BasicInfo commonActualColor;
        private CommonInfoDto.BasicInfo mclMaterialUom;
        private CompanyDto.SelectCompany supplier;
        private CompanyDto.SelectCompany buyer;
        private CompanyDto.SelectCompany factory;
        private double requireQty;
        private double orderQty;
        private double balanceQty;
        private String useYN;
        private String updated;
        private CommonDto.CreatedBy createdBy;
    }

    @Getter
    @Setter
    public static class DependencyInfo {
        private String type;
        private List<MclCommonDto> infos;
    }
}
