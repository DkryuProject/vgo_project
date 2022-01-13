package vgo.mail.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRequestDto {
    private String companyName;
    private String userName;
    private String userEmail;
}
