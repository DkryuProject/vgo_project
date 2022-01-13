package io.vengine.api.v1.supplier.dto;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Data
public class SupplierInvoiceRequest {
    private InvoiceHeader invoiceHeader;
    private List<InvoiceItem> invoiceItemList;

    @Valid
    @Data
    public class InvoiceHeader {
        @NotNull(message = "Supplier ID is null.")
        private Long supplierID;
        @NotEmpty(message = "Invoice No is Empty.")
        private String invoiceNo;
        @NotEmpty(message = "Issue Date is Empty.")
        private String issueDate;
        @NotEmpty(message = "Payment Date is Empty.")
        private String paymentDueDate;
        @NotNull(message = "Currency ID is null.")
        private Long currencyID;
        private int status;
        private String comments ;
    }

    @Valid
    @Data
    public class InvoiceItem {
        @NotEmpty(message = "Design number is Empty.")
        private String designNumber ;
        @NotEmpty(message = "Size group number is Empty.")
        private String sizeGroupNumber;
        @NotNull(message = "Material offer is null.")
        private Long materialOfferID;
        private String hsCode ;
        private String invoiceColor ;
        private String invoiceTipColor ;
        @NotNull(message = "Invoice uom ID is null.")
        private Long invoiceUomID;
        @NotNull(message = "Price is null.")
        private BigDecimal unitPrice;
        @NotNull(message = "Quantity is null.")
        private BigDecimal totalQuantity;
        @NotNull(message = "Amount is null.")
        private BigDecimal totalAmount;
        @NotEmpty(message = "Order index is Empty.")
        private String orderIdx ;
        private List<ItemSizeInfo> sizeInfos;

        @Valid
        @Data
        public class ItemSizeInfo {
            private String sizeName;
            private Integer sizeQty ;
        }
    }
}
