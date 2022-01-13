package io.vengine.inventory.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {

	boolean fileUpload(MultipartFile file, String packingNumber, String type);
	
}
