package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.dto.MclOrderItemDto;
import io.vengine.api.v1.mcl.entity.MclMaterialInfo;

public interface MclMaterialPurchaseOrderDependencyItemRepositoryCustom {
    Integer findItemQuantitySum(MclMaterialInfo mclMaterialInfo, MclOrderItemDto.DependencyItem item);
}
