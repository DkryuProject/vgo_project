package io.vengine.api.v1.mcl.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MclOrderQtyRequestDto {
    private List<Qty> qtyList;
    private List<PreMclOrderQty> preMclOrderQtyList;

    @Getter
    @Setter
    public static class Qty {
        private Long id;
        private Long colorId;
        private Long sizeId;
        private Long market;
        private Integer qty;
    }

    @Getter
    @Setter
    public static class PreMclOrderQty {
        private Long id;
    }
}
