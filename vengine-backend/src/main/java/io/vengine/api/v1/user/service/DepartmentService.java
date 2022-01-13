package io.vengine.api.v1.user.service;

import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.Department;


import java.util.List;
import java.util.Optional;

public interface DepartmentService {
    Optional<Department> getId(Long departmentId);

    List<Department> findAllDepartment();

    Department saveDepartment(String name);
}
