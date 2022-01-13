package io.vengine.api.v1.cbd.repository;

import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.user.entity.Company;

import java.util.List;

public interface CBDOptionRepositoryCustom {
    List<CBDOption> findCbdOptionForMclAssign(Long mclOptionId);

    Long findCbdOptionCountByMonth(Company company, int year, int month);
}
