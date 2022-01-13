package io.vengine.api.v1.supplier.dto;

import io.vengine.api.common.dto.CommonDto;
import lombok.Data;

@Data
public class SupplierInvoiceResponse {
    private String supplier;
    private String invoiceNo;
    private double amount;
    private int status;
    private String updated;
    private CommonDto.CreatedBy createdBy;
}
