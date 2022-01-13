package io.vengine.api.v1.material.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.Department;
import io.vengine.api.v1.user.entity.User;
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
import java.math.BigDecimal;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "material_yarn")
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MaterialYarn extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //material_info_id
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_info_id", referencedColumnName = "id", nullable = false)
    private MaterialInfo materialInfo;

    //원사 이름 순번
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_material_yarn_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo commonMaterialYarn;

    @Column(name = "used", nullable = false, precision = 5, scale = 2)
    private BigDecimal used;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deputy_user_id", referencedColumnName = "id", nullable = false)
    private User deputyUser;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deputy_dept_id", referencedColumnName = "id", nullable = false)
    //@NotAudited
    private Department deputyDepartment;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deputy_comp_id", referencedColumnName = "id", nullable = false)
    private Company deputyCompany;
}
