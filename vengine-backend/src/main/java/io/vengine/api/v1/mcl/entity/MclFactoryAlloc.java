package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.user.entity.Company;
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
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_factory_alloc",
        indexes = {
                @Index(name = "fk_mfa_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mfa_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mfa_user_id", columnList = "user_id"),
                @Index(name = "fk_mfa_mcl_option_id", columnList = "mcl_option_id"),
                @Index(name = "fk_mfa_factory_comp_id", columnList = "factory_comp_id"),
                @Index(name = "fk_mfa_cm_material_product_id", columnList = "common_material_product_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclFactoryAlloc extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mcl option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_option_id", referencedColumnName = "id", nullable = false)
    private MclOption mclOption;

    //생산 공정
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_material_product_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo commonMaterialProduct;

    //공장(회사)
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "factory_comp_id", referencedColumnName = "id", nullable = false)
    private Company factory;

    //가먼트 오더 총 수량(po 테이블에서 assign 된 po의 sku 총합)
    @Column(name = "po_total_quantity", length = 11)
    private int poTotalQuantity;
}
