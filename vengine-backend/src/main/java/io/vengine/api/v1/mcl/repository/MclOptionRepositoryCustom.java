package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.mcl.entity.MclOption;
import io.vengine.api.v1.user.entity.Company;

import java.util.List;

public interface MclOptionRepositoryCustom {
    List<MclOption> findByCbdCover(CBDCover cbdCover);

    Long findMclOptionCountByMonth(Company company, int year, int month);
}
