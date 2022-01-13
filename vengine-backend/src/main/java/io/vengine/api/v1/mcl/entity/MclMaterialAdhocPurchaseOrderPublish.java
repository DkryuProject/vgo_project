package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.supplier.entity.SupplierAdhocPoChecking;
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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_material_adhoc_purchase_order_publish")
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclMaterialAdhocPurchaseOrderPublish extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //원부자재 PO 번호 (comp_document_code 테이블 이용해서 생성하고 저장)
    @Column(name = "material_purchase_order_number", nullable = false, length = 100)
    private String materialPurchaseOrderNumber;

    //원부자재 구매회사 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_purchase_comp_id", referencedColumnName = "id")
    private Company materialPurchaseCompany;

    //원부자재 구매회사 주소
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_purchase_comp_addr_id", referencedColumnName = "id")
    private CompanyAddress materialPurchaseCompanyAddress;

    //원부자재 제공회사 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_selling_comp_id", referencedColumnName = "id")
    private Company materialSellingCompany;

    //원부자재 제공회사 주소
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_selling_comp_addr_id", referencedColumnName = "id")
    private CompanyAddress materialSellingCompanyAddress;

    //수하인
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consignee_comp_id", referencedColumnName = "id")
    private Company consigneeCompany;

    //수하인 주소
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consignee_comp_addr_id", referencedColumnName = "id")
    private CompanyAddress consigneeCompanyAddress;

    //송하인
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_comp_id", referencedColumnName = "id")
    private Company shipperCompany;

    //송하인 주소
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_comp_addr_id", referencedColumnName = "id")
    private CompanyAddress shipperCompanyAddress;

    //Bill To 회사
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_biz_relation_id", referencedColumnName = "id")
    private Company shipToCompany;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_biz_relation_addr_id", referencedColumnName = "id")
    private CompanyAddress shipToCompanyAddress;

    //약관
    @Column(columnDefinition="TEXT", name = "material_terms")
    private String terms;

    //인코텀즈
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_incoterms_info_id", referencedColumnName = "id")
    private CommonBasicInfo incoterms;

    //환적허용 여부 (0: 허용안함, 1: 허용함)
    @Column(name = "transhipment_allow")
    private Integer transhipmentAllow;

    //선적방법
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_material_shipping_method_id", referencedColumnName = "id")
    private CommonBasicInfo shippingMethod;

    //분할선적 허용여부(0: Not Allowed, 1: Allowed)
    @Column(name = "partial_shipment")
    private Integer partialShipment;

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

    //plus tolerence (숫자 %)
    @Column(name = "plus_tolerance")
    private Integer plusTolerance;

    //minus tolerence (숫자 %)
    @Column(name = "minus_tolerance")
    private Integer minusTolerance;

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

    //예상 선적일
    @Column(name = "estimated_date")
    private LocalDate estimatedDate;

    //공장 도착일
    @Column(name = "infactory_date")
    private LocalDate infactoryDate;

    //ex mill(xfactory)
    @Column(name = "ex_mill")
    private LocalDate exMill;

    //포워더 회사
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forwarder_comp_id", referencedColumnName = "id")
    private Company forwarder;

    //포워더 회사 주소 주소
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forwarder_comp_addr_id", referencedColumnName = "id")
    private CompanyAddress forwarderCompanyAddress;

    //메모
    @Column(name = "memo")
    private String memo;

    //통화
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_currency_id", referencedColumnName = "id")
    private CommonBasicInfo currency;

    //상태값
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @JsonManagedReference
    @OneToMany(mappedBy = "mclMaterialAdhocPurchaseOrderPublish", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MclMaterialAdhocPurchaseOrderItemPublish> mclMaterialAdhocPurchaseOrderItemPublishes = new ArrayList<>();

    @JsonManagedReference
    @OneToOne(mappedBy = "mclMaterialAdhocPurchaseOrderPublish", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private SupplierAdhocPoChecking supplierAdhocPoCheckings;

    @Transient
    private String itemType;

    @Transient
    private int itemQty;

    @Transient
    private double totalPoAmt = 0;

    @Transient
    private int poConfirm = 0;

    @Transient
    private String revertMemo;

    @Transient
    private String emailSendDate;

    public String getItemType() {
        if(this.mclMaterialAdhocPurchaseOrderItemPublishes.size() == 0){
            return null;
        }
        return this.mclMaterialAdhocPurchaseOrderItemPublishes.get(0).getMaterialType();
    }

    public int getItemQty() {
        return this.getMclMaterialAdhocPurchaseOrderItemPublishes().size();
    }

    public double getTotalPoAmt() {
        double total = 0;
        for (MclMaterialAdhocPurchaseOrderItemPublish itemPublish : this.mclMaterialAdhocPurchaseOrderItemPublishes){
            double unitPrice = 0;
            if(itemPublish.getUnitPrice() != null){
                unitPrice = itemPublish.getUnitPrice().doubleValue();
            }
            total += (unitPrice*itemPublish.getOrderedQty());
        }
        return total;
    }

    public int getPoConfirm() {
        if(this.supplierAdhocPoCheckings == null){
            return 0;
        }
        return this.supplierAdhocPoCheckings.getPoConfirm();
    }

    public String getRevertMemo() {
        if(this.supplierAdhocPoCheckings == null){
            return "";
        }
        return this.supplierAdhocPoCheckings.getRevertMemo();
    }
}
