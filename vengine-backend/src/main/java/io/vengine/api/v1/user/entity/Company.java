package io.vengine.api.v1.user.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.v1.buyer.entity.BuyerApiInfo;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.companyInfo.entity.*;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderPublish;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrder;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderPublish;
import io.vengine.api.v1.mcl.entity.MclOption;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_company",
        uniqueConstraints = {
        @UniqueConstraint(name = "uc_company_name", columnNames = {"name"})
        }
)
@Where(clause = "del_flag = 'N'")
@AuditOverride(forClass = CommonDateEntity.class)
//@Audited
public class Company extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="name", nullable = false, length = 100)
    @NotBlank
    private String name;

    @Column(name="nick_name", length = 100)
    private String nickName;

    @Column(name="l_code", length = 10)
    private String LCode;

    @Column(name="tax", length = 20)
    private String tax;

    @Column(name="ceo_name", length = 30)
    private String ceoName;

    @Column(name="business_number", length = 20)
    private String businessNumber;

    @Column(name="business_file_url", length = 255)
    private String businessFileUrl;

    @Column(name = "status", length = 11, nullable = false)
    @ColumnDefault("1")
    private int status;

    @Column(name = "terms_agree", nullable = false)
    @ColumnDefault("0")
    private int termsAgree;

    @Column(name = "terms_agree_final", nullable = false)
    @ColumnDefault("0")
    private int termsAgreeFinal;

    @Column(name = "mid_no", length = 100)
    private String midNo;

    @Column(name = "lor_no", length = 100)
    private String lorNo;

    @Column(name = "mid_memo", columnDefinition = "TEXT")
    private String midMemo;

    @Column(name = "lor_memo", columnDefinition = "TEXT")
    private String lorMemo;

    //비지니스 디폴트 타입
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_biz_default_id", nullable = false, referencedColumnName = "id")
    private CommonBasicInfo commonBizType;

    //삭제상태여부(A: 사용중, D: 삭제상태)
    @Column(name = "del_flag", length = 2)
    private String delFlag;

    @PrePersist
    public void prePersist(){
        this.delFlag = this.delFlag == null ? "N" : this.delFlag;
    }

    //사용자
//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "compId", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<User> users = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "companyInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CompanyAddress> companyAddresses = new ArrayList<>();

    //자재 정보
//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "supplierCompany", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MaterialInfo> materialInfos = new ArrayList<>();

    // Material Offer
//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MaterialOffer> materialOfferRecipients = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "vendorBrand", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MaterialOffer> materialOfferBrandIds = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "buyerCompany", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MaterialOffer> materialOfferBuyerIds = new ArrayList<>();

    //CBD Cover
//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "company", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CBDCover> cbdCovers = new ArrayList<>();

    //Brand
    //@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "brandCompany", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyBuyer> vendorBrands = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "company", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyDocumentCode> companyDocumentCodes = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "company", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyFactoryStore> companyFactoryStores = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "company", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyGarmentMarket> companyGarmentMarkets = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "company", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyGarmentProgram> companyGarmentPrograms = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "company", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyGarmentSize> companyGarmentSizes = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "company", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyPurchaseOrderType> companyPurchaseOrderTypes = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "company", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanySeason> companySeasons = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "company", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyTerms> companyTerms = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "company", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyUsage> companyUsages = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "buyerCompany", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyRelation> buyCompanyRelations = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "subsidiaryCompany", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyRelation> subsidiaryCompanyRelations = new ArrayList<>();

    //@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "factory", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclOption> mclOptions = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "company", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<BuyerApiInfo> buyerApiInfos = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "shipToCompany", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialAdhocPurchaseOrderPublish> mclMaterialAdhocPurchaseOrderPublishes = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "shipToCompany", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrder> mclMaterialPurchaseOrders = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "shipToCompany", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderPublish> mclMaterialPurchaseOrderPublishes = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "bizCompany", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyBizRelation> companyBizRelations = new ArrayList<>();
}
