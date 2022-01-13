package io.vengine.api.v1.cbd.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.converters.StatusConverter;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.enums.Status;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import io.vengine.api.v1.companyInfo.entity.CompanyOrderType;
import io.vengine.api.v1.companyInfo.entity.CompanySeason;
import io.vengine.api.v1.mcl.entity.MclCover;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderDependencyItem;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.*;

import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cbd_cover")
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CBDCover extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //바이어
    //@NotAudited
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "buyer_comp_id", referencedColumnName = "id", nullable = false)
    private Company buyer;

    //브랜드
    //@NotAudited
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "vendor_brand_id", referencedColumnName = "id", nullable = false)
    private Company vendorBrandId;

    //성별
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "common_gender_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo commonGenderId;

    //자재 카테고리
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "cm_material_type_id", referencedColumnName = "id", nullable = false)
    private CommonMaterialType materialCategoryId;

    //시즌
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "comp_season_id", referencedColumnName = "id", nullable = false)
    private CompanySeason season;

    //시즌 년도
    @Column(name = "season_year", nullable = false)
    private int seasonYear;

    //오더타입
    //@NotAudited
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "comp_order_type_id", referencedColumnName = "id", nullable = false)
    private CompanyOrderType orderType;

    //디자인 번호
    @Column(name = "design_number", length = 50, nullable = false)
    private String designNumber;

    //CBD 명
    @Column(name = "cbd_name", nullable = false, length = 50)
    private String cbdName;

    //cbd image
    @Column(name = "cbd_img", length = 255)
    private String cbdImg;

    //가먼트 종류
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_garment_category_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo commonGarmentCategoryId;

    //통화
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_currency_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo commonCurrencyId;

    //상태
    @Convert(converter = StatusConverter.class)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "del_date")
    private LocalDateTime delDate;

    //@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "cbdCoverId", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CBDOption> cbdOptions = new ArrayList<>();

    //@NotAudited
    @JsonManagedReference
    @OneToOne(mappedBy = "cbdCover", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private MclCover mclCover;

    @Transient
    private String useYN;

    public String getUseYN() {
        if(this.getCbdOptions().size() > 0){
            return "Y";
        }
        if(this.getMclCover() != null){
            if(this.getMclCover().getMclOptions().size() > 0){
                return "Y";
            }
        }
        return "N";
    }
}
