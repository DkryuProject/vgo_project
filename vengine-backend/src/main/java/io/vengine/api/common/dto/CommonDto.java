package io.vengine.api.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.user.entity.User;
import lombok.*;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class CommonDto {

    @Getter
    @Setter
    public static class Search {
        private Map<String, Object> searchFilter;
        private Paging paging;
    }

    @Getter
    @Setter
    public static class Paging {
        private int page;
        private int size;
    }

    @Getter
    @Builder
    public static class UOM {
        private String data;
        private CommonInfoDto.BasicInfo uom;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IdName {
        private Long id;
        private String name;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatedBy {
        private Long userId;
        private String userName;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatedInfo {
        private Long userId;
        private String userName;

        @JsonIgnore
        private String department;
        private String company;
        private LocalDateTime createdDate;
        private LocalDateTime updatedDate;
    }

    @Getter
    @Builder
    public static class Take {
        private Long takeId;
        private String method;
        private String userName;
        private LocalDateTime takeDateTime;
    }

    @Getter
    @Setter
    public static class PageDto<T> {
        private List<T> content;
        private long number;
        private long size;
        private long totalElements;
        private long totalPages;
    }

    public static IdName toIdName (Long id, String name){
        IdName.IdNameBuilder builder = IdName.builder();
        builder.id(id);
        builder.name(name);
        return builder.build();
    }

    public static UOM toUom (String data, CommonBasicInfo uom){
        CommonMapper commonMapper = Mappers.getMapper(CommonMapper.class);
        UOM.UOMBuilder builder = UOM.builder();
        builder.data(data);
        builder.uom(commonMapper.toBasicInfoDto(uom));
        return builder.build();
    }

    public static CreatedInfo toCreatedInfo(User user){
        CreatedInfo.CreatedInfoBuilder builder = CreatedInfo.builder();
        builder.userId(user.getId());
        builder.userName(user.getFullName());
        builder.department(user.getDeptId().getName());
        builder.company(user.getCompId().getName());
        builder.createdDate(user.getCreatedAt());
        builder.updatedDate(user.getUpdatedAt());
        return builder.build();
    }

    public static <T> PageDto<T> toPageDto(Page page, List dtoList){
        PageDto<T> pageDto = new PageDto<>();
        pageDto.setSize(page.getSize());
        pageDto.setNumber(page.getNumber()+1);
        pageDto.setTotalElements(page.getTotalElements());
        pageDto.setTotalPages(page.getTotalPages());
        pageDto.setContent(dtoList);
        return pageDto;
    }

    public static Take toTake(Long takeId, String method, User user){
        if(takeId == null || method == null || user == null){
            return null;
        }
        Take.TakeBuilder takeBuilder= Take.builder();
        takeBuilder.takeId(takeId);
        takeBuilder.method(method);
        takeBuilder.userName(user.getFullName());
        takeBuilder.takeDateTime(LocalDateTime.now());
        return takeBuilder.build();
    }
}
