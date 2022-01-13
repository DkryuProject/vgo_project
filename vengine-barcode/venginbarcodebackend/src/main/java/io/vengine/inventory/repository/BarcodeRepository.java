package io.vengine.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.vengine.inventory.entity.Barcode;
import io.vengine.inventory.entity.GoodsReceipt;

@Repository
public interface BarcodeRepository extends JpaRepository<Barcode, Long> {

	Barcode findByBarcodeId(String barcodeID);

	List<Barcode> findByGoodsReceipt(GoodsReceipt goodsReceipt);

}
