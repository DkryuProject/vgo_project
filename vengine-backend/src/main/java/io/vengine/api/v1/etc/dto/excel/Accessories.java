package io.vengine.api.v1.etc.dto.excel;

import io.vengine.api.common.dto.ExcelColumnName;
import io.vengine.api.common.dto.ExcelDto;
import io.vengine.api.common.dto.ExcelFileName;
import io.vengine.api.common.utils.ExcelUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.poi.ss.usermodel.Row;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Arrays;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ExcelFileName(filename = "accessories")
public class Accessories implements ExcelDto {
    @NotEmpty
    @ExcelColumnName(headerName = "No.")
    private String no;

    @NotEmpty
    @ExcelColumnName(headerName = "Supplier Name", cellIndex = "A")
    private String supplier;

    @NotEmpty
    @Size(max = 100)
    @ExcelColumnName(headerName = "Item Name", cellType = "TEXT_LEFT")
    private String itemName;

    @NotEmpty
    @ExcelColumnName(headerName = "Item Type", cellIndex = "J")
    private String itemType;

    @NotEmpty
    @ExcelColumnName(headerName = "Item Category", cellIndex = "K")
    private String itemCategory;

    @NotEmpty
    @Size(max = 200)
    @ExcelColumnName(headerName = "Item Detail")
    private String itemDetail;

    @Size(max=20, message = "Only Number can do it")
    @ExcelColumnName(headerName = "Material No.")
    private String MaterialNo;

    @NotEmpty
    @ExcelColumnName(headerName = "Buyer Name", cellIndex = "B")
    private String buyer;

    @Size(max = 100)
    @ExcelColumnName(headerName = "Post Processing", cellType = "TEXT_LEFT")
    private String postProcessing;

    @NotEmpty
    @ExcelColumnName(headerName = "Uom (Supplier)", cellIndex = "E")
    private String originalUom;

    @Size(max = 10)
    @ExcelColumnName(headerName = "Item Size", cellType = "TEXT_LEFT")
    private String itemSize;

    @ExcelColumnName(headerName = "Item Size (UOM)", cellIndex = "E")
    private String itemSizeUom;

    @NotEmpty
    @ExcelColumnName(headerName = "Currency", cellIndex = "C")
    private String currency;

    @NotEmpty
    @Pattern(regexp = "^([0-9]{1,15})(.[0-9]{1,5})?$", message = "15 digits of an integer, 5 decimal places.")
    @ExcelColumnName(headerName = "Price", cellType = "TEXT_RIGHT")
    private String price;

    @Pattern(regexp = "^[0-9]*$", message = "Only Number can do it.")
    @ExcelColumnName(headerName = "MOQ", cellType = "TEXT_RIGHT")
    private String moq;

    @Pattern(regexp = "^[0-9]*$", message = "Only Number can do it.")
    @ExcelColumnName(headerName = "MCQ", cellType = "TEXT_RIGHT")
    private String mcq;

    @Override
    public List<String> mapToList() {
        return Arrays.asList(no, supplier, itemName, itemType, itemCategory,
                itemDetail, MaterialNo, buyer, postProcessing, originalUom, itemSize, itemSizeUom,
                currency, price, moq, mcq
        );
    }

    /**
     * 엑셀 업로드 처리를 위한 객체
     * @param row
     * @return
     */
    public static Accessories from(Row row) {
        return ExcelUtils.setObjectMapping(new Accessories(), row);
    }
}
