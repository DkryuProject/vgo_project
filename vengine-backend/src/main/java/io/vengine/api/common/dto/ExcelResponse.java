package io.vengine.api.common.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExcelResponse {
    private String fileName;
    private List excelList;
    private List errorList;
}
