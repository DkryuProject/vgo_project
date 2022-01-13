package io.vengine.api.v1.user.entity;

import io.vengine.api.common.entity.CommonDateEntity;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_mail_send")
public class UserMailSend extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, length = 50)
    @Email
    @NotBlank
    private String email;

    //메일종류(0: 초대메일, 1: po 알림, 2: 회사 가입 요청, 3: 회사 승인, 4:자재 등록, 5.파트너 회사 승인, 6: ADHOC PO 알림, 7: 파트너 등록 알림, 8:비밀번호 reset, 9 파트너 가입 요청, 10: 파트너 가입 승인, 11: 파트너 가입 거절, 12: 회원 가입  요청)
    //0: Invite, 1: PO, 2: join, 3: confirm, 4:material, 5.partner, 6: ADHOC PO, 7: partner register, 8:reset
    @Column(name = "send_type",nullable = false)
    private int sendType;

    //예(po 번호)
    @Column(name = "type_idx")
    private Long typeIdx;

    //미발송: 0, 발송완료: 1, 예러: 2
    @Column(name = "status",nullable = false)
    @ColumnDefault("0")
    private int status;

    @Column(name = "send_date")
    private LocalDateTime sendDate;
}
