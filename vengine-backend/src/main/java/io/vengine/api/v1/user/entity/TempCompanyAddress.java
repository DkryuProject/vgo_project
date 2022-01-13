package io.vengine.api.v1.user.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import lombok.*;
import org.hibernate.envers.AuditJoinTable;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_company_address_pending")
public class TempCompanyAddress  extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_biz_default_id", nullable = false, referencedColumnName = "id")
    private CommonBasicInfo commonBizType;

    //회사명(주소 타이틀)
    @Column(name="work_place", length = 150)
    private String workPlace;

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
    private int status;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    //@NotAudited
    private User user;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "dept_id", referencedColumnName = "id")
    //@NotAudited
    private Department department;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "comp_id", referencedColumnName = "id")
    //@NotAudited
    private Company company;

    @JsonBackReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_pending_id", referencedColumnName = "id", nullable = false)
    private TempCompany tempCompany;
}
