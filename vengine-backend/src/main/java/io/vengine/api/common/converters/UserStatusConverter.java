package io.vengine.api.common.converters;

import io.vengine.api.common.enums.UserStatus;

import javax.persistence.AttributeConverter;

public class UserStatusConverter implements AttributeConverter<UserStatus, String> {
    @Override
    public String convertToDatabaseColumn(UserStatus attribute) {
        return attribute.getKey();
    }

    @Override
    public UserStatus convertToEntityAttribute(String dbData) {
        return UserStatus.of(dbData);
    }
}
