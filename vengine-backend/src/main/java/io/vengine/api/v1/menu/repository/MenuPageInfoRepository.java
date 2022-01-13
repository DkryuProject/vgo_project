package io.vengine.api.v1.menu.repository;

import io.vengine.api.v1.menu.entity.MenuPageInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuPageInfoRepository extends JpaRepository<MenuPageInfo, Long> {
}
