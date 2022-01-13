package io.vengine.api.v1.companyInfo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.service.EnumValue;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

public class CompanyInfoDto extends CommonDto {

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Response {
        private Long id;
        private String name;
        private String code;
        private String type;
        private IdName buyerCompany;
        private String buyerNickname;
        private String buyerCode;
        private IdName subsidiaryCompany;
        private String subsidiaryNickname;
        private String subsidiaryCode;
        private IdName forwarderCompany;

        @JsonIgnoreProperties({"type"})
        private CommonInfoDto.BasicInfo originCountry;

        @JsonIgnoreProperties({"type"})
        private CommonInfoDto.BasicInfo originPort;
        private String originLocode;

        @JsonIgnoreProperties({"type"})
        private CommonInfoDto.BasicInfo destinationCountry;

        @JsonIgnoreProperties({"type"})
        private CommonInfoDto.BasicInfo destinationPort;
        private String destinationLocode;

        @JsonIgnoreProperties({"type"})
        private CommonInfoDto.BasicInfo garmentCategory;
        private String sizeGroup;

        @JsonIgnoreProperties({"type"})
        private CommonInfoDto.BasicInfo gender;

        private IdName brandCompany;
        private CommonInfoDto.BasicInfo incoterms;
        private CommonInfoDto.BasicInfo payment;
        private IdName paymentPeriod;
        private IdName paymentBase;
        private IdName accounteeCompany;

        @JsonIgnoreProperties({"createdInfo"})
        private IdName market;

        @JsonIgnoreProperties({"companyBuyer","createdInfo"})
        private List<BuyerDeduction> buyerDeduction;

        private IdName forwarder;
        private BigDecimal buyerPlusTolerance;
        private BigDecimal buyerMinusTolerance;
        private String updated;
        private CreatedBy createdInfo;
    }

    @Getter
    @Builder
    public static class BuyerDeduction {
        private Long id;
        private Long companyBuyer;

        @JsonIgnoreProperties({"createdInfo"})
        private String companyIndirectCost;
        private CommonInfoDto.BasicInfo cmUom;
        private BigDecimal value;
        private CreatedInfo createdInfo;
    }

    @Getter
    @Setter
    public static class Request {
        private Long id;

        @Size(min=0, max=11)
        private Integer type;

        @Size(min = 0, max = 100)
        private String name;

        @Size(min = 0, max = 100)
        private String sizeName;

        private CommonBasicInfo garmentCategory;

        @Size(min = 0, max = 200)
        private String sizeGroup;
    }

    @Getter
    @Setter
    public static class RelationRequest {
        private Long id;

        private IdName buyerCompany;

        @Size(min = 1, max = 100)
        private String buyerNickname;

        @Size(min = 1, max = 10, message = "코드를 1~10 사이로 입력하세요")
        private String buyerCode;

        private IdName subsidiaryCompany;

        @Size(min = 1, max = 100)
        private String subsidiaryNickname;

        @Size(min = 1, max = 10, message = "코드를 1~10 사이로 입력하세요")
        private String subsidiaryCode;
    }

    @Getter
    @Setter
    public static class BuyerRequest {
        private Long id;

        @NotNull(message = "Brand를 선택하세요")
        private IdName brandCompany;

        @NotNull(message = "선적 조건을 선택하세요")
        private IdName cmIncoterms;

        @NotNull(message = "결제 조건을 선택하세요")
        private IdName cmPayment;

        private IdName accounteeCompany;

        private IdName companyGarmentMarket;

        @NotNull(message = "포워드 회사를 선택하세요")
        private IdName forwarderCompany;

        @NotNull(message = "바이어(브랜드) 플러스 허용 선적 수량을 입력하세요")
        @Digits(integer = 3, fraction = 2)
        private BigDecimal buyerPlusTolerance;

        @NotNull(message = "바이어(브랜드) 마이너스 허용 선적 수량을 입력하세요")
        @Digits(integer = 3, fraction = 2)
        private BigDecimal buyerMinusTolerance;
    }
}
