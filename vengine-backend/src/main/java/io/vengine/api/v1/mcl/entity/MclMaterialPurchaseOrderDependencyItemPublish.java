package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.common.entity.CommonEntity;
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

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_material_purchase_order_dependency_item_publish")
@Where(clause = "del_flag = 'N'")
@AuditOverride(forClass = CommonDateEntity.class)
//@Audited
public class MclMaterialPurchaseOrderDependencyItemPublish extends CommonDateEntity {
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
    private Integer orderedQty;

    //주문 수량 단위
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordered_cm_uom_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo orderedUom;

    //삭제상태여부(A: 사용중, D: 삭제상태)
    @Column(name = "del_flag", length = 2)
    private String delFlag;

    @PrePersist
    public void prePersist(){
        this.delFlag = this.delFlag == null ? "N" : this.delFlag;
    }
}
