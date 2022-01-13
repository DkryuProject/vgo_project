package io.vengine.api.v1.companyInfo.entity;

import io.vengine.api.common.entity.CommonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.*;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comp_purchase_order_type", indexes = {
        @Index(name = "fk_comppot_comp_id", columnList = "comp_id"),
        @Index(name = "fk_comppot_dept_id", columnList = "dept_id"),
        @Index(name = "fk_comppot_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyPurchaseOrderType extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //주문종류명
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    //설명
    @Column(name = "description", length = 200)
    private String description;


}
