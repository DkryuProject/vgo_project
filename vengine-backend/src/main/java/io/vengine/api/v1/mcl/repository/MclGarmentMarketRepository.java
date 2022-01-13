package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.companyInfo.entity.CompanyGarmentMarket;
import io.vengine.api.v1.mcl.entity.MclGarmentMarket;
import io.vengine.api.v1.mcl.entity.MclOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MclGarmentMarketRepository extends JpaRepository<MclGarmentMarket, Long>, JpaSpecificationExecutor<MclGarmentMarket> {
    
    List<MclGarmentMarket> findByMclOptionOrderByMarket(MclOption mclOption);

    List<MclGarmentMarket> findByMclOption(MclOption mclOption);

    Optional<MclGarmentMarket> findByMclOptionAndMarket(MclOption mclOption, CompanyGarmentMarket market);
}
