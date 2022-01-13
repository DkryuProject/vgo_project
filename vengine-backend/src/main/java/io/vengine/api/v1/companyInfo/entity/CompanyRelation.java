package io.vengine.api.v1.companyInfo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.user.entity.Company;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditJoinTable;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comp_relation", indexes = {
        @Index(name = "fk_compr_buyer_comp_id", columnList = "buyer_comp_id"),
        @Index(name = "fk_compr_subsidiary_comp_id", columnList = "subsidiary_comp_id"),
        @Index(name = "fk_compr_comp_id", columnList = "comp_id"),
        @Index(name = "fk_compr_dept_id", columnList = "dept_id"),
        @Index(name = "fk_compr_user_id", columnList = "user_id")
})
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class CompanyRelation extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_comp_id", referencedColumnName = "id")
    private Company buyerCompany;

    @Column(name = "buyer_nickname", length = 100)
    private String buyerNickname;

    @Column(name = "buyer_code", length = 10)
    private String buyerCode;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subsidiary_comp_id", referencedColumnName = "id")
    private Company subsidiaryCompany;

    @Column(name = "subsidiary_nickname", length = 100)
    private String subsidiaryNickname;

    @Column(name = "subsidiary_code", length = 10)
    private String subsidiaryCode;
}
