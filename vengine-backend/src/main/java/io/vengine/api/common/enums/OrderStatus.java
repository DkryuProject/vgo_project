package io.vengine.api.common.enums;

import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;

import java.util.Arrays;

public enum OrderStatus {
    Published, Draft, Canceled, Revised, Confirm, Revert;

    public static OrderStatus of(String value){
        return Arrays.stream(OrderStatus.values())
                .filter(v-> v.equals(value))
                .findAny()
                .orElseThrow(()-> new BusinessException(String.format("상태코드에 type=[%s]이 존재하지 않습니다",value), ErrorCode.INTERNAL_SERVER_ERROR));
    }
}
