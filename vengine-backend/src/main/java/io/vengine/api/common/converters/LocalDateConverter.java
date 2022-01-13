package io.vengine.api.common.converters;

import javax.persistence.AttributeConverter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class LocalDateConverter implements AttributeConverter<LocalDate, String> {
    @Override
    public String convertToDatabaseColumn(LocalDate attribute) {
        if(attribute == null) {
            return "";
        } else {
            return attribute.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        }
    }

    @Override
    public LocalDate convertToEntityAttribute(String dbData) {
        if(dbData == null) {
            return null;
        } else {
            return LocalDate.parse(dbData, DateTimeFormatter.ISO_LOCAL_DATE);
        }
    }
}
