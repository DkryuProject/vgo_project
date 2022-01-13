package io.vengine.api.v1.mcl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.cbd.dto.CbdDto;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;
import java.math.BigInteger;
import java.time.LocalDate;

public class MclPreBookingDto {
    @Getter
    @Setter
    public static class MclPreBooking {
        private Long id;
        private String shipDateFrom;
        private String shipDateTo;
        private BigInteger styleNumber;
        @JsonIgnoreProperties({"createdInfo"})
        private CompanyInfoDto.Response program;
        @JsonIgnoreProperties({"created", "createdBy"})
        private CbdDto.Option cbdOption;
        private String updated;
        private CommonDto.CreatedBy createdBy;
    }

    @Getter
    @Setter
    public static class MclPreBookingRequest {
        @NotNull(message = "Mcl Option Id가 없습니다.")
        private Long mclOptionID;

        @NotEmpty(message = "조건시작일을 입력하세요.")
        private String shipDateFrom;

        @NotEmpty(message = "조건마지막일을 입력하세요.")
        private String shipDateTo;

        @NotNull(message = "스타일 번호를 입력하세요.")
        @PositiveOrZero(message = "음수값은 안됩니다.")
        private BigInteger styleNumber;

        @NotNull(message = "Company Program Id가 없습니다.")
        private Long companyProgramID;

        private Long cbdOptionId;
    }
}
