package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditMappedBy;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_garment_color",
        indexes = {
                @Index(name = "fk_mgc_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mgc_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mgc_user_id", columnList = "user_id"),
                @Index(name = "fk_mgc_mcl_option_id", columnList = "mcl_option_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclGarmentColor extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mcl option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_option_id", referencedColumnName = "id", nullable = false)
    private MclOption mclOption;

    @Column(name = "garment_color", length = 100)
    private String garmentColor;

    @Column(name = "po_garment_color", length = 100)
    private String poGarmentColor;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclGarmentColor", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclOrderQuantity> mclOrderQuantities = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclGarmentColor", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencyColor> mclMaterialDependencyColors = new ArrayList<>();

    //@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclGarmentColor", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderDependencyItem> mclMaterialPurchaseOrderDependencyItems = new ArrayList<>();
}
