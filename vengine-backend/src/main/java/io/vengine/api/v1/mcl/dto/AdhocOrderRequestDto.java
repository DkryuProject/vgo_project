package io.vengine.api.v1.mcl.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class AdhocOrderRequestDto {
    private OrderInfo orderInfo;
    private List<OrderItemInfo> orderItemInfos;

    @Getter
    @Setter
    public static class OrderInfo{
        @NotNull(message = "Selling company is null")
        private Long sellingCompanyID;
        @NotNull(message = "Selling company address is null")
        private Long sellingCompanyAddressID;
        /* shipper 삭제
        @NotNull(message = "Shipper company is null")
        private Long shipperCompanyID;
        @NotNull(message = "Shipper company address is null")
        private Long shipperCompanyAddressID;
        */
        private Long forwarderCompanyID;
        private Long forwardCompanyAddressID;
        @NotNull(message = "Consignee company is null")
        private Long consigneeCompanyID;
        @NotNull(message = "Consignee company address is null")
        private Long consigneeCompanyAddressID;
        @NotNull(message = "ship To company is null")
        private Long shipToCompanyID;
        @NotNull(message = "ship To company address is null")
        private Long shipToCompanyAddressID;

        private Long incoterms;
        @NotNull(message = "Ship mode is null")
        private Long shippingMethod;
        private Long paymentTerm;
        private Long paymentBase;
        private Long paymentPeriod;
        private Long loadingBasicCountry;
        private Long loadingPort;
        private Long dischargeBasicCountry;
        private Long dischargePort;
        @NotEmpty(message = "Ship Date is empty")
        private String estimatedDate;
        @NotEmpty(message = "Infactory Date is empty")
        private String infactoryDate;
        @NotEmpty(message = "Infactory Date is empty")
        private String exMill;
        private Integer plusTolerance;
        private Integer minusTolerance;
        private Integer partialShipment;
        private String memo;
        private Long currency;
    }

    @Getter
    @Setter
    public static class OrderItemInfo {
        @NotNull(message = "material info is null")
        private Long materialInfoID;

        @NotNull(message = "material offer is null")
        private Long materialOfferID;

        @NotEmpty(message = "Color is empty")
        private String color;
        private Long actualColor;

        @NotNull(message = "Unit Price is null")
        private BigDecimal unitPrice;

        private double orderedQty;
        @NotNull(message = "Order Uom is null")
        private Long orderUomId;
    }
}
