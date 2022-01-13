package io.vengine.api.v1.commonInfo.entity;

import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Code_generated")
public class CodeGenerated {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", length = 20)
    private String code;

    //사용여부(0-미사용, 1-사용)
    @Column(name = "used")
    private int used;
}
