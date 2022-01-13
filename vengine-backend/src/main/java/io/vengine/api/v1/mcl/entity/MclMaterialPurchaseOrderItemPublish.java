package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import io.vengine.api.v1.companyInfo.entity.CompanyOrderType;
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
@Table(name = "mcl_material_purchase_order_item_publish")
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclMaterialPurchaseOrderItemPublish extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //자재 po 발주
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_material_purchase_order_id", referencedColumnName = "id", nullable = false)
    private MclMaterialPurchaseOrderPublish mclMaterialPurchaseOrderPublish;

    //자재 카테고리
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_material_type_id", referencedColumnName = "id", nullable = false)
    private CommonMaterialType commonMaterialType;

    //MCL 자재 정보
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_material_info_id", referencedColumnName = "id", nullable = false)
    private MclMaterialInfo mclMaterialInfo;

    //원단 컬러명
    @Column(name = "mcl_material_fabric_color_name", length = 100)
    private String mclMaterialFabricColorName;

    //기준 컬러 순번
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_actual_color_id", referencedColumnName = "id")
    private CommonBasicInfo commonActualColor;

    //기준 컬러명
    @Column(name = "mcl_material_active_color_name", length = 100)
    private String mclMaterialActiveColorName;

    //타입 (fabric, trims, accessories)
    @Column(name = "material_type")
    private String materialType;

    //net yy
    @Column(name = "net_yy",  precision = 6, scale = 3)
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

    //주문 수량 단위
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_ordered_qty_uom_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo orderedUom;

    //주문수량 변경 단위
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_ordered_qty_adj_uom_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo orderedAdjUom;

    //상태값
    @Column(name = "status")
    private String status;

    //주문종류 순번(default "Bulk" 로 고정)
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_order_type_id", referencedColumnName = "id", nullable = false)
    private CompanyOrderType companyOrderType;

    @Column(name = "purchase_qty")
    private Integer purchaseQty;

    @Column(name = "issued_qty")
    private Integer issuedQty;

    //Pre production 수량
    @Column(name = "pre_production_qty")
    private Integer preProductionQty;

    //Pre production 오더 수량 단위
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_production_uom_id", referencedColumnName = "id")
    private CommonBasicInfo preProductionUom;

    //cm purchase_order_type 순번(PP: 고정)
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_production_cm_order_type_id", referencedColumnName = "id")
    private CommonBasicInfo preProductionOrderType;

    //Pre production unit price
    @Column(name = "pre_production_unit_price", precision = 15, scale = 2)
    private BigDecimal preProductionUnitPrice;

    //Advertisement 오더 수량
    @Column(name = "advertisement_qty")
    private Integer advertisementQty;

    //Advertisement 오더 수량 단위
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "advertisement_uom_id", referencedColumnName = "id")
    private CommonBasicInfo advertisementUom;

    //cm purchase_order_type 순번(AD)
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "advertisement_cm_order_type_id", referencedColumnName = "id")
    private CommonBasicInfo advertisementOrderType;

    //advertisement unit price
    @Column(name = "advertisement_unit_price", precision = 15, scale = 2)
    private BigDecimal advertisementUnitPrice;

    //단위변환 수치값
    @Column(name = "from_to_uom", precision = 10, scale = 4)
    private BigDecimal fromToUom;
}
