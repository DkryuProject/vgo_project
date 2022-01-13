package io.vengine.api.v1.user.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.user.dto.UserDto;
import io.vengine.api.v1.user.entity.Department;
import io.vengine.api.v1.user.mapper.DepartmentMapper;
import io.vengine.api.v1.user.repository.DepartmentRepository;
import io.vengine.api.v1.user.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Api(tags = {"05. DEPARTMENT"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class DepartmentController {
    private final ResponseService responseService;

    private final DepartmentService departmentService;

    private final DepartmentRepository departmentRepository;

    @ApiOperation(value = "부서 전체 조회", notes = "전체 부서를 조회한다")
    @GetMapping(value = "/departments")
    public ListResult<UserDto.UserDepartment> findAllDepartment(){
        return responseService.getListResult(DepartmentMapper.INSTANCE.toDepartmentDTO(departmentService.findAllDepartment()));
    }

    @ApiOperation(value = "부서 정보 등록", notes = "부서 정보를 등록한다")
    @PostMapping(value = "/department")
    public CommonResult saveDepartment(
            @ApiParam(value = "이름") @RequestParam String name
    )
    {
        departmentService.saveDepartment(name);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "부서 정보 수정", notes = "부서 정보를 수정한다")
    @PutMapping(value = "/department/{id}")
    public CommonResult modifyDepartment(
            @ApiParam(value = "부서 ID") @PathVariable Long id,
            @ApiParam(value = "이름") @RequestParam String name
    )
    {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND));
        department.setName(name);
        departmentRepository.save(department);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "부서 정보 삭제", notes = "부서 정보를 삭제한다")
    @DeleteMapping(value = "/department/{id}")
    public CommonResult deleteDepartment(
            @ApiParam(value = "부서 ID") @PathVariable Long id
    )
    {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND));
        if(department.getUsers().size() > 0){
            throw new BusinessException(ErrorCode.DEPARTMENT_NOT_DELETE);
        }
        departmentRepository.delete(department);
        return responseService.getSuccessResult();
    }
}
