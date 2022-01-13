package io.vengine.api.common.converters;

import javax.persistence.AttributeConverter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LocalDateTimeConverter implements AttributeConverter<LocalDateTime, String> {
    @Override
    public String convertToDatabaseColumn(LocalDateTime attribute) {
        if(attribute == null) {
            return "";
        } else {
            return attribute.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        }
    }

    @Override
    public LocalDateTime convertToEntityAttribute(String dbData) {
        if(dbData == null) {
            return null;
        } else {
            return LocalDateTime.parse(dbData, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        }
    }
}
