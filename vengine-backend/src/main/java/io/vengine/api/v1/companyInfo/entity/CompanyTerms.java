package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.*;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comp_terms", indexes = {
        @Index(name = "fk_compts_comp_id", columnList = "comp_id"),
        @Index(name = "fk_compts_dept_id", columnList = "dept_id"),
        @Index(name = "fk_compts_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyTerms extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //약관 내용
    @Column(columnDefinition="TEXT", name = "terms")
    private String terms;

    //서류 양식 코드
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_document_type_id", referencedColumnName = "id")
    private CommonBasicInfo documentType;

    //공통 material 코드
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_material_type_id", referencedColumnName = "id")
    private CommonBasicInfo materialType;
}
