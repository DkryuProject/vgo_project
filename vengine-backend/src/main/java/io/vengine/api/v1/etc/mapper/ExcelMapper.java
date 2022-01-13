package io.vengine.api.v1.etc.mapper;

import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.etc.dto.excel.Accessories;
import io.vengine.api.v1.etc.dto.excel.Fabric;
import io.vengine.api.v1.etc.dto.excel.Port;
import io.vengine.api.v1.etc.dto.excel.Trim;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
public interface ExcelMapper {
    ExcelMapper INSTANCE = Mappers.getMapper(ExcelMapper.class);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "cmName1", source = "cmName1"),
            @Mapping(target = "cmName2", source = "cmName2")
    })
    Port toPortExcel(CommonBasicInfo commonBasicInfo);

    List<Port> toPortExcel(List<CommonBasicInfo> commonBasicInfos);

    @Mappings({
            @Mapping(target = "no", source = "excelA.no"),
            @Mapping(target = "supplier", source = "excelA.supplier"),
            @Mapping(target = "itemName", source = "excelA.itemName"),
            @Mapping(target = "itemCategory", source = "excelA.itemCategory"),
            @Mapping(target = "structure", source = "excelA.structure"),
            @Mapping(target = "yarnSizeWrap", source = "excelA.yarnSizeWrap"),
            @Mapping(target = "yarnSizeWeft", source = "excelA.yarnSizeWeft"),
            @Mapping(target = "epi", source = "excelA.epi"),
            @Mapping(target = "ppi", source = "excelA.ppi"),
            @Mapping(target = "shrinkagePlus", source = "excelA.shrinkagePlus"),
            @Mapping(target = "shrinkageMinus", source = "excelA.shrinkageMinus"),
            @Mapping(target = "fabricContents1", source = "excelA.fabricContents1"),
            @Mapping(target = "value1", source = "excelA.value1"),
            @Mapping(target = "fabricContents2", source = "excelA.fabricContents2"),
            @Mapping(target = "value2", source = "excelA.value2"),
            @Mapping(target = "fabricContents3", source = "excelA.fabricContents3"),
            @Mapping(target = "value3", source = "excelA.value3"),
            @Mapping(target = "fabricContents4", source = "excelA.fabricContents4"),
            @Mapping(target = "value4", source = "excelA.value4"),
            @Mapping(target = "materialNo", source = "excelB.materialNo"),
            @Mapping(target = "buyer", source = "excelB.buyer"),
            @Mapping(target = "postProcessing", source = "excelB.postProcessing"),
            @Mapping(target = "dyeing", source = "excelB.dyeing"),
            @Mapping(target = "printing", source = "excelB.printing"),
            @Mapping(target = "originalUom", source = "excelB.originalUom"),
            @Mapping(target = "width", source = "excelB.width"),
            @Mapping(target = "widthUom", source = "excelB.widthUom"),
            @Mapping(target = "weight", source = "excelB.weight"),
            @Mapping(target = "weightUom", source = "excelB.weightUom"),
            @Mapping(target = "fullWidth", source = "excelB.fullWidth"),
            @Mapping(target = "fullWidthUom", source = "excelB.fullWidthUom"),
            @Mapping(target = "currency", source = "excelB.currency"),
            @Mapping(target = "price", source = "excelB.price"),
            @Mapping(target = "moq", source = "excelB.moq"),
            @Mapping(target = "mcq", source = "excelB.mcq")
    })
    Fabric toFabricMaterial(Fabric excelA, Fabric excelB);

    @Mappings({
            @Mapping(target = "no", source = "excelA.no"),
            @Mapping(target = "supplier", source = "excelA.supplier"),
            @Mapping(target = "itemName", source = "excelA.itemName"),
            @Mapping(target = "itemCategory", source = "excelA.itemCategory"),
            @Mapping(target = "itemDetail", source = "excelA.itemDetail"),
            @Mapping(target = "materialNo", source = "excelB.materialNo"),
            @Mapping(target = "buyer", source = "excelB.buyer"),
            @Mapping(target = "postProcessing", source = "excelB.postProcessing"),
            @Mapping(target = "originalUom", source = "excelB.originalUom"),
            @Mapping(target = "width", source = "excelB.width"),
            @Mapping(target = "widthUom", source = "excelB.widthUom"),
            @Mapping(target = "weight", source = "excelB.weight"),
            @Mapping(target = "weightUom", source = "excelB.weightUom"),
            @Mapping(target = "fullWidth", source = "excelB.fullWidth"),
            @Mapping(target = "fullWidthUom", source = "excelB.fullWidthUom"),
            @Mapping(target = "itemSize", source = "excelB.itemSize"),
            @Mapping(target = "itemSizeUom", source = "excelB.itemSizeUom"),
            @Mapping(target = "currency", source = "excelB.currency"),
            @Mapping(target = "price", source = "excelB.price"),
            @Mapping(target = "moq", source = "excelB.moq"),
            @Mapping(target = "mcq", source = "excelB.mcq")
    })
    Trim toTrimMaterial(Trim excelA, Trim excelB);

    @Mappings({
            @Mapping(target = "no", source = "excelA.no"),
            @Mapping(target = "supplier", source = "excelA.supplier"),
            @Mapping(target = "itemName", source = "excelA.itemName"),
            @Mapping(target = "itemType", source = "excelA.itemType"),
            @Mapping(target = "itemCategory", source = "excelA.itemCategory"),
            @Mapping(target = "itemDetail", source = "excelA.itemDetail"),
            @Mapping(target = "materialNo", source = "excelB.materialNo"),
            @Mapping(target = "buyer", source = "excelB.buyer"),
            @Mapping(target = "postProcessing", source = "excelB.postProcessing"),
            @Mapping(target = "originalUom", source = "excelB.originalUom"),
            @Mapping(target = "itemSize", source = "excelB.itemSize"),
            @Mapping(target = "itemSizeUom", source = "excelB.itemSizeUom"),
            @Mapping(target = "currency", source = "excelB.currency"),
            @Mapping(target = "price", source = "excelB.price"),
            @Mapping(target = "moq", source = "excelB.moq"),
            @Mapping(target = "mcq", source = "excelB.mcq")
    })
    Accessories toAccessoriesMaterial(Accessories excelA, Accessories excelB);
}
