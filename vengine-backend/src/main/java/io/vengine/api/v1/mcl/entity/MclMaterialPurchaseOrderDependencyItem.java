package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.common.utils.FormattingUtil;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
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
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_material_purchase_order_dependency_item")
@Where(clause = "del_flag = 'N'")
@AuditOverride(forClass = CommonDateEntity.class)
//@Audited
public class MclMaterialPurchaseOrderDependencyItem extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //CBD OPTION
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cbd_option_id", referencedColumnName = "id")
    private CBDOption cbdOption;

    //자재 po 발주 아이템
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_material_purchase_order_item_id", referencedColumnName = "id", nullable = false)
    private MclMaterialPurchaseOrderItem mclMaterialPurchaseOrderItem;

    //MCL 자재 정보
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_material_info_id", referencedColumnName = "id", nullable = false)
    private MclMaterialInfo mclMaterialInfo;

    //타입 (fabric, trims, accessories)
    @Column(name = "mcl_material_type")
    private String mclMaterialType;

    //MCL 가먼트 컬러
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_garment_color_id", referencedColumnName = "id")
    private MclGarmentColor mclGarmentColor;

    //MCL 가먼트 사이즈
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_garment_size_id", referencedColumnName = "id")
    private MclGarmentSize mclGarmentSize;

    //MCL 가먼트 마켓
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_garment_market_id", referencedColumnName = "id")
    private MclGarmentMarket mclGarmentMarket;

    //주문 수량
    @Column(name = "ordered_qty")
    private Integer orderedQty=0;

    //주문 수량 단위
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordered_cm_uom_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo orderedUom;

    //삭제상태여부(A: 사용중, D: 삭제상태)
    @Column(name = "del_flag", length = 2)
    private String delFlag;

    //@Column(name = "unit_price", precision = 15, scale = 3)
    //private BigDecimal unitPrice;

    @PrePersist
    public void prePersist(){
        this.delFlag = this.delFlag == null ? "N" : this.delFlag;
    }

    @Transient
    private double requireQty = 0;

    @Transient
    private double issuedQty = 0;

    @Transient
    private double balanceQty = 0;

    @Transient
    private double amount = 0;

    public double getRequireQty() {
        List<MclOrderQuantity> orderQuantities = this.getMclMaterialInfo().getMclOption().getMclOrderQuantities();

        if(this.getMclGarmentColor() != null){
            orderQuantities = orderQuantities.stream()
                    .filter(item -> item.getMclGarmentColor().getId() == this.getMclGarmentColor().getId()).collect(Collectors.toList());
        }

        if(this.getMclGarmentSize() != null){
            orderQuantities = orderQuantities.stream()
                    .filter(item -> item.getMclGarmentSize().getId() == this.getMclGarmentSize().getId()).collect(Collectors.toList());
        }

        if(this.getMclGarmentMarket() != null){
            orderQuantities = orderQuantities.stream()
                    .filter(item -> item.getMclGarmentMarket().getId() == this.getMclGarmentMarket().getId()).collect(Collectors.toList());
        }

        return FormattingUtil.withMathCeil(orderQuantities.stream().mapToInt(MclOrderQuantity::getMeasuredQuantity).sum()*this.getMclMaterialInfo().getGrossYy());
    }

    public double getIssuedQty() {
        double totalIssuedQty = 0;
        for(MclMaterialPurchaseOrderItem orderItem: this.getMclMaterialInfo().getMclMaterialPurchaseOrderItems()){
            totalIssuedQty += orderItem.getMclMaterialPurchaseOrderDependencyItems()
                    .stream()
                    .filter(item-> (item.getMclMaterialPurchaseOrderItem().getMclMaterialPurchaseOrder().getStatus().equals(OrderStatus.Published)
                                    || item.getMclMaterialPurchaseOrderItem().getMclMaterialPurchaseOrder().getStatus().equals(OrderStatus.Confirm))
                                    && (this.getMclGarmentMarket() != null && item.getMclGarmentMarket().equals(this.getMclGarmentMarket()))
                                    && (this.getMclGarmentColor() != null && item.getMclGarmentColor().equals(this.getMclGarmentColor()))
                                    && (this.getMclGarmentSize() != null && item.getMclGarmentSize().equals(this.getMclGarmentSize()))
                    )
                    .map(MclMaterialPurchaseOrderDependencyItem::getOrderedQty)
                    .reduce(0, (a, b)-> (a == null ? 0:a) +(b == null ? 0: b));
        }
        return FormattingUtil.withMathCeil(totalIssuedQty);
    }

    public double getBalanceQty() {
        return this.getRequireQty()-this.getIssuedQty()-(this.getOrderedQty()==null ? 0:this.getOrderedQty());
    }
}
