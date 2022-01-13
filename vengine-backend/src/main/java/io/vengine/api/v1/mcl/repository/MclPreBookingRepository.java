package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclOption;
import io.vengine.api.v1.mcl.entity.MclPreBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MclPreBookingRepository extends JpaRepository<MclPreBooking, Long>, JpaSpecificationExecutor<MclPreBooking> {
    List<MclPreBooking> findByMclOption(MclOption mclOption);
}
