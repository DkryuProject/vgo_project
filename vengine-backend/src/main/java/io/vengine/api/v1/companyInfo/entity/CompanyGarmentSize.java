package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.mcl.entity.MclGarmentSize;
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
@Table(name = "comp_garment_size", indexes = {
        @Index(name = "fk_compgs_cm_garment_category_id", columnList = "common_garment_category_id"),
        @Index(name = "fk_compgs_cm_gender_id", columnList = "common_gender_id"),
        @Index(name = "fk_compgs_comp_id", columnList = "comp_id"),
        @Index(name = "fk_compgs_dept_id", columnList = "dept_id"),
        @Index(name = "fk_compgs_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyGarmentSize extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //제품 (가먼트) 사이즈명
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_garment_category_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo garmentCategory;

    @Column(name = "size_group", nullable = false, length = 200)
    private String sizeGroup;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_gender_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo gender;
}
