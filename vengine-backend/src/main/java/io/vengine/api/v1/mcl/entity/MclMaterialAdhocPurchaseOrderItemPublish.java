package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import io.vengine.api.v1.companyInfo.entity.CompanyOrderType;
import io.vengine.api.v1.companyInfo.entity.CompanyUsage;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.material.entity.MaterialYarn;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_material_adhoc_purchase_order_item_publish")
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclMaterialAdhocPurchaseOrderItemPublish extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //자재 po 발주
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_material_adhoc_purchase_order_id", referencedColumnName = "id", nullable = false)
    private MclMaterialAdhocPurchaseOrderPublish mclMaterialAdhocPurchaseOrderPublish;

    //사용처
    @Column(name = "comp_usage", length = 100)
    private String usagePlace;

    //자재 카테고리
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_material_type_id", referencedColumnName = "id", nullable = false)
    private CommonMaterialType commonMaterialType;

    //자재 정보
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_info_id", referencedColumnName = "id", nullable = false)
    private MaterialInfo materialInfo;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_offer_id", referencedColumnName = "id", nullable = false)
    private MaterialOffer materialOffer;

    //원단 컬러명
    @Column(name = "mcl_material_fabric_color_name", length = 100)
    private String fabricColorName;

    //원단 기준 컬러
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_actual_color_id", referencedColumnName = "id")
    private CommonBasicInfo commonActualColor;

    //기준 컬러명
    @Column(name = "mcl_material_active_color_name", length = 100)
    private String materialColorName;

    //타입 (fabric, trims, accessories)
    @Column(name = "material_type", nullable = false)
    private String materialType;

    //net yy
    @Column(name = "net_yy",  precision = 5, scale = 2)
    private BigDecimal netYy;

    //plus tolerence (숫자 %)
    @Column(name = "plus_tolerance")
    private Integer plusTolerance;

    //minus tolerence (숫자 %)
    @Column(name = "minus_tolerance")
    private Integer minusTolerance;

    //unit price
    @Column(name = "unit_price", precision = 15, scale = 2)
    private BigDecimal unitPrice;

    //주문 수량
    @Column(name = "ordered_qty")
    private int orderedQty;

    //주문 수량 단위
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordered_cm_uom_id", referencedColumnName = "id")
    private CommonBasicInfo orderedUom;

    //주문수량 변경 단위
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_ordered_qty_adj_uom_id", referencedColumnName = "id")
    private CommonBasicInfo orderedAdjUom;

    //주문종류 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_order_type_id", referencedColumnName = "id")
    private CompanyOrderType companyOrderType;

    //상태값
    @Column(name = "status")
    private String status;
}
