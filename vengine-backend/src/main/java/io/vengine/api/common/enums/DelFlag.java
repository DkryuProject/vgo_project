package io.vengine.api.common.enums;

import io.vengine.api.common.service.EnumModel;

public enum DelFlag implements EnumModel {
    A("사용"), //사용중
    N("미사용"), //미사용
    D("삭제"), //삭제상태
    ;

    private String statusValue;

    DelFlag(String value) {
        this.statusValue = value;
    }

    @Override
    public String getKey() {
        return name();
    }

    @Override
    public String getValue() {
        return statusValue;
    }
}
