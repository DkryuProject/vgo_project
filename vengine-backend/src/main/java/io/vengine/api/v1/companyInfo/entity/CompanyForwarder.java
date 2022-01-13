package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.user.entity.Company;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comp_forwarder", indexes = {
        @Index(name = "fk_compf_forwarder_comp_id", columnList = "forwarder_comp_id"),
        @Index(name = "fk_compf_cm_country_pol_id", columnList = "cm_country_pol_id"),
        @Index(name = "fk_compf_cm_port_pol_id", columnList = "cm_port_pol_id"),
        @Index(name = "fk_compf_cm_country_pod_id", columnList = "cm_country_pod_id"),
        @Index(name = "fk_compf_cm_port_pod_id", columnList = "cm_port_pod_id"),
        @Index(name = "fk_compf_comp_id", columnList = "comp_id"),
        @Index(name = "fk_compf_dept_id", columnList = "dept_id"),
        @Index(name = "fk_compf_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyForwarder extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //포워더(회사) 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forwarder_comp_id", referencedColumnName = "id", nullable = false)
    private Company forwarderCompany;
    
    //출발지 국가 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_country_pol_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo cmCountryPol;
    
    //출발지 포트 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_port_pol_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo cmPortPol;
    
    //출발지 LOCODE [국가명 2코드] + [포트명 3코드]
    @Column(name = "pol_locode", length = 10, nullable = false)
    private String polLocode;
    
    //도착지 국가 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_country_pod_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo cmCountryPod;
    
    //도착지 포트 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_port_pod_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo cmPortPod;
    
    //도착지 LOCODE [국가명 2코드] + [포트명 3코드]
    @Column(name = "pod_locode", length = 10, nullable = false)
    private String podLocode;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "companyBuyer", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyBuyerDeduction> companyBuyerDeductions = new ArrayList<>();
}
