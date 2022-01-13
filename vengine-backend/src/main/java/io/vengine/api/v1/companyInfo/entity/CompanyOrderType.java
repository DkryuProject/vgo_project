package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderItemPublish;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderItem;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderItemPublish;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditMappedBy;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comp_order_type", indexes = {
        @Index(name = "fk_compot_comp_id", columnList = "comp_id"),
        @Index(name = "fk_compot_dept_id", columnList = "dept_id"),
        @Index(name = "fk_compot_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyOrderType extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //오더종류명
    @Column(name = "name", nullable = false, length = 100)
    private String name;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "orderType", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CBDCover> cbdCovers = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "companyOrderType", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderItem> mclMaterialPurchaseOrderItems = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "companyOrderType", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialPurchaseOrderItemPublish> mclMaterialPurchaseOrderItemPublishes = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "companyOrderType", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclMaterialAdhocPurchaseOrderItemPublish> mclMaterialAdhocPurchaseOrderItemPublishes = new ArrayList<>();
}
