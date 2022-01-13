package io.vengine.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import io.vengine.inventory.entity.Barcode;
import io.vengine.inventory.repository.BarcodeRepository;

@Service
public class BarcodeServiceImpl implements BarcodeService {

	@Autowired
	BarcodeRepository barcodeRepository;

	@Override
	public boolean insertBarcode(List<Barcode> barcodeData) {
		boolean result = true;
		
		try {
			Barcode updateData = null;
			
			for (Barcode barcodeMap : barcodeData) {
				if (!"".equals(barcodeMap.getBarcodeId())) {
					updateData = new Barcode();
					updateData = barcodeMap;

					barcodeRepository.save(updateData);
				} else {
					barcodeRepository.save(barcodeMap);
				}
			}
			result =true;
		} catch (Exception e) {
			e.printStackTrace();
			result = false;
		}
		
		return result;
	}

	@Override
	public Page<Barcode> getBarcodeList(String searchKeyWord, int pageNum) {
		Pageable pageable = PageRequest.of(pageNum, 10, Sort.by("insertDate").descending());
		Page<Barcode> result = null;

		try {
			result = barcodeRepository.findAll(pageable);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

	@Override
	public List<Barcode> getBarcode(String goodsReceiptID) {
		//Delivery delivery = new Delivery();
		//delivery.setGoodsReceipt(goodsReceipt);(goodsReceipt);

		return null;//barcodeRepository.findByinWareHousing(inWareHousing);
	}

	@Override
	public Barcode getBarcodeInfo(String barcodeText) {
		return barcodeRepository.findByBarcodeId(barcodeText);
	}

	@Override
	public void updateBarcodeInfo(Barcode data) {
		Barcode updateData = new Barcode();
		//updateData = barcodeRepository.findByBarcodeId(data.getBarcodeId());
		//updateData.setBarcodeText(data.getBarcodeText());
		barcodeRepository.save(updateData);
	}

}
