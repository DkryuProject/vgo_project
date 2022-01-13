package io.vengine.api.v1.mcl.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class MclOrderRequestDto {
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
    private Long forwarderCompanyAddressID;
    @NotNull(message = "Consignee company is null")
    private Long consigneeCompanyID;
    @NotNull(message = "Consignee company address is null")
    private Long consigneeCompanyAddressID;
    @NotNull(message = "ship To company is null")
    private Long shipToCompanyID;
    @NotNull(message = "ship To company address is null")
    private Long shipToCompanyAddressID;

    private Long incoterms;
    private Long shippingMethod;
    private Long paymentTerm;
    private Long paymentBase;
    private Long paymentPeriod;
    private Long loadingBasicCountry;
    private Long loadingPort;
    private Long dischargeBasicCountry;
    private Long dischargePort;
    private String estimatedDate;
    private String exMill;
    private String infactoryDate;
    private Integer plusTolerance;
    private Integer minusTolerance;
    private Integer partialShipment;
    private String memo;
    private Long currency;
}
