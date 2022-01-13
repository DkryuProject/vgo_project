package io.vengine.api.v1.mcl.repository.impl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.v1.dashboard.dto.DailyOrderDto;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderPublish;
import io.vengine.api.v1.mcl.entity.QMclMaterialAdhocPurchaseOrderPublish;
import io.vengine.api.v1.mcl.repository.MclMaterialAdhocPurchaseOrderPublishRepositoryCustom;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

public class MclMaterialAdhocPurchaseOrderPublishRepositoryImpl extends QuerydslRepositorySupport implements MclMaterialAdhocPurchaseOrderPublishRepositoryCustom {
    public MclMaterialAdhocPurchaseOrderPublishRepositoryImpl() {
        super(MclMaterialAdhocPurchaseOrderPublish.class);
    }

    @Override
    public List<DailyOrderDto> findOrders(Company company, OrderStatus status, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        YearMonth yearMonth = YearMonth.from(startDate);

        LocalDateTime startDatetime = LocalDateTime.of(startDate, LocalTime.of(0,0,0));
        LocalDateTime endDatetime = LocalDateTime.of(yearMonth.atEndOfMonth(), LocalTime.of(23,59,59));

        QMclMaterialAdhocPurchaseOrderPublish order = QMclMaterialAdhocPurchaseOrderPublish.mclMaterialAdhocPurchaseOrderPublish;

        BooleanBuilder builder = new BooleanBuilder();

        if(status != null){
            builder.and(order.status.eq(status));
            builder.and(order.createdAt.between(startDatetime, endDatetime));
        }else{
            builder.and(order.createdAt.between(startDatetime, endDatetime));
        }

        return from(order)
                .select(
                        Projections.bean(DailyOrderDto.class,
                                order.id.as("orderID"),
                                order.materialPurchaseOrderNumber.as("poNumber"),
                                Expressions.asString("ADHOC").as("type"),
                                order.createdAt.as("date")
                        )
                )
                .where(
                        order.company.eq(company)
                        ,builder
                )
                .fetch();
    }
}
