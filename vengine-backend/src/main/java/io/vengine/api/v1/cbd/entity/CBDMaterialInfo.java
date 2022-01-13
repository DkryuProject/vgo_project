package io.vengine.api.v1.cbd.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.utils.FormattingUtil;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.companyInfo.entity.CompanyUsage;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.mcl.entity.MclMaterialInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cbd_material_info")
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CBDMaterialInfo extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //cbd option
    //@NotAudited
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "cbd_option_id", referencedColumnName = "id", nullable = false)
    private CBDOption cbdOption;

    //자재구분(fabric or subsidiary)
    @Column(name = "type", length = 20, nullable = false)
    private String type;

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
    @Column(name = "net_yy",  precision = 6, scale = 3)
    private BigDecimal netYy = BigDecimal.ZERO;

    //tolerance(%)
    @Column(name = "tolerance", precision = 5, scale = 2)
    private BigDecimal tolerance = BigDecimal.ZERO;

    //자재 정보
    //@NotAudited
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

    @Column(name = "size_memo", length = 1000)
    private String sizeMemo;

    //cbd 자재 단위
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cbd_material_uom_id", referencedColumnName = "id")
    private CommonBasicInfo cbdMaterialUom;

    @JsonManagedReference
    @OneToMany(mappedBy = "cbdMaterialInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialInfo> mclMaterialInfos = new ArrayList<>();

    @Transient
    private double grossYy = 0;

    @Transient
    private double amount = 0;

    @Transient
    private double portion = 0;

    @Transient
    private String useYN;

    public double getGrossYy() {
        if(this.getNetYy() == null ){
            return 0;
        }
        if(this.getTolerance() == null){
            return 0;
        }
        return FormattingUtil.withMathRound(this.getNetYy().doubleValue() * (this.getTolerance().doubleValue()/100+1),3);
    }

    public double getAmount() {
        double amount = 0;

        if(this.getUnitPrice() == null){
            return 0;
        }

        if("fabric".equals(this.type)){
            amount = FormattingUtil.withMathRound(this.getGrossYy() * this.getUnitPrice().doubleValue(), 2);
        }else{
            amount = FormattingUtil.withMathRound(this.getGrossYy() * this.getUnitPrice().doubleValue(), 5);
        }
        return amount;
    }

    public double getPortion() {
        if(this.getAmount() == 0){
            return 0;
        }
        if(this.getCbdOption().getFinalCost().doubleValue() == 0){
            return 0;
        }
        return FormattingUtil.withMathRound(getAmount()/this.getCbdOption().getFinalCost().doubleValue()*100, 2);
    }

    public String getUseYN() {
        if(this.getMclMaterialInfos().size() > 0
        ){
            return "Y";
        }
        return "N";
    }
}
