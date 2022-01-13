package vengine.batchjob.po.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private String assignedToUserId;
    private String uid;
    private String objectType;
    private String documentType;
    private String documentId;
    private String documentRefNumber;
    private String status;
    private String orderStatusCode;
    private String assignedOn;
    private String cancelledOn;
    private String acceptedOn;
    private String suspendedOn;
    private String finishedOn;
    private String url;
    private String shipmentUrl;
    private String orderClass;
    private String deptName;
    private String deptCode;
    private String destinationCountry;
    private String originCountry;
    private String originCity;
    private String brand;
    private String divisionName;
    private String marketDesc;
    private String marketPONo;
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
    private String shipmentMethodCode;
    private boolean factoryDifferent;
    private int orderedQuantity;
    private int shipmentQuantity;
    private String flag;
    private String incotermCode;
    private Date timestamp;
    private Long companyID;

    List<OrderChangeDescriptionDto> orderChangeDescriptionDtos;
    List<OrderPartyDto> orderPartyDtos;
    List<OrderItemDto> orderItemDtos;

    public OrderDto(Long buyerOrderInfoId) {
        this.id = buyerOrderInfoId;
    }
}
