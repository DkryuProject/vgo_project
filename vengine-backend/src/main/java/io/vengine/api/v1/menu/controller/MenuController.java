package io.vengine.api.v1.menu.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.menu.dto.MenuDto;
import io.vengine.api.v1.menu.entity.MenuBasicInfo;
import io.vengine.api.v1.menu.mapper.MenuMapper;
import io.vengine.api.v1.menu.repository.MenuBasicInfoRepository;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Api(tags = {"06. MENU"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MenuController {
    private final ResponseService responseService;

    @Autowired
    CommonService commonService;

    @Autowired
    MenuBasicInfoRepository menuBasicInfoRepository;

    @ApiOperation(value = "메뉴 타입별 조회", notes = "메뉴 타입별로 조회한다")
    @GetMapping(value = "/menu/my/{menuTypeId}")
    public ListResult<MenuDto> findMyMenuByMenuType(
            @ApiParam(value = "메뉴 타입 ID", required = true) @PathVariable Long menuTypeId,
            @AuthenticationPrincipal User user
    ) {
        List<MenuBasicInfo> menuBasicInfos =
                menuBasicInfoRepository.findByCustomId(commonService.findBasicInfoById(menuTypeId))
                .stream()
                .sorted(Comparator.comparing(MenuBasicInfo::getId))
                .collect(Collectors.toList());

        if(menuBasicInfos.size() == 0){
            throw new BusinessException(ErrorCode.MENU_NOT_FOUND);
        }

        if("System".equals(user.getLevelId().getName())){
            menuBasicInfos.add(menuBasicInfoRepository.findByMenuName("DATABASE"));
        }

        List<MenuDto> menuDtos = MenuMapper.INSTANCE.toMenuDTO(menuBasicInfos);

        return responseService.getListResult(menuDtos);
    }
}
