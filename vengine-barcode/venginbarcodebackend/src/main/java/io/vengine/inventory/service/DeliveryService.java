package io.vengine.inventory.service;

import io.vengine.inventory.common.PageResult;
import io.vengine.inventory.entity.Delivery;

public interface DeliveryService {

	public Delivery getItem(String docNo);

	public PageResult<Delivery> getDeliveryList(String delFlag, String company, String searchKeyWord, int pageNum);

}
