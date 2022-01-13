package io.vengine.api.v1.mcl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.cbd.dto.CbdDto;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class MclCbdAssignDto {
    private Long mclCbdAssignId;

    @JsonIgnoreProperties({"createdBy","created","status"})
    private CbdDto.Option cbdOption;
    private int fabricCheck;
    private int trimsCheck;
    private int accessoriesCheck;
    private String assigned;
    private CommonDto.CreatedBy createdBy;

    @Getter
    @Setter
    public static class CbdAssignRequest {
        private Long mclCbdAssignId;

        @NotNull(message = "Cbd Option ID가 없습니다.")
        private Long cbdOptionID;

        @NotNull(message = "값이 없습니다.")
        @ApiModelProperty(example = "1")
        private int fabricCheck;

        @NotNull(message = "값이 없습니다.")
        @ApiModelProperty(example = "1")
        private int trimsCheck;

        @NotNull(message = "값이 없습니다.")
        @ApiModelProperty(example = "1")
        private int accessoriesCheck;
    }
}
