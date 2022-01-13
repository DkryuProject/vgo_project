package io.vengine.api.v1.mcl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.vengine.api.common.enums.DependencyType;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class MclDocumentDto {
    private MclHeader mclHeader;
    private List<MclDetail> mclDetails;

    @Getter
    @Setter
    public static class MclHeader{
        private double orderQuantity;
        private String co;
        private String manufacture;
        private LocalDate pcdDate;
        private List<String> destinations;
    }

    @Getter
    @Setter
    public static class MclDetail{
        @JsonProperty("usage_supplier")
        private UsageSupplier usageSupplier;
        @JsonProperty("item_name")
        private ItemName itemName;
        @JsonProperty("item_color_size")
        private ItemColorSize itemColorSize;
        @JsonProperty("item_detail")
        private ItemDetail itemDetail;
        @JsonProperty("yardage_yield")
        private YardageYield yardageYield;
        @JsonProperty("quantity_info")
        private QuantityInfo qtyInfo;
        private String uom;
        private MclDependency dependency;

        @Getter
        @Setter
        public static class UsageSupplier {
            private String usage;
            @JsonProperty("supplier_name")
            private String supplierName;
        }

        @Getter
        @Setter
        public static class YardageYield {
            private BigDecimal net;
            private BigDecimal loss;
            private double gross;
        }

        @Getter
        @Setter
        public static class QuantityInfo {
            @JsonProperty("require_qty")
            private int requireQty;
            @JsonProperty("order_qty")
            private int orderQty;
            @JsonProperty("balance_qty")
            private int balanceQty;
        }

        @Getter
        @Setter
        public static class MclDependency {
            private DependencyType color;
            private DependencyType size;
            private DependencyType market;
        }

        @Getter
        @Setter
        public static class ItemName {
            @JsonIgnoreProperties({"id"})
            private CommonInfoDto.MaterialTypeResponse category;
            @JsonProperty("item_name")
            private String name;
            @JsonProperty("material_no")
            private String materialNo;
        }

        @Getter
        @Setter
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        public static class ItemDetail {
            @JsonProperty("item_detail")
            private String itemDetail;
            @JsonProperty("contents")
            private String content;
            private String construction;
            private String cw;
            private String weight;
            private String finishing;
            private String dyeing;
            private String printing;
            private String characteristic;
            @JsonProperty("solid_pattern")
            private String solidPattern;
            private String function;
            private String performance;
            private String stretch;
            private String leadTime;
        }

        @Getter
        @Setter
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        public static class ItemColorSize {
            @JsonProperty("item_color")
            private String color;
            @JsonProperty("actual_color")
            private String actualColor;
            @JsonProperty("item_size")
            private String size;
            @JsonProperty("item_size_uom")
            private String sizeUom;
        }
    }
}
