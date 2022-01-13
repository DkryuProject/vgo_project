package io.vengine.api.v1.companyInfo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyTermsResponse {
    private Long id;

    @JsonIgnoreProperties("updated")
    private CommonInfoDto.BasicInfo documentType;

    @JsonIgnoreProperties("updated")
    private CommonInfoDto.BasicInfo materialType;
    private String terms;

    private String updated;
    private CommonDto.CreatedBy createdInfo;
}
