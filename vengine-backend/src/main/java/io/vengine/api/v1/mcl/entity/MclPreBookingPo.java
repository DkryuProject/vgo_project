package io.vengine.api.v1.mcl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.buyer.entity.BuyerOrderInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mcl_pre_booking_po")
@Where(clause = "del_flag = 'N'")
//@AuditOverride(forClass = CommonEntity.class)
//@Audited
public class MclPreBookingPo extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //mcl option
    //@NotAudited
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_option_id", referencedColumnName = "id", nullable = false)
    private MclOption mclOption;

    //mcl pre booking
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mcl_pre_booking_id", referencedColumnName = "id", nullable = false)
    private MclPreBooking mclPreBooking;

    //po 번호
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_product_order_id", referencedColumnName = "id", nullable = false)
//@NotAudited
    ////@Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    private BuyerOrderInfo buyerOrderInfo;

//@NotAudited
    @JsonManagedReference
    @OneToMany(mappedBy = "mclPreBookingPo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<MclPreBookingPoItem> mclPreBookingPoItems = new ArrayList<>();

    public void setMclPreBookingPoItems(List<MclPreBookingPoItem> items) {
        for (MclPreBookingPoItem mclPreBookingPoItem : items){
            mclPreBookingPoItem.setMclPreBookingPo(this);
        }
        this.mclPreBookingPoItems = items;
    }
}
