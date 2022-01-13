package io.vengine.api.v1.commonInfo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.vengine.api.common.dto.CommonDto;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CommonInfoDto extends CommonDto {

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class BasicInfo {
        private Long id;
        private String type;
        private String name1;
        private String name2;
        private String name3;
        private String name4;
        private Long name5;
        private Long name6;
        private String updated;
    }

    @Getter
    @Setter
    public static class BasicInfoRequest {
        private Long id;

        @Size(min=0, max=255)
        private String name1;

        @Size(min=0, max=255)
        private String name2;

        @Size(min=0, max=255)
        private String name3;

        @Size(min=0, max=255)
        private String name4;

        @Digits(integer = 20, fraction = 0)
        private Long name5;

        @Digits(integer = 20, fraction = 0)
        private Long name6;
    }

    @Getter
    @Setter
    public static class MaterialTypeRequest {
        private Long id;

        @Size(min=0, max=100)
        private String typeA;

        @Size(min=0, max=100)
        private String typeB;

        @Size(min=0, max=100)
        private String typeC;
    }

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class MaterialTypeResponse {
        private Long id;
        private String typeA;
        private String typeB;
        private String typeC;
        private CreatedInfo createdInfo;
    }

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SelectBasicInfo {
        private Long id;
        private String name;
    }

    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SizeInfo {
        private Long id;
        private String name;
        private String sizeGroup;
    }
}
