package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.companyInfo.entity.CompanyTerms;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.CompanyAddress;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_material_purchase_order",
        indexes = {
                @Index(name = "fk_mmpo_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mmpo_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mmpo_user_id", columnList = "user_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclMaterialPurchaseOrder extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //MCL OPTION
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_option_id", referencedColumnName = "id")
    private MclOption mclOption;

    //원부자재 PO 번호 (comp_document_code 테이블 이용해서 생성하고 저장)
    @Column(name = "material_purchase_order_number", nullable = false, length = 100)
    private String materialPurchaseOrderNumber;

    //원부자재 PO 번호 URL
    @Column(name = "material_fabric_po_url", length = 2000)
    private String materialFabricPOUrl;

    //원부자재 구매회사 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_purchase_comp_id", referencedColumnName = "id")
    private Company materialPurchaseCompany;

    //원부자재 제공회사 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_selling_comp_id", referencedColumnName = "id")
    private Company materialSellingCompany;

    //수하인
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consignee_comp_id", referencedColumnName = "id")
    private Company consigneeCompany;

    //송하인
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_comp_id", referencedColumnName = "id")
    private Company shipperCompany;

    //Bill To 회사
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_biz_relation_id", referencedColumnName = "id")
    private Company shipToCompany;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_biz_relation_addr_id", referencedColumnName = "id")
    private CompanyAddress shipToCompanyAddress;

    //인코텀즈
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_incoterms_info_id", referencedColumnName = "id")
    private CommonBasicInfo incoterms;

    //선적방법
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_material_shipping_method_id", referencedColumnName = "id")
    private CommonBasicInfo shippingMethod;

    //결재 조건
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_material_payment_term_id", referencedColumnName = "id")
    private CommonBasicInfo paymentTerm;

    //결재 기준
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_payment_base_id", referencedColumnName = "id")
    private CommonBasicInfo paymentBase;

    //결재 기간
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "cm_payment_period_id", referencedColumnName = "id")
    private CommonBasicInfo paymentPeriod;

    //출발지 국가
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_loading_basic_country_id", referencedColumnName = "id")
    private CommonBasicInfo loadingBasicCountry;

    //출발지 포트
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_loading_port_info_id", referencedColumnName = "id")
    private CommonBasicInfo loadingPort;

    //도착지 국가
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_discharge_basic_country_id", referencedColumnName = "id")
    private CommonBasicInfo dischargeBasicCountry;

    //도착지 포트
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_discharge_port_info_id", referencedColumnName = "id")
    private CommonBasicInfo dischargePort;

    //포워더 회사
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forwarder_comp_id", referencedColumnName = "id")
    private Company forwarder;

    //약관
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_terms_id", referencedColumnName = "id")
    private CompanyTerms companyTerms;

    //예상 선적일
    @Column(name = "estimated_date")
    private LocalDate estimatedDate;

    //공장 도착일
    @Column(name = "infactory_date")
    private LocalDate infactoryDate;

    //ex mill(xfactory)
    @Column(name = "ex_mill")
    private LocalDate exMill;

    //메모
    @Column(name = "memo")
    private String memo;

    //상태값
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    //원부자재 구매회사 주소
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_purchase_comp_addr_id", referencedColumnName = "id")
    private CompanyAddress materialPurchaseCompanyAddress;

    //원부자재 제공회사 주소
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_selling_comp_addr_id", referencedColumnName = "id")
    private CompanyAddress materialSellingCompanyAddress;

    //수하인 주소
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consignee_comp_addr_id", referencedColumnName = "id")
    private CompanyAddress consigneeCompanyAddress;

    //송하인 주소
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_comp_addr_id", referencedColumnName = "id")
    private CompanyAddress shipperCompanyAddress;

    //포워더 회사 주소 주소
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forwarder_comp_addr_id", referencedColumnName = "id")
    private CompanyAddress forwarderCompanyAddress;

    //등록자명
    @Column(name = "user_name")
    private String userName;

    //분할선적 허용여부(0: Not Allowed, 1: Allowed)
    @Column(name = "partial_shipment")
    private Integer partialShipment;

    //plus tolerence (숫자 %)
    @Column(name = "plus_tolerance")
    private Integer plusTolerance;

    //minus tolerence (숫자 %)
    @Column(name = "minus_tolerance")
    private Integer minusTolerance;

    //통화
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_currency_id", referencedColumnName = "id")
    private CommonBasicInfo currency;

    //환율정보
    @Column(name = "exchange_rate", precision = 15, scale = 2)
    private BigDecimal exchangeRate;

    @JsonManagedReference
    @OneToMany(mappedBy = "mclMaterialPurchaseOrder", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderItem> mclMaterialPurchaseOrderItems = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "mclMaterialPurchaseOrder", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderPublish> mclMaterialPurchaseOrderPublishes = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "mclMaterialPurchaseOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderOption> mclMaterialPurchaseOrderOptions = new ArrayList<>();

    @Transient
    private Integer itemQty=0;

    @Transient
    private double totalPoQty=0;

    @Transient
    private double totalPoAmt = 0;

    @Transient
    private List<Integer> styleNumbers = new ArrayList<>();

    @Transient
    private String revertMemo;

    @Transient
    private String poTerms;

    @Transient
    private String emailSendDate;

    public Integer getItemQty() {
        return this.getMclMaterialPurchaseOrderItems().size();
    }

    public double getTotalPoQty() {
        return this.getMclMaterialPurchaseOrderItems()
                .stream()
                .map(MclMaterialPurchaseOrderItem::getIssuedQty)
                .reduce(0, (a,b)-> (a == null ? 0: a) + (b == null ? 0: b));
    }

    public double getTotalPoAmt() {
        return this.getMclMaterialPurchaseOrderItems()
                .stream()
                .mapToDouble(MclMaterialPurchaseOrderItem::getAmount).sum();
    }

    public List<BigInteger> getStyleNumbers() {
        List<BigInteger> styles = new ArrayList<>();
        for(MclMaterialPurchaseOrderItem item: this.getMclMaterialPurchaseOrderItems()){
            styles.addAll(item.getStyleNumbers());
        }
        return styles;
    }

    public String getPoTerms() {
        String result = "";
        if(this.getMclMaterialPurchaseOrderPublishes().size() == 0){
            return null;
        }
        for (MclMaterialPurchaseOrderPublish orderPublish: this.getMclMaterialPurchaseOrderPublishes()){
            result = orderPublish.getTerms();
        }
        return result;
    }
}
