package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.converters.RelationTypeConverter;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.enums.RelationType;
import io.vengine.api.v1.user.entity.Company;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comp_biz_relation")
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyBizRelation extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //관계 타입(MANUFACTURER, FORWARDER, SUPPLIER, ....)
    //@NotAudited
    @Convert(converter = RelationTypeConverter.class)
    @Column(name = "relation_type", nullable = false, length = 100)
    private RelationType relationType;

    //상태값(VERIFIED, UNVERIFIED) - 관계 등록된 사용자가 로그인 했을 시 처리
    @Column(name = "status", length = 30)
    private String status;

    //관계 회사
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "biz_comp_id", referencedColumnName = "id", nullable = false)
    private Company bizCompany;

    //등록 회사
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_register_id", referencedColumnName = "id", nullable = false)
    private Company companyRegister;

    @JsonManagedReference
    @OneToMany(mappedBy = "companyBizRelation", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyBizRequest> companyBizRequests = new ArrayList<>();
}
