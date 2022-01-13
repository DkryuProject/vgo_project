package io.vengine.api.v1.cbd.repository;

import io.vengine.api.v1.cbd.entity.CBDMaterialCosting;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CBDMaterialCostingRepository extends JpaRepository<CBDMaterialCosting, Long>, JpaSpecificationExecutor<CBDMaterialCosting> {

}
