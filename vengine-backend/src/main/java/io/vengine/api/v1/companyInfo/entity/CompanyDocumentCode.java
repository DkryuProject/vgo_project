package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.user.entity.Company;
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
@Table(name = "comp_document_code", indexes = {
        @Index(name = "fk_compdc_comp_id", columnList = "comp_id")
})
@AuditOverride(forClass = CommonDateEntity.class)
//@Audited
public class CompanyDocumentCode extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comp_id", referencedColumnName = "id", nullable = false)
    private Company company;

    //서류 종류
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cm_doc_info_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo commonDocInfo;

    //서류 코드
    @Column(name = "doc_code", length = 20, nullable = false)
    private String docCode;

    //연번(0001)
    @Column(name = "idx", precision = 4, nullable = false)
    private Integer idx;

    public CompanyDocumentCode(Company company, CommonBasicInfo commonDocInfo, String docCode, Integer idx) {
        this.company = company;
        this.commonDocInfo = commonDocInfo;
        this.docCode = docCode;
        this.idx = idx;
    }
}
