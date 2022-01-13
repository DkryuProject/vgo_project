package vengine.batchjob.invoice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemDto {
    private Long id;
    private String size;
    private String packInstructionReference;
    private String sku;
    private String pkQty;
}
