package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.Department;
import io.vengine.api.v1.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditJoinTable;

import javax.persistence.*;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_material_purchase_order_option")
public class MclMaterialPurchaseOrderOption extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //자재 po 발주
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_material_purchase_order_id", referencedColumnName = "id")
    private MclMaterialPurchaseOrder mclMaterialPurchaseOrder;

    //Upcharge, Discount on Sale
    @Column(name = "option_name", length = 30)
    private String name;

    //Num, Percentage
    @Column(name = "option_type", length = 20)
    private String type;

    //Num(소수점 2자리), Percentage(정수)
    @Column(name = "option_value", precision = 10, scale = 2)
    private BigDecimal value;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @AuditJoinTable
    private User user;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "dept_id", referencedColumnName = "id", nullable = false)
    private Department department;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "comp_id", referencedColumnName = "id", nullable = false)
    @AuditJoinTable
    private Company company;
}
