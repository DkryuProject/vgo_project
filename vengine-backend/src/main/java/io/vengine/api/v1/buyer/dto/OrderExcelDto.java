package io.vengine.api.v1.buyer.dto;

import io.vengine.api.common.utils.ExcelUtils;
import lombok.*;
import org.apache.poi.ss.usermodel.Row;

import javax.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderExcelDto {
    @NotBlank
    @Size(max = 45)
    private String style;

    @NotBlank
    @Size(max = 30)
    private String poNumber;

    @NotBlank
    @Size(min = 1, max = 3, message = "3자리가 아닙니다.")
    private String incoterms;

    @NotBlank
    @Size(min = 1, max = 2, message = "국가코드는 2자리입니다.")
    private String originCountry;

    @NotBlank
    @Size(min = 1, max = 2, message = "국가코드는 2자리입니다.")
    private String destinationCountry;

    @NotBlank
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "날짜 입력 형식을 확인 부탁드립니다.")
    private String start;

    @NotBlank
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "날짜 입력 형식을 확인 부탁드립니다.")
    private String end;

    @NotBlank
    private String shipMode;

    @NotBlank
    @Size(max = 20)
    private String sku;

    @NotBlank
    @Size(max = 20)
    private String market;

    @NotBlank
    @Size(max = 50)
    private String color;

    @NotBlank
    @Size(max = 10)
    private String size;

    @NotBlank
    @Pattern(regexp = "^[0-9]*$", message = "숫자만 됩니다.")
    private String qty;

    @NotBlank
    @Pattern(regexp = "^[0-9]*\\.?[0-9]*$", message = "소수점 포함 숫자만 됩니다.")
    private String unitPrice;

    /**
     * 엑셀 업로드 처리를 위한 객체
     * @param row
     * @return
     */
    public static OrderExcelDto from(Row row) {
        return ExcelUtils.setObjectMapping(new OrderExcelDto(), row);
    }
}
