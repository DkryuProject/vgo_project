package io.vengine.api.v1.user.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
public class CompanyRegisterReq {
    @NotNull(message = "비즈니스 타입을 선택하세요.")
    private Long commonBizType;

    @Size(max=100)
    private String name;

    @Size(max=20)
    private String businessNumber;

    @Size(max=255)
    private String businessFileUrl;

    @NotNull(message = "국가를 선택하세요.")
    private Long countryId;

    private Long cityId;

    @NotBlank(message = "주소를 입력하세요.")
    @Size(max=200)
    private String etc;

    @NotBlank(message = "우편번호를 입력하세요.")
    @Size(max=10)
    private String zipCode;

    private int termsAgree;

    private int termsAgreeFinal;
}
