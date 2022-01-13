package io.vengine.api.v1.buyer.repository;

import io.vengine.api.v1.buyer.entity.BuyerOrderInfo;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BuyerOrderInfoRepository extends JpaRepository<BuyerOrderInfo, Long>, BuyerOrderInfoRepositoryCustom, JpaSpecificationExecutor<BuyerOrderInfo> {
    BuyerOrderInfo findByCompanyIDAndDocumentRefNumber(Long companyID, String documentRefNumber);
}
