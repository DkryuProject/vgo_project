package io.vengine.api.common.service;

import io.vengine.api.common.dto.ExcelColumnName;
import io.vengine.api.common.dto.ExcelDto;
import io.vengine.api.common.dto.ExcelFileName;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFDataValidationHelper;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExcelWriter {
    private final Workbook workbook;
    private final Map<String, Object> data;
    private final HttpServletResponse response;

    public ExcelWriter(Workbook workbook, Map<String, Object> data, HttpServletResponse response) {
        this.workbook = workbook;
        this.data = data;
        this.response = response;
    }

    // 엑셀 파일 생성
    public void create() {
        setFileName(response, mapToFileName());
        Sheet sheet = workbook.createSheet("data");

        if(data.get("selectBoxData") != null){
            createHiddenSheet(workbook,  (List<Map<String, Object>>) data.get("selectBoxData"));
        }
        createHead(workbook, sheet, mapToHeadList());
        createBody(workbook, sheet, mapToBodyList(), mapToCellTypeList());
    }

    private void createHiddenSheet(Workbook workbook, List<Map<String, Object>> selectBoxData) {
        Sheet hidden = workbook.createSheet("hidden");

        int cellIndex = 0;
        for(Map<String, Object> map: selectBoxData){
            List<String> dataList = (List<String>) map.get("data");

            for (int i=0; i<dataList.size(); i++){
                Row row = hidden.getRow(i);
                if(row == null){
                    row = hidden.createRow(i);
                }

                Cell cell = row.createCell(cellIndex);
                cell.setCellValue(dataList.get(i));
            }
            cellIndex++;
        }
        workbook.setSheetHidden(workbook.getSheetIndex("hidden"), HSSFWorkbook.SHEET_STATE_VERY_HIDDEN);
    }

    // 모델 객체에서 파일 이름 꺼내기
    private String mapToFileName() {
        return (String) data.get("filename");
    }

    // 모델 객체에서 헤더 이름 리스트 꺼내기
    private List<String> mapToHeadList() {
        return (List<String>) data.get("head");
    }

    private List<String> mapToCellTypeList() {
        return (List<String>) data.get("cellType");
    }

    private List<Map<String, Object>> mapToSelectBoxList() {
        List<Map<String, Object>> list = new ArrayList<>();
        if(data.get("selectBox") != null){
            list = (List<Map<String, Object>>) data.get("selectBoxData");
        }
        return list;
    }

    // 모델 객체에서 바디 데이터 리스트 꺼내기
    private List<List<String>> mapToBodyList() {
        return (List<List<String>>) data.get("body");
    }

    // 파일 이름 지정
    private void setFileName(HttpServletResponse response, String fileName) {
        response.setHeader("Content-Disposition",
                "attachment; filename=\"" + getFileExtension(fileName) + "\"");
    }

    // 넘어온 뷰에 따라서 확장자 결정
    private String getFileExtension(String fileName) {
        if (workbook instanceof XSSFWorkbook) {
            fileName += ".xlsx";
        }
        if (workbook instanceof SXSSFWorkbook) {
            fileName += ".xlsx";
        }
        if (workbook instanceof HSSFWorkbook) {
            fileName += ".xls";
        }
        return fileName;
    }

    // 엑셀 헤더 생성
    private void createHead(Workbook workbook, Sheet sheet, List<String> headList) {
        // 테이블 헤더용 스타일
        CellStyle headStyle = workbook.createCellStyle();

        // 가는 경계선을 가집니다.
        headStyle.setBorderTop(CellStyle.BORDER_THIN);
        headStyle.setBorderBottom(CellStyle.BORDER_THIN);
        headStyle.setBorderLeft(CellStyle.BORDER_THIN);
        headStyle.setBorderRight(CellStyle.BORDER_THIN);

        // 배경색은 노란색입니다.
        headStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
        headStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);

        // 데이터는 가운데 정렬합니다.
        headStyle.setAlignment(CellStyle.ALIGN_CENTER);
        headStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);

        int size = headList.size();
        Row row = sheet.createRow(0);

        Cell cell = null;
        for (int i = 0; i < size; i++) {
            cell = row.createCell(i);
            cell.setCellStyle(headStyle);
            cell.setCellValue(headList.get(i));
            sheet.autoSizeColumn(i);
            //row.createCell(i).setCellValue(headList.get(i));
        }
    }

    // 엑셀 바디 생성
    private void createBody(Workbook workbook, Sheet sheet, List<List<String>> bodyList, List<String> cellTypeList) {
        //TEXT Style
        CellStyle textStyle = workbook.createCellStyle();
        textStyle.setAlignment(CellStyle.ALIGN_CENTER);
        textStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        textStyle.setDataFormat((short) 0x31);

        //TEXT  LEFT Style
        CellStyle textLeftStyle = workbook.createCellStyle();
        textLeftStyle.setAlignment(CellStyle.ALIGN_LEFT);
        textLeftStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        textLeftStyle.setDataFormat((short) 0x31);

        //TEXT RIGHT Style
        CellStyle textRightStyle = workbook.createCellStyle();
        textRightStyle.setAlignment(CellStyle.ALIGN_RIGHT);
        textRightStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        textRightStyle.setDataFormat((short) 0x31);

        //NUMBER Style
        CellStyle numberStyle = workbook.createCellStyle();
        numberStyle.setAlignment(CellStyle.ALIGN_RIGHT);
        numberStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        numberStyle.setDataFormat((short) 1);

        int rowSize = bodyList.size();
        int cellSize = 0;
        List<String> cellList = new ArrayList<>();
        for (int i = 0; i < rowSize; i++) {
            cellList = bodyList.get(i);
            cellSize = cellList.size();
            Row row = sheet.createRow(i + 1);

            Cell cell = null;
            for (int j= 0; j < cellSize; j++) {
                cell = row.createCell(j);
                if(cellTypeList.get(j).equals("TEXT")){
                    cell.setCellStyle(textStyle);
                }else if(cellTypeList.get(j).equals("TEXT_LEFT")){
                    cell.setCellStyle(textLeftStyle);
                }else if(cellTypeList.get(j).equals("TEXT_RIGHT")){
                    cell.setCellStyle(textRightStyle);
                }else if(cellTypeList.get(j).equals("INT")){
                    cell.setCellStyle(numberStyle);
                    cell.setCellType(Cell.CELL_TYPE_NUMERIC);
                }
                cell.setCellValue(cellList.get(j));
            }

            if(data.get("selectBox") != null){
                List<Map<String, Object>> mapList = (List<Map<String, Object>>) data.get("selectBox");
                for (Map<String, Object> map: mapList){
                    if((boolean)map.get("flag")){
                        DataValidation dataValidation = null;
                        DataValidationConstraint constraint = null;
                        DataValidationHelper validationHelper = null;

                        int rowNum = 0;
                        if(data.get("selectBoxData") != null){
                            for(Map<String, Object> mapSelectBox: (List<Map<String, Object>>) data.get("selectBoxData")){
                                if(mapSelectBox.get("cellIndex").equals(map.get("cellIndex"))){
                                    rowNum = (int) mapSelectBox.get("size");
                                }
                            }
                        }

                        validationHelper = new XSSFDataValidationHelper((XSSFSheet) sheet);
                        CellRangeAddressList addressList = new CellRangeAddressList(1, rowSize, (Integer) map.get("index"), (Integer) map.get("index"));
                        constraint = validationHelper.createFormulaListConstraint("hidden!$"+map.get("cellIndex")+"$1:$"+map.get("cellIndex")+"$"+rowNum);
                        dataValidation = validationHelper.createValidation(constraint, addressList);
                        dataValidation.setSuppressDropDownArrow(true);
                        dataValidation.setEmptyCellAllowed(true);
                        dataValidation.setShowErrorBox(true);
                        dataValidation.createErrorBox("ERROR","Invalid Data");
                        sheet.addValidationData(dataValidation);
                    }
                }
            }
            //createRow(sheet, bodyList.get(i), i + 1);
        }
    }

    // 행 생성
    private void createRow(Sheet sheet, List<String> cellList, int rowNum) {
        int size = cellList.size();
        Row row = sheet.createRow(rowNum);

        for (int i = 0; i < size; i++) {
            row.createCell(i).setCellValue(cellList.get(i));
        }
    }

    // 모델 객체에 담을 형태로 엑셀 데이터 생성
    public static Map<String, Object> createExcelData(List<? extends ExcelDto> data, Class<?> target) {
        Map<String, Object> excelData = new HashMap<>();
        excelData.put("filename", createFileName(target));
        excelData.put("head", createHeaderName(target));
        excelData.put("cellType", createCellType(target));
        excelData.put("body", createBodyData(data));
        return excelData;
    }

    public static Map<String, Object> createExcelData(List<? extends ExcelDto> data, List<Map<String, Object>> selectBoxData, Class<?> target) {
        Map<String, Object> excelData = new HashMap<>();
        excelData.put("filename", createFileName(target));
        excelData.put("head", createHeaderName(target));
        excelData.put("cellType", createCellType(target));
        excelData.put("selectBoxData", selectBoxData);
        excelData.put("selectBox", createSelectBox(target));
        excelData.put("body", createBodyData(data));
        return excelData;
    }

    private static List<Map<String, Object>> createSelectBox(Class<?> header) {
        List<Map<String, Object>> selectBoxes = new ArrayList<>();
        Map<String, Object> selectBox ;

        int index =0;
        for (Field field : header.getDeclaredFields()) {
            selectBox = new HashMap<>();
            field.setAccessible(true);
            selectBox.put("index", index);
            if (field.isAnnotationPresent(ExcelColumnName.class)) {
                if(!field.getAnnotation(ExcelColumnName.class).cellIndex().equals("")){
                    selectBox.put("flag", true);
                    selectBox.put("cellIndex", field.getAnnotation(ExcelColumnName.class).cellIndex());
                }else{
                    selectBox.put("flag", false);
                }
                selectBoxes.add(selectBox);
            }
            index++;
        }
        return selectBoxes;
    }

    private static List<String> createCellType(Class<?> header) {
        List<String> cellTypes = new ArrayList<>();
        for (Field field : header.getDeclaredFields()) {
            field.setAccessible(true);
            if (field.isAnnotationPresent(ExcelColumnName.class)) {
                cellTypes.add(field.getAnnotation(ExcelColumnName.class).cellType());
            }
        }
        return cellTypes;
    }

    // @ExcelColumnName에서 헤더 이름 리스트 생성
    private static List<String> createHeaderName(Class<?> header) {
        List<String> headData = new ArrayList<>();
        for (Field field : header.getDeclaredFields()) {
            field.setAccessible(true);
            if (field.isAnnotationPresent(ExcelColumnName.class)) {
                String headerName = field.getAnnotation(ExcelColumnName.class).headerName();
                if (headerName.equals("")) {
                    headData.add(field.getName());
                } else {
                    headData.add(headerName);
                }
            }
        }
        return headData;
    }

    // @ExcelFileName 에서 엑셀 파일 이름 생성
    private static String createFileName(Class<?> file) {
        if (file.isAnnotationPresent(ExcelFileName.class)) {
            String filename = file.getAnnotation(ExcelFileName.class).filename();
            return filename.equals("") ? file.getSimpleName() : filename + "_"+ LocalDateTime.now();
        }
        throw new RuntimeException("excel filename not exist");
    }

    // 데이터 리스트 형태로 가공
    private static List<List<String>> createBodyData(List<? extends ExcelDto> dataList) {
        List<List<String>> bodyData = new ArrayList<>();
        dataList.forEach(v -> bodyData.add(v.mapToList()));
        return bodyData;
    }
}
