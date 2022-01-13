package io.vengine.api.v1.user.mapper;

import io.vengine.api.common.enums.UserStatus;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.companyInfo.dto.CompanyBizDto;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.user.dto.CompanyDto;
import io.vengine.api.v1.user.dto.JoinRequestDto;
import io.vengine.api.v1.user.dto.UserDto;
import io.vengine.api.v1.user.entity.*;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT,
        uses = {CommonMapper.class, CompanyMapper.class, DepartmentMapper.class})
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mappings({
            @Mapping(target = "userId", source = "id"),
            @Mapping(target = "userName", source = "fullName"),
            @Mapping(target = "email", source = "email"),
            @Mapping(target = "manager", source = "manager"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "level", source = "levelId"),
            @Mapping(target = "menuType", source = "menuType"),
            @Mapping(target = "company", source = "compId"),
            @Mapping(target = "termsAgree", source = "termsAgree"),
            @Mapping(target = "officePhone", source = "officePhone"),
            @Mapping(target = "mobilePhone", source = "mobilePhone"),
            @Mapping(target = "createData", source = "createdAt"),
            @Mapping(target = "updateData", source = "updatedAt"),
    })
    UserDto.UserInfo toUserInfoDTO(User user);

    @Mappings({
            @Mapping(target = "userLevelId", source = "id"),
            @Mapping(target = "userLevelName", source = "name")
    })
    UserDto.UserLevel toUserLevelDTO(UserLevel level);

    List<UserDto.UserLevel> toUserLevelDTO(List<UserLevel> level);

    List<UserDto.UserInfo> toUserInfoDTO(List<User> user);

    @Mappings({
            @Mapping(target = "menuType", source = "commonBizType"),
            @Mapping(target = "termsAgree", ignore = true),
            @Mapping(target = "id", ignore = true),
    })
    User toUser(CompanyDto.CompanySignUp companyRequest);

    @Mappings({
            @Mapping(target = "email", source = "request.email"),
            @Mapping(target = "menuType", source = "typeVendor"),
            @Mapping(target = "id", ignore = true),
    })
    User toUser(CompanyBizDto.NewPartnerRequest request, CommonBasicInfo typeVendor);

    @Mappings({
            @Mapping(target = "fullName", source = "userName"),
            @Mapping(target = "officePhone", source = "officePhone"),
            @Mapping(target = "mobilePhone", source = "mobilePhone"),
            @Mapping(target = "termsAgree", source = "termsAgree"),
            @Mapping(target = "id", ignore = true),
    })
    void toUser(UserDto.UserRequest userRequest, @MappingTarget User user);

    @Mappings({
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    User toUser(TempUser tempUser);

    @Mappings({
            @Mapping(target = "email", source = "userSignUp.email"),
            @Mapping(target = "fullName", source = "userSignUp.name"),
            @Mapping(target = "termsAgree", source = "userSignUp.termsAgree"),
            @Mapping(target = "compId", source = "companyID"),
            @Mapping(target = "deptId", source = "departmentID"),
            @Mapping(target = "menuType", source = "menuTypeID"),
            @Mapping(target = "levelId", source = "userLevel"),
            @Mapping(target = "id", ignore = true),
    })
    User toUser(
            UserDto.UserSignUp userSignUp,
            Long departmentID,
            Long companyID,
            Long menuTypeID,
            UserLevel userLevel,
            String secretKey,
            String userType,
            UserStatus status
    );

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "name", source = "userPersonalPending.user.fullName"),
            @Mapping(target = "email", source = "userPersonalPending.user.email"),
            @Mapping(target = "status", source = "status")
    })
    JoinRequestDto toJoinRequestDTO(UserPersonalPending userPersonalPending);

    List<JoinRequestDto> toJoinRequestDTO(List<UserPersonalPending> userPersonalPendingList);

    @Mappings({
            @Mapping(target = "tempCompany", source = "tempCompany"),
            @Mapping(target = "menuType", source = "user.menuType"),
            @Mapping(target = "termsAgree", source = "user.termsAgree"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "id", ignore = true),
    })
    TempUser toTempUser(User user, TempCompany tempCompany, String status);
}
