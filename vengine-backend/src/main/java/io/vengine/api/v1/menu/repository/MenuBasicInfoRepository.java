package io.vengine.api.v1.menu.repository;

import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.menu.entity.MenuBasicInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuBasicInfoRepository extends JpaRepository<MenuBasicInfo, Long> {
    List<MenuBasicInfo> findByCustomId(CommonBasicInfo commonBasicInfo);

    MenuBasicInfo findByMenuName(String menuName);
}
