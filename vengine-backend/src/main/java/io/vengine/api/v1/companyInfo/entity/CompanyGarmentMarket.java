package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.mcl.entity.MclGarmentMarket;
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
@Table(name = "comp_garment_market", indexes = {
        @Index(name = "fk_compgm_comp_id", columnList = "comp_id"),
        @Index(name = "fk_compgm_dept_id", columnList = "dept_id"),
        @Index(name = "fk_compgm_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyGarmentMarket extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //제품 (가먼트) 마켓명
    @Column(name = "name", nullable = false, length = 100)
    private String name;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "market", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclGarmentMarket> mclGarmentMarkets = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "companyGarmentMarket", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<CompanyBuyer> companyBuyers = new ArrayList<>();
}
