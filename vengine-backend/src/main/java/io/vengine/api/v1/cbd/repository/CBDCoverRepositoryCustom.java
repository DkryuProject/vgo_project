package io.vengine.api.v1.cbd.repository;

import io.vengine.api.v1.user.entity.Company;

public interface CBDCoverRepositoryCustom {
    Long findCbdCoverCountByMonth(Company company, int year, int month);
}
