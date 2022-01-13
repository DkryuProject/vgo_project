package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.mcl.entity.MclMaterialInfo;
import lombok.*;
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
@Table(name = "comp_season", indexes = {
        @Index(name = "fk_comps_comp_id", columnList = "comp_id"),
        @Index(name = "fk_comps_dept_id", columnList = "dept_id"),
        @Index(name = "fk_comps_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanySeason extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //시즌명
    @Column(name = "name", nullable = false, length = 100)
    private String name;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "season", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CBDCover> cbdCovers = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "season", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MaterialOffer> materialOffers = new ArrayList<>();
}
