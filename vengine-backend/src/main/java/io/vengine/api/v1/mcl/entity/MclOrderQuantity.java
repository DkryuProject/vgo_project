package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
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
@Table(name = "mcl_order_quantity",
        indexes = {
                @Index(name = "fk_moq_comp_id", columnList = "comp_id"),
                @Index(name = "fk_moq_dept_id", columnList = "dept_id"),
                @Index(name = "fk_moq_user_id", columnList = "user_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclOrderQuantity extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mcl option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_option_id", referencedColumnName = "id", nullable = false)
    private MclOption mclOption;

    //입력 수량
    @Column(name = "measured_quantity", precision = 11)
    private Integer measuredQuantity;

    //오더 수량
    @Column(name = "order_quantity", precision = 11)
    private Integer orderQuantity;

    //mcl 가먼트 컬러
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_garment_color_id", referencedColumnName = "id")
    private MclGarmentColor mclGarmentColor;

    //mcl 가먼트 사이즈
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_garment_size_id", referencedColumnName = "id")
    private MclGarmentSize mclGarmentSize;

    //mcl 가먼트 마켓
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_garment_market_id", referencedColumnName = "id")
    private MclGarmentMarket mclGarmentMarket;

    @JsonManagedReference
    @OneToOne(mappedBy = "mclOrderQuantity", cascade = CascadeType.DETACH)
    private MclOrderQuantityOption mclOrderQuantityOptions;
}
