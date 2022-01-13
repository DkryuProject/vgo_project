package io.vengine.inventory.service;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import io.vengine.inventory.common.PageResult;
import io.vengine.inventory.common.ResponseService;
import io.vengine.inventory.entity.Delivery;
import io.vengine.inventory.repository.DeliveryRepository;

@Service
public class DeliveryServiceImpl implements DeliveryService {

	@Autowired
	DeliveryRepository inWareHousingRepository;

	@Autowired
	ResponseService responseService;
	
	@Override
	public Delivery getItem(String deliveryNumber) {
		return inWareHousingRepository.findByDeliveryNumber(deliveryNumber);
	}

	@Override
	@Transactional
	public PageResult<Delivery> getDeliveryList(String delFlag, String company, String searchKeyWord, int pageNum) {

		Pageable pageable = PageRequest.of(pageNum, 10, Sort.by("deliveryDate").descending());
		PageResult<Delivery> result = null;

		try {
			if (!"".equals(searchKeyWord)) {
				result = responseService.getListResult(inWareHousingRepository.getDeliveryList(delFlag, company, searchKeyWord, pageable));
			} else {
				result = responseService.getListResult(inWareHousingRepository.findByDelFlagAndCompany(delFlag, company, pageable));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

}
