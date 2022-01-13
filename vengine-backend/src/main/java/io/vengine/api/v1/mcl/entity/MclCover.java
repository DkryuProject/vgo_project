package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.converters.StatusConverter;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.common.enums.Status;
import io.vengine.api.v1.cbd.entity.CBDCover;
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
@Table(name = "mcl_cover",
        indexes = {
                @Index(name = "fk_mclcover_comp_id", columnList = "comp_id"),
                @Index(name = "fk_mclcover_dept_id", columnList = "dept_id"),
                @Index(name = "fk_mclcover_user_id", columnList = "user_id"),
                @Index(name = "fk_mclcover_cbd_cover_id", columnList = "cbd_cover_id")
        }
)
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclCover extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //cbd cover
    //@NotAudited
    @JsonBackReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cbd_cover_id", referencedColumnName = "id", nullable = false)
    private CBDCover cbdCover;

    //상태
    @Convert(converter = StatusConverter.class)
    @Column(name = "status", nullable = false)
    //@Enumerated(EnumType.STRING)
    private Status status;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclCover", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclOption> mclOptions = new ArrayList<>();
}
