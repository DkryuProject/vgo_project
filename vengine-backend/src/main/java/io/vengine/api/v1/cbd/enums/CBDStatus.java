package io.vengine.api.v1.cbd.enums;

import io.vengine.api.common.service.EnumModel;
import lombok.Getter;

@Getter
public enum CBDStatus implements EnumModel {
    NEW("NEW"), //처음 [CBD COVER]가 생성된 처음 상태
    CBD("CBD"), //[CBD OPTION]만 생성된 상태
    MCL("MCL"), //[MCL OPTION]이 하나라도 생성되었을 때 상태
    RM_PO("RM PO"), //[RM PO]가 하나라도 생성되었을 때 상태
    WIP("WIP"), //인벤토리에서 해당 DESIGN#건으로 한 건이라도 PRODUCTION RECORD가 생겼을 때
    AR("AR"), //[ACCOUNT RECEIVALBE]에 한 건이라도 기록이 되었을 경우
    ;

    private String statusValue;

    CBDStatus(String value) {
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
