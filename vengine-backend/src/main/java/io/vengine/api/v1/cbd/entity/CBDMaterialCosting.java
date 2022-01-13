package io.vengine.api.v1.cbd.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.converters.CostingTypeConverter;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.utils.FormattingUtil;
import io.vengine.api.v1.cbd.enums.CBDCostingValueKind;
import io.vengine.api.v1.commonInfo.enums.CostingType;
import io.vengine.api.v1.companyInfo.entity.CompanyCost;
import io.vengine.api.v1.mcl.entity.MclCbdAssign;
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

import static org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cbd_material_costing",
        indexes = {
                @Index(name = "fk_cmc_user_id", columnList = "user_id"),
                @Index(name = "fk_cmc_dept_id", columnList = "dept_id"),
                @Index(name = "fk_cmc_option_comp_id", columnList = "comp_id"),
                @Index(name = "fk_cmc_ci_id", columnList = "cbd_option_id"),
                @Index(name = "fk_cmc_comp_cost_id", columnList = "comp_cost_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CBDMaterialCosting extends CommonEntity  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //cbd option ID
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cbd_option_id", referencedColumnName = "id", nullable = false)
    private CBDOption cbdOptionId;

    //직간접비
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_cost_id", referencedColumnName = "id", nullable = false)
    private CompanyCost companyCost;

    //직간접비 구분(Direct, InDirect)
    //@Convert(converter = CostingTypeConverter.class)
    @Column(name = "type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private CostingType type;

    //단가 및 %
    @Column(name = "cost_value", precision = 15, scale = 2)
    private BigDecimal costValue;

    //% or number
    @Column(name = "value_kind", length = 20)
    @Enumerated(EnumType.STRING)
    private CBDCostingValueKind valueKind;

    @Transient
    private double amount = 0;

    @Transient
    private double portion = 0;

    public double getAmount() {
        if(this.getCbdOptionId().getFinalCost() == null || this.getCbdOptionId().getFinalCost() == BigDecimal.ZERO){
            return 0;
        }
        if(this.getValueKind().equals(CBDCostingValueKind.PERCENT)){
            return FormattingUtil.withBigDecimal(this.getCbdOptionId().getFinalCost().doubleValue()*(this.getCostValue().doubleValue()/100),2);
        }
        return this.getCostValue().doubleValue();
    }

    public double getPortion() {
        if(this.getAmount() == 0){
            return 0;
        }
        if(this.getCbdOptionId().getFinalCost().doubleValue() == 0){
            return 0;
        }
        return FormattingUtil.withMathRound(getAmount()/this.getCbdOptionId().getFinalCost().doubleValue()*100, 2);
    }
}
