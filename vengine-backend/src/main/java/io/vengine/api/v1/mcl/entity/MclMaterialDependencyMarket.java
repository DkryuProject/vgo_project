package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.cbd.entity.CBDOption;
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

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_material_dependency_market",
        indexes = {
                @Index(name = "fk_mmdm_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mmdm_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mmdm_user_id", columnList = "user_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclMaterialDependencyMarket extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mcl option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_option_id", referencedColumnName = "id", nullable = false)
    private MclOption mclOption;

    //cbd option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cbd_option_id", referencedColumnName = "id")
    private CBDOption cbdOption;

    //타입 (fabric, trims, accessories)
    @Column(name = "material_type", nullable = false, length = 20)
    private String materialType;

    //MCL 가먼트 마켓
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "garment_market_id", referencedColumnName = "id", nullable = false)
    private MclGarmentMarket mclGarmentMarket;

    //mcl 자재
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_material_info_id", referencedColumnName = "id", nullable = false)
    private MclMaterialInfo mclMaterialInfo;
}
