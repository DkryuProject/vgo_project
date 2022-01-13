package io.vengine.api.v1.companyInfo.dto;

import io.vengine.api.common.dto.CommonDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyBizRequestDto {
    private Long id;
    //private CompanyBizDto companyBizRelation;
    private CommonDto.IdName requestCompany;
    private CommonDto.IdName responseCompany;
    private int approveStatus;

    private String updated;
    private CommonDto.CreatedBy createdInfo;
}
