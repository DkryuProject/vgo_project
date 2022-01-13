package io.vengine.api.common.filters;

import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.BiPredicate;

public class MclSpecification {
    public static Specification<MclFactoryAlloc> searchMclFactoryAlloc(Map<String, Object> serchFilter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            serchFilter.forEach((key, value) -> {
                switch (key) {
                    case "mclOptionID":
                        Join<MclFactoryAlloc, MclOption> mclOptionJoin = root.join("mclOption", JoinType.INNER);
                        predicates.add(criteriaBuilder.equal(mclOptionJoin.get("id").as(Long.class), value));
                        break;

                    case "factoryID":
                        Join<MclFactoryAlloc, Company> factoryJoin = root.join("factory", JoinType.INNER);
                        predicates.add(criteriaBuilder.equal(factoryJoin.get("id").as(Long.class), value));
                        break;

                    case "productID":
                        Join<MclFactoryAlloc, CommonBasicInfo> productJoin = root.join("commonMaterialProduct", JoinType.INNER);
                        predicates.add(criteriaBuilder.equal(productJoin.get("id").as(Long.class), value));
                        break;
                }
            });

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<MclPreBooking> searchMclPrebooking(Map<String, Object> searchFilter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            searchFilter.forEach((key, value) -> {
                switch (key) {
                    case "mclOptionID":
                        Join<MclPreBooking, MclOption> mclOptionJoin = root.join("mclOption", JoinType.INNER);
                        predicates.add(criteriaBuilder.equal(mclOptionJoin.get("id").as(Long.class), value));
                        break;
                }
            });
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<MclMaterialPurchaseOrder> searchOrder(MclOption mclOption, String searchKeyWord, String status, Company company, String type) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicate = new ArrayList<>();
            String likeValue = "%"+searchKeyWord+"%";

            query.orderBy(criteriaBuilder.desc(root.get("updatedAt")));

            Join<MclMaterialPurchaseOrder, Company> materialPurchaseCompanyJoin = root.join("materialPurchaseCompany", JoinType.LEFT);
            Predicate materialPurchaseCompanyName = criteriaBuilder.like(materialPurchaseCompanyJoin.get("name"), likeValue);

            Join<MclMaterialPurchaseOrder, Company> materialSellingCompanyJoin = root.join("materialSellingCompany", JoinType.LEFT);
            Predicate materialSellingCompanyName = criteriaBuilder.like(materialSellingCompanyJoin.get("name"), likeValue);

            Join<MclMaterialPurchaseOrder, Company> consigneeCompanyJoin = root.join("consigneeCompany", JoinType.LEFT);
            Predicate consigneeCompanyName = criteriaBuilder.like(consigneeCompanyJoin.get("name"), likeValue);

            Join<MclMaterialPurchaseOrder, Company> shipperCompanyJoin = root.join("shipperCompany", JoinType.LEFT);
            Predicate shipperCompanyName = criteriaBuilder.like(shipperCompanyJoin.get("name"), likeValue);

            Join<MclMaterialPurchaseOrder, Company> forwarderJoin = root.join("forwarder", JoinType.LEFT);
            Predicate forwarderName = criteriaBuilder.like(forwarderJoin.get("name"), likeValue);

            Predicate orTemplate = criteriaBuilder.or(
                    criteriaBuilder.like(root.get("materialPurchaseOrderNumber"), likeValue),
                    criteriaBuilder.like(root.get("userName"), likeValue),
                    materialPurchaseCompanyName,
                    materialSellingCompanyName,
                    consigneeCompanyName,
                    shipperCompanyName,
                    forwarderName
            );

            if(status != ""){
                predicate.add(criteriaBuilder.equal(root.get("status"), OrderStatus.valueOf(status)));
            }

            if("vendor".equals(type)){
                predicate.add(criteriaBuilder.equal(root.get("company").as(Company.class), company));
                predicate.add(criteriaBuilder.equal(root.get("mclOption").as(MclOption.class), mclOption));
            }else if("supplier".equals(type)){
                predicate.add(criteriaBuilder.equal(root.get("materialSellingCompany").as(Company.class), company));
            }

            predicate.add(orTemplate);
            return criteriaBuilder.and(predicate.toArray(new Predicate[0]));
        };
    }

    public static Specification<MclMaterialAdhocPurchaseOrderPublish> searchOrder(String searchKeyWord, String status, Company company) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicate = new ArrayList<>();
            String likeValue = "%"+searchKeyWord+"%";

            query.orderBy(criteriaBuilder.desc(root.get("updatedAt")));

            Join<MclMaterialPurchaseOrder, Company> materialPurchaseCompanyJoin = root.join("materialPurchaseCompany", JoinType.LEFT);
            Predicate materialPurchaseCompanyName = criteriaBuilder.like(materialPurchaseCompanyJoin.get("name"), likeValue);

            Join<MclMaterialPurchaseOrder, Company> materialSellingCompanyJoin = root.join("materialSellingCompany", JoinType.LEFT);
            Predicate materialSellingCompanyName = criteriaBuilder.like(materialSellingCompanyJoin.get("name"), likeValue);

            Join<MclMaterialPurchaseOrder, Company> consigneeCompanyJoin = root.join("consigneeCompany", JoinType.LEFT);
            Predicate consigneeCompanyName = criteriaBuilder.like(consigneeCompanyJoin.get("name"), likeValue);

            Join<MclMaterialPurchaseOrder, Company> shipperCompanyJoin = root.join("shipperCompany", JoinType.LEFT);
            Predicate shipperCompanyName = criteriaBuilder.like(shipperCompanyJoin.get("name"), likeValue);

            Join<MclMaterialPurchaseOrder, Company> forwarderJoin = root.join("forwarder", JoinType.LEFT);
            Predicate forwarderName = criteriaBuilder.like(forwarderJoin.get("name"), likeValue);

            Predicate orTemplate = criteriaBuilder.or(
                    criteriaBuilder.like(root.get("materialPurchaseOrderNumber"), likeValue),
                    materialPurchaseCompanyName,
                    materialSellingCompanyName,
                    consigneeCompanyName,
                    shipperCompanyName,
                    forwarderName
            );

            if(status != ""){
                predicate.add(criteriaBuilder.equal(root.get("status"), OrderStatus.valueOf(status)));
            }

            predicate.add(criteriaBuilder.equal(root.get("company").as(Company.class), company));

            predicate.add(orTemplate);
            return criteriaBuilder.and(predicate.toArray(new Predicate[0]));
        };
    }
}
