package io.vengine.api.v1.mcl.repository.impl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import io.vengine.api.v1.buyer.entity.QBuyerOrderItem;
import io.vengine.api.v1.buyer.entity.QBuyerOrderParty;
import io.vengine.api.v1.buyer.enums.EnumOrderStatusCode;
import io.vengine.api.v1.buyer.enums.EnumRole;
import io.vengine.api.v1.mcl.dto.AssignedPODto;
import io.vengine.api.v1.mcl.entity.MclPreBookingPoItem;
import io.vengine.api.v1.mcl.entity.QMclOption;
import io.vengine.api.v1.mcl.entity.QMclPreBookingPo;
import io.vengine.api.v1.mcl.entity.QMclPreBookingPoItem;
import io.vengine.api.v1.mcl.repository.MclPreBookingPoItemRepositoryCustom;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.math.BigDecimal;
import java.util.List;

public class MclPreBookingPoItemRepositoryImpl extends QuerydslRepositorySupport implements MclPreBookingPoItemRepositoryCustom {

    public MclPreBookingPoItemRepositoryImpl() {
        super(MclPreBookingPoItem.class);
    }

    @Override
    public List<String> findItemColors(Long mclOptionId) {
        QMclPreBookingPo preBookingPo = QMclPreBookingPo.mclPreBookingPo;
        QMclPreBookingPoItem preBookingPoItem = QMclPreBookingPoItem.mclPreBookingPoItem;
        QBuyerOrderItem buyerOrderItem = QBuyerOrderItem.buyerOrderItem;
        QMclOption mclOption = QMclOption.mclOption;

        return from(preBookingPoItem)
                    .innerJoin(preBookingPoItem.buyerOrderItem, buyerOrderItem)
                    .innerJoin(preBookingPoItem.mclPreBookingPo, preBookingPo)
                    .innerJoin(preBookingPo.mclOption, mclOption).on(mclOption.id.eq(mclOptionId))
                    .select(buyerOrderItem.color)
                    .distinct()
                    .where(preBookingPo.delFlag.ne("D") ,buyerOrderItem.color.isNotNull())
                    .orderBy(buyerOrderItem.color.desc())
                    .fetch();
    }

    @Override
    public List<String> findItemSizes(Long mclOptionId) {
        QMclPreBookingPo preBookingPo = QMclPreBookingPo.mclPreBookingPo;
        QMclPreBookingPoItem preBookingPoItem = QMclPreBookingPoItem.mclPreBookingPoItem;
        QBuyerOrderItem buyerOrderItem = QBuyerOrderItem.buyerOrderItem;
        QMclOption mclOption = QMclOption.mclOption;

        return from(preBookingPoItem)
                .innerJoin(preBookingPoItem.buyerOrderItem, buyerOrderItem)
                .innerJoin(preBookingPoItem.mclPreBookingPo, preBookingPo)
                .innerJoin(preBookingPo.mclOption, mclOption).on(mclOption.id.eq(mclOptionId))
                .select(buyerOrderItem.size)
                .distinct()
                .where(preBookingPo.delFlag.ne("D") ,buyerOrderItem.size.isNotNull())
                .orderBy(buyerOrderItem.size.desc())
                .fetch();
    }

    @Override
    public List<AssignedPODto> findMclPreBookingPoByMclOption(Long mclOptionId) {
        QMclPreBookingPoItem item = QMclPreBookingPoItem.mclPreBookingPoItem;
        QMclPreBookingPo po = QMclPreBookingPo.mclPreBookingPo;
        QBuyerOrderItem a = new QBuyerOrderItem("a");
        QBuyerOrderParty buyerOrderParty = QBuyerOrderParty.buyerOrderParty;

        return from(item)
                    .select(
                        Projections.bean(AssignedPODto.class,
                                item.buyerOrderItem.styleNumber.as("styleNo"),
                                po.buyerOrderInfo.documentRefNumber.as("poNo"),
                                po.buyerOrderInfo.earliestDate.as("shipStart"),
                                po.buyerOrderInfo.latestDate.as("shipEnd"),
                                po.buyerOrderInfo.marketDesc.as("market"),
                                po.buyerOrderInfo.orderedQuantity.as("orderQty"),
                                //po.buyerOrderInfo.totalMerchandiseAmount.as("orderAmount"),
                                ExpressionUtils.as(
                                        JPAExpressions.select(a.totalPrice.castToNum(BigDecimal.class).sum())
                                                .from(a)
                                                .where(a.buyerOrderInfo.eq(po.buyerOrderInfo)),
                                        "orderAmount"),
                                po.buyerOrderInfo.id.as("orderId"),
                                ExpressionUtils.as(
                                        JPAExpressions.select(buyerOrderParty.name)
                                                .from(buyerOrderParty)
                                                .where(buyerOrderParty.buyerOrderInfo.eq(po.buyerOrderInfo),
                                                        buyerOrderParty.role.eq(EnumRole.Factory)),
                                        "manufacture"),
                                po.id.as("id"),
                                Expressions.stringTemplate("group_concat({0})", item.buyerOrderItem.id).as("items")
                        ))
                    .innerJoin(item.mclPreBookingPo, po)
                    .where(po.mclOption.id.eq(mclOptionId),
                            po.buyerOrderInfo.orderStatusCode.eq(EnumOrderStatusCode.Accepted),
                            po.buyerOrderInfo.orderClass.notIn("PO Summary"),
                            po.delFlag.ne("D"))
                    .groupBy( item.buyerOrderItem.styleNumber,
                            po.buyerOrderInfo.documentRefNumber,
                            po.buyerOrderInfo.earliestDate,
                            po.buyerOrderInfo.latestDate,
                            po.buyerOrderInfo.marketDesc,
                            po.buyerOrderInfo.orderedQuantity,
                            po.buyerOrderInfo.id,
                            po.id)
                    .fetch();
    }
}
