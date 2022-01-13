package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditJoinTable;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comp_buyer_deduction", indexes = {
        @Index(name = "fk_compbd_comp_buyer_id", columnList = "comp_buyer_id"),
        @Index(name = "fk_compbd_comp_cost_id", columnList = "comp_cost_id"),
        @Index(name = "fk_compbd_cm_uom_id", columnList = "cm_uom_id"),
        @Index(name = "fk_compbd_comp_id", columnList = "comp_id"),
        @Index(name = "fk_compbd_dept_id", columnList = "dept_id"),
        @Index(name = "fk_compbd_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyBuyerDeduction extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //바이어 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_buyer_id", referencedColumnName = "id", nullable = false)
    private CompanyBuyer companyBuyer;

    //공임
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_cost_id", referencedColumnName = "id", nullable = false)
    private CompanyCost companyCost;

    //단위 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_uom_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo cmUom;

    //값
    @Column(name = "value", precision = 15, scale = 2, nullable = false)
    private BigDecimal value;
}
