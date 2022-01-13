package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.math.BigInteger;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_material_purchase_order_style",
        indexes = {
                @Index(name = "fk_mmpos_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mmpos_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mmpos_user_id", columnList = "user_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclMaterialPurchaseOrderStyle extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //스타일 번호
    @Column(name = "style_number", nullable = false)
    private BigInteger styleNumber;

    //자재 po 발주 아이템
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_material_purchase_order_item_id", referencedColumnName = "id", nullable = false)
    private MclMaterialPurchaseOrderItem mclMaterialPurchaseOrderItem;
}
