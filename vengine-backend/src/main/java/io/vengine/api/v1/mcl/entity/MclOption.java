package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.converters.StatusConverter;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.enums.Status;
import io.vengine.api.common.service.EnumValue;
import io.vengine.api.v1.user.entity.Company;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_option",
        indexes = {
                @Index(name = "fk_mcloption_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mcloption_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mcloption_user_id", columnList = "user_id"),
                @Index(name = "fk_mcloption_mcl_cover_id", columnList = "mcl_cover_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclOption extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //MCL Option name
    @Column(name = "name", length = 100)
    private String name;

    //mcl cover
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_cover_id", referencedColumnName = "id", nullable = false)
    private MclCover mclCover;

    //작업시작일
    @Column(name = "pcd_date")
    private LocalDate pcdDate;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "factory_comp_id", referencedColumnName = "id", nullable = false)
    private Company factory;

    //상태
    //@Convert(converter = StatusConverter.class)
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclComment> mclComments = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclCbdAssign> mclCbdAssigns = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclFactoryAlloc> mclFactoryAllocs = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclGarmentColor> mclGarmentColors = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclGarmentSize> mclGarmentSizes = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclGarmentMarket> mclGarmentMarkets = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencyColor> mclMaterialDependencyColors = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencySize> mclMaterialDependencySizes = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialDependencyMarket> mclMaterialDependencyMarkets = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclPreBooking> mclPreBookings = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclPreBookingPo> mclPreBookingPos = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclOrderQuantity> mclOrderQuantities = new ArrayList<>();

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialInfo> mclMaterialInfos = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "mclOption", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrder> mclMaterialPurchaseOrders = new ArrayList<>();

    @Transient
    private String useYN;

    public String getUseYN() {
        if(this.getMclGarmentMarkets().size() > 0
                || this.getMclGarmentSizes().size() > 0
                || this.getMclGarmentColors().size() > 0
                || this.getMclMaterialInfos().size() > 0
                || this.getMclCbdAssigns().size() >0
                || this.getMclMaterialDependencyColors().size() > 0
                || this.getMclMaterialDependencyMarkets().size() > 0
                || this.getMclMaterialDependencySizes().size() > 0
                || this.getMclPreBookingPos().size() > 0
                || this.getMclPreBookings().size() > 0
                || this.getMclOrderQuantities().size() > 0
                || this.getMclMaterialPurchaseOrders().size() > 0
        ){
            return "Y";
        }
        return "N";
    }
}
