package io.vengine.api.v1.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Arrays;

@Getter
@Setter
@AllArgsConstructor
public class MailDto {
    private String email;

    private EmailType emailType;

    private EmailStatus emailStatus;

    private LocalDateTime emailSendDate;

    public enum EmailType{
        Invite(0), PO(1), Join(2), Confirm(3), Material(4), Partner(5), ADHOC_PO(6), Partner_Register(7),
        PW_Reset(8),;

        private int emailType;
        EmailType(int emailType) {
            this.emailType = emailType;
        }

        public static EmailType of(int type) {
            return Arrays.stream(EmailType.values())
                    .filter(m-> m.emailType == type)
                    .findAny()
                    .orElse(null);
        }
    }

    public enum EmailStatus{
        미발송(0), 발송(1), 에러(2);

        private int emailStatus;
        EmailStatus(int emailStatus) {
            this.emailStatus = emailStatus;
        }

        public static EmailStatus of(int status) {
            return Arrays.stream(EmailStatus.values())
                    .filter(m-> m.emailStatus == status)
                    .findFirst()
                    .orElse(null);
        }
    }
}
