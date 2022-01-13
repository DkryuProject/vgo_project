package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.dto.MclOrderItemDto;
import io.vengine.api.v1.mcl.dto.MclOrderQtyDto;
import io.vengine.api.v1.mcl.entity.MclGarmentMarket;
import io.vengine.api.v1.mcl.entity.MclGarmentSize;
import io.vengine.api.v1.mcl.entity.MclMaterialInfo;
import io.vengine.api.v1.mcl.entity.MclOption;

import java.util.List;

public interface MclOrderQuantityRepositoryCustom {
    List<MclOrderQtyDto.Color> findMclOrderQtyByColor(Long mclOptionId);

    List<MclOrderQtyDto.Color> findMclOrderQtyByColorAndMarket(Long mclOptionId, MclGarmentMarket market);

    List<MclOrderQtyDto.Color> findMclOrderQtyByColorAndSize(Long mclOptionId, MclGarmentSize size);

    List<MclOrderQtyDto.Color> findMclOrderQtyByColorAndSizeAndMarket(Long mclOptionId, MclGarmentSize size, MclGarmentMarket market);

    Integer findItemQuantitySum(MclOrderItemDto.DependencyItem item, MclOption mclOption);

    Integer findMaterialQuantitySum(MclMaterialInfo mclMaterialInfo);
}
