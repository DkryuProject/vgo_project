package io.vengine.api.v1.buyer.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.v1.buyer.enums.EnumOrderStatusCode;
import io.vengine.api.v1.buyer.enums.EnumShipmentMethodCode;
import io.vengine.api.v1.buyer.enums.EnumStatus;
import io.vengine.api.v1.mcl.entity.MclPreBookingPo;
import io.vengine.api.v1.user.entity.Company;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "buyer_api_info")
@Where(clause = "del_flag = 'N'")
//@Audited
public class BuyerApiInfo extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "comp_id", referencedColumnName = "id", nullable = false)
    private Company company;

    //api userid
    @Column(name = "user_id", length = 150)
    private String apiUserId;

    //액세스키
    @Column(name = "accessKeyId", length = 150)
    private String accessKeyId;

    //시크릿 키
    @Column(name = "secretAccessKey", length = 255)
    private String secretAccessKey;

    //data key
    @Column(name = "dataKey", length = 150)
    private String dataKey;

    //삭제상태여부(A: 사용중, D: 삭제상태)
    @Column(name = "del_flag", length = 2)
    private String delFlag;

    @PrePersist
    public void prePersist(){
        this.delFlag = this.delFlag == null ? "N" : this.delFlag;
    }
}
