package io.vengine.api.v1.mcl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.material.dto.MaterialResponse;
import io.vengine.api.v1.user.dto.CompanyDto;
import io.vengine.api.v1.user.dto.UserDto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdhocOrderDto {
    private AdhocOrder adhocOrder;
    private List<AdhocOrderItem> adhocOrderItems;

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AdhocOrder{
        private Long orderID;
        private String poNumber;
        private String status;

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
        private Integer partialShipment;
        private Integer plusTolerance;
        private Integer minusTolerance;
        private String poTerms;

        private int poConfirm;
        private String revertMemo;
        private String itemType;
        private int itemQty;
        private double totalPoAmt;

        private String updated;
        @JsonIgnoreProperties({"menuType", "company", "createData", "updateData", "termsAgree", "level"})
        private UserDto.UserInfo userInfo;
        private String emailSendDate;
        //private CommonDto.CreatedBy createdBy;

        @Getter
        @Setter
        @JsonInclude(JsonInclude.Include.NON_NULL)
        public static class CompanyInfo {
            private Long companyID;
            private String companyName;
            private CompanyDto.Address address;
        }
    }

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AdhocOrderItem{
        private Long itemID;
        private String usagePlace;
        private CompanyInfoDto.Response orderType;

        @JsonIgnoreProperties({"updated","createdBy","requireQty","orderQty","balanceQty"})
        private MaterialResponse.MaterialInfo materialInfo;

        @JsonIgnoreProperties({"updated","createdBy"})
        private MaterialResponse.MaterialOffer materialOffer;

        @JsonIgnoreProperties({"updated"})
        private CommonInfoDto.BasicInfo actualColor;
        private String color;
        private BigDecimal unitPrice;
        private double orderedQty;
        private CommonInfoDto.BasicInfo orderedUom;
    }
}
