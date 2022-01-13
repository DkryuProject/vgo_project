package io.vengine.api.v1.supplier.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.vengine.api.common.entity.CommonDateEntity;
import io.vengine.api.common.entity.CommonEntity;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderPublish;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.Department;
import io.vengine.api.v1.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.AuditJoinTable;
import org.hibernate.envers.AuditOverride;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "supplier_invoice")
public class SupplierInvoice extends CommonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //supplier 순번
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "supplier_comp_id", referencedColumnName = "id", nullable = false)
    private Company supplier;

    //invoice 번호
    @Column(name = "invoice_no", nullable = false, length = 50)
    private String invoiceNo;

    //invoice 이슈 일자
    @Column(name = "invoice_issue_date", nullable = false)
    private Date invoiceIssueDate;

    //payment due date
    @Column(name = "payment_due_date", nullable = false)
    private Date paymentDueDate;

    //통화 순번
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "common_currency_id", referencedColumnName = "id", nullable = false)
    private CommonBasicInfo currency;

    //상태값(0: Draft, 1: Published)
    @Column(name = "status", nullable = false)
    private int status = 0;

    @Column(name = "comments", length = 2500)
    private String comments ;

    @JsonManagedReference
    @OneToMany(mappedBy = "supplierInvoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SupplierInvoiceItemInfo> supplierInvoiceItemInfos = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "supplierInvoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SupplierInvoiceSizeGroup> supplierInvoiceSizeGroups = new ArrayList<>();
}
