package io.vengine.api.v1.commonInfo.mapper;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.commonInfo.entity.*;
import io.vengine.api.v1.user.entity.User;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CommonMapper {
    CommonMapper INSTANCE = Mappers.getMapper(CommonMapper.class);

    @Mappings({
            @Mapping(target = "type", source = "type"),
            @Mapping(target = "cmName1", source = "request.name1"),
            @Mapping(target = "cmName2", source = "request.name2"),
            @Mapping(target = "cmName3", source = "request.name3"),
            @Mapping(target = "cmName4", source = "request.name4"),
            @Mapping(target = "cmName5", source = "request.name5"),
            @Mapping(target = "cmName6", source = "request.name6"),
            @Mapping(target = "id", ignore = true)
    })
    void toCommonBasicInfo(CommonInfoDto.BasicInfoRequest request, String type, @MappingTarget CommonBasicInfo commonBasicInfo);

    @Mappings({
            @Mapping(target = "categoryA", source = "typeA"),
            @Mapping(target = "categoryB", source = "typeB"),
            @Mapping(target = "categoryC", source = "typeC"),
            @Mapping(target = "id", ignore = true)
    })
    void toMaterialType(CommonInfoDto.MaterialTypeRequest request, @MappingTarget CommonMaterialType commonMaterialType);

    @Mappings({
            @Mapping(target = "name1", source = "cmName1"),
            @Mapping(target = "name2", source = "cmName2"),
            @Mapping(target = "name3", source = "cmName3"),
            @Mapping(target = "name4", source = "cmName4"),
            @Mapping(target = "name5", source = "cmName5"),
            @Mapping(target = "name6", source = "cmName6"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS")
    })
    CommonInfoDto.BasicInfo toBasicInfoDto(CommonBasicInfo commonBasicInfo);

    @Mappings({
            @Mapping(target = "typeA", source = "categoryA"),
            @Mapping(target = "typeB", source = "categoryB"),
            @Mapping(target = "typeC", source = "categoryC"),
    })
    CommonInfoDto.MaterialTypeResponse toCommonMaterialTypeDto(CommonMaterialType commonMaterialType);

    @Mappings({
            @Mapping(target = "userId", source = "user.id"),
            @Mapping(target = "userName", source = "user", qualifiedByName = "setUserName"),
    })
    CommonDto.CreatedBy toCreatedInfo(User user);

    @Mappings({
            @Mapping(target = "name", source = "cmName1")
    })
    CommonDto.IdName toIdName(CommonBasicInfo commonBasicInfo);

    @Mapping(target = "id", source = "id")
    CommonBasicInfo toCommonBasic(Long id);

    @Mapping(target = "id", source = "id")
    CommonMaterialType toCommonMaterialType(Long id);

    List<CommonInfoDto.BasicInfo> toBasicInfoDtos(List<CommonBasicInfo> commonBasicInfos);

    List<CommonInfoDto.MaterialTypeResponse> toCommonMaterialTypeDtos(List<CommonMaterialType> CommonMaterialTypes);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "name", source = "cmName2")
    })
    CommonInfoDto.SelectBasicInfo toSelectBasicInfoDtos(CommonBasicInfo commonBasicInfo);

    List<CommonInfoDto.SelectBasicInfo> toSelectBasicInfoDtos(List<CommonBasicInfo> commonBasicInfos);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "name", source = "cmName2"),
            @Mapping(target = "sizeGroup", source = "cmName1"),
    })
    CommonInfoDto.SizeInfo toSelectSizeDtos(CommonBasicInfo commonBasicInfo);

    List<CommonInfoDto.SizeInfo> toSelectSizeDtos(List<CommonBasicInfo> commonBasicInfos);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "cmName3", source = "name")
    })
    CommonBasicInfo toCommonBasic(CommonInfoDto.IdName idName);

    @Named("setUserName")
    static String setUserName(User user){
        String userName = "-";
        if(user.getFullName() != null){
            userName = user.getFullName();
        }else{
            if(user.getEmail() != null){
                userName = user.getEmail().split("@")[0];
            }
        }

        return userName;
    }
}
