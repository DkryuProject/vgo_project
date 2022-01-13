package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.mcl.entity.MclPreBooking;
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
@Table(name = "comp_garment_program", indexes = {
        @Index(name = "fk_compgp_comp_id", columnList = "comp_id"),
        @Index(name = "fk_compgp_dept_id", columnList = "dept_id"),
        @Index(name = "fk_compgp_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyGarmentProgram extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //주문종류명
    @Column(name = "name", nullable = false, length = 100)
    private String name;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "companyGarmentProgram", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclPreBooking> mclPreBookingList = new ArrayList<>();
}
