package io.vengine.api.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
@AllArgsConstructor
public enum ExcelReaderFieldError {
    TYPE("잘못된 데이터 타입: "),
    EMPTY("필수 입력값 누락"),
    VALID("유효성 검증 실패"),
    UNKNOWN("알수 없는 에러"),
    NODATA("No Data"),
    MATERIAL_YARN_SUM_ERROR("Material Yarn value sum error"),
    ;

    private static Map messageToMap;

    /** 메세지 */
    private final String message;

    /**
     * 에러명으로 ExcelReaderErrorConstant 맵으로 맵핑
     * @param name
     * @return
     */
    public static ExcelReaderFieldError getExcelReaderErrorConstant(String name) {
        if(messageToMap == null) {
            initMapping();
        }
        return (ExcelReaderFieldError) messageToMap.get(name);
    }

    /**
     * 맵 초기화
     */
    private static void initMapping() {
        messageToMap = new HashMap<>();
        for (ExcelReaderFieldError excelReaderFieldError : values()) {
            messageToMap.put(excelReaderFieldError.name(), excelReaderFieldError);
        }
    }
}
