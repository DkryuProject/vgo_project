package io.vengine.inventory.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import io.vengine.inventory.entity.GoodsIssue;
import io.vengine.inventory.entity.GoodsReceipt;

@Repository
public interface GoodsIssueRepository extends JpaRepository<GoodsIssue, Long> {

	List<GoodsIssue> findByGoodsReceipt(GoodsReceipt goodsReceipt);

	@Query("select a from GoodsIssue a where (a.goodsIssueDate like %:searchKeyWord% or a.company like %:searchKeyWord%)")
	Page<GoodsIssue> findByKeyWord(String searchKeyWord, Pageable pageable);

	GoodsIssue findByGoodsIssueID(long goodIssueID);

	Page<GoodsIssue> findByCompany(Pageable pageable, String company);

}
