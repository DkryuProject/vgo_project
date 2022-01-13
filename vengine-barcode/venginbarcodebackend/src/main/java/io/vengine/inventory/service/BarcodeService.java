package io.vengine.inventory.service;

import java.util.List;

import org.springframework.data.domain.Page;

import io.vengine.inventory.entity.Barcode;

public interface BarcodeService {

	boolean insertBarcode(List<Barcode> data);
	
	Page<Barcode> getBarcodeList(String searchKeyWord, int pageNum);

	List<Barcode> getBarcode(String inWareHousingNumber);

	Barcode getBarcodeInfo(String barcodeText);

	void updateBarcodeInfo(Barcode data);
}
