package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.converters.StatusConverter;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.enums.DependencyType;
import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.common.enums.Status;
import io.vengine.api.common.utils.FormattingUtil;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.companyInfo.entity.CompanyUsage;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.user.entity.Company;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.*;

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
@Table(name = "mcl_material_info",
        indexes = {
                @Index(name = "fk_mmi_info_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mmi_info_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mmi_info_user_id", columnList = "user_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclMaterialInfo extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mcl option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_option_id", referencedColumnName = "id", nullable = false)
    private MclOption mclOption;

    @Column(name = "type", nullable = false, length = 20)
    private String type;

    @Column(name = "color_dependency", length = 20)
    @Enumerated(EnumType.STRING)
    private DependencyType colorDependency;

    @Column(name = "size_dependency", length = 20)
    @Enumerated(EnumType.STRING)
    private DependencyType sizeDependency;

    @Column(name = "market_dependency", length = 20)
    @Enumerated(EnumType.STRING)
    private DependencyType marketDependency;

    //제공업체 관리번호
    @Column(name = "supplier_material", length = 20)
    private String supplierMaterial;

    //unit price
    @Column(name = "unit_price", precision = 15, scale = 5)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    //사용처
    @Column(name = "comp_usage", length = 100)
    private String usagePlace;

    //net yy
    @Column(name = "net_yy",  precision = 5, scale = 3)
    private BigDecimal netYy;

    //tolerance(%)
    @Column(name = "tolerance", precision = 5, scale = 2)
    private BigDecimal tolerance;

    //자재 정보
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_info_id", referencedColumnName = "id", nullable = false)
    private MaterialInfo materialInfo;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_offer_id", referencedColumnName = "id", nullable = false)
    private MaterialOffer materialOffer;

    //부자재 Detail
    @Column(name = "subsidiary_detail", length = 200)
    private String subsidiaryDetail;

    //원단 컬러명
    @Column(name = "fabric_color_name", length = 100)
    private String fabricColorName;

    //원단 기준 컬러
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_actual_color_id", referencedColumnName = "id")
    private CommonBasicInfo commonActualColor;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cbd_material_info_id", referencedColumnName = "id")
    private CBDMaterialInfo cbdMaterialInfo;

    //mcl 자재 단위
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_material_uom_id", referencedColumnName = "id")
    private CommonBasicInfo mclMaterialUom;

    //@Convert(converter = StatusConverter.class)
    @Column(name = "status", length = 30)
    @Enumerated(EnumType.STRING)
    private Status status;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_comp_id", referencedColumnName = "id")
    private Company supplier;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_comp_id", referencedColumnName = "id")
    private Company buyer;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "factory_comp_id", referencedColumnName = "id")
    private Company factory;

    @Column(name = "size_memo", length = 1000)
    private String sizeMemo;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclMaterialInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencyColor> mclMaterialDependencyColors = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclMaterialInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencyMarket> mclMaterialDependencyMarkets = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclMaterialInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencySize> mclMaterialDependencySizes = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "mclMaterialInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderItem> mclMaterialPurchaseOrderItems = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "mclMaterialInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderDependencyItem> mclMaterialPurchaseOrderDependencyItems = new ArrayList<>();

    @PrePersist
    public void preDependencyPersist(){
        this.colorDependency = this.colorDependency == null ? DependencyType.NotApplicable : this.colorDependency;
        this.sizeDependency = this.sizeDependency == null ? DependencyType.NotApplicable : this.sizeDependency;
        this.marketDependency = this.marketDependency == null ? DependencyType.NotApplicable : this.marketDependency;
    }

    @Transient
    private double grossYy = 0;

    @Transient
    private int requireQty = 0;

    @Transient
    private int orderQty = 0;

    @Transient
    private int balanceQty = 0;

    @Transient
    private double requiredAmount = 0;

    @Transient
    private double orderAmount = 0;

    @Transient
    private List<Integer> styleNumbers = new ArrayList<>();

    @Transient
    private String useYN;

    public double getGrossYy() {
        if(this.getNetYy() == null){
            return 0;
        }
        if(this.getTolerance() == null){
            return 0;
        }
        return FormattingUtil.withMathRound(this.getNetYy().doubleValue() * (this.getTolerance().doubleValue()/100+1),3);
    }

    public double getRequireQty() {
        List<MclGarmentColor> colors = this.mclMaterialDependencyColors.stream().map(MclMaterialDependencyColor::getMclGarmentColor).collect(Collectors.toList());
        List<MclGarmentSize> sizes = this.mclMaterialDependencySizes.stream().map(MclMaterialDependencySize::getMclGarmentSize).collect(Collectors.toList());
        List<MclGarmentMarket> markets = this.mclMaterialDependencyMarkets.stream().map(MclMaterialDependencyMarket::getMclGarmentMarket).collect(Collectors.toList());

        List<MclOrderQuantity> orderQuantities = this.getMclOption().getMclOrderQuantities();

        if(colors.size() == 0 && sizes.size() ==0 && markets.size() == 0){

        }else{
            if(colors.size() > 0){
                orderQuantities = orderQuantities.stream()
                        .filter(item -> {
                            for (MclGarmentColor color: colors){
                                if(item.getMclGarmentColor() != null){
                                    if(color.getId() == item.getMclGarmentColor().getId()){
                                        return true;
                                    }
                                }
                            }
                            return false;
                        }).collect(Collectors.toList());
            }

            if(sizes.size() > 0){
                orderQuantities = orderQuantities.stream()
                        .filter(item -> {
                            for (MclGarmentSize size: sizes){
                                if(item.getMclGarmentSize() != null){
                                    if(size.getId() == item.getMclGarmentSize().getId()){
                                        return true;
                                    }
                                }
                            }
                            return false;
                        }).collect(Collectors.toList());
            }

            if(markets.size() > 0){
                orderQuantities = orderQuantities.stream()
                        .filter(item -> {
                            for (MclGarmentMarket market: markets){
                                if(item.getMclGarmentMarket() != null){
                                    if(market.getId() == item.getMclGarmentMarket().getId()){
                                        return true;
                                    }
                                }
                            }
                            return false;
                        }).collect(Collectors.toList());
            }
        }
        return FormattingUtil.withMathCeil(orderQuantities.stream().mapToInt(MclOrderQuantity::getMeasuredQuantity).sum()*this.getGrossYy());
    }

    public double getOrderQty() {
        return FormattingUtil.withMathCeil(this.getMclMaterialPurchaseOrderItems()
                .stream()
                .filter(item-> item.getMclMaterialPurchaseOrder().getStatus().equals(OrderStatus.Published)
                        || item.getMclMaterialPurchaseOrder().getStatus().equals(OrderStatus.Confirm))
                .map(MclMaterialPurchaseOrderItem::getPurchaseQty)
                .reduce(0, (a, b)-> (a == null ? 0:a) +(b == null ? 0: b)));
    }

    public double getBalanceQty() {
        return this.getRequireQty()-this.getOrderQty();
    }

    public double getRequiredAmount() {
        double amount = 0;
        if(this.getUnitPrice() == null){
            return 0;
        }

        if(this.type.equals("fabric")){
            amount = FormattingUtil.withMathRound(this.getRequireQty()*this.getUnitPrice().doubleValue(),2);
        }else{
            amount = FormattingUtil.withMathRound(this.getRequireQty()*this.getUnitPrice().doubleValue(),5);
        }
        return amount;
    }

    public double getOrderAmount() {
        double orderAmount = 0;
        for(MclMaterialPurchaseOrderItem orderItem : this.getMclMaterialPurchaseOrderItems().stream()
                .filter(item-> (item.getMclMaterialPurchaseOrder().getStatus().equals(OrderStatus.Published)
                        || item.getMclMaterialPurchaseOrder().getStatus().equals(OrderStatus.Confirm)))
                .collect(Collectors.toList()))
        {
                orderAmount += (orderItem.getPurchaseQty() == null ? 0: orderItem.getPurchaseQty()) * (orderItem.getUnitPrice() == null ? 0: orderItem.getUnitPrice().doubleValue());
        }

        double amount  = 0;
        if(this.type.equals("fabric")){
            amount = FormattingUtil.withMathRound(orderAmount, 2);
        }else{
            amount = FormattingUtil.withMathRound(orderAmount, 5);
        }
        return amount;
    }

    public List<BigInteger> getStyleNumbers() {
        return this.getMclOption().getMclPreBookings().stream().map(MclPreBooking::getStyleNumber).collect(Collectors.toList());
    }

    public String getUseYN() {
        if(this.getMclMaterialPurchaseOrderItems().size() > 0
        ){
            return "Y";
        }
        return "N";
    }
}
