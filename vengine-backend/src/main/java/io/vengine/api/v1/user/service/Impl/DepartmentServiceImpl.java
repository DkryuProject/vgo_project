package io.vengine.api.v1.user.service.Impl;

import io.vengine.api.v1.user.entity.Department;
import io.vengine.api.v1.user.repository.DepartmentRepository;
import io.vengine.api.v1.user.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    DepartmentRepository departmentRepository;

    @Override
    public Optional<Department> getId(Long departmentId) {
        return departmentRepository.findById(departmentId);
    }

    @Override
    public List<Department> findAllDepartment() {
        return departmentRepository.findAll();
    }

    @Override
    public Department saveDepartment(String name) {
        Department department = new Department();
        department.setName(name);
        return departmentRepository.save(department);
    }

}
