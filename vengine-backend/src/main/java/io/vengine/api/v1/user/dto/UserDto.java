package io.vengine.api.v1.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModelProperty;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class UserDto {
    @Getter
    @Setter
    public static class UserInfo {
        private Long userId;
        private String userName;
        private String email;
        private int manager;
        private String status;
        private UserLevel level;

        @JsonIgnoreProperties({"type"})
        private CommonInfoDto.BasicInfo menuType;

        private CompanyDto company;
        private int termsAgree;
        private String officePhone;
        private String mobilePhone;

        @JsonProperty("user_type")
        private String userType;
        private LocalDateTime createData;
        private LocalDateTime updateData;
    }

    @Getter
    @Setter
    public static class UserLevel {
        private Long userLevelId;
        private String userLevelName;
    }

    @Getter
    @Setter
    public static class UserDepartment {
        private Long userDepartmentId;
        private String userDepartmentName;
    }

    @Getter
    @Setter
    public static class UserRequest {
        @NotNull(message = "User ID가 없습니다.")
        private Long userID;

        //@NotBlank(message = "패스워드를 입력하세요.")
        @Size(max=100)
        //@Pattern(regexp = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}",
        // message = "비밀번호는 영문 대,소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다.")
        private String password;

        @Size(max=100)
        @NotEmpty(message = "User Name이 없습니다.")
        private String userName;

        @Size(max=100)
        private String officePhone;

        @Size(max=100)
        private String mobilePhone;

        @NotNull(message = "약관 동의 확인 부탁드립니다.")
        private int termsAgree;
    }

    @Getter
    @Setter
    public static class InviteRequest {
        @Email(message = "이메일 형식이 아닙니다.")
        @NotBlank(message = "이메일이 없습니다.")
        @Size(max=150)
        private String email;

        //@NotNull(message = "직책을 선택하세요")
        private Long levelID;
    }

    @Getter
    @Setter
    public static class UserStatusRequest {
        @NotNull(message = "User ID가 없습니다.")
        private Long userID;

        @NotNull(message = "직책을 선택하세요")
        private Long levelID;

        @NotEmpty(message = "status 를 선택하세요")
        private String status;
    }

    @Getter
    @Setter
    public static class UserSignUp {
        @Size(max=50)
        @Email
        private String email;

        @Size(max=100)
        private String name;

        @Size(max=100)
        //@Pattern(regexp = "^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[!@#$%^&+=]).*$", message = "비밀번호 형식이 아닙니다.")
        private String password;

        @JsonProperty("terms_agree")
        private int termsAgree;
    }
}
