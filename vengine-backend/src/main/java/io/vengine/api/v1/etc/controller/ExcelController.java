package io.vengine.api.v1.etc.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.utils.CustomExcel;
import io.vengine.api.v1.etc.service.ExcelService;
import io.vengine.api.v1.user.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Api(tags = {"90. EXCEL"})
@RestController
@AllArgsConstructor
@RequestMapping(value = "/v1/excel")
public class ExcelController {
    @Autowired
    ExcelService excelService;

    @ApiOperation(value = "Excel Download")
    @GetMapping(value = "/{type}")
    public ModelAndView excelDownload(
            @ApiParam(value = "다운로드 타입", required = true) @PathVariable String type,
            HttpServletRequest request
    ){
        Map<String, Object> excelData = excelService.excelDownload(request, type);
        return new ModelAndView(new CustomExcel(), excelData);
    }
}
