package io.vengine.api.v1.companyInfo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.vengine.api.common.enums.RelationType;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.*;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompanyBizDto {
    private Long id;
    private RelationType relationType;
    private Long companyID;
    private String companyName;
    private String country;
    private String city;
    private String address;
    private String postalCode;
    private String status;

    @Getter
    @Setter
    public static class BizRelationRequest{
        @NotEmpty(message = "Relation Type이 없습니다.")
        private String relationType;

        @NotNull(message = "선택된 회사가 없습니다.")
        private Long bizCompanyID;
    }

    @Getter
    @Setter
    public static class NewPartnerRequest{
        @NotEmpty(message = "Relation Type이 없습니다.")
        private String relationType;

        @Size(min=0, max=20)
        private String businessNumber;

        @Size(min=0, max=255)
        private String businessFileUrl;

        @Size(min=0, max=100)
        @NotEmpty(message = "회사 이름이 없습니다.")
        private String companyName;

        @NotNull(message = "국가를 선택하세요.")
        private Long countryId;

        @NotNull(message = "도시를 입력하세요.")
        private Long cityId;

        @Size(min=0, max=100)
        private String state;

        @NotBlank(message = "주소를 입력하세요.")
        @Size(min=0, max=200)
        private String etc;

        @NotBlank(message = "우편번호를 입력하세요.")
        @Size(min=0, max=10)
        private String zipCode;

        @Email(message = "이메일 형식이 아닙니다.")
        @NotBlank(message = "이메일이 없습니다.")
        @Size(min=0, max=150)
        private String email;
    }

    @Getter
    @Setter
    public static class BizRelationStatusRequest{
        @NotNull(message = "Biz Relation ID가 없습니다.")
        private Long bizRelationId;

        @NotBlank(message = "상태값을 입력하세요.")
        private String status;

        @NotEmpty(message = "Relation Type이 없습니다.")
        private String relationType;
    }
}
