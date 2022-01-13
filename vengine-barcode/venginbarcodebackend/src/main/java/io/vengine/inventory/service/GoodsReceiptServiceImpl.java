package io.vengine.inventory.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.vengine.inventory.common.ResponseService;
import io.vengine.inventory.common.SingleResult;
import io.vengine.inventory.entity.Barcode;
import io.vengine.inventory.entity.Delivery;
import io.vengine.inventory.entity.GoodsReceipt;
import io.vengine.inventory.repository.GoodsReceiptRepository;

@Service
public class GoodsReceiptServiceImpl implements GoodsReceiptService {

	@Autowired 
	GoodsReceiptRepository goodsReceiptRepository;
	@Autowired
	ResponseService responseService;
	
	@Override
	public SingleResult<GoodsReceipt> getGoodsReceiptData(String docNO, String type, String company) {
		SingleResult<GoodsReceipt> result = new SingleResult<GoodsReceipt>();
		
		Delivery delivery = new Delivery();
		delivery.setDeliveryNumber(docNO);
		
		result = responseService.getSingleResult(goodsReceiptRepository.findByDeliveryAndCompany(delivery, company));
		return result;
	}

	@Override
	public GoodsReceipt insertGoodsReceipt(GoodsReceipt goodsReceiptData) {
		return goodsReceiptRepository.save(goodsReceiptData);
	}

	@Override
	public void updateGoodsReceipt(Barcode barcodeData) {
		GoodsReceipt updateData = goodsReceiptRepository.findByGoodsReceiptID(barcodeData.getGoodsReceipt().getGoodsReceiptID());
		updateData.setTotalPackingQuantity(updateData.getTotalPackingQuantity().add(barcodeData.getPackingQuantity()));
		goodsReceiptRepository.save(updateData);
	}

}
