package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.companyInfo.entity.CompanyGarmentSize;
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
@Table(name = "mcl_garment_size",
        indexes = {
                @Index(name = "fk_mgs_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mgs_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mgs_user_id", columnList = "user_id"),
                @Index(name = "fk_mgs_mcl_option_id", columnList = "mcl_option_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclGarmentSize extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mcl option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_option_id", referencedColumnName = "id", nullable = false)
    private MclOption mclOption;

    //가먼트 사이즈명
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_garment_size_info_id", referencedColumnName = "id")
    private CommonBasicInfo size;

    //PO 가먼트 사이즈
    @Column(name = "po_garment_size", length = 100)
    private String poGarmentSize;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclGarmentSize", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclOrderQuantity> mclOrderQuantities = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclGarmentSize", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencySize> mclMaterialDependencySizes = new ArrayList<>();

    //@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclGarmentSize", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderDependencyItem> mclMaterialPurchaseOrderDependencyItems = new ArrayList<>();
}
