package io.vengine.api.v1.etc.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.utils.S3Uploader;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

@ApiIgnore
@RestController
@AllArgsConstructor
@RequestMapping(value = "/v1")
public class FileController {
    @Autowired
    private S3Uploader s3Uploader;

    @ApiOperation(value = "파일 업로드", notes = "파일을 업로드 한다")
    @PostMapping("/file/upload/{type}")
    public String fileUpload(
            @ApiParam(value = "타입", required = true) @PathVariable String type,
            @ApiParam(value = "ID", required = true) @PathVariable long id,
            MultipartFile file
    ){
        try {
            String imgPath = s3Uploader.upload(file, type);;
            return imgPath;
        }catch (Exception e){
            e.printStackTrace();
            throw new BusinessException("File Upload Error", ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "JSON 업로드", notes = "Json String 을 업로드 한다")
    @PostMapping("/upload/json")
    public String jsonUpload(
            @ApiParam(value = "Json String", required = true) @RequestParam String jsonString
    ){
        try {
            return s3Uploader.excelDataUpload(jsonString);
        }catch (Exception e){
            e.printStackTrace();
            throw new BusinessException("Json String Upload Error", ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
