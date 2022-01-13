package io.vengine.api.v1.cbd.repository;

import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CBDMaterialInfoRepository extends JpaRepository<CBDMaterialInfo, Long>, JpaSpecificationExecutor<CBDMaterialInfo> {
}
