package io.vengine.api.v1.mcl.repository.impl;

import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.mcl.entity.MclOption;
import io.vengine.api.v1.mcl.entity.QMclCover;
import io.vengine.api.v1.mcl.entity.QMclOption;
import io.vengine.api.v1.mcl.repository.MclOptionRepositoryCustom;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

public class MclOptionRepositoryImpl extends QuerydslRepositorySupport implements MclOptionRepositoryCustom {
    public MclOptionRepositoryImpl() {
        super(MclOption.class);
    }

    @Override
    public List<MclOption> findByCbdCover(CBDCover cbdCover) {
        QMclCover qMclCover = QMclCover.mclCover;
        QMclOption qMclOption = QMclOption.mclOption;

        return from(qMclOption)
                    .innerJoin(qMclOption.mclCover, qMclCover)
                    .where(qMclCover.cbdCover.eq(cbdCover), qMclOption.delFlag.ne("D"))
                    .orderBy(qMclOption.name.asc())
                    .fetch();
    }

    @Override
    public Long findMclOptionCountByMonth(Company company, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        YearMonth yearMonth = YearMonth.from(startDate);

        LocalDateTime startDatetime = LocalDateTime.of(startDate, LocalTime.of(0,0,0));
        LocalDateTime endDatetime = LocalDateTime.of(yearMonth.atEndOfMonth(), LocalTime.of(23,59,59));

        QMclOption qMclOption = QMclOption.mclOption;

        return from(qMclOption)
                .select(qMclOption.count().coalesce(0L))
                .where(
                        qMclOption.company.eq(company)
                        ,qMclOption.updatedAt.between(startDatetime, endDatetime)
                )
                .fetchOne();
    }
}
