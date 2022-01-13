package io.vengine.api.v1.supplier.repository;

import io.vengine.api.v1.dashboard.dto.DailyOrderDto;
import io.vengine.api.v1.user.entity.Company;

import java.util.List;

public interface SupplierPoCheckingRepositoryCustom {
    List<DailyOrderDto> findOrders(Company company, String confirm, int year, int month);
}
