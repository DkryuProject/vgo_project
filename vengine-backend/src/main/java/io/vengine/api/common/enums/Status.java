package io.vengine.api.common.enums;

import io.vengine.api.common.service.EnumModel;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;

import java.util.Arrays;

public enum Status implements EnumModel {
    OPEN("OPEN"),
    CLOSE("CLOSE"),
    ;

    private String statusValue;

    Status(String value) {
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

    public static Status ofStatusValue(String statusValue){
        return Arrays.stream(Status.values())
                    .filter(v-> v.getValue().equals(statusValue))
                    .findAny()
                    .orElseThrow(()-> new BusinessException(String.format("상태코드에 status=[%s]가 존재하지 않습니다",statusValue), ErrorCode.INTERNAL_SERVER_ERROR));
    }
}
