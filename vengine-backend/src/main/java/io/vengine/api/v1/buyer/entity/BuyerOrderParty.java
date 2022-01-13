package io.vengine.api.v1.buyer.entity;

import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.v1.buyer.enums.EnumRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "buyer_order_party")
//@Audited
public class BuyerOrderParty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    private EnumRole role;

    @Column(length = 70)
    private String name;

    @Column(length = 50)
    private String department;

    @Column(length = 100)
    private String addressLine1;

    @Column(length = 100)
    private String addressLine2;

    @Column(length = 20)
    private String city;

    @Column(length = 30)
    private String stateOrProvince;

    @Column(length = 50)
    private String postalCodeNumber;

    @Column(length = 5)
    private String countryCode;

    @Column(name = "comp_id", nullable = false)
    private Long companyID;

    @Column(name = "user_id", length = 255)
    private String userID;

    @CreatedDate
    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyerOrderInfoId", nullable = false)
    private BuyerOrderInfo buyerOrderInfo;
}
