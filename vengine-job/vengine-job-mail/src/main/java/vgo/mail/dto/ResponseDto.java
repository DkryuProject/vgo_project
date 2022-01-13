package vgo.mail.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseDto {
    String success;
    int code;
    String msg;
    String data;
}
