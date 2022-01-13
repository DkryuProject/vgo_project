package io.vengine.api.v1.buyer.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class BuyerApiInfoRequest {

    @NotNull
    private Long companyID;

    @NotEmpty
    private String apiUserId;

    @NotEmpty
    private String accessKeyId;

    @NotEmpty
    private String secretAccessKey;

    @NotEmpty
    private String dataKey;
}
