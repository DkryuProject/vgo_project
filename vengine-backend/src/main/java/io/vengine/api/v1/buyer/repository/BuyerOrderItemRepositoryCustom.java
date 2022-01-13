package io.vengine.api.v1.buyer.repository;

import io.vengine.api.v1.buyer.dto.MappedOrderDto;
import io.vengine.api.v1.buyer.entity.BuyerOrderItem;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.mcl.entity.MclPreBooking;

import java.util.BitSet;
import java.util.List;

public interface BuyerOrderItemRepositoryCustom {
    List<MappedOrderDto> findMappedPO(MclPreBooking mclPreBooking);

    List<BuyerOrderItem> findByCbdCover(CBDCover cover);
}
