package io.vengine.api.v1.commonInfo.enums;

import io.vengine.api.common.service.EnumModel;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;

import java.util.Arrays;

public enum CostingType implements EnumModel {
    indirect("Indirect"), //Indirect
    direct("Direct") //Direct
    ;

    private String valueName;

    CostingType(String value) {
        this.valueName = value;
    }

    @Override
    public String getKey() {
        return name();
    }

    @Override
    public String getValue() {
        return this.valueName;
    }

    public static CostingType ofCostingTypeValue(String dbData) {
        return Arrays.stream(CostingType.values())
                .filter(v-> v.getValue().equals(dbData))
                .findAny()
                .orElseThrow(()-> new BusinessException(String.format("상태코드에 cotingType=[%s]가 존재하지 않습니다",dbData), ErrorCode.INTERNAL_SERVER_ERROR));
    }
}
