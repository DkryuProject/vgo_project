package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.converters.LocalDateConverter;
import io.vengine.api.common.converters.LocalDateTimeConverter;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.companyInfo.entity.CompanyGarmentProgram;
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
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_pre_booking",
        indexes = {
                @Index(name = "fk_mpb_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mpb_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mpb_user_id", columnList = "user_id"),
                @Index(name = "fk_mpb_mcl_option_id", columnList = "mcl_option_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclPreBooking extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mcl option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_option_id", referencedColumnName = "id", nullable = false)
    private MclOption mclOption;

    //선적시작일(조건시작일)
    @Column(name = "ship_date_from", nullable = false)
    private LocalDateTime shipDateFrom;

    //선적종료일(조건마지막일)
    @Column(name = "ship_date_to", nullable = false)
    private LocalDateTime shipDateTo;

    //스타일 번호
    @Column(name = "style_number", nullable = false, precision = 11)
    private BigInteger styleNumber;

    //프로그램명 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_program_id", referencedColumnName = "id", nullable = false)
    private CompanyGarmentProgram companyGarmentProgram;

    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cbd_option_id", referencedColumnName = "id")
    private CBDOption cbdOption;

    @JsonManagedReference
    @OneToMany(mappedBy = "mclPreBooking", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclPreBookingPo> mclPreBookingPos = new ArrayList<>();
}
