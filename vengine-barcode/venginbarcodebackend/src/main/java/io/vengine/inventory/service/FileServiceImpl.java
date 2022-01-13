package io.vengine.inventory.service;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;

import javax.sql.rowset.serial.SerialException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import io.vengine.inventory.entity.File;
import io.vengine.inventory.repository.FileRepository;

@Service
public class FileServiceImpl implements FileService {

	@Autowired
	FileRepository fileRepository;
	
	@Override
	public boolean fileUpload(MultipartFile file, String packingNumber, String type) {
		String fileName = file.getOriginalFilename();
		File fileData = new File();
		
		System.out.println("File Name: " + file.getName());
		System.out.println("File Original Name: " + fileName);
		System.out.println("File Size: " + file.getSize());
		System.out.println("packingNumber: " + packingNumber);
		System.out.println("type: " + type);
		
		try {
			byte[] fileByte = file.getBytes();
			
			Blob blobData = new javax.sql.rowset.serial.SerialBlob(fileByte);
			System.out.println("length: " + blobData.length());
			
			fileData.setFile(blobData);
			fileData.setFileName(fileName);
			fileData.setPackingNumber(packingNumber);
			fileData.setType(type);
			fileData.setFileSize(blobData.length());
			
			fileRepository.save(fileData);

			return true;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		} catch (SerialException e) {
			e.printStackTrace();
			return false;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}

}
