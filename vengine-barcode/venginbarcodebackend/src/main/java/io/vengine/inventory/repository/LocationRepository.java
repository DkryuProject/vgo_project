package io.vengine.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.vengine.inventory.entity.Location;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

	Location findByBarcodeText(String barcodeText);

}
