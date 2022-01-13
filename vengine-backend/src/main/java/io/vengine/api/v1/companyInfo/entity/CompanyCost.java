package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.cbd.entity.CBDMaterialCosting;
import io.vengine.api.v1.commonInfo.enums.CostingType;
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
@Table(name = "comp_cost", indexes = {
        @Index(name = "fk_compic_comp_id", columnList = "comp_id"),
        @Index(name = "fk_compic_dept_id", columnList = "dept_id"),
        @Index(name = "fk_compic_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyCost extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //공임 타입(Indirect, Direct)
    @Column(name = "type", nullable = false, length = 20)
    private String type;

    //이름
    @Column(name = "name", nullable = false, length = 200)
    private String name;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "companyCost", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CBDMaterialCosting> cbdMaterialCostings = new ArrayList<>();
}
