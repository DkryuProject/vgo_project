package io.vengine.api.v1.cbd.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.converters.StatusConverter;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.enums.Status;
import io.vengine.api.v1.cbd.enums.CBDStatus;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.Department;
import io.vengine.api.v1.user.entity.User;
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
@Table(name = "cbd_option",
        uniqueConstraints = {@UniqueConstraint(name = "uc_cbd_name", columnNames = {"cbd_cover_id","name"})},
        indexes = {
                @Index(name = "fk_cbd_option_comp_id", columnList = "comp_id"),
                @Index(name = "fk_cbd_option_dept_id", columnList = "dept_id"),
                @Index(name = "fk_cbd_option_user_id", columnList = "user_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CBDOption extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "final_cost", precision = 10, scale = 2)
    private BigDecimal finalCost;

    @Column(name = "profit_cost", precision = 5, scale = 2)
    private BigDecimal profitCost;

    @Column(name = "goods_quantity")
    private int goodsQuantity;

//    @AuditJoinTable
//    //@Audited(targetAuditMode = NOT_AUDITED)
//@NotAudited
//    //@Audited(targetAuditMode = NOT_AUDITED)
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cbd_cover_id", referencedColumnName = "id", nullable = false)
    private CBDCover cbdCoverId;

    @Convert(converter = StatusConverter.class)
    @Column(name = "status", nullable = false)
    private Status status;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "cbdOptionId", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CBDMaterialCosting> cbdMaterialCostings = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "cbdOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CBDMaterialInfo> cbdMaterialInfos = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "cbdOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclCbdAssign> mclCbdAssigns = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "cbdOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencyColor> mclMaterialDependencyColors = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "cbdOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencyMarket> mclMaterialDependencyMarkets = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "cbdOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencySize> mclMaterialDependencySizes = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "cbdOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclPreBooking> mclPreBookings = new ArrayList<>();

    //@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "cbdOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderDependencyItem> mclMaterialPurchaseOrderDependencyItems = new ArrayList<>();

    @Transient
    private String useYN;

    public String getUseYN() {
        if(this.getCbdMaterialCostings().size() > 0
                || this.getCbdMaterialInfos().size() > 0
                || this.getMclCbdAssigns().size() >0
                || this.getMclMaterialDependencyColors().size() > 0
                || this.getMclMaterialDependencyMarkets().size() > 0
                || this.getMclMaterialDependencySizes().size() > 0
                || this.getMclPreBookings().size() > 0
                || this.getMclMaterialPurchaseOrderDependencyItems().size() > 0
        ){
            return "Y";
        }
        return "N";
    }
}
