package io.vengine.api.v1.commonInfo.entity;

import io.vengine.api.common.entity.CommonDateEntity;
import lombok.*;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "common_notice")
@Where(clause = "del_flag = 'N'")
public class CommonNotice extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //알림타입(0: 일반알림, 1: 업데이트, 2: 장애 등등)
    @Column(name = "category", nullable = false)
    private int category;

    //제목
    @Column(name = "event", length = 200, nullable = false)
    private String event;

    //내용
    @Column(name = "detail", length = 2000, nullable = false)
    private String detail;

    //상태(장애시나 기타..상태시 상황을 나타내기위해.. 필요없을 시는 "-"로
    @Column(name = "status", nullable = false)
    private Integer status;

    //삭제상태여부(A: 사용중, D: 삭제상태)
    @Column(name = "del_flag", length = 2)
    private String delFlag;

    @PrePersist
    public void prePersist(){
        this.delFlag = this.delFlag == null ? "N" : this.delFlag;
        this.status = this.status == null ? 0 : this.status;
    }
}
