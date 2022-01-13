package vengine.batchjob.po.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BuyerApiInfoDto {
    private Long company;
    private String apiUserId;
    private String accessKeyId;
    private String secretAccessKey;
    private String dataKey;
}
