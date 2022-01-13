package io.vengine.api.v1.mcl.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.models.auth.In;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MclOrderQtyDto {
    private List<MclOrderQty> mclOrders;
    private List<TotalQty> preMclOrders;

    @Getter
    @Setter
    public static class Color {
        private Long orderQtyId;
        private MclCommonDto color;
        private Integer qty;
        private Integer orderQty;
    }

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class MclOrderQty {
        private MclCommonDto market;
        private MclCommonDto size;
        private List<Color> colors;
    }

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TotalQty {
        private Long id;
        private MclCommonDto market;
        private MclCommonDto size;
        private MclCommonDto color;
        private Integer total;
    }
}
