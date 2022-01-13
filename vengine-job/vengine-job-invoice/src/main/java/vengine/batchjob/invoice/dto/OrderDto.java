package vengine.batchjob.invoice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDto {
    private Long id;
    private String uid;
    private String documentRefNumber;
    private String shipmentUrl;
    private String finishedOn;
    private String status;
    private String orderStatusCode;
    private int shipmentQuantity;
}
