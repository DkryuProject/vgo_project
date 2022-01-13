package io.vengine.api.v1.buyer.repository.impl;

import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import io.vengine.api.v1.buyer.dto.MappedOrderDto;
import io.vengine.api.v1.buyer.entity.BuyerOrderItem;
import io.vengine.api.v1.buyer.entity.QBuyerOrderInfo;
import io.vengine.api.v1.buyer.entity.QBuyerOrderItem;
import io.vengine.api.v1.buyer.entity.QBuyerOrderParty;
import io.vengine.api.v1.buyer.enums.EnumOrderStatusCode;
import io.vengine.api.v1.buyer.enums.EnumRole;
import io.vengine.api.v1.buyer.repository.BuyerOrderItemRepositoryCustom;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.mcl.entity.MclPreBooking;
import io.vengine.api.v1.mcl.entity.QMclPreBookingPo;
import io.vengine.api.v1.mcl.entity.QMclPreBookingPoItem;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class BuyerOrderItemRepositoryImpl extends QuerydslRepositorySupport implements BuyerOrderItemRepositoryCustom {
    public BuyerOrderItemRepositoryImpl() {
        super(BuyerOrderItem.class);
    }

    @Override
    public List<MappedOrderDto> findMappedPO(MclPreBooking mclPreBooking) {
        QBuyerOrderInfo order = QBuyerOrderInfo.buyerOrderInfo;
        QBuyerOrderItem item = QBuyerOrderItem.buyerOrderItem;
        QMclPreBookingPo preBookingPo = QMclPreBookingPo.mclPreBookingPo;
        QMclPreBookingPoItem preBookingPoItem = QMclPreBookingPoItem.mclPreBookingPoItem;
        QBuyerOrderParty buyerOrderParty = QBuyerOrderParty.buyerOrderParty;
        QBuyerOrderItem a = new QBuyerOrderItem("a");

        return from(item)
                .select(
                        Projections.bean(MappedOrderDto.class,
                                item.styleNumber.as("styleNo"),
                                order.documentRefNumber.as("poNo"),
                                order.earliestDate.as("shipStart"),
                                order.latestDate.as("shipEnd"),
                                order.marketDesc.as("market"),
                                order.orderedQuantity.as("orderQty"),
                                ExpressionUtils.as(
                                        JPAExpressions.select(a.totalPrice.castToNum(BigDecimal.class).sum())
                                                .from(a)
                                                .where(a.buyerOrderInfo.eq(order.buyerOrderInfo)),
                                        "orderAmount"),
                                ExpressionUtils.as(
                                        JPAExpressions.select(buyerOrderParty.name)
                                                .from(buyerOrderParty)
                                                .where(buyerOrderParty.buyerOrderInfo.eq(order),
                                                        buyerOrderParty.role.eq(EnumRole.Factory)),
                                        "manufacture"),
                                order.id.as("orderId"),
                                Expressions.stringTemplate("group_concat({0})", item.id).as("itemIds")
                        ))
                .innerJoin(item.buyerOrderInfo, order)
                .where(item.styleNumber.eq(String.valueOf(mclPreBooking.getStyleNumber())),
                        order.earliestDate.goe(mclPreBooking.getShipDateFrom().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))),
                        order.latestDate.loe(mclPreBooking.getShipDateTo().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))),
                        order.buildTypeCode.eq(mclPreBooking.getCompanyGarmentProgram().getName()),
                        order.orderStatusCode.eq(EnumOrderStatusCode.Accepted),
                        order.orderClass.notIn("PO Summary"),
                        item.id.notIn(
                                JPAExpressions
                                        .select(preBookingPoItem.buyerOrderItem.id)
                                        .from(preBookingPoItem)
                                        .innerJoin(preBookingPoItem.mclPreBookingPo, preBookingPo)
                                        .where(preBookingPo.mclPreBooking.id.eq(mclPreBooking.getId())
                                                , preBookingPo.delFlag.eq("N"))
                        )
                )
                .groupBy(item.styleNumber,
                        order.documentRefNumber,
                        order.earliestDate,
                        order.latestDate,
                        order.marketDesc,
                        order.id,
                        order.orderedQuantity
                )
                .fetch();
    }

    @Override
    public List<BuyerOrderItem> findByCbdCover(CBDCover cover) {
        QBuyerOrderItem item = QBuyerOrderItem.buyerOrderItem;
        QMclPreBookingPoItem preBookingPoItem = QMclPreBookingPoItem.mclPreBookingPoItem;
        QMclPreBookingPo preBookingPo = QMclPreBookingPo.mclPreBookingPo;
        return from(item)
                    .innerJoin(preBookingPoItem).on(preBookingPoItem.buyerOrderItem.eq(item))
                    .innerJoin(preBookingPo).on(preBookingPo.id.eq(preBookingPoItem.mclPreBookingPo.id), preBookingPo.mclOption.in(cover.getMclCover().getMclOptions()))
                    .where(item.isNotNull())
                    .fetch();
    }
}
