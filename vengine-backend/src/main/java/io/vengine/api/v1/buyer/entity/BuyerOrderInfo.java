package io.vengine.api.v1.buyer.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.v1.buyer.enums.EnumOrderStatusCode;
import io.vengine.api.v1.buyer.enums.EnumShipmentMethodCode;
import io.vengine.api.v1.buyer.enums.EnumStatus;
import io.vengine.api.v1.mcl.entity.MclPreBookingPo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "buyer_order_info")
//@Audited
public class BuyerOrderInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(length = 100)
    private String buyer;

    @Column(length = 30)
    private String assignedToUserId;

    @Column(nullable = false, length = 15)
    private String uid;

    @Column(length = 45)
    private String objectType;

    @Column(length = 30)
    private String documentType;

    @Column(length = 15)
    private String documentId;

    @Column(length = 30)
    private String documentRefNumber;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private EnumStatus status;

    @Column(length = 30)
    @Enumerated(EnumType.STRING)
    private EnumOrderStatusCode orderStatusCode;

    @Column(length = 45)
    private String assignedOn;

    @Column(length = 45)
    private String cancelledOn;

    @Column(length = 45)
    private String acceptedOn;

    @Column(length = 45)
    private String suspendedOn;

    @Column(length = 45)
    private String finishedOn;

    @Column(length = 150)
    private String url;

    @Column(length = 150)
    private String shipmentUrl;

    @Column(length = 10)
    private String orderClass;

    @Column(length = 30)
    private String deptName;

    @Column(length = 10)
    private String deptCode;

    @Column(length = 5)
    private String destinationCountry;

    @Column(length = 20)
    private String originCountry;

    @Column(length = 20)
    private String originCity;

    @Column(length = 50)
    private String brand;

    @Column(length = 30)
    private String divisionName;

    @Column(length = 20)
    private String marketDesc;

    @Column(length = 10)
    private String marketPONo;

    @Column(length = 10)
    private String issueDate;

    @Column(length = 10)
    private String cancelAfterDate;

    @Column(length = 10)
    private String latestDate;

    @Column(length = 10)
    private String earliestDate;

    @Column(length = 10)
    private String contractShipCancelDate;

    @Column(length = 10)
    private String inDcDate;

    @Column(length = 10)
    private String inStoreDate;

    @Column(length = 15)
    private String revisionNumber;

    @Column(length = 5)
    private String currencyCode;

    @Column(length = 45)
    private String retailSeason;

    @Column(length = 20)
    private String buildTypeCode;

    @Enumerated(EnumType.STRING)
    private EnumShipmentMethodCode shipmentMethodCode;

    private boolean factoryDifferent;

    private int orderedQuantity;
    private int shipmentQuantity;

    @Deprecated
    private String flag;

    @Column(length = 45)
    private String incotermCode;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    @Column(name = "comp_id", nullable = false)
    private Long companyID;

    @Column(name = "user_id", length = 255)
    private String userID;

    @CreatedDate
    @Column(name = "createdAt")
    private Date createdAt;

    @OneToMany(mappedBy = "buyerOrderInfo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("line ASC")
    private List<BuyerOrderItem> buyerOrderItems = new ArrayList<>();

    @OneToMany(mappedBy = "buyerOrderInfo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("id ASC")
    private List<BuyerOrderChangeDescription> buyerOrderChangeDescriptions = new ArrayList<>();

    @OneToMany(mappedBy = "buyerOrderInfo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<BuyerOrderParty> buyerOrderParties = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "buyerOrderInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclPreBookingPo> mclPreBookingPos = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "buyerOrderInfo", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<BuyerOrderInvoice> buyerOrderInvoices = new ArrayList<>();
}
