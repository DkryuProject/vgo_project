package io.vengine.api.v1.supplier.dto;

import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SupplierPoItemResponse {
    private Long materialOfferID;
    private String category;
    private String materialNo;
    private String itemName;
    private String itemDetail;
    private CommonInfoDto.BasicInfo uom;
}
