package io.vengine.api.v1.mcl.dto;

import io.vengine.api.common.dto.CommonDto;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class MclCommentDto {
    @Getter
    @Setter
    public static class Comment {
        private Long id;
        private String remark;
        private String updated;
        private CommonDto.CreatedBy createdBy;
    }

    @Getter
    @Setter
    public static class CommentRequest {
        private Long id;

        @NotNull(message = "Mcl Option ID가 없습니다.")
        private Long mclOptionID;

        @Size(min = 0, max = 255, message = "최대 255자까지 입니다.")
        private String remark;
    }
}
