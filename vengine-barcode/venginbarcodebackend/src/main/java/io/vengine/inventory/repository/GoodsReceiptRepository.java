package io.vengine.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.vengine.inventory.entity.Delivery;
import io.vengine.inventory.entity.GoodsReceipt;

@Repository
public interface GoodsReceiptRepository extends JpaRepository<GoodsReceipt, Long> {

	GoodsReceipt findByDelivery(Delivery delivery);

	GoodsReceipt findByGoodsReceiptID(long goodsReceiptID);

	GoodsReceipt findByDeliveryAndCompany(Delivery delivery, String company);

}
