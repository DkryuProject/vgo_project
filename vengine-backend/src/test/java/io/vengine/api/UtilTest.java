package io.vengine.api;

import io.vengine.api.common.utils.PatternUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UtilTest {
    String value1="";
    String value2="";
    String value3="";

    @BeforeEach
    void setUp() {
        this.value1 = "12.34";
        this.value2 = "13221119";
        this.value3 = "12.343";
    }

    @Test
    void decimalPointCheck() {
        System.out.println("value1 check :" +PatternUtil.decimalPointCheck(this.value1, 2));
        System.out.println("value2 check :" +PatternUtil.decimalPointCheck(this.value2, 2));
        System.out.println("value3 check :" +PatternUtil.decimalPointCheck(this.value3, 5));
        System.out.println("value3 check :" +PatternUtil.decimalPointCheck(this.value3, 2));
    }
}