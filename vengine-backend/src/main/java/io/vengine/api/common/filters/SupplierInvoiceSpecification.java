package io.vengine.api.common.filters;

import io.vengine.api.v1.supplier.entity.SupplierInvoice;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;

public class SupplierInvoiceSpecification {
    public static Specification<SupplierInvoice> searchInvoiceByCompany(Company company) {
        return new Specification<SupplierInvoice>() {
            @Override
            public Predicate toPredicate(Root<SupplierInvoice> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.equal(root.get("company").as(Company.class), company);
            }
        };
    }

    public static Specification<SupplierInvoice> searchInvoiceBySupplier(String supplierName) {
        return new Specification<SupplierInvoice>() {
            @Override
            public Predicate toPredicate(Root<SupplierInvoice> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                Join<SupplierInvoice, Company> invoiceSupplierJoin = root.join("supplier", JoinType.INNER);
                return criteriaBuilder.equal(invoiceSupplierJoin.get("name"), supplierName);
            }
        };
    }
}
