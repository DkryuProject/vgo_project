package io.vengine.api.common.converters;

import io.vengine.api.v1.commonInfo.enums.CostingType;

import javax.persistence.AttributeConverter;

public class CostingTypeConverter implements AttributeConverter<CostingType, String> {
    @Override
    public String convertToDatabaseColumn(CostingType attribute) {
        return attribute.getValue();
    }

    @Override
    public CostingType convertToEntityAttribute(String dbData) {
        return CostingType.ofCostingTypeValue(dbData);
    }
}
