package io.vengine.api.common.utils;

import java.util.regex.Pattern;

public class PatternUtil {
    public static boolean decimalPointCheck(String value, int point){
        //정수일 경우
        if(Pattern.matches("^[0-9]*$", value)){
            return true;
        }

        //소숫점 자릿수 체크
        return Pattern.matches("^[0-9]*[.]?[0-9]{1,"+point+"}", value);
    }
}
