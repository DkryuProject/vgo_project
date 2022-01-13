package io.vengine.api.v1.supplier.repository.impl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import io.vengine.api.v1.dashboard.dto.DailyOrderDto;
import io.vengine.api.v1.supplier.entity.QSupplierPoChecking;
import io.vengine.api.v1.supplier.entity.SupplierPoChecking;
import io.vengine.api.v1.supplier.repository.SupplierPoCheckingRepositoryCustom;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

public class SupplierPoCheckingRepositoryImpl extends QuerydslRepositorySupport implements SupplierPoCheckingRepositoryCustom {
    public SupplierPoCheckingRepositoryImpl() {
        super(SupplierPoChecking.class);
    }

    @Override
    public List<DailyOrderDto> findOrders(Company company, String status, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        YearMonth yearMonth = YearMonth.from(startDate);

        LocalDateTime startDatetime = LocalDateTime.of(startDate, LocalTime.of(0,0,0));
        LocalDateTime endDatetime = LocalDateTime.of(yearMonth.atEndOfMonth(), LocalTime.of(23,59,59));

        QSupplierPoChecking poChecking = QSupplierPoChecking.supplierPoChecking;

        BooleanBuilder builder = new BooleanBuilder();

        if(status.equals("confirm")){
            builder.and(poChecking.poConfirm.eq(1));
        }else if(status.equals("revert")){
            builder.and(poChecking.poConfirm.eq(2));
        }

        return from(poChecking)
                .select(
                        Projections.bean(DailyOrderDto.class,
                                poChecking.mclMaterialPurchaseOrderPublish.mclMaterialPurchaseOrder.id.as("orderID"),
                                poChecking.mclMaterialPurchaseOrderPublish.mclMaterialPurchaseOrder.materialPurchaseOrderNumber.as("poNumber"),
                                Expressions.asString("RM").as("type"),
                                poChecking.createdAt.as("date")
                        )
                )
                .where(
                        poChecking.mclMaterialPurchaseOrderPublish.company.eq(company)
                        ,poChecking.createdAt.between(startDatetime, endDatetime)
                        ,builder
                )
                .fetch();
    }
}
