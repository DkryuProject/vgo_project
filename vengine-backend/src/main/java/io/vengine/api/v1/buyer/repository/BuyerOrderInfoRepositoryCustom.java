package io.vengine.api.v1.buyer.repository;

public interface BuyerOrderInfoRepositoryCustom {
    String findOrderAcceptedOn();

    String findOrderAssignedOn();

    String findOrderCancelledOn();
}
