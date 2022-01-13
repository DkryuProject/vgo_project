package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclPreBookingPo;
import io.vengine.api.v1.mcl.entity.MclPreBookingPoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MclPreBookingPoItemRepository extends JpaRepository<MclPreBookingPoItem, Long>, JpaSpecificationExecutor<MclPreBookingPoItem>, MclPreBookingPoItemRepositoryCustom {
    List<MclPreBookingPoItem> findByMclPreBookingPo(MclPreBookingPo mclPreBookingPo);
}
