package io.vengine.api.v1.buyer.entity;

import io.vengine.api.common.entity.CommonDateEntity;
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
@Table(name = "buyer_order_invoice")
//@Audited
public class BuyerOrderInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyerOrderInfoId", nullable = false)
    private BuyerOrderInfo buyerOrderInfo;

    @Column(length = 500)
    private String invoiceURL;

    @Column(length = 45, nullable = false)
    private String invoiceNumber;

    @Column(length = 45, nullable = false)
    private String invoiceUid;

    @Column(length = 45, nullable = false)
    private String shipmentDocumentUid;

    @Column(length = 500)
    private String shipmentURL;

    @Column(length = 45)
    private String draftedOn;

    @Column(length = 45)
    private String publishedOn;

    @Column(length = 45)
    private String cancelledOn;

    @Column(length = 45)
    private String rejectedOn;

    @Column(length = 45)
    private String finishedOn;

    @Column(length = 15, nullable = false)
    private String status;

    private Float totalQuantity;

    private Float totalMerchandiseAmount;

    private Float totalAllowanceChargeAmount;

    private Float totalTaxAmount;

    private Float totalDocumentAmount;

    @Column(length = 10)
    private String rejectedReferenceDocumentType;

    @Column(length = 50)
    private String rejectedReferenceDocumentId;

    @Column(length = 200)
    private String rejectedReferenceDocumentNote;

    @Column(length = 500)
    private String rejectedReferenceDocumentUrl;

    @Column(name = "comp_id", nullable = false)
    private Long companyID;

    @Column(name = "user_id", length = 255)
    private String userID;

    @CreatedDate
    @Column(name = "createdAt")
    private LocalDateTime createdAt;
}
