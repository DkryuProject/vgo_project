package io.vengine.api.v1.supplier.dto;

import lombok.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SupplierPoResponse {
    private PoInfo poInfo;
    private CompanyInfo companyInfo;
    private BuyerInfo buyerInfo;
    private DateInfo dateInfo;
    private ShippingInfo shippingInfo;
    private String poType;
    private BigInteger poConfirm;
    private String revertMemo;
    private String status;
    private String userName;
    private Timestamp updatedAt;

    @AllArgsConstructor
    @Getter
    @Setter
   public static class PoInfo{
       private BigInteger publishOrderId;
       private String poNumber;
       private BigInteger itemQty;
       private String totalAmount;
   }

    @AllArgsConstructor
    @Getter
    @Setter
    public static class CompanyInfo{
        private String purchaser;
        private String shipper;
    }

    @AllArgsConstructor
    @Getter
    @Setter
    public static class BuyerInfo{
        private String brand;
        private String buyer;
        private String designNumber;
        private String styleNumber;
    }

    @AllArgsConstructor
    @Getter
    @Setter
    public static class DateInfo{
        private Date estimatedDate;
        private Date infactoryDate;
    }

    @AllArgsConstructor
    @Getter
    @Setter
    public static class ShippingInfo{
        private String dischargePort;
        private String loadingPort;
        private String shippingMode;
    }

    public SupplierPoResponse(Map<String, Object> map) {
        this.poInfo = new PoInfo((BigInteger) map.get("publishOrderId"), (String) map.get("poNumber"), (BigInteger) map.get("itemQty"), (String) map.get("totalAmount"));
        this.companyInfo = new CompanyInfo((String) map.get("purchaser"), (String) map.get("shipper"));
        this.buyerInfo = new BuyerInfo((String) map.get("brand"), (String) map.get("buyer"), (String) map.get("designNumber"), (String) map.get("styleNumber"));
        this.dateInfo = new DateInfo((Date) map.get("estimatedDate"), (Date) map.get("infactoryDate"));
        this.shippingInfo = new ShippingInfo((String) map.get("dischargePort"), (String) map.get("loadingPort"), (String) map.get("shippingMode"));
        this.poType=(String) map.get("poType");
        this.poConfirm=(BigInteger) map.get("poConfirm");
        this.revertMemo=(String) map.get("revertMemo");
        this.status=(String) map.get("status");
        this.userName=(String) map.get("userName");
        this.updatedAt=(Timestamp) map.get("updatedAt");
    }
}
