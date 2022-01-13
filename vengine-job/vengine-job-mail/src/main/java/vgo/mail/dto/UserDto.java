package vgo.mail.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDto {
    private Long id;
    private String email;
    private String secretKey;
    private String company;
    private String registerCompany;
    private String userName;
    private String password;
}
