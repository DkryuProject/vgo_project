package vengine.batchjob.po.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderPartyDto {
    private Long id;
    private Long companyID;
    private Long buyerOrderInfoId;
    private String role;
    private String name;
    private String department;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String stateOrProvince;
    private String postalCodeNumber;
    private String countryCode;
}
