package io.vengine.api.v1.supplier.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupplierPoRequest {
    private String poType;

    @NotNull(message = "Published Order 가 없습니다.")
    private Long publishedOrderId;

    @NotNull(message = "PO Confirm 값이 없습니다.")
    private int poConfirm;

    private String revertMemo;
}
