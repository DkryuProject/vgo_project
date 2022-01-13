package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.enums.OrderStatus;
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
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_material_purchase_order_item",
        indexes = {
                @Index(name = "fk_mmpoi_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mmpoi_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mmpoi_user_id", columnList = "user_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclMaterialPurchaseOrderItem extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //자재 po 발주
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_material_purchase_order_id", referencedColumnName = "id", nullable = false)
    private MclMaterialPurchaseOrder mclMaterialPurchaseOrder;

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

    //타입 (fabric, trims, accessories)
    @Column(name = "material_type")
    private String materialType;

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
    @JoinColumn(name = "cm_ordered_qty_adj_uom_id", referencedColumnName = "id")
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

    @JsonManagedReference
    @OneToMany(mappedBy = "mclMaterialPurchaseOrderItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderDependencyItem> mclMaterialPurchaseOrderDependencyItems = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "mclMaterialPurchaseOrderItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderStyle> mclMaterialPurchaseOrderStyles = new ArrayList<>();

    @Transient
    private int requireQty = 0;

    @Transient
    private int balanceQty = 0;

    @Transient
    private int totalIssuedQty = 0;

    @Transient
    private double amount = 0;

    @Transient
    private List<Integer> styleNumbers = new ArrayList<>();

    public double getRequireQty() {
        //return this.getMclMaterialInfo().getRequireQty();
        return this.getMclMaterialPurchaseOrderDependencyItems()
                .stream()
                .mapToDouble(MclMaterialPurchaseOrderDependencyItem::getRequireQty)
                .sum();
    }

    public double getBalanceQty() {
        return this.getRequireQty()-(this.getIssuedQty()==null ? 0:this.getIssuedQty())-(this.getPurchaseQty()==null ? 0:this.getPurchaseQty());
    }

    public Integer getIssuedQty() {
        return this.getMclMaterialInfo().getMclMaterialPurchaseOrderItems()
                    .stream()
                    .filter(item-> item.getMclMaterialPurchaseOrder().getStatus().equals(OrderStatus.Published)
                        || item.getMclMaterialPurchaseOrder().getStatus().equals(OrderStatus.Confirm))
                    .map(MclMaterialPurchaseOrderItem::getPurchaseQty)
                    .reduce(0, (a, b)-> (a == null ? 0:a) +(b == null ? 0: b));
    }

    public List<BigInteger> getStyleNumbers() {
        return this.getMclMaterialPurchaseOrderStyles()
                .stream()
                .map(MclMaterialPurchaseOrderStyle::getStyleNumber)
                .collect(Collectors.toList());
    }

    public double getAmount() {
        if(this.getUnitPrice() == null || this.getUnitPrice() == BigDecimal.ZERO){
            return 0;
        }

        if(this.getPurchaseQty() == null || this.getPurchaseQty() == 0){
            return 0;
        }
        return this.getUnitPrice().doubleValue() * this.getIssuedQty();
    }
}
