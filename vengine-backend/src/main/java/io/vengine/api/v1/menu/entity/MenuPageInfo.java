package io.vengine.api.v1.menu.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.vengine.api.common.entity.CommonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "menu_page_info")
//@Audited
public class MenuPageInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //메뉴
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", referencedColumnName = "id", nullable = false)
    private MenuBasicInfo menuBasicInfo;

    //중분류
    @Column(name = "m_menu", length = 100)
    private String mMenu;

    //소메뉴
    @Column(name = "s_menu", length = 100)
    private String sMenu;

    //sorting 번호
    @Column(name = "idx", length = 100, nullable = false)
    private String idx;

    //미사용: 0, 사용: 1
    @Column(name = "status", nullable = false)
    private int status;
}
