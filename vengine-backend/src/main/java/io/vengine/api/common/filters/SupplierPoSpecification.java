package io.vengine.api.common.filters;

import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderItemPublish;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderPublish;
import io.vengine.api.v1.mcl.entity.QMclMaterialPurchaseOrderItemPublish;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;

public class SupplierPoSpecification {
    public static Specification<MclMaterialPurchaseOrderItemPublish> searchPoItemByCompany(Company company) {
        return new Specification<MclMaterialPurchaseOrderItemPublish>() {
            @Override
            public Predicate toPredicate(Root<MclMaterialPurchaseOrderItemPublish> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.equal(root.get("company").as(Company.class), company);
            }
        };
    }

    public static Specification<MclMaterialPurchaseOrderItemPublish> searchPoItemBySupplier(String supplierName) {
        return new Specification<MclMaterialPurchaseOrderItemPublish>() {
            @Override
            public Predicate toPredicate(Root<MclMaterialPurchaseOrderItemPublish> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                Join<MclMaterialPurchaseOrderItemPublish, MclMaterialPurchaseOrderPublish> orderJoin = root.join("mclMaterialPurchaseOrderPublish", JoinType.INNER);
                Join<MclMaterialPurchaseOrderPublish, Company> orderItemSupplierJoin = orderJoin.join("materialSellingCompany", JoinType.INNER);

                return criteriaBuilder.equal(orderItemSupplierJoin.get("name"), supplierName);
            }
        };
    }
}
