package io.vengine.api.v1.mcl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.user.dto.CompanyDto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class MclOrderItemDto {
    private BigDecimal exchangeRate;
    private List<MclOrderDto.PurchaseOrderOption> option;
    private List<OrderItem> orderItemList;

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class OrderItem {
        private Long itemID;
        private String designNumber;
        private CompanyDto.SelectCompany brand;
        @JsonIgnoreProperties({"updated","createdBy"})
        private CompanyInfoDto.Response season;
        private int seasonYear;
        private CompanyInfoDto.Response orderType;
        private List<Integer> styleNumbers;
        private CommonInfoDto.BasicInfo currency;
        @JsonIgnoreProperties({"updated","createdBy","requireQty","orderQty","balanceQty"})
        private MclMaterialInfoDto.MaterialInfo mclMaterialInfo;
        private BigDecimal unitPrice;
        private BigDecimal fromToUom;
        private double requiredQty;
        private double issuedQty;
        private double balanceQty;
        private double purchaseQty;
        private CommonInfoDto.BasicInfo orderedUom;
        private CommonInfoDto.BasicInfo orderedAdjUom;
        private SampleOrder sampleOrder;
        private List<DependencyItem> dependencyItemList;
    }

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class DependencyItem {
        private Long id;
        private MclCommonDto market;
        private MclCommonDto color;
        private MclCommonDto size;
        private double requireQty;
        private double orderQty;
        private double balanceQty;
        private double purchaseQty;
        private CommonInfoDto.BasicInfo orderedUom;
    }

    @Getter
    @Setter
    public static class SampleOrder {
        private Integer preProductionQty;
        private CommonInfoDto.BasicInfo preProductionUom;
        private BigDecimal preProductionUnitPrice;
        private CommonInfoDto.BasicInfo preProductionOrderType;
        private Integer advertisementQty;
        private CommonInfoDto.BasicInfo advertisementUom;
        private BigDecimal advertisementUnitPrice;
        private CommonInfoDto.BasicInfo advertisementOrderType;
    }
}
