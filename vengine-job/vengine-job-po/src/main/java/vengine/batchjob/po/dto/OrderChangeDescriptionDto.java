package vengine.batchjob.po.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderChangeDescriptionDto {
    private Long id;
    private String text;
    private Long buyerOrderInfoId;
}
