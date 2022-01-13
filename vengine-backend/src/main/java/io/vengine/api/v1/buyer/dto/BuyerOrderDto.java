package io.vengine.api.v1.buyer.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BuyerOrderDto {
    private Long id;
    private String documentType;
    private String buyer;
    private String brand;
    private String marketDesc;
    private String poNumber;
    private String assignedOn;
    private String cancelledOn;
    private String acceptedOn;
    private String suspendedOn;
    private String finishedOn;
    private String destinationCountry;
    private String originCountry;
    private String originCity;
    private String issueDate;
    private String cancelAfterDate;
    private String latestDate;
    private String earliestDate;
    private String contractShipCancelDate;
    private String inDcDate;
    private String inStoreDate;
    private String revisionNumber;
    private String currencyCode;
    private String retailSeason;
    private String buildTypeCode;
    private int orderedQuantity;
    private int shipmentQuantity;
    private String incotermCode;
    private Date timestamp;
    private String status;
    private String orderStatusCode;
    private List<BuyerOrderItemDto> items;
}
