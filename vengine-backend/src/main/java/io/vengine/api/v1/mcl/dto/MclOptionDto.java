package io.vengine.api.v1.mcl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.cbd.dto.CbdDto;
import io.vengine.api.v1.user.dto.CompanyDto;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public class MclOptionDto {
    @Getter
    @Setter
    public static class Option {
        private Long id;
        private String name;

        @JsonIgnoreProperties({"createdBy","created"})
        private List<MclCbdAssignDto> mclCbdAssigns;

        @JsonIgnoreProperties({"addresses"})
        private CompanyDto factory;
        private String pcdDate;
        private String status;
        private MclAmount mclAmount;
        private String useYN;
        private String updated;
        private CommonDto.CreatedBy createdBy;
    }

    @Getter
    @Setter
    public static class MclAmount {
        private double requiredTotalAmount;
        private double issuedTotalAmount;
    }

    @Getter
    @Setter
    public static class MclOptionRequest {
        @Size(min = 0, max = 100, message = "최대 100자까지 입니다.")
        private String name;

        @NotNull(message = "Mcl Cover ID가 없습니다.")
        private Long mclCoverID;

        @NotNull(message = "Factory ID가 없습니다.")
        private Long factoryID;

        private String pcdDate;

        @NotNull(message = "상태값은 필수 입니다.")
        @Pattern(regexp = "(^[A-Z]*$)", message = "대문자가 아닙니다.")
        @ApiModelProperty(example = "OPEN")
        private String status;
    }
}
