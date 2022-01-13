package io.vengine.api.v1.mcl.dto;

import io.vengine.api.common.dto.CommonDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MclCoverDto {
    private Long id;
    private String status;
    private String updated;
    private CommonDto.CreatedBy createdBy;
}
