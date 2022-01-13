package io.vengine.api.v1.buyer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Optional;

@Getter
@Setter
public class GarmentPoDto {
    private List<OrderSummary> orderSummaries;
    private List<OrderDetail> orderDetails;

    @Getter
    @Setter
    public static class OrderSummary{
        private Long buyerOrderID;
        private String styleNumber;
        private String color;
        private List<SizeQuantity> sizeQuantity;
        private String totalQty;
        private String unitPrice;
        private String amount;
        private String factory;

        @Getter
        @Setter
        @AllArgsConstructor
        public static class SizeQuantity{
            private String size;
            private String qty;
        }
    }

    @Getter
    @Setter
    public static class OrderDetail{
        private Long buyerOrderID;
        private String documentRefNumber;
        private ShippingWindow shippingWindow;
        private String market;
        private String destination;
        private List<OrderSummary> orderSummaries;
        private String factory;

        @Getter
        @Setter
        public static class ShippingWindow{
            private String start;
            private String end;
        }
    }
}
