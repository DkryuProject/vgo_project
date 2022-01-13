package io.vengine.api.v1.mcl.repository;

import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.v1.dashboard.dto.DailyOrderDto;
import io.vengine.api.v1.user.entity.Company;

import java.util.List;

public interface MclMaterialPurchaseOrderRepositoryCustom {
    List<DailyOrderDto> findOrders(Company company, OrderStatus status, int year, int month);
}
