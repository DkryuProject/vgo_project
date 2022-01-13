package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.mcl.entity.MclCbdAssign;
import io.vengine.api.v1.mcl.entity.MclOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MclCbdAssignRepository extends JpaRepository<MclCbdAssign, Long>, JpaSpecificationExecutor<MclCbdAssign> {

    MclCbdAssign findByMclOptionAndCbdOption(MclOption mclOption, CBDOption toOption);
}
