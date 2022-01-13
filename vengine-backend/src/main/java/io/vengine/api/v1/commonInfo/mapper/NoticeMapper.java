package io.vengine.api.v1.commonInfo.mapper;

import io.vengine.api.v1.commonInfo.dto.NoticeRequest;
import io.vengine.api.v1.commonInfo.dto.NoticeResponse;
import io.vengine.api.v1.commonInfo.entity.CommonNotice;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface NoticeMapper {
    NoticeMapper INSTANCE = Mappers.getMapper(NoticeMapper.class);

    @Mappings({
            @Mapping(target = "id", ignore = true)
    })
    CommonNotice toNotice(NoticeRequest noticeRequest);

    @Mappings({
            @Mapping(target = "id", ignore = true)
    })
    void toNotice(NoticeRequest noticeRequest, @MappingTarget CommonNotice commonNotice);

    @Mappings({
            @Mapping(target = "created", source = "createdAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
    })
    NoticeResponse toNoticeDto(CommonNotice commonNotice);

    List<NoticeResponse> toNoticeDto(List<CommonNotice> commonNotices);
}
