package io.vengine.api.v1.buyer.repository;

import io.vengine.api.v1.buyer.entity.BuyerOrderInfo;
import io.vengine.api.v1.buyer.entity.BuyerOrderItem;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.BitSet;
import java.util.List;

public interface BuyerOrderItemRepository extends JpaRepository<BuyerOrderItem, Long>, BuyerOrderItemRepositoryCustom {
    List<BuyerOrderItem> findByBuyerOrderInfo(BuyerOrderInfo toOrder);

    List<BuyerOrderItem> findByStyleNumberAndCompanyID(String styleNumber, Long companyID);

    BuyerOrderItem findByBuyerOrderInfoAndSku(BuyerOrderInfo buyerOrderInfo, String sku);
}
