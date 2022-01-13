package io.vengine.api.common;

import io.vengine.api.common.utils.PatternUtil;
import io.vengine.api.error.errorCode.ErrorCode;

public class ValidationCheck {
    public static void unitPricePointCheck(String type, String unitPrice) throws Exception {
        if(type.equals("fabric")){
            if(!PatternUtil.decimalPointCheck(unitPrice, 2)){
                throw new Exception(String.format(ErrorCode.POINT_CHECK.getMessage(), "Unit Price", "2"));
            }
        }else{
            if(!PatternUtil.decimalPointCheck(unitPrice, 5)){
                throw new Exception(String.format(ErrorCode.POINT_CHECK.getMessage(), "Unit Price", "3"));
            }
        }
    }
}
