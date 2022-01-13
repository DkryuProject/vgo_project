package io.vengine.api.v1.buyer.repository.impl;

import io.vengine.api.v1.buyer.entity.BuyerOrderInfo;
import io.vengine.api.v1.buyer.entity.QBuyerOrderInfo;
import io.vengine.api.v1.buyer.enums.EnumOrderStatusCode;
import io.vengine.api.v1.buyer.repository.BuyerOrderInfoRepositoryCustom;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

public class BuyerOrderInfoRepositoryImpl extends QuerydslRepositorySupport implements BuyerOrderInfoRepositoryCustom {

    public BuyerOrderInfoRepositoryImpl() {
        super(BuyerOrderInfo.class);
    }

    @Override
    public String findOrderAcceptedOn() {
        QBuyerOrderInfo buyerOrderInfo = QBuyerOrderInfo.buyerOrderInfo;

        return from(buyerOrderInfo)
                .select(buyerOrderInfo.acceptedOn)
                .limit(1)
                .where(buyerOrderInfo.orderStatusCode.eq(EnumOrderStatusCode.Accepted),
                        buyerOrderInfo.acceptedOn.isNotNull())
                .orderBy(buyerOrderInfo.acceptedOn.desc())
                .fetchOne();
    }

    @Override
    public String findOrderAssignedOn() {
        QBuyerOrderInfo buyerOrderInfo = QBuyerOrderInfo.buyerOrderInfo;

        return from(buyerOrderInfo)
                .select(buyerOrderInfo.assignedOn)
                .limit(1)
                .where(buyerOrderInfo.orderStatusCode.eq(EnumOrderStatusCode.New),
                        buyerOrderInfo.assignedOn.isNotNull())
                .orderBy(buyerOrderInfo.assignedOn.desc())
                .fetchOne();
    }

    @Override
    public String findOrderCancelledOn() {
        QBuyerOrderInfo buyerOrderInfo = QBuyerOrderInfo.buyerOrderInfo;

        return from(buyerOrderInfo)
                .select(buyerOrderInfo.cancelledOn)
                .limit(1)
                .where(buyerOrderInfo.orderStatusCode.eq(EnumOrderStatusCode.Cancelled),
                        buyerOrderInfo.cancelledOn.isNotNull())
                .orderBy(buyerOrderInfo.cancelledOn.desc())
                .fetchOne();
    }
}
