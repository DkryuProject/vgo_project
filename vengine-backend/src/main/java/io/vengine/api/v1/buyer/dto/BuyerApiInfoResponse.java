package io.vengine.api.v1.buyer.dto;

import io.vengine.api.v1.user.dto.CompanyDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BuyerApiInfoResponse {
    private Long id;
    private CompanyDto.SelectCompany company;
    private String apiUserId;
    private String accessKeyId;
    private String secretAccessKey;
    private String dataKey;
}
