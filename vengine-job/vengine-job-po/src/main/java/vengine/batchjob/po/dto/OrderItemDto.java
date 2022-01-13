package vengine.batchjob.po.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemDto {
    private Long id;
    private Long companyID;
    private String itemUid;
    private String itemTypeCode;
    private Long buyerOrderInfoId;
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
