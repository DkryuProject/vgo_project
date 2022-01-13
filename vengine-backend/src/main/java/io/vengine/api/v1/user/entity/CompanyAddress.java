package io.vengine.api.v1.user.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_company_address",
        indexes = {
                @Index(name = "fk_company_address_comp_id", columnList = "comp_id"),
                @Index(name = "fk_company_address_country_id", columnList = "country_id")
        }
)
@AuditOverride(forClass = CommonDateEntity.class)
//@Audited
public class CompanyAddress extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //등록 회사
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_id", referencedColumnName = "id", nullable = false)
    private Company company;

    //국가
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", referencedColumnName = "id")
    private CommonBasicInfo countryId;

    //도시명
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", referencedColumnName = "id")
    private CommonBasicInfo cityId;

    //주
    @Column(name="state", length = 100)
    private String state;

    //나머지주소
    @Column(name="etc", length = 200)
    private String etc;

    //우편번호
    @Column(name="zip_code", length = 10)
    private String zipCode;

    //상태값
    @Column(name = "status", length = 30)
    private String status;

    //비지니스 디폴트 타입
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_biz_default_id", nullable = false, referencedColumnName = "id")
    private CommonBasicInfo commonBizType;

    //회사
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_info_id", referencedColumnName = "id", nullable = false)
    private Company companyInfo;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id", referencedColumnName = "id", nullable = false)
    private Department department;

    //삭제상태여부(A: 사용중, D: 삭제상태)
    @Column(name = "del_flag", length = 2)
    private String delFlag;

    //회사명(주소 타이틀)
    @Column(name="work_place", length = 150)
    private String workPlace;

    //대표 주소 여부(0: 아님, 1: 대표주소)
    @Column(name="representive")
    @ColumnDefault("0")
    private int representitive;

    @PrePersist
    public void prePersist(){
        this.delFlag = this.delFlag == null ? "N" : this.delFlag;
    }
}
