package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.converters.RelationTypeConverter;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.enums.RelationType;
import io.vengine.api.v1.user.entity.Company;
import lombok.*;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comp_biz_request")
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyBizRequest extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //회사 관계 리스트 순번
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_biz_relation_id", referencedColumnName = "id", nullable = false)
    private CompanyBizRelation companyBizRelation;

    //요청 회사
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_comp_id", referencedColumnName = "id", nullable = false)
    private Company requestCompany;

    //요청 받은 회사
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "response_comp_id", referencedColumnName = "id", nullable = false)
    private Company responseCompany;

    //상태 여부(0=active, 1=deactive, 2: waiting)
    @Column(name = "approve_status")
    private int approveStatus;
}
