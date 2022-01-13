package io.vengine.api.v1.buyer.repository;

import io.vengine.api.v1.buyer.entity.BuyerApiInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuyerApiInfoRepository extends JpaRepository<BuyerApiInfo, Long> {
}
