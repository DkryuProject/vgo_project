package io.vengine.api.v1.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompanyDto {
    private Long companyID;
    private String companyName;
    private String nickName;
    private String LCode;
    private String tax;
    private String ceoName;
    private String businessNumber;
    private String businessFileUrl;
    private String loginString;
    private int status;
    private int termsAgree;
    private int termsAgreeFinal;
    private String midNo;
    private String lorNo;
    private String midMemo;
    private String lorMemo;
    @JsonIgnoreProperties({"type"})
    private CommonInfoDto.BasicInfo bizType;
    private List<Address> addresses;

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Address {
        private Long id;
        @JsonIgnoreProperties({"type"})
        private CommonInfoDto.BasicInfo country;
        @JsonIgnoreProperties({"type"})
        private CommonInfoDto.BasicInfo city;
        private String state;
        private String etc;
        private String zipCode;
        private String status;
        @JsonIgnoreProperties({"type"})
        private CommonInfoDto.BasicInfo bizType;
        private String workPlace;
        private int representitive;
    }

    @Getter
    @Setter
    public static class CompanySignUp {
        private List<String> emails;

        @Size(max=20)
        private String businessNumber;

        @Size(max=255)
        private String businessFileUrl;

        @Size(max=100)
        private String name;

        private int termsAgree;

        private int termsAgreeFinal;

        @NotNull(message = "비즈니스 타입을 선택하세요.")
        private Long commonBizType;

        @NotNull(message = "국가를 선택하세요.")
        private Long countryId;

        private Long cityId;

        @Size(max=100)
        private String state;

        @NotBlank(message = "주소를 입력하세요.")
        @Size(max=200)
        private String etc;

        @NotBlank(message = "우편번호를 입력하세요.")
        @Size(max=10)
        private String zipCode;

        private Long userID;

        private String relationType;
    }

    @Getter
    @Setter
    public static class CompanyRequest {
        @NotNull(message = "Company ID가 없습니다.")
        private Long id;

        @Size(max=6)
        private String LCode;

        @Size(max=100)
        private String nickName;

        @Size(max=20)
        private String businessNumber;

        @Size(max=255)
        private String businessFileUrl;

        @Size(max=100)
        private String midNo;

        @Size(max=100)
        private String lorNo;

        private String midMemo;

        private String lorMemo;

        private int termsAgree;

        private int termsAgreeFinal;

        private List<AddressRequest> companyAddressList;
    }

    @Getter
    @Setter
    public static class AddressRequest {
        private Long id;

        @NotBlank(message = "주소 타이틀을 입력하세요")
        @Size(max=300)
        private String workPlace;

        @NotNull(message = "대표 여부를 확인 부탁드립니다.")
        private int representitive;

        @NotNull(message = "국가를 선택하세요.")
        private Long countryId;

        @NotNull(message = "도시를 입력하세요.")
        private Long cityId;

        @Size(max=100)
        private String state;

        @NotBlank(message = "주소를 입력하세요.")
        @Size(max=200)
        private String etc;

        @NotBlank(message = "우편번호를 입력하세요.")
        @Size(max=10)
        private String zipCode;

        @NotBlank(message = "상태값이 없습니다.")
        @Size(max=10)
        private String status;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SelectCompany {
        private Long companyID;
        private String companyName;
        private String nickName;
        private String code;

        public SelectCompany(Long companyID, String companyName) {
            this.companyID = companyID;
            this.companyName = companyName;
        }
    }
}
