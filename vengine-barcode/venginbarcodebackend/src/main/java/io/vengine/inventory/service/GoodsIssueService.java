package io.vengine.inventory.service;

import java.util.List;

import org.springframework.data.domain.Page;

import io.vengine.inventory.entity.Delivery;
import io.vengine.inventory.entity.GoodsIssue;
import io.vengine.inventory.entity.GoodsReceipt;

public interface GoodsIssueService {

	GoodsIssue insertGoodsIssue(GoodsIssue goodsIssueData);

	List<GoodsIssue> getGoodsIssueData(GoodsReceipt goodsReceipt);

	Page<GoodsIssue> getGoodsIssueList(String string, String searchKeyWord, int pageNum, String company);

	GoodsIssue getGoodsIssueDataByID(long goodIssueID);

}
