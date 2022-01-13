package io.vengine.api.v1.companyInfo.dto;

import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.user.dto.CompanyDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyDocDto {
    private Long id;

    private CompanyDto company;

    private CommonInfoDto.BasicInfo commonDocInfo;

    private String docCode;

    private Integer idx;
}
