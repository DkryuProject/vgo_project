package io.vengine.api.v1.buyer.repository;

import io.vengine.api.v1.buyer.entity.BuyerOrderInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuyerOrderInvoiceRepository extends JpaRepository<BuyerOrderInvoice, Long> {
}
