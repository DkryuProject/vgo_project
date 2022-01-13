package io.vengine.api.v1.user.mapper;

import io.vengine.api.v1.user.dto.UserDto;
import io.vengine.api.v1.user.entity.Department;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface DepartmentMapper {
    DepartmentMapper INSTANCE = Mappers.getMapper(DepartmentMapper.class);

    @Mappings({
            @Mapping(target = "userDepartmentId", source = "id"),
            @Mapping(target = "userDepartmentName", source = "name")
    })
    UserDto.UserDepartment toDepartmentDTO(Department department);

    List<UserDto.UserDepartment> toDepartmentDTO(List<Department> departments);

    @Mapping(target = "id", source = "id")
    Department toDepartment(Long id);
}
