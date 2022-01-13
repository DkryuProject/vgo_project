package io.vengine.api.v1.buyer.repository;

import io.vengine.api.v1.buyer.entity.BuyerOrderInfo;
import io.vengine.api.v1.buyer.entity.BuyerOrderParty;
import io.vengine.api.v1.buyer.enums.EnumRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuyerOrderPartyRepository extends JpaRepository<BuyerOrderParty, Long> {
    BuyerOrderParty findByBuyerOrderInfoAndRole(BuyerOrderInfo toOrder, EnumRole factory);
}
