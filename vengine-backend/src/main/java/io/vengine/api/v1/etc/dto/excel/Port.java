package io.vengine.api.v1.etc.dto.excel;

import io.vengine.api.common.dto.ExcelColumnName;
import io.vengine.api.common.dto.ExcelDto;
import io.vengine.api.common.dto.ExcelFileName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ExcelFileName(filename = "port")
public class Port implements ExcelDto {
    @ExcelColumnName(headerName = "Port ID")
    private Long id;

    @ExcelColumnName(headerName = "Port Name", cellType = "TEXT_LEFT")
    private String cmName1;

    @ExcelColumnName(headerName = "Port Code")
    private String cmName2;

    @Override
    public List<String> mapToList() {
        return Arrays.asList(String.valueOf(id), cmName1, cmName2);
    }
}
