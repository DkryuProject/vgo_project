package io.vengine.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import io.vengine.inventory.entity.GoodsIssue;
import io.vengine.inventory.entity.GoodsReceipt;
import io.vengine.inventory.repository.GoodsIssueRepository;

@Service
public class GoodsIssueServiceImpl implements GoodsIssueService {

	@Autowired
	GoodsIssueRepository goodsIssueRepository;
	
	@Override
	public GoodsIssue insertGoodsIssue(GoodsIssue goodsIssueData) {
		return goodsIssueRepository.save(goodsIssueData);
	}

	@Override
	public List<GoodsIssue> getGoodsIssueData(GoodsReceipt goodsReceipt) {
		return goodsIssueRepository.findByGoodsReceipt(goodsReceipt);
	}

	@Override
	public Page<GoodsIssue> getGoodsIssueList(String string, String searchKeyWord, int pageNum, String company) {
		Pageable pageable = PageRequest.of(pageNum, 10, Sort.by("goodsIssueID").descending());
		Page<GoodsIssue> result = null;

		try {
			if (!"".equals(searchKeyWord)) {
				//result = goodsIssueRepository.findByKeyWord(searchKeyWord, pageable);
			} else {
				//result = goodsIssueRepository.findAll(pageable);
			}
			result = goodsIssueRepository.findByCompany(pageable, company);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

	@Override
	public GoodsIssue getGoodsIssueDataByID(long goodIssueID) {
		return goodsIssueRepository.findByGoodsIssueID(goodIssueID);
	}

}
