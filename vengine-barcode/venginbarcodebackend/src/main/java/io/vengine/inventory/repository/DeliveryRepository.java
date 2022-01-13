package io.vengine.inventory.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import io.vengine.inventory.entity.Delivery;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, String> {

	Delivery findByDeliveryNumber(String deliveryNumber);

	Page<Delivery> findByDelFlag(String delFlag, Pageable pageable);

	@Query("select a from Delivery a where a.delFlag=:delFlag and a.company=:company and (a.deliveryNumber like %:searchKeyWord% or a.deliveryDate like %:searchKeyWord% or a.supplier like %:searchKeyWord%)")
	Page<Delivery> getDeliveryList(String delFlag, String company, String searchKeyWord, Pageable pageable);

	Page<Delivery> findByDelFlagAndCompany(String delFlag, String company, Pageable pageable);

}
