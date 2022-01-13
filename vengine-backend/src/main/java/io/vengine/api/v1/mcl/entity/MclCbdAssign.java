package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.cbd.entity.CBDMaterialCosting;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.cbd.entity.CBDOption;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditJoinTable;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_cbd_assign",
        indexes = {
                @Index(name = "fk_mcas_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mcas_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mcas_user_id", columnList = "user_id"),
                @Index(name = "fk_mcas_mcl_option_id", columnList = "mcl_option_id"),
                @Index(name = "fk_mcas_cbd_option_id", columnList = "cbd_option_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclCbdAssign extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mcl option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_option_id", referencedColumnName = "id", nullable = false)
    private MclOption mclOption;

    //cbd option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cbd_option_id", referencedColumnName = "id", nullable = false)
    private CBDOption cbdOption;

    @Column(name = "fabric_check", nullable = false)
    private int fabricCheck;

    @Column(name = "trims_check", nullable = false)
    private int trimsCheck;

    @Column(name = "accessories_check", nullable = false)
    private int accessoriesCheck;
}
