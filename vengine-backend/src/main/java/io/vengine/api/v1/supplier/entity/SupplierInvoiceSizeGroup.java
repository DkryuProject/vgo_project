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
@Table(name = "supplier_invoice_size_group")
public class SupplierInvoiceSizeGroup extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //supplier invoice 순번
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "supplier_invoice_id", referencedColumnName = "id", nullable = false)
    private SupplierInvoice supplierInvoice;

    @Column(name = "size_group_number", length = 20, nullable = false)
    private String sizeGroupNumber ;

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
