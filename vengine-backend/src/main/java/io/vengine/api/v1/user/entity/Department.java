package io.vengine.api.v1.user.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_department", uniqueConstraints = {@UniqueConstraint(name = "uc_depart_comp_name", columnNames = {"name"})})
////@Audited(targetAuditMode = NOT_AUDITED)
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "deptId", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<User> users = new ArrayList<>();
}
