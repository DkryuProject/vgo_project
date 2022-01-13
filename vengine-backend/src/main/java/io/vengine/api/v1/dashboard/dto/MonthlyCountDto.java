package io.vengine.api.v1.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MonthlyCountDto {
    private String month;

    @JsonProperty("cover_count")
    private Long coverCount;

    @JsonProperty("cbd_option_count")
    private Long cbdOptionCount;

    @JsonProperty("mcl_option_count")
    private Long mclOptionCount;

    @JsonProperty("po_count")
    private OrderCountDto poCount;

    @JsonProperty("adhoc_po_count")
    private OrderCountDto adhocPoCount;

    @JsonProperty("created_po")
    private List<DailyOrderDto> createdOrders;

    @JsonProperty("confirm_po")
    private List<DailyOrderDto> confirmOrders;

    @JsonProperty("revert_po")
    private List<DailyOrderDto> revertOrders;
}
