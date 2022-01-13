package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.Department;
import io.vengine.api.v1.user.entity.User;
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
@Table(name = "mcl_order_quantity_option",
        indexes = {
                @Index(name = "fk_moq_comp_id", columnList = "comp_id"),
                @Index(name = "fk_moq_dept_id", columnList = "dept_id"),
                @Index(name = "fk_moq_user_id", columnList = "user_id")
        }
)
@AuditOverride(forClass = CommonDateEntity.class)
//@Audited
public class MclOrderQuantityOption extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mcl 오더 수량
    @JsonBackReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_order_quantity_id", referencedColumnName = "id", nullable = false)
    private MclOrderQuantity mclOrderQuantity;

    //퍼센티지 적용,미적용
    @Column(name = "register_option", nullable = false)
    private Integer registerOption;

    //퍼센티지
    @Column(name = "increase_quantity_percent", precision = 5, scale = 2)
    private BigDecimal increaseQuantityPercent;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_id", referencedColumnName = "id", nullable = false)
    private Company compId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id", referencedColumnName = "id", nullable = false)
    //@NotAudited
    private Department deptId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;
}
