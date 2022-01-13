package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.buyer.entity.BuyerOrderItem;
import io.vengine.api.v1.mcl.entity.MclOption;
import io.vengine.api.v1.mcl.entity.MclPreBookingPo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface MclPreBookingPoRepository extends JpaRepository<MclPreBookingPo, Long>, JpaSpecificationExecutor<MclPreBookingPo> {
    List<MclPreBookingPo> findByMclOption(MclOption mclOption);
}
