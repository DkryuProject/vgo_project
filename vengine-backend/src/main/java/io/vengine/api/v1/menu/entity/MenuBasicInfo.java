package io.vengine.api.v1.menu.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "menu_basic_info")
//@Audited
public class MenuBasicInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //메뉴명
    @Column(name = "menu_name", length = 200)
    private String menuName;

    //supplier, vendor
    //@NotAudited
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "custom_id", referencedColumnName = "id")
    private CommonBasicInfo customId;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @JsonManagedReference
    @OneToMany(mappedBy = "menuBasicInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MenuPageInfo> menuPageInfos = new ArrayList<>();
}
