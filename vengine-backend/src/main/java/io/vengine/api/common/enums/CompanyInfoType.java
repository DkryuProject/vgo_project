package io.vengine.api.common.enums;

import io.vengine.api.common.service.EnumModel;

public enum CompanyInfoType  implements EnumModel {
    relation("관계사 및 회사 코드"),
    season("시즌 정보"),
    usage("사용처"),
    factory("공장창고"),
    forwarder("포워드"),
    market("마켓"),
    program("프로그램"),
    size("사이즈"),
    order("오더 종류"),
    indirect("간접 공임"),
    direct("직접 공임"),
    buyer("바이어 정보"),
    after("후가공 정보")
    ;

    private String typeValue;
    CompanyInfoType(String value) {
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
