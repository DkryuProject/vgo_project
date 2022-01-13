package io.vengine.api.common.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Component
public class FileUtil {

    private static String baseFilePath;

    @Value("${file.upload-dir}")
    public void setBaseFilePath(String value){
        this.baseFilePath = value;
    }

    public String fileUpload(MultipartFile file){

        String filePath = baseFilePath+file.getOriginalFilename();
        try {
            file.transferTo(new File(filePath));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return filePath;
    }
}
