package io.vengine.api.v1.material.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.companyInfo.entity.CompanySeason;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderItemPublish;
import io.vengine.api.v1.mcl.entity.MclMaterialInfo;
import io.vengine.api.v1.supplier.entity.SupplierInvoiceItemInfo;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.Department;
import io.vengine.api.v1.user.entity.User;
import lombok.*;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditJoinTable;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "material_offer")
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MaterialOffer extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_info_id", nullable = false)
    private MaterialInfo materialInfo;

    @Column(name = "unit_price", precision = 15, scale = 5)
    private BigDecimal unitPrice;

    @Column(name = "mcq_quantity")
    private int mcqQuantity;

    @Column(name = "moq_quantity")
    private int moqQuantity;

    @Column(name = "my_millarticle", length = 20)
    private String myMillarticle;

    //original millarticle id(offer id)
    @Column(name = "original_millarticle_id")
    private Long originalMillarticleId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_uom_id", referencedColumnName = "id")
    private CommonBasicInfo commonUom;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_currency_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo currency;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_comp_id", referencedColumnName = "id")
    private Company recipient;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_brand_id", referencedColumnName = "id")
    private Company vendorBrand;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_comp_id", referencedColumnName = "id")
    private Company buyerCompany;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deputy_user_id", referencedColumnName = "id", nullable = false)
    private User deputyUser;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deputy_dept_id", referencedColumnName = "id", nullable = false)
    //@NotAudited
    private Department deputyDepartment;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deputy_comp_id", referencedColumnName = "id", nullable = false)
    private Company deputyCompany;

    //자재 후가공 Dyeing
    @Column(name = "material_after_manufacturing_dyeing", length = 100)
    private String materialAfterManufacturingDyeing;

    //자재 후가공 Fashion
    @Column(name = "material_after_manufacturing_fashion", length = 100)
    private String materialAfterManufacturingFashion;

    //자재 후가공 Finishing
    @Column(name = "material_after_manufacturing_finishing", length = 100)
    private String materialAfterManufacturingFinishing;

    //원단 무게
    @Column(name = "fabric_weight", precision = 17, scale = 0)
    private BigDecimal fabricWeight;

    //원단 무게 단위명
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_fabric_weight_uom_id", referencedColumnName = "id")
    private CommonBasicInfo commonFabricWeightUom;

    //원단 폭(cuttable width)
    @Column(name = "fabric_cw", precision = 11, scale = 0)
    private BigDecimal fabricCw;

    //원단 폭 단위명
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_fabric_cw_uom_id", referencedColumnName = "id")
    private CommonBasicInfo commonFabricCwUom;

    @Column(name = "size", length=10)
    private String size;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_subsidiary_size_uom_id", referencedColumnName = "id")
    private CommonBasicInfo commonSubsidiarySizeUom;

    @Column(name = "characteristic", length = 255)
    private String characteristic;

    @Column(name = "solid_pattern", length = 255)
    private String solidPattern;

    @Column(name = "function", length = 255)
    private String function;

    @Column(name = "performance", length = 255)
    private String performance;

    @Column(name = "stretch", length = 255)
    private String stretch;

    @Column(name = "lead_time", length = 100)
    private String leadTime;

    @Column(name = "season_year", length = 11)
    private Integer seasonYear;

    //원단 폭 단위명
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_season_id", referencedColumnName = "id")
    private CompanySeason season;

    @Column(name = "fabric_fw", length = 11)
    private Integer fabricFullWidth;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_fabric_full_weight_uom_id", referencedColumnName = "id")
    private CommonBasicInfo commonFabricFullWeightUom;

    @Transient
    private String  originalMaterialNo;

    @Builder.Default
    @JsonManagedReference
    @OneToMany(mappedBy = "materialOffer", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CBDMaterialInfo> cbdMaterialInfos = new ArrayList<>();

    @Builder.Default
    @JsonManagedReference
    @OneToMany(mappedBy = "materialOffer", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialInfo> mclMaterialInfos = new ArrayList<>();

    @Builder.Default
    @JsonManagedReference
    @OneToMany(mappedBy = "materialOffer", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialAdhocPurchaseOrderItemPublish> adhocPurchaseOrderItemPublishes = new ArrayList<>();

    @Builder.Default
    @JsonManagedReference
    @OneToMany(mappedBy = "materialOffer", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<SupplierInvoiceItemInfo> supplierInvoiceItemInfos = new ArrayList<>();

    @Transient
    private String useYN;

    public String getUseYN() {
        if(this.getCbdMaterialInfos().size() > 0
                || this.getMclMaterialInfos().size() >0
        ){
            return "Y";
        }
        return "N";
    }
}
