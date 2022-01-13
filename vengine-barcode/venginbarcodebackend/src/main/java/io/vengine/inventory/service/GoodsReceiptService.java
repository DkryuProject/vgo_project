package io.vengine.inventory.service;

import io.vengine.inventory.common.SingleResult;
import io.vengine.inventory.entity.Barcode;
import io.vengine.inventory.entity.GoodsReceipt;

public interface GoodsReceiptService {

	SingleResult<GoodsReceipt> getGoodsReceiptData(String docNO, String type, String company);

	GoodsReceipt insertGoodsReceipt(GoodsReceipt goodsReceiptData);

	void updateGoodsReceipt(Barcode barcodeData);

}
