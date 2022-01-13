package io.vengine.api.common.enums;

import io.vengine.api.common.service.EnumModel;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;

import java.util.Arrays;

public enum UserStatus implements EnumModel {
    A("Active"),
    W("Waiting"),
    D("Deactive"),
    ;
    private String status;

    UserStatus(String status) {
        this.status = status;
    }

    @Override
    public String getKey() {
        return name();
    }

    @Override
    public String getValue() {
        return this.status;
    }

    public static UserStatus of(String status){
        return Arrays.stream(UserStatus.values())
                .filter(v-> v.getKey().equals(status))
                .findAny()
                .orElseThrow(()-> new BusinessException(String.format("상태코드에 status=[%s]가 존재하지 않습니다",status), ErrorCode.INTERNAL_SERVER_ERROR));
    }
}
