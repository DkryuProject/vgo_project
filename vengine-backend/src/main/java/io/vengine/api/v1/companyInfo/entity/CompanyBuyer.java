package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.user.entity.Company;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comp_buyer", indexes = {
        @Index(name = "fk_compb_brand_comp_id", columnList = "brand_comp_id"),
        @Index(name = "fk_compb_forwarder_comp_id", columnList = "forwarder_comp_id"),
        @Index(name = "fk_compb_cm_incoterms_id", columnList = "cm_incoterms_id"),
        @Index(name = "fk_compb_cm_payment_id", columnList = "cm_payment_id"),
        @Index(name = "fk_compb_comp_payment_period_id", columnList = "cm_payment_period_id"),
        @Index(name = "fk_compb_comp_payment_base_id", columnList = "cm_payment_base_id"),
        @Index(name = "fk_compb_comp_garment_market_id", columnList = "comp_garment_market_id"),
        @Index(name = "fk_compb_accountee_comp_id", columnList = "accountee_comp_id"),
        @Index(name = "fk_compb_comp_id", columnList = "comp_id"),
        @Index(name = "fk_compb_dept_id", columnList = "dept_id"),
        @Index(name = "fk_compb_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyBuyer extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //브랜드(회사) 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_comp_id", referencedColumnName = "id", nullable = false)
    private Company brandCompany;

    //선적 조건 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_incoterms_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo cmIncoterms;

    //결재 조건(종류) 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_payment_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo cmPayment;

    //결재 조건(기간) 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_payment_period_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo companyPaymentPeriod;

    //결재 조건(기준) 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_payment_base_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo companyPaymentBase;

    //대금 결제인 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accountee_comp_id", referencedColumnName = "id")
    private Company accounteeCompany;

    //제품 마켓명 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_garment_market_id", referencedColumnName = "id")
    private CompanyGarmentMarket companyGarmentMarket;

    //포워더 회사 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forwarder_comp_id", referencedColumnName = "id", nullable = false)
    private Company forwarderCompany;

    //바이어(브랜드) 플러스 허용 선적 수량 %
    @Column(name = "buyer_plus_tolerance", precision = 5, scale = 2, nullable = false)
    private BigDecimal buyerPlusTolerance;

    //바이어(브랜드) 마이너스 허용 선적 수량 %
    @Column(name = "buyer_minus_tolerance", precision = 5, scale = 2, nullable = false)
    private BigDecimal buyerMinusTolerance;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "companyBuyer", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyBuyerDeduction> companyBuyerDeductions = new ArrayList<>();
}
