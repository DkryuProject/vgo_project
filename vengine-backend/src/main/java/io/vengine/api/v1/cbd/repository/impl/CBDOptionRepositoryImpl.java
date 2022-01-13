package io.vengine.api.v1.cbd.repository.impl;

import com.querydsl.jpa.JPAExpressions;
import io.vengine.api.common.enums.Status;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.cbd.entity.QCBDOption;
import io.vengine.api.v1.cbd.repository.CBDOptionRepositoryCustom;
import io.vengine.api.v1.mcl.entity.QMclCbdAssign;
import io.vengine.api.v1.mcl.entity.QMclOption;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

public class CBDOptionRepositoryImpl extends QuerydslRepositorySupport implements CBDOptionRepositoryCustom {

    public CBDOptionRepositoryImpl() {
        super(CBDOption.class);
    }

    @Override
    public List<CBDOption> findCbdOptionForMclAssign(Long mclOptionId) {
        QCBDOption qcbdOption = QCBDOption.cBDOption;
        QMclOption qMclOption = QMclOption.mclOption;
        QMclCbdAssign qMclCbdAssign = QMclCbdAssign.mclCbdAssign;

        return from(qcbdOption)
                    .where(
                            qcbdOption.status.eq(Status.CLOSE),
                            qcbdOption.delFlag.ne("D"),
                            qcbdOption.cbdCoverId.id.eq(
                                            JPAExpressions.select(qMclOption.mclCover.cbdCover.id)
                                                    .from(qMclOption)
                                                    .where(qMclOption.id.eq(mclOptionId))
                            ),
                            qcbdOption.id.notIn(JPAExpressions.select(qMclCbdAssign.cbdOption.id)
                                    .from(qMclCbdAssign)
                                    .where(qMclCbdAssign.mclOption.id.eq(mclOptionId), qMclCbdAssign.delFlag.ne("D")))
                    )
                    .fetch();
    }

    @Override
    public Long findCbdOptionCountByMonth(Company company, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        YearMonth yearMonth = YearMonth.from(startDate);

        LocalDateTime startDatetime = LocalDateTime.of(startDate, LocalTime.of(0,0,0));
        LocalDateTime endDatetime = LocalDateTime.of(yearMonth.atEndOfMonth(), LocalTime.of(23,59,59));

        QCBDOption qcbdOption = QCBDOption.cBDOption;

        return from(qcbdOption)
                .select(qcbdOption.count().coalesce(0L))
                .where(
                         qcbdOption.company.eq(company)
                        ,qcbdOption.updatedAt.between(startDatetime, endDatetime)
                )
                .fetchOne();
    }
}
