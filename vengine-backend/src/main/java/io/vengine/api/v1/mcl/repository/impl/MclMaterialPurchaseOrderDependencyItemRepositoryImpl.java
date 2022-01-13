package io.vengine.api.v1.mcl.repository.impl;

import com.querydsl.core.BooleanBuilder;
import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.v1.mcl.dto.MclOrderItemDto;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.mcl.repository.MclMaterialPurchaseOrderDependencyItemRepositoryCustom;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

public class MclMaterialPurchaseOrderDependencyItemRepositoryImpl extends QuerydslRepositorySupport implements MclMaterialPurchaseOrderDependencyItemRepositoryCustom {
    public MclMaterialPurchaseOrderDependencyItemRepositoryImpl() {
        super(MclMaterialPurchaseOrderDependencyItem.class);
    }

    @Override
    public Integer findItemQuantitySum(MclMaterialInfo mclMaterialInfo, MclOrderItemDto.DependencyItem item) {
        BooleanBuilder builder = new BooleanBuilder();
        QMclMaterialPurchaseOrderDependencyItem quantity = QMclMaterialPurchaseOrderDependencyItem.mclMaterialPurchaseOrderDependencyItem;
        QMclMaterialPurchaseOrderItem orderItem = QMclMaterialPurchaseOrderItem.mclMaterialPurchaseOrderItem;
        QMclMaterialPurchaseOrder order = QMclMaterialPurchaseOrder.mclMaterialPurchaseOrder;

        if(item.getColor() != null){
            builder.and(quantity.mclGarmentColor.id.eq(item.getColor().getId()));
        }

        if(item.getSize() != null){
            builder.and(quantity.mclGarmentSize.id.eq(item.getSize().getId()));
        }

        if(item.getMarket() != null){
            builder.and(quantity.mclGarmentMarket.id.eq(item.getMarket().getId()));
        }

        return from(quantity)
                .innerJoin(orderItem).on(quantity.mclMaterialPurchaseOrderItem.id.eq(orderItem.id), orderItem.delFlag.ne("D"))
                .innerJoin(order).on(order.id.eq(orderItem.mclMaterialPurchaseOrder.id),
                        order.delFlag.ne("D"),
                        order.status.in(OrderStatus.Draft, OrderStatus.Published))
                .select(quantity.orderedQty.sum().coalesce(0))
                .where(builder,
                        quantity.delFlag.ne("D"),
                        quantity.mclMaterialInfo.eq(mclMaterialInfo))
                .fetchOne();
    }
}
