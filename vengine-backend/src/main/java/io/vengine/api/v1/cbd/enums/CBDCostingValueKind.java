package io.vengine.api.v1.cbd.enums;

import io.vengine.api.common.service.EnumModel;

public enum CBDCostingValueKind implements EnumModel {
    NUM("Number"),
    PERCENT("%")
    ;

    private String kindValue;

    CBDCostingValueKind(String value) {
        this.kindValue = value;
    }

    @Override
    public String getKey() {
        return name();
    }

    @Override
    public String getValue() {
        return kindValue;
    }
}
