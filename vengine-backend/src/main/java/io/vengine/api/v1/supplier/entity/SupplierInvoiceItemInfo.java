package io.vengine.api.v1.supplier.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.Department;
import io.vengine.api.v1.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "supplier_invoice_item_info")
public class SupplierInvoiceItemInfo extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //supplier invoice 순번
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "supplier_invoice_id", referencedColumnName = "id", nullable = false)
    private SupplierInvoice supplierInvoice;

    //사이즈 그룹 순번
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "supplier_invoice_size_group_id", referencedColumnName = "id", nullable = false)
    private SupplierInvoiceSizeGroup supplierInvoiceSizeGroup;

    //디자인 번호
    @Column(name = "design_number", length = 60, nullable = false)
    private String designNumber ;

    //material info 순번
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "material_info_offer_id", referencedColumnName = "id")
    private MaterialOffer materialOffer;

    //HS CODE
    @Column(name = "hs_code", length = 30)
    private String hsCode ;

    //invoice color
    @Column(name = "invoice_color", length = 30)
    private String invoiceColor ;

    //trim, accessory 일때
    @Column(name = "invoice_tip_color", length = 30)
    private String invoiceTipColor ;

    //invoice uom
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "cm_invoice_uom_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo invoiceUom;

    //unit price
    @Column(name = "average_unit_price", precision = 15, scale = 2, nullable = false)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "total_quantity", precision = 15, scale = 2, nullable = false)
    private BigDecimal totalQuantity = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    //화면 리스트 순번
    @Column(name = "order_idx", length = 10, nullable = false)
    private String orderIdx ;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "dept_id", referencedColumnName = "id", nullable = false)
    private Department department;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "comp_id", referencedColumnName = "id", nullable = false)
    private Company company;
}
