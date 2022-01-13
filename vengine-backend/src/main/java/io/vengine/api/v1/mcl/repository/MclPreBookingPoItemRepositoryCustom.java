package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.dto.AssignedPODto;
import io.vengine.api.v1.user.entity.Company;

import java.util.List;

public interface MclPreBookingPoItemRepositoryCustom {
    List<String> findItemColors(Long mclOptionId);

    List<String> findItemSizes(Long mclOptionId);

    List<AssignedPODto> findMclPreBookingPoByMclOption(Long mclOptionId);
}
