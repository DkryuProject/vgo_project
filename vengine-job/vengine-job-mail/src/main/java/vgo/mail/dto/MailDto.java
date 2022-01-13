package vgo.mail.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MailDto {
    private Long id;

    private String email;
    //메일종류(0: 초대메일, 1: po 알림, 2: 회사 가입 요청, 3: 회사 승인)
    private int type;
    //예(po 번호)
    private Long idx;

    private int status;
}
