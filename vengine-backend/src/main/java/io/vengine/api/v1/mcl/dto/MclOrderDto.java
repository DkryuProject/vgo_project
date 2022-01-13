package io.vengine.api.v1.mcl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.user.dto.CompanyDto;
import io.vengine.api.v1.user.dto.UserDto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class MclOrderDto {
    private Order order;
    private List<Integer> styleNumbers;
    private Integer itemQty;
    private Integer totalPoQty;
    private Integer totalPoAmt;
    private String emailSendDate;

    @Getter
    @Setter
    public static class Order {
        private Long orderID;
        private String poNumber;
        private String status;
        private String designNumber;

        private CompanyInfo buyer;
        private CompanyInfo brand;
        private CompanyInfo purchaser;
        private CompanyInfo supplier;
        private CompanyInfo consignee;
        //private CompanyInfo shipper;
        private CompanyInfo forwarder;
        private CompanyInfo shipTo;

        private CommonInfoDto.BasicInfo incoterms;
        private CommonInfoDto.BasicInfo shippingMethod;
        private CommonInfoDto.BasicInfo paymentTerm;
        private CommonInfoDto.BasicInfo paymentBase;
        private CommonInfoDto.BasicInfo paymentPeriod;
        private CommonInfoDto.BasicInfo loadingBasicCountry;
        private CommonInfoDto.BasicInfo loadingPort;
        private CommonInfoDto.BasicInfo dischargeBasicCountry;
        private CommonInfoDto.BasicInfo dischargePort;
        private CommonInfoDto.BasicInfo currency;

        private String estimatedDate;
        private String infactoryDate;
        private String exMill;
        private String memo;
        private String userName;
        private Integer partialShipment;
        private Integer plusTolerance;
        private Integer minusTolerance;
        private String poTerms;

        private Qty order;
        private Qty advertisement;

        private String revertMemo;

        private String updated;
        @JsonIgnoreProperties({"menuType", "company", "createData", "updateData", "termsAgree", "level"})
        private UserDto.UserInfo userInfo;
        //private CommonDto.CreatedBy createdBy;
    }

    @Getter
    @Setter
    public static class CompanyInfo {
        private Long companyID;
        private String companyName;
        private CompanyDto.Address address;
    }

    @Getter
    @Setter
    public static class Qty {
        private Integer qty;
        private CommonInfoDto.BasicInfo uom;
        private CommonInfoDto.BasicInfo orderType;
    }

    @Getter
    @Setter
    public static class PurchaseOrderOption {
        private String name;
        private String type;
        private BigDecimal value;
    }
}
