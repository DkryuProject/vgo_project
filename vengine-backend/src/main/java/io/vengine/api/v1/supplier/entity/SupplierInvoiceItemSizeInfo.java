package io.vengine.api.v1.supplier.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.Department;
import io.vengine.api.v1.user.entity.User;
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
@Table(name = "supplier_invoice_item_size_info")
public class SupplierInvoiceItemSizeInfo extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //supplier invoice item 순번
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "supplier_invoice_item_id", referencedColumnName = "id", nullable = false)
    private SupplierInvoiceItemInfo supplierInvoiceItemInfo;

    //사이즈명(fabric 은 1개, trim, accessory 일 때 6개까지 로우가 늘어남)
    @Column(name = "size_name", length = 50)
    private String sizeName ;

    //사이즈 수량
    @Column(name = "size_qty")
    private int sizeQty ;

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

    @JsonManagedReference
    @OneToMany(mappedBy = "supplierInvoiceSizeGroup", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SupplierInvoiceItemInfo> supplierInvoiceItemInfos = new ArrayList<>();
}
