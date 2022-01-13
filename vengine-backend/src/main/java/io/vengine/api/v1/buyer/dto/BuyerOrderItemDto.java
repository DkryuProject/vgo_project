package io.vengine.api.v1.buyer.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BuyerOrderItemDto {
    private Long id;
    private String styleNumber;
    private String color;
    private String prepackType;
    private String fullCartonIndicator;
    private String pricePerUnit;
    private String qty;
    private String pkQty;
    private String qtyPerInnerPack;
    private String qtyPerOuterPack;
    private String size;
    private String totalPrice;
    private String sku;
    private String line;
    private String packInstructionReference;
    private String description;
}
