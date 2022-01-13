package io.vengine.api.v1.material.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.material.dto.MaterialResponse;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.material.service.MaterialService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;

@Api(tags = {"11. MATERIAL YARN"}, consumes = "application/json")
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MaterialYarnController {
    private final ResponseService responseService;

    @Autowired
    MaterialService materialService;

    @ApiOperation(value = "Material Yarn MaterialInfoId로 조회", notes = "MaterialInfoId로 Material Yarn을 조회한다")
    @GetMapping(value = "/material/yarn/{materialInfoId}")
    public ListResult<MaterialResponse.MaterialYarn> findYarnByMaterialId(
            @ApiParam(value = "Material Info ID", required = true) @PathVariable Long materialInfoId,
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(
                MaterialMapper.INSTANCE.toMaterialYarnDto(
                        materialService.findYarnByMaterialId(materialInfoId, user)
                )
        );
    }

    @ApiOperation(value = "Material Chief Content 조회", notes = "Material Chief Content를 조회한다")
    @GetMapping(value = "/material/chief-contents")
    public ListResult<CommonInfoDto.BasicInfo> findChiefContents(
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(CommonMapper.INSTANCE.toBasicInfoDtos(materialService.findChiefContents(user)));
    }

    @ApiOperation(value = "Material Yarn 삭제", notes = "Material Yarn를 삭제상태로 업데이트 한다")
    @DeleteMapping(value = "/material/yarn")
    @Transactional
    public CommonResult deleteYarn(
            @RequestBody List<Long> ids,
            @AuthenticationPrincipal User user
    ){
        for (Long id : ids){
            materialService.deleteFlagUpdateMaterialYarn(id, user);
        }
        return responseService.getSuccessResult();
    }
}
