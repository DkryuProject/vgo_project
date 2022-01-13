package io.vengine.api.v1.mcl.dto;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.buyer.dto.BuyerOrderDto;
import io.vengine.api.v1.buyer.dto.BuyerOrderItemDto;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

public class MclAssignedPODto {
    @Getter
    @Setter
    public static class MclAssignedPOResponse {
        private Long assignedPoId;
        private BuyerOrderDto order;
        private List<BuyerOrderItemDto> items;
        private String assigned;
        private CommonDto.CreatedBy createdBy;
    }

    @Getter
    @Setter
    public static class MclAssignedPORequest {
        @NotNull(message = "Mcl Pre Booking ID가 없습니다.")
        private Long mclPreBookingId;

        @NotNull(message = "Order ID가 없습니다.")
        private Long orderId;

        @NotEmpty(message = "Order Item ID가 없습니다.")
        private String orderItems;
    }
}
