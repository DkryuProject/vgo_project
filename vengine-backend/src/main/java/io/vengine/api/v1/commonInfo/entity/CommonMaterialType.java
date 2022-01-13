package io.vengine.api.v1.commonInfo.entity;

import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.common.entity.CommonEntity;
import lombok.*;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.*;


@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "common_material_type")
@AuditOverride(forClass = CommonDateEntity.class)
@Where(clause = "del_flag = 'N'")
//@Audited
public class CommonMaterialType extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //자재 대분류
    @Column(name = "category_a", length = 100)
    private String categoryA;

    //자재 중분류
    @Column(name = "category_b", length = 100)
    private String categoryB;

    //자재 소분류
    @Column(name = "category_c", length = 100)
    private String categoryC;

    //삭제상태여부(A: 사용중, D: 삭제상태)
    @Column(name = "del_flag", length = 2)
    private String delFlag;

    @PrePersist
    public void prePersist(){
        this.delFlag = this.delFlag == null ? "N" : this.delFlag;
    }
}
