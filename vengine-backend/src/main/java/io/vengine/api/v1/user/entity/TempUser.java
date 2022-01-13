package io.vengine.api.v1.user.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.common.enums.UserStatus;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_info_pending")
public class TempUser extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, unique = true, length = 50)
    @Email
    @NotBlank
    private String email;

    @Column(name="full_name", length = 100)
    private String fullName;

    @Column(name = "terms_agree")
    @ColumnDefault("0")
    private int termsAgree;

    @Column(name="status", nullable = false)
    private String status;

    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_menu_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo menuType;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_pending_id", referencedColumnName = "id", nullable = false)
    private TempCompany tempCompany;
}
