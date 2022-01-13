package io.vengine.api.common.enums;

import io.vengine.api.common.service.EnumModel;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;

import java.util.Arrays;

public enum RelationType implements EnumModel {
    MANUFACTURER("MANUFACTURER"),
    FORWARDER("FORWARDER"),
    SUPPLIER("SUPPLIER"),
    BUYER("BUYER"),
    ;

    private String typeValue;

    RelationType(String value) {
        this.typeValue = value;
    }

    @Override
    public String getKey() {
        return name();
    }

    @Override
    public String getValue() {
        return this.typeValue;
    }

    public static RelationType of(String typeValue){
        return Arrays.stream(RelationType.values())
                .filter(v-> v.getValue().equals(typeValue))
                .findAny()
                .orElseThrow(()-> new BusinessException(String.format("상태코드에 type=[%s]이 존재하지 않습니다",typeValue), ErrorCode.INTERNAL_SERVER_ERROR));
    }
}
