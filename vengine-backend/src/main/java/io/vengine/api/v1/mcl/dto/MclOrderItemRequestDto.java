package io.vengine.api.v1.mcl.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

@Getter
@Setter
public class MclOrderItemRequestDto {
    @Digits(integer=13, fraction=2)
    private BigDecimal exchangeRate;
    @Valid
    private List<MclPurchaseOrderOptionRequest> orderOption;
    @Valid
    private List<ItemRequest> orderItemList;

    @Getter
    @Setter
    public static class SampleOrderRequest {
        private Integer preProductionQty;
        private Long preProductionUom;
        @Digits(integer=13, fraction=2)
        private BigDecimal preProductionUnitPrice;
        private Integer advertisementQty;
        private Long advertisementUom;
        @Digits(integer=13, fraction=2)
        private BigDecimal advertisementUnitPrice;
    }

    @Getter
    @Setter
    public static class ItemRequest {
        private Long OrderItemId;
        @Digits(integer=13, fraction=2)
        private BigDecimal unitPrice;
        private Integer purchaseQty;
        private Long orderedAdjUomID;
        private SampleOrderRequest sampleOrder;
        private List<DependencyItemRequest> dependencyItems;
        //단위변환 수치값 추가
        @Digits(integer=10, fraction=4)
        private BigDecimal fromToUom;
    }

    @Getter
    @Setter
    public static class ItemMatchingRequest {
        private List<BigInteger> styleNumbers;
        private Long mclMaterialInfoID;
        private List<DependencyItemRequest> dependencyItems;
    }

    @Getter
    @Setter
    public static class DependencyItemRequest {
        private Long dependencyItemId;
        private Long marketId;
        private Long colorId;
        private Long sizeId;
        private Integer purchaseQty;
        private Long orderedUomId;
    }
}
