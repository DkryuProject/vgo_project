package io.vengine.api.v1.commonInfo.repository;

import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommonBasicInfoRepository extends JpaRepository<CommonBasicInfo, Long>, JpaSpecificationExecutor<CommonBasicInfo>, CommonBasicInfoRepositoryCustom {

    List<CommonBasicInfo> findByType(String type);

    List<CommonBasicInfo> findByTypeAndCmName2(String type, String cmName2);

    Optional<CommonBasicInfo> findByTypeAndCmName1(String type, String cmName1);

    List<CommonBasicInfo> findByCmName1(String groupName);

    List<CommonBasicInfo> findByTypeAndCmName6(String type, Long cmName6);

    Optional<CommonBasicInfo> findByTypeAndCmName3(String type, String name3);

    Optional<CommonBasicInfo> findByTypeAndCmName2NotAndCmName3(String type, String name2, String name3);
}
