package io.vengine.api.v1.menu.mapper;

import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.menu.dto.MMenuDto;
import io.vengine.api.v1.menu.dto.MenuDto;
import io.vengine.api.v1.menu.entity.MenuBasicInfo;
import io.vengine.api.v1.menu.entity.MenuPageInfo;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT,
        uses = {CommonMapper.class})
public interface MenuMapper {
    MenuMapper INSTANCE = Mappers.getMapper(MenuMapper.class);

    @Mappings({
            @Mapping(target = "menu", source = "menuName"),
            @Mapping(target = "MMenus", source = "menuPageInfos", qualifiedByName = "setMMenu"),
    })
    MenuDto toMenuDTO(MenuBasicInfo menuBasicInfo);

    List<MenuDto> toMenuDTO(List<MenuBasicInfo> menuBasicInfos);

    @Named("setMMenu")
    static List<MMenuDto> setMMenu(List<MenuPageInfo> menuPageInfos){
        List<MMenuDto> mMenuList = new ArrayList<>();
        List<String> mMenus =  menuPageInfos
                .stream()
                .sorted(Comparator.comparing(MenuPageInfo::getIdx))
                .map(MenuPageInfo::getMMenu)
                .distinct()
                .collect(Collectors.toList());

        for (String mMenu: mMenus){
            mMenuList.add(
                    MMenuDto.builder().mMenu(mMenu).sMenus(
                            menuPageInfos
                                    .stream()
                                    .filter(item-> item.getMMenu().equals(mMenu))
                                    .filter(Objects::nonNull)
                                    .sorted(Comparator.comparing(MenuPageInfo::getIdx))
                                    .map(MenuPageInfo::getSMenu)
                                    .collect(Collectors.toList())
                    ).build()
            );
        }

        return mMenuList;
    }
}
