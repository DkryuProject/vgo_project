package io.vengine.api.common.service;

import io.vengine.api.common.utils.ExcelUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
public class ExcelReader {

    /** 엑셀 업로드 에러 필드 리스트 **/
    public static List excelList;
    /** 엑셀 업로드 에러 필드 리스트 **/
    public static List errorFieldList;
    /** 엑셀 업로드 HEADER 리스트 **/
    public static List headerList;

    public <T> ExcelReader(MultipartFile multipartFile, Function<Row, T> rowFunc) {
        this.excelList =  getObjectList(multipartFile, rowFunc, 1);
    }

    public static Workbook getWorkbook(MultipartFile file) {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());

        if (!extension.equals("xlsx") && !extension.equals("xls")) {
            throw new RuntimeException("엑셀파일만 업로드 해주세요.");
        }

        Workbook workbook = null;

        if (extension.equals("xlsx")) {
            try {
                workbook = new XSSFWorkbook(file.getInputStream());
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage(), e);
            }
        } else if (extension.equals("xls")) {
            try {
                workbook = new HSSFWorkbook(file.getInputStream());
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage(), e);
            }
        }

        return workbook;
    }

    /**
     * 엑셀 파일의 데이터를 읽어서 요청한 오브젝트 타입 리스트에 담아 준다
     * @param multipartFile 엑셀 파일 데이터
     * @param rowFunc cell 데이터를 객체에 셋팅해주는 함수
     * @return List 요청 객체 타입의 리스트로 리턴
     * @throws IOException
     */
    public static <T>List<T> getObjectList(final MultipartFile multipartFile, final Function<Row, T> rowFunc) throws Exception {
        //헤더 데이터가 ROW가 0에 있고 실제 데이터의 시작 ROW가 1번째 부터인 것으로 판단
        return getObjectList(multipartFile, rowFunc, 1);
    }

    public  List getErrorFieldList()  {
        return errorFieldList;
    }

    public  List getExcelList()  {
        return excelList;
    }
    /**
     * 엑셀 파일의 데이터를 읽어서 요청한 오브젝트 타입 리스트에 담아 준다
     * @param multipartFile 엑셀 파일 데이터
     * @param rowFunc cell 데이터를 객체에 셋팅해주는 함수
     * @param startRow 데이터 시작 ROW (Default: 1)
     * @return List 요청 객체 타입의 리스트로 리턴
     * @throws IOException
     */
    public static  <T>List<T> getObjectList(final MultipartFile multipartFile,
                                      final Function<Row, T> rowFunc, Integer startRow) {

        errorFieldList = new ArrayList<>();
        headerList = new ArrayList<>();

        // rownum 이 입력되지 않으면 default로 1 번째 라인을 데이터 시작 ROW로 판단
        if(Objects.isNull(startRow)) startRow = 1;

        // 엑셀 파일을 Workbook에 담는다
        final Workbook workbook= getWorkbook(multipartFile);

        // 시트 수 (첫번째에만 존재시 0)
        final Sheet sheet = workbook.getSheetAt(0);
        // 전체 행 수
        final int rowCount = sheet.getPhysicalNumberOfRows();
        // 헤더 셋팅
        headerList = getHeader(multipartFile);

        List<T> objectList = IntStream
                .range(startRow, rowCount)
                .filter(rowIndex -> isPass(sheet.getRow(rowIndex)))
                .mapToObj(rowIndex -> rowFunc.apply(sheet.getRow(rowIndex)))
                .collect(Collectors.toList());

        return objectList;
    }

    /**
     * 해당 ROW에 있는 데이터가 모두 비어있으면 빈 ROW로 판단하고 해당 ROW는 PASS 시킨다
     * @param row
     * @return
     */
    private static boolean isPass(Row row) {
        int i =0;
        boolean isPass = false;
        while (i < row.getPhysicalNumberOfCells()) {
            if(StringUtils.isNotEmpty(ExcelUtils.getValue(row.getCell(i++))))
                isPass = true;
        }
        //log.info("## row.getPhysicalNumberOfCells() = {}, isPass = {}",row.getPhysicalNumberOfCells(), isPass);
        return isPass;

    }

    /**
     * 헤더 가져오기
     * 가장 상단에 헤더가 있다면 헤더 정보를 List 에 담아준다
     * @param multipartFile 엑셀파일
     * @return List 헤더 리스트
     * @throws IOException
     */
    public static List getHeader(final MultipartFile multipartFile) {
        return getHeader(multipartFile, 0); //헤더가 가장 첫번째 라인에 있다고 판단함
    }

    /**
     * 헤더 가져오기
     * 가장 상단에 헤더가 있다면 헤더 정보를 List 에 담아준다
     * @param multipartFile 엑셀파일
     * @param rownum 헤더가 있는 row number 값
     * @return List 헤더 리스트
     * @throws IOException
     */
    public static List getHeader(final MultipartFile multipartFile, Integer rownum) {

        // rownum 이 입력되지 않으면 default로 0 번째 라인을 header 로 판단
        if(Objects.isNull(rownum)) rownum = 0;

        final Workbook workbook = getWorkbook(multipartFile);

        // 시트 수 (첫번째에만 존재시 0)
        final Sheet sheet = workbook.getSheetAt(0);

        // 타이틀 가져오기
        Row title = sheet.getRow(rownum);
        return IntStream
                .range(0, title.getPhysicalNumberOfCells())
                .mapToObj(cellIndex -> title.getCell(cellIndex).getStringCellValue())
                .collect(Collectors.toList());
    }

    /**
     * 타이틀 가져오기
     * 가장 상단에 타이틀이 있다면 타이틀 정보를 List 에 담아준다
     * @param multipartFile 엑셀파일
     * @return List 타이틀 리스트
     * @throws IOException
     */
    public static List getTitle(final MultipartFile multipartFile) {

        final Workbook workbook = getWorkbook(multipartFile);

        // 시트 수 (첫번째에만 존재시 0)
        final Sheet sheet = workbook.getSheetAt(0);

        // 타이틀 가져오기
        Row title = sheet.getRow(0);
        return IntStream
                .range(0, title.getPhysicalNumberOfCells())
                .mapToObj(cellIndex -> title.getCell(cellIndex).getStringCellValue())
                .collect(Collectors.toList());
    }
}
