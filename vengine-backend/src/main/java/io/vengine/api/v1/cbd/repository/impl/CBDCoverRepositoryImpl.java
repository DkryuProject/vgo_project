package io.vengine.api.v1.cbd.repository.impl;

import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.cbd.entity.QCBDCover;
import io.vengine.api.v1.cbd.repository.CBDCoverRepositoryCustom;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;

public class CBDCoverRepositoryImpl extends QuerydslRepositorySupport implements CBDCoverRepositoryCustom {
    public CBDCoverRepositoryImpl() {
        super(CBDCover.class);
    }

    @Override
    public Long findCbdCoverCountByMonth(Company company, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        YearMonth yearMonth = YearMonth.from(startDate);

        LocalDateTime startDatetime = LocalDateTime.of(startDate, LocalTime.of(0,0,0));
        LocalDateTime endDatetime = LocalDateTime.of(yearMonth.atEndOfMonth(), LocalTime.of(23,59,59));

        QCBDCover qcbdCover = QCBDCover.cBDCover;

        return from(qcbdCover)
                .select(qcbdCover.count().coalesce(0L))
                .where(
                        qcbdCover.company.eq(company)
                        ,qcbdCover.updatedAt.between(startDatetime, endDatetime)
                )
                .fetchOne();
    }
}
