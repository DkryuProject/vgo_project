package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.companyInfo.entity.CompanyGarmentMarket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_garment_market",
        indexes = {
                @Index(name = "fk_mgm_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mgm_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mgm_user_id", columnList = "user_id"),
                @Index(name = "fk_mgm_mcl_option_id", columnList = "mcl_option_id"),
                @Index(name = "fk_mgm_common_basic_country_id", columnList = "common_basic_country_id"),
                @Index(name = "fk_mgm_comp_market_id", columnList = "comp_market_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclGarmentMarket extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mcl option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_option_id", referencedColumnName = "id", nullable = false)
    private MclOption mclOption;

    //도착지 국가
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_basic_country_id", referencedColumnName = "id")
    private CommonBasicInfo country;

    //가먼트 마켓
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_market_id", referencedColumnName = "id")
    private CompanyGarmentMarket market;

    //PO 가먼트 마켓
    @Column(name = "po_garment_market", length = 100)
    private String poGarmentMarket;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclGarmentMarket", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclOrderQuantity> mclOrderQuantities = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclGarmentMarket", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencyMarket> mclMaterialDependencyMarkets = new ArrayList<>();

    //@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclGarmentMarket", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderDependencyItem> mclMaterialPurchaseOrderDependencyItems = new ArrayList<>();
}