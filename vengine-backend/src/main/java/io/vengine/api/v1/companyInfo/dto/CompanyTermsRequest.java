package io.vengine.api.v1.companyInfo.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class CompanyTermsRequest {
    private Long id;

    @NotNull(message = "Document Type is null")
    private Long documentType;

    @NotNull(message = "Material Type is null")
    private Long materialType;

    private String terms;
}
