package io.vengine.api.common.enums;

import io.vengine.api.common.service.EnumModel;

public enum MaterialInfoType implements EnumModel {
    FABRIC("fabric"),
    TRIM("trim"),
    ACCESSORY("accessory"),
    ;

    private String typeValue;

    MaterialInfoType(String value) {
        this.typeValue = value;
    }

    @Override
    public String getKey() {
        return name();
    }

    @Override
    public String getValue() {
        return typeValue;
    }
}
