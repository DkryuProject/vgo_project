package io.vengine.api.common.utils;

import com.github.drapostolos.typeparser.TypeParser;
import com.github.drapostolos.typeparser.TypeParserException;
import io.vengine.api.common.dto.ExcelReaderErrorField;
import io.vengine.api.common.enums.ExcelReaderFieldError;
import io.vengine.api.common.service.ExcelReader;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.poi.ss.usermodel.*;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
public class ExcelUtils{

    /**
     * Cell 데이터를 Type 별로 체크 하여 String 데이터로 변환함
     * String 데이터로 우선 변환해야 함
     * @param cell 요청 엑셀 파일의 cell 데이터
     * @return String 형으로 변환된 cell 데이터
     */
    public static  String getValue(Cell cell){
        String value = "";

        if(cell == null){
            value = "";
        }else{
            switch (cell.getCellType()) {
                case Cell.CELL_TYPE_FORMULA:
                    value=cell.getCellFormula();
                    break;
                case Cell.CELL_TYPE_NUMERIC:
                    if( DateUtil.isCellDateFormatted(cell)) {
                        Date date = cell.getDateCellValue();
                        value = new SimpleDateFormat("yyyy-MM-dd").format(date);
                    }
                    else
                        value = String.valueOf(cell.getNumericCellValue());

                    if (value.endsWith(".0"))
                        value = value.substring(0, value.length() - 2);
                    break;
                case Cell.CELL_TYPE_STRING:
                    value=cell.getStringCellValue()+"";
                    break;
                case Cell.CELL_TYPE_BLANK:
                    value="";
                    break;
                case Cell.CELL_TYPE_ERROR:
                    value=cell.getErrorCellValue()+"";
                    break;
            }
        }
        return value;
    }

    /**
     * TypeParser 로 String으로 변환된 Cell 데이터를 객체 필드 타입에 맞게 변환하여 셋팅해줌
     * @param object 요청 객체
     * @param row 엑셀 ROW 데이터
     * @return Cell 데이터를 맵핑한 오브젝트
     */
    public static <T>  T setObjectMapping(T object, Row row) {
        int i = 0;

        if(Objects.isNull(object)) return null;

        for (Field field : object.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            String cellValue = null;
            TypeParser typeParser = TypeParser.newBuilder().build();

            try {
                if( i  < row.getPhysicalNumberOfCells()) { //유효한 Cell 영역 까지만
                    cellValue = ExcelUtils.getValue(row.getCell(i));
                    Object setData = null;
                    if(!StringUtils.isEmpty(cellValue))
                        setData = typeParser.parseType(cellValue, field.getType());
                    field.set(object, setData);
                    checkValidation(object, row, i, cellValue, field.getName());
                }
            } catch (TypeParserException e) {
                ExcelReaderFieldError error = ExcelReaderFieldError.TYPE;
                ExcelReader.errorFieldList.add(ExcelReaderErrorField.builder()
                        .type(error.name())
                        .row(row.getRowNum()+1)
                        .field(field.getName())
                        .fieldHeader((String) ExcelReader.headerList.get(i))
                        .inputData(cellValue)
                        .message(error.getMessage()+
                                "데이터 필드타입 - "+field.getType().getSimpleName()+
                                ", 입력값 필드타입 - "+cellValue.getClass().getSimpleName())
                        .exceptionMessage(ExceptionUtils.getRootCauseMessage(e))
                        .build());
            } catch (Exception e) {
                ExcelReaderFieldError error = ExcelReaderFieldError.UNKNOWN;
                ExcelReader.errorFieldList.add(ExcelReaderErrorField.builder()
                        .type(error.name())
                        .row(row.getRowNum()+1)
                        .field(field.getName())
                        .fieldHeader((String) ExcelReader.headerList.get(i))
                        .inputData(cellValue)
                        .message(error.getMessage())
                        .exceptionMessage(ExceptionUtils.getRootCauseMessage(e))
                        .build());
            }
            i++;
        }

        return object;
    }

    /**
     * 객체에 대한 Validation 을 검증해서 검증을 통과 하지 못한 내역이 있을 경우 에러 리스트에 담는다
     * @param object
     * @param row
     * @param i
     * @param
     */
    private static<T> void checkValidation(T object, Row row, int i, String cellValue, String fieldName) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Object>> constraintValidations = validator.validate(object);
        ConstraintViolation validData = constraintValidations.stream()
                .filter(data -> data.getPropertyPath().toString().equals(fieldName))
                .findFirst().orElse(null);

        if(Objects.isNull(validData)) return;

        String fieldHeader = (String) ExcelReader.headerList.get(i);
        ExcelReaderFieldError error = ExcelReaderFieldError.VALID;
        String exceptionMessage = validData.getMessage();

        if(validData.getMessageTemplate().contains("NotEmpty") || validData.getMessageTemplate().contains("NotNull") || validData.getMessageTemplate().contains("NotBlank")) {
            error = ExcelReaderFieldError.EMPTY;
            exceptionMessage = fieldHeader+"은 필수 입력값입니다";
        }

        ExcelReader.errorFieldList.add(ExcelReaderErrorField.builder()
                .type(error.name())
                .row(row.getRowNum()+1)
                .field(validData.getPropertyPath().toString())
                .fieldHeader(fieldHeader)
                .inputData(cellValue)
                .message(error.getMessage())
                .exceptionMessage(exceptionMessage)
                .build());
    }
}
