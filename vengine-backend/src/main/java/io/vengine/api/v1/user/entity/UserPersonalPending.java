package io.vengine.api.v1.user.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonDateEntity;
import lombok.*;
import org.hibernate.envers.AuditJoinTable;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_personal_pending")
public class UserPersonalPending extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "comp_id", referencedColumnName = "id", nullable = false)
    private Company company;

    //승인 처리중 : P, 승인 거부 : R, 승인 완료 : A
    @Column(name="status", length = 2, nullable = false)
    private String status;
}
