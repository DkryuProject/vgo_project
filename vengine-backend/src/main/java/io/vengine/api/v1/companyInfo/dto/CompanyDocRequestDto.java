package io.vengine.api.v1.companyInfo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyDocRequestDto {
    private Long commonDocInfoId;

    private String docCode;
}
