package io.vengine.api.v1.user.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.common.enums.RelationType;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_company_pending")
public class TempCompany extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="name", nullable = false, length = 100)
    @NotBlank
    private String name;

    @Column(name="nick_name", length = 100)
    private String nickName;

    @Column(name = "status", length = 11, nullable = false)
    @ColumnDefault("1")
    private int status;

    @Column(name = "terms_agree")
    @ColumnDefault("0")
    private int termsAgree;

    @Column(name = "terms_agree_final", nullable = false)
    @ColumnDefault("0")
    private int termsAgreeFinal;

    @Column(name="business_number", length = 20)
    private String businessNumber;

    @Column(name="business_file_url", length = 255)
    private String businessFileUrl;

    //비지니스 디폴트 타입
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_biz_default_id", nullable = false, referencedColumnName = "id")
    private CommonBasicInfo commonBizType;

    @Column(name = "relation_type", length = 100)
    private String relationType;

    @JsonManagedReference
    @OneToMany(mappedBy = "tempCompany", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TempUser> tempUsers = new ArrayList<>();

    @JsonManagedReference
    @OneToOne(mappedBy = "tempCompany", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TempCompanyAddress tempCompanyAddress;
}
