package io.vengine.api.v1.material.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderItemPublish;
import io.vengine.api.v1.mcl.entity.MclMaterialInfo;
import io.vengine.api.v1.supplier.entity.SupplierInvoiceItemInfo;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.*;

import javax.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "material_info",
        indexes = {
                @Index(name = "fk_mif_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mif_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mif_user_id", columnList = "user_id"),
                @Index(name = "fk_mif_common_material_type_id", columnList = "cm_material_type_id"),
                @Index(name = "fk_mif_supplier_comp_id", columnList = "supplier_comp_id")
        }
)
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MaterialInfo extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //자재 제공 업체명(회사)
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_comp_id", referencedColumnName = "id")
    private Company supplierCompany;

    //자재이름
    @Column(name = "item_name", nullable = false, length = 100)
    private String name;

    //자재 사진
    @Column(name = "material_pic", length = 255)
    private String materialPic;

    //자재구분(fabric or subsidiary)
    @Column(name = "type", nullable = false, length = 20)
    private String type;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_material_type_id", referencedColumnName = "id")
    private CommonMaterialType materialCategory;

    @Column(name = "item_detail", length = 200)
    private String subsidiaryDetail;

    //상태값
    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "structure", length = 20)
    private String constructionType;

    @Column(name = "yarn_size_wrap", length = 20)
    private String yarnSizeWrap;

    @Column(name = "yarn_size_weft", length = 20)
    private String yarnSizeWeft;

    @Column(name = "construction_epi")
    private int constructionEpi;

    @Column(name = "construction_ppi")
    private int constructionPpi;

    @Column(name = "shrinkage_plus", precision = 5, scale = 1)
    private BigDecimal shrinkagePlus;

    @Column(name = "shrinkage_minus", precision = 5, scale = 1)
    private BigDecimal shrinkageMinus;

    @Column(name = "parent_material_info")
    private Long parentMaterialInfo;

    @Column(name = "usage_type", length = 255)
    private String usageType;

    @Column(name = "sus_eco", length = 255)
    private String susEco;

    @Column(name = "application", length = 255)
    private String application;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "materialInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MaterialYarn> materialYarns = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "materialInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MaterialOffer> materialOffers = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "materialInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CBDMaterialInfo> cbdMaterialInfos = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "materialInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialInfo> mclMaterialInfos = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "materialInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialAdhocPurchaseOrderItemPublish> mclMaterialAdhocPurchaseOrderItemPublishes = new ArrayList<>();

    @Transient
    private String useYN;

    public String getUseYN() {
        if(this.getMaterialOffers().size() > 0
                || this.getParentMaterialInfo() != null
        ){
            return "Y";
        }
        return "N";
    }

    public List<MaterialYarn> getMaterialYarns() {
        return materialYarns
                .stream()
                .sorted(Comparator.comparing(MaterialYarn::getUsed).reversed())
                .collect(Collectors.toList());
    }
}
