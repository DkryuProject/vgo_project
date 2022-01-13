package io.vengine.api.v1.mcl.repository.impl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import io.vengine.api.v1.buyer.entity.QBuyerOrderItem;
import io.vengine.api.v1.mcl.dto.MclCommonDto;
import io.vengine.api.v1.mcl.dto.MclOrderItemDto;
import io.vengine.api.v1.mcl.dto.MclOrderQtyDto;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.mcl.repository.MclOrderQuantityRepositoryCustom;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class MclOrderQuantityRepositoryImpl extends QuerydslRepositorySupport implements MclOrderQuantityRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    public MclOrderQuantityRepositoryImpl() {
        super(MclOrderQuantity.class);
    }

    @Override
    public List<MclOrderQtyDto.Color> findMclOrderQtyByColor(Long mclOptionId) {
        QMclGarmentColor color = QMclGarmentColor.mclGarmentColor;
        QMclOrderQuantity mclOrderQuantity = QMclOrderQuantity.mclOrderQuantity;
        QBuyerOrderItem item = QBuyerOrderItem.buyerOrderItem;
        QMclPreBookingPoItem preBookingPoItem = QMclPreBookingPoItem.mclPreBookingPoItem;
        QMclPreBookingPo preBookingPo = QMclPreBookingPo.mclPreBookingPo;

        return from(color)
                .select(
                        Projections.bean(MclOrderQtyDto.Color.class,
                                mclOrderQuantity.id.as("orderQtyId"),
                                Projections.bean(MclCommonDto.class,
                                        color.id,
                                        color.garmentColor,
                                        color.poGarmentColor
                                ).as("color"),
                                mclOrderQuantity.measuredQuantity.coalesce(0).as("qty"),
                                new CaseBuilder().when(color.poGarmentColor.isNull()).then(0).otherwise(
                                        JPAExpressions
                                                .select(item.qty.castToNum(Integer.class).sum().coalesce(0))
                                                .from(item)
                                                .innerJoin(preBookingPoItem).on(preBookingPoItem.buyerOrderItem.eq(item))
                                                .innerJoin(preBookingPo).on(preBookingPo.eq(preBookingPoItem.mclPreBookingPo),
                                                preBookingPo.mclOption.id.eq(mclOptionId),
                                                preBookingPo.delFlag.ne("D"))
                                                .where(item.color.eq(color.poGarmentColor))
                                ).as("orderQty")
                        )
                )
                .leftJoin(mclOrderQuantity).on(mclOrderQuantity.mclOption.id.eq(mclOptionId)
                        , mclOrderQuantity.mclGarmentColor.eq(color)
                        ,mclOrderQuantity.mclGarmentMarket.isNull()
                        ,mclOrderQuantity.mclGarmentSize.isNull())
                .where(color.mclOption.id.eq(mclOptionId), color.delFlag.ne("D"))
                .orderBy(color.garmentColor.desc())
                .fetch();
    }

    @Override
    public List<MclOrderQtyDto.Color> findMclOrderQtyByColorAndMarket(Long mclOptionId, MclGarmentMarket market) {
        BooleanBuilder builder = new BooleanBuilder();
        QMclGarmentColor color = QMclGarmentColor.mclGarmentColor;
        QMclOrderQuantity mclOrderQuantity = QMclOrderQuantity.mclOrderQuantity;
        QBuyerOrderItem item = QBuyerOrderItem.buyerOrderItem;
        QMclPreBookingPoItem preBookingPoItem = QMclPreBookingPoItem.mclPreBookingPoItem;
        QMclPreBookingPo preBookingPo = QMclPreBookingPo.mclPreBookingPo;

        if(market.getPoGarmentMarket() == null){
            builder.and(item.buyerOrderInfo.marketDesc.isNull());
        }else{
            builder.and(item.buyerOrderInfo.marketDesc.eq(market.getPoGarmentMarket()));
        }

        return from(color)
                .select(
                        Projections.bean(MclOrderQtyDto.Color.class,
                                mclOrderQuantity.id.as("orderQtyId"),
                                Projections.bean(MclCommonDto.class,
                                        color.id,
                                        color.garmentColor,
                                        color.poGarmentColor
                                ).as("color"),
                                mclOrderQuantity.measuredQuantity.coalesce(0).as("qty"),
                                new CaseBuilder()
                                        .when(color.poGarmentColor.isNull()).then(0)
                                        .otherwise(
                                                JPAExpressions
                                                        .select(item.qty.castToNum(Integer.class).sum().coalesce(0))
                                                        .from(item)
                                                        .innerJoin(preBookingPoItem).on(preBookingPoItem.buyerOrderItem.eq(item))
                                                        .innerJoin(preBookingPo).on(preBookingPo.eq(preBookingPoItem.mclPreBookingPo),
                                                        preBookingPo.mclOption.id.eq(mclOptionId),
                                                        preBookingPo.delFlag.ne("D"))
                                                        .where(item.color.eq(color.poGarmentColor), builder)
                                        ).as("orderQty")
                        )
                )
                .leftJoin(mclOrderQuantity).on(mclOrderQuantity.mclOption.id.eq(mclOptionId)
                        , mclOrderQuantity.mclGarmentColor.eq(color)
                        ,mclOrderQuantity.mclGarmentSize.isNull()
                        ,mclOrderQuantity.mclGarmentMarket.eq(market))
                .where(color.mclOption.id.eq(mclOptionId), color.delFlag.ne("D"))
                .orderBy(color.garmentColor.desc())
                .fetch();
    }

    @Override
    public List<MclOrderQtyDto.Color> findMclOrderQtyByColorAndSize(Long mclOptionId, MclGarmentSize size) {
        BooleanBuilder builder = new BooleanBuilder();
        QMclGarmentColor color = QMclGarmentColor.mclGarmentColor;
        QMclOrderQuantity mclOrderQuantity = QMclOrderQuantity.mclOrderQuantity;
        QBuyerOrderItem item = QBuyerOrderItem.buyerOrderItem;
        QMclPreBookingPoItem preBookingPoItem = QMclPreBookingPoItem.mclPreBookingPoItem;
        QMclPreBookingPo preBookingPo = QMclPreBookingPo.mclPreBookingPo;

        if(size.getPoGarmentSize() == null){
            builder.and(item.size.isNull());
        }else{
            builder.and(item.size.eq(size.getPoGarmentSize()));
        }

        return from(color)
                .select(
                        Projections.bean(MclOrderQtyDto.Color.class,
                                mclOrderQuantity.id.as("orderQtyId"),
                                Projections.bean(MclCommonDto.class,
                                        color.id,
                                        color.garmentColor,
                                        color.poGarmentColor
                                ).as("color"),
                                mclOrderQuantity.measuredQuantity.coalesce(0).as("qty"),
                                new CaseBuilder()
                                        .when(color.poGarmentColor.isNull()).then(0)
                                        .otherwise(
                                                JPAExpressions
                                                        .select(item.qty.castToNum(Integer.class).sum().coalesce(0))
                                                        .from(item)
                                                        .innerJoin(preBookingPoItem).on(preBookingPoItem.buyerOrderItem.eq(item))
                                                        .innerJoin(preBookingPo).on(preBookingPo.eq(preBookingPoItem.mclPreBookingPo),
                                                        preBookingPo.mclOption.id.eq(mclOptionId),
                                                        preBookingPo.delFlag.ne("D"))
                                                        .where(item.color.eq(color.poGarmentColor), builder)
                                ).as("orderQty")
                        )
                )
                .leftJoin(mclOrderQuantity).on(mclOrderQuantity.mclOption.id.eq(mclOptionId)
                        , mclOrderQuantity.mclGarmentColor.eq(color)
                        ,mclOrderQuantity.mclGarmentMarket.isNull()
                        ,mclOrderQuantity.mclGarmentSize.eq(size))
                .where(color.mclOption.id.eq(mclOptionId), color.delFlag.ne("D"))
                .orderBy(color.garmentColor.desc())
                .fetch();
    }

    @Override
    public List<MclOrderQtyDto.Color> findMclOrderQtyByColorAndSizeAndMarket(Long mclOptionId, MclGarmentSize size, MclGarmentMarket market) {
        BooleanBuilder builder = new BooleanBuilder();
        QMclGarmentColor color = QMclGarmentColor.mclGarmentColor;
        QMclOrderQuantity mclOrderQuantity = QMclOrderQuantity.mclOrderQuantity;
        QBuyerOrderItem item = QBuyerOrderItem.buyerOrderItem;
        QMclPreBookingPoItem preBookingPoItem = QMclPreBookingPoItem.mclPreBookingPoItem;
        QMclPreBookingPo preBookingPo = QMclPreBookingPo.mclPreBookingPo;

        if(size.getPoGarmentSize() == null){
            builder.and(item.size.isNull());
        }else{
            builder.and(item.size.eq(size.getPoGarmentSize()));
        }

        if(market.getPoGarmentMarket() == null){
            builder.and(item.buyerOrderInfo.marketDesc.isNull());
        }else{
            builder.and(item.buyerOrderInfo.marketDesc.eq(market.getPoGarmentMarket()));
        }

        return from(color)
                .select(
                        Projections.bean(MclOrderQtyDto.Color.class,
                                mclOrderQuantity.id.as("orderQtyId"),
                                Projections.bean(MclCommonDto.class,
                                        color.id,
                                        color.garmentColor,
                                        color.poGarmentColor
                                ).as("color"),
                                mclOrderQuantity.measuredQuantity.coalesce(0).as("qty"),
                                new CaseBuilder()
                                        .when(color.poGarmentColor.isNull()).then(0)
                                        .otherwise(
                                                JPAExpressions
                                                        .select(item.qty.castToNum(Integer.class).sum().coalesce(0))
                                                        .from(item)
                                                        .innerJoin(preBookingPoItem).on(preBookingPoItem.buyerOrderItem.eq(item))
                                                        .innerJoin(preBookingPo).on(preBookingPo.eq(preBookingPoItem.mclPreBookingPo),
                                                        preBookingPo.mclOption.id.eq(mclOptionId),
                                                        preBookingPo.delFlag.ne("D"))
                                                        .where(item.color.eq(color.poGarmentColor), builder)
                                        ).as("orderQty")
                        )
                )
                .leftJoin(mclOrderQuantity).on(mclOrderQuantity.mclOption.id.eq(mclOptionId)
                        , mclOrderQuantity.mclGarmentColor.eq(color)
                        ,mclOrderQuantity.mclGarmentMarket.eq(market)
                        ,mclOrderQuantity.mclGarmentSize.eq(size)
                )
                .where(color.mclOption.id.eq(mclOptionId), color.delFlag.ne("D"))
                .orderBy(color.garmentColor.desc())
                .fetch();
    }

    @Override
    public Integer findItemQuantitySum(MclOrderItemDto.DependencyItem item, MclOption mclOption) {
        BooleanBuilder builder = new BooleanBuilder();
        QMclOrderQuantity orderQuantity = QMclOrderQuantity.mclOrderQuantity;

        if(item.getColor() != null){
            builder.and(orderQuantity.mclGarmentColor.id.eq(item.getColor().getId()));
        }

        if(item.getSize() != null){
            builder.and(orderQuantity.mclGarmentSize.id.eq(item.getSize().getId()));
        }

        if(item.getMarket() != null){
            builder.and(orderQuantity.mclGarmentMarket.id.eq(item.getMarket().getId()));
        }

        return from(orderQuantity)
                .select(orderQuantity.measuredQuantity.sum().coalesce(0))
                .where(builder,
                        orderQuantity.mclOption.eq(mclOption),
                        orderQuantity.delFlag.ne("D"))
                .fetchOne();
    }

    @Override
    public Integer findMaterialQuantitySum(MclMaterialInfo mclMaterialInfo) {
        JPAQueryFactory queryFactory = new JPAQueryFactory(this.getEntityManager());
        BooleanBuilder builder = new BooleanBuilder();

        QMclOrderQuantity orderQuantity = QMclOrderQuantity.mclOrderQuantity;
        QMclMaterialDependencyColor color = QMclMaterialDependencyColor.mclMaterialDependencyColor;
        QMclMaterialDependencyMarket market = QMclMaterialDependencyMarket.mclMaterialDependencyMarket;
        QMclMaterialDependencySize size = QMclMaterialDependencySize.mclMaterialDependencySize;

        List<MclGarmentColor> colors =  queryFactory
                .select(color.mclGarmentColor)
                .from(color)
                .where(color.mclMaterialInfo.eq(mclMaterialInfo), color.delFlag.ne("D")).fetch();

        List<MclGarmentMarket> markets =  queryFactory
                .select(market.mclGarmentMarket)
                .from(market)
                .where(market.mclMaterialInfo.eq(mclMaterialInfo), market.delFlag.ne("D")).fetch();

        List<MclGarmentSize> sizes =  queryFactory
                .select(size.mclGarmentSize)
                .from(size)
                .where(size.mclMaterialInfo.eq(mclMaterialInfo), size.delFlag.ne("D")).fetch();

        if(colors.size()>0){
            builder.and(orderQuantity.mclGarmentColor.in(colors));
        }

        if(markets.size()>0){
            builder.and(orderQuantity.mclGarmentMarket.in(markets));
        }

        if(sizes.size()>0){
            builder.and(orderQuantity.mclGarmentSize.in(sizes));
        }

        return from(orderQuantity)
                .select(orderQuantity.measuredQuantity.sum().coalesce(0))
                .where(orderQuantity.delFlag.ne("D"),
                        orderQuantity.mclOption.eq(mclMaterialInfo.getMclOption()),
                        builder
                )
                .fetchOne();
    }
}
