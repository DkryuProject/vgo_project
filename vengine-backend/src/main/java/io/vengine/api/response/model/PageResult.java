package io.vengine.api.response.model;

import io.vengine.api.common.dto.CommonDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageResult<T> extends CommonResult {

    private CommonDto.PageDto<T> page;
}
