package io.vengine.inventory.service;

import java.util.List;

import io.vengine.inventory.entity.Location;

public interface LocationService {

	List<Location> getLocationList();

	void insertLocation(List<Location> data);

	Location getLocationInfo(String barcodeText);

}
