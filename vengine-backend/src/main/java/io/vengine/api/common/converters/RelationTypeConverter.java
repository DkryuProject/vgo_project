package io.vengine.api.common.converters;

import io.vengine.api.common.enums.RelationType;

import javax.persistence.AttributeConverter;

public class RelationTypeConverter implements AttributeConverter<RelationType, String> {
    @Override
    public String convertToDatabaseColumn(RelationType attribute) {
        return attribute.getValue();
    }

    @Override
    public RelationType convertToEntityAttribute(String dbData) {
        return RelationType.of(dbData);
    }
}
