package io.vengine.api.v1.mcl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.companyInfo.entity.CompanyGarmentSize;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Size;

@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MclCommonDto {
    private Long id;
    private String garmentColor;

    @JsonIgnoreProperties({"createdInfo"})
    private CommonInfoDto.SizeInfo garmentSize;

    @JsonIgnoreProperties({"createdInfo"})
    private CompanyInfoDto.Response garmentMarket;

    private String poGarmentColor;
    private String poGarmentSize;
    private String poGarmentMarket;

    @Getter
    @Setter
    public static class ColorRequest {
        private Long id;

        @Size(min = 0, max = 100)
        private String garmentColor;

        @Size(min = 0, max = 100)
        private String poGarmentColor;
    }

    @Getter
    @Setter
    public static class SizeRequest {
        private Long id;

        private Long garmentSizeId;

        @Size(min = 0, max = 100)
        private String poGarmentSize;
    }

    @Getter
    @Setter
    public static class MarketRequest {
        private Long id;

        private Long garmentMarketId;

        @Size(min = 0, max = 100)
        private String poGarmentMarket;
    }
}
