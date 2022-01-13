package io.vengine.api.v1.user.entity;

import com.fasterxml.jackson.annotation.*;
import io.vengine.api.common.converters.UserStatusConverter;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.common.enums.UserStatus;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.material.entity.MaterialInfo;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Proxy;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_info",
        indexes = {
                @Index(name = "fk_user_comp_id", columnList = "comp_id"),
                @Index(name = "fk_user_dept_id", columnList = "dept_id"),
                @Index(name = "fk_user_level_id", columnList = "level_id"),
                @Index(name = "fk_user_common_menu_id", columnList = "common_menu_id")
        }
        )
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})  // Post Entity에서 User와의 관계를 Json으로 변환 시 오류 방지를 위한 코드
// User class는 다른 class에서 연관관계 매핑을 통해 Lazy 로딩되므로 캐싱 시 문제가 발생하지 않도록 proxy false 설정.
@Proxy(lazy = false)
@AuditOverride(forClass = CommonDateEntity.class)
//@Audited
public class User extends CommonDateEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    @Email
    @NotBlank
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name="password", length = 100)
    private String password;

    @Column(name="full_name", length = 100)
    private String fullName;

    @Column(name="office_phone", length = 100)
    private String officePhone;

    @Column(name="mobile_phone", length = 100)
    private String mobilePhone;

    @Column(name="memo", columnDefinition = "TEXT")
    private String memo;

    @Column(name = "terms_agree")
    @ColumnDefault("0")
    private int termsAgree;

    @Column(name="manager", nullable = false)
    @ColumnDefault("0")
    private int manager;

    //사용자 상태(A=active, D=detach, W=waiting)
    @Convert(converter = UserStatusConverter.class)
    @Column(name="status", nullable = false)
    private UserStatus status;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "comp_id", referencedColumnName = "id", nullable = false)
    private Company compId;

    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id", referencedColumnName = "id", nullable = false)
    private Department deptId;

    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_menu_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo menuType;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "level_id", referencedColumnName = "id", nullable = false)
    private UserLevel levelId;

    @Column(name="secret_key", length = 150)
    private String secretKey;

    @Column(name="user_type", nullable = false, length = 10)
    @ColumnDefault("C")
    private String userType;

//@NotAudited
    @JsonManagedReference
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MaterialInfo> materialInfos = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CBDCover> cbdCovers = new ArrayList<>();

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        authorities.add(new SimpleGrantedAuthority(getLevelId().getName()));
        return authorities;
    }

    // 사용자의 id를 반환 (unique한 값)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Override
    public String getUsername() {
        return email;
    }

    // 사용자의 password를 반환
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Override
    public String getPassword() {
        return password;
    }

    // 계정 만료 여부 반환
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정 잠금 여부 반환
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 패스워드의 만료 여부 반환
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 계정 사용 가능 여부 반환
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Override
    public boolean isEnabled() {
        return true;
    }
}
