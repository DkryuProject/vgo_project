package io.vengine.api.v1.cbd.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CbdDocumentDto {
    private CbdHeader cbdHeader;
    private List<CbdDetail> cbdDetails;

    @Getter
    @Setter
    public static class CbdHeader{
        private int orderQuantity;
        private BigDecimal finalCost;
        private double profit;
        private double amount;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class CbdDetail{
        private String usage;
        private String millNo;
        private String size;
        private String uom;
        private BigDecimal netYy;
        private BigDecimal loss;
        private BigDecimal unitPrice;
        private double grossYy;
        private double amount;
        private double portion;
        private String supplierName;
    }
}
