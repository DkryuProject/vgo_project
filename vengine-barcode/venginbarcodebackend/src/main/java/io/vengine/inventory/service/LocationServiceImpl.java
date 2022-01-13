package io.vengine.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.vengine.inventory.entity.Location;
import io.vengine.inventory.repository.LocationRepository;

@Service
public class LocationServiceImpl implements LocationService {

	@Autowired LocationRepository locationRepository;
	
	@Override
	public List<Location> getLocationList() {
		return locationRepository.findAll();
	}

	@Override
	public void insertLocation(List<Location> data) {
		locationRepository.saveAll(data);
	}

	@Override
	public Location getLocationInfo(String barcodeText) {
		return locationRepository.findByBarcodeText(barcodeText);
	}

}
