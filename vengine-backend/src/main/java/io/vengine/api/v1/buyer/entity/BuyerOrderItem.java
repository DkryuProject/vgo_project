package io.vengine.api.v1.buyer.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.v1.mcl.entity.MclPreBookingPoItem;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "buyer_order_item")
//@Audited
public class BuyerOrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(length = 50)
    private String itemUid;

    @Column(length = 50)
    private String itemTypeCode;

    @Column(length = 45)
    private String styleNumber;

    @Column(length = 50)
    private String color;

    @Column(length = 10)
    private String prepackType;

    @Column(length = 1)
    private String fullCartonIndicator;

    @Column(length = 10)
    private String pricePerUnit;

    @Column(length = 5)
    private String qty;

    @Column(length = 5)
    private String pkQty;

    @Column(length = 5)
    private String qtyPerInnerPack;

    @Column(length = 5)
    private String qtyPerOuterPack;

    @Column(length = 10)
    private String size;

    @Column(length = 10)
    private String totalPrice;

    @Column(length = 20)
    private String sku;

    @Column(length = 5)
    private String line;

    @Column(length = 15)
    private String packInstructionReference;

    @Column(length = 100)
    private String description;

    @Column(name = "comp_id", nullable = false)
    private Long companyID;

    @Column(name = "user_id", length = 255)
    private String userID;

    @CreatedDate
    @Column(name = "createdAt")
    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyerOrderInfoId", nullable = false)
    private BuyerOrderInfo buyerOrderInfo;

    @JsonManagedReference
    @OneToMany(mappedBy = "buyerOrderItem", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<MclPreBookingPoItem> mclPreBookingPoItems = new ArrayList<>();

    public BuyerOrderItem(String styleNumber, String color, String qty, String totalPrice, BuyerOrderInfo buyerOrderInfo) {
        this.styleNumber = styleNumber;
        this.color = color;
        this.qty = qty;
        this.totalPrice = totalPrice;
        this.buyerOrderInfo = buyerOrderInfo;
    }

    public BuyerOrderItem(BuyerOrderInfo buyerOrderInfo) {
        this.buyerOrderInfo = buyerOrderInfo;
    }

    public BuyerOrderItem(String size, String qty) {
        this.qty = qty;
        this.size = size;
    }
}
