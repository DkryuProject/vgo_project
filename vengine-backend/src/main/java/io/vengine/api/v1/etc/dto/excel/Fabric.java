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
@ExcelFileName(filename = "fabric")
public class Fabric implements ExcelDto {
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
    @ExcelColumnName(headerName = "Fabric Type", cellIndex = "H")
    private String itemCategory;

    @NotEmpty
    @Size(max = 20)
    @ExcelColumnName(headerName = "Structure", cellType = "TEXT_LEFT")
    private String structure;

    @NotEmpty
    @Size(max = 20)
    @ExcelColumnName(headerName = "Yarn Size(Wrap)", cellType = "TEXT_LEFT")
    private String yarnSizeWrap;

    @NotEmpty
    @Size(max = 20)
    @ExcelColumnName(headerName = "Yarn Size(Weft)", cellType = "TEXT_LEFT")
    private String yarnSizeWeft;

    @NotEmpty
    @Pattern(regexp = "^[0-9]*$", message = "Only Number can do it")
    @ExcelColumnName(headerName = "Construction (EPI)", cellType = "TEXT_LEFT")
    private String epi;

    @NotEmpty
    @Pattern(regexp = "^[0-9]*$", message = "Only Number can do it.")
    @ExcelColumnName(headerName = "Construction (PPI)", cellType = "TEXT_LEFT")
    private String ppi;

    @Pattern(regexp = "^([0-9]{1,5})(.[0-9]{1})?$", message = "An integer of 5 digits, a decimal place.")
    @ExcelColumnName(headerName = "Shrinkage (+)", cellType = "TEXT_LEFT")
    private String shrinkagePlus;

    @Pattern(regexp = "^([0-9]{1,5})(.[0-9]{1})?$", message = "An integer of 5 digits, a decimal place.")
    @ExcelColumnName(headerName = "Shrinkage (-)", cellType = "TEXT_LEFT")
    private String shrinkageMinus;

    @NotEmpty
    @ExcelColumnName(headerName = "Fabric Contents(1)", cellIndex = "G")
    private String fabricContents1;

    @NotEmpty
    @Pattern(regexp = "^([0-9]{1,3})(.[0-9]{1,2})?$", message = "Three digits of an integer, two decimal places.")
    @ExcelColumnName(headerName = "Value", cellType = "TEXT_RIGHT")
    private String value1;

    @ExcelColumnName(headerName = "Fabric Contents(2)", cellIndex = "G")
    private String fabricContents2;

    @Pattern(regexp = "^([0-9]{1,3})(.[0-9]{1,2})?$", message = "Three digits of an integer, two decimal places.")
    @ExcelColumnName(headerName = "Value", cellType = "TEXT_RIGHT")
    private String value2;

    @ExcelColumnName(headerName = "Fabric Contents(3)", cellIndex = "G")
    private String fabricContents3;

    @Pattern(regexp = "^([0-9]{1,3})(.[0-9]{1,2})?$", message = "Three digits of an integer, two decimal places.")
    @ExcelColumnName(headerName = "Value", cellType = "TEXT_RIGHT")
    private String value3;

    @ExcelColumnName(headerName = "Fabric Contents(4)", cellIndex = "G")
    private String fabricContents4;

    @Pattern(regexp = "^([0-9]{1,3})(.[0-9]{1,2})?$", message = "Three digits of an integer, two decimal places.")
    @ExcelColumnName(headerName = "Value", cellType = "TEXT_RIGHT")
    private String value4;

    @Size(max=20, message = "20자리까지 가능")
    @ExcelColumnName(headerName = "Material No.")
    private String materialNo;

    @NotEmpty
    @ExcelColumnName(headerName = "Buyer Name", cellIndex = "B")
    private String buyer;

    @Size(max = 100)
    @ExcelColumnName(headerName = "Post Processing", cellType = "TEXT_LEFT")
    private String postProcessing;

    @Size(max = 100)
    @ExcelColumnName(headerName = "Dyeing", cellType = "TEXT_LEFT")
    private String dyeing;

    @Size(max = 100)
    @ExcelColumnName(headerName = "Printing", cellType = "TEXT_LEFT")
    private String printing;

    @NotEmpty
    @ExcelColumnName(headerName = "Uom (Supplier)", cellIndex = "D")
    private String originalUom;

    @Pattern(regexp = "^[0-9]*$", message = "Only Number can do it.")
    @ExcelColumnName(headerName = "Cuttable Width", cellType = "TEXT_LEFT")
    private String width;

    @ExcelColumnName(headerName = "Cuttable Width (UOM)", cellIndex = "L")
    private String widthUom;

    @Pattern(regexp = "^[0-9]*$", message = "Only Number can do it.")
    @ExcelColumnName(headerName = "Weight", cellType = "TEXT_LEFT")
    private String weight;

    @ExcelColumnName(headerName = "UOM (Weight)", cellIndex = "F")
    private String weightUom;

    @Pattern(regexp = "^[0-9]*$", message = "Only Number can do it.")
    @ExcelColumnName(headerName = "Full Width", cellType = "TEXT_LEFT")
    private String fullWidth;

    @ExcelColumnName(headerName = "Full Width (UOM)", cellIndex = "L")
    private String fullWidthUom;

    @NotEmpty
    @ExcelColumnName(headerName = "Currency", cellIndex = "C")
    private String currency;

    @NotEmpty
    @Pattern(regexp = "^([0-9]{1,15})(.[0-9]{1,5})?$", message = "15 digits of an integer, 5 decimal places.")
    @ExcelColumnName(headerName = "Price", cellType = "TEXT_RIGHT")
    private String price;

    @Pattern(regexp = "^[0-9]*$", message = "Only Number can do it.")
    @ExcelColumnName(headerName = "MOQ", cellType = "INT")
    private String moq;

    @Pattern(regexp = "^[0-9]*$", message = "Only Number can do it.")
    @ExcelColumnName(headerName = "MCQ", cellType = "INT")
    private String mcq;

    @Override
    public List<String> mapToList() {
        return Arrays.asList(no, supplier, itemName, itemCategory,
                structure, yarnSizeWrap, yarnSizeWeft, epi, ppi, shrinkagePlus, shrinkageMinus,
                fabricContents1, value1, fabricContents2, value2, fabricContents3, value3, fabricContents4, value4,
                materialNo, buyer, postProcessing, dyeing, printing, originalUom, width, widthUom, weight, weightUom,
                currency, price, moq, mcq
        );
    }

    /**
     * 엑셀 업로드 처리를 위한 객체
     * @param row
     * @return
     */
    public static Fabric from(Row row) {
        return ExcelUtils.setObjectMapping(new Fabric(), row);
    }
}
