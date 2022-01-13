package io.vengine.api.common.filters;

import io.vengine.api.v1.buyer.entity.BuyerOrderInfo;
import io.vengine.api.v1.buyer.enums.EnumStatus;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;

public class BuyerOrderSpecification {
    public static Specification<BuyerOrderInfo> searchBuyerOrder(String searchKeyWord, Company company) {
        return (root, query, criteriaBuilder) -> {
            String likeValue = "%"+searchKeyWord+"%";

            query.orderBy(criteriaBuilder.desc(root.get("timestamp")));

            Predicate poNumber = criteriaBuilder.like(root.get("documentRefNumber"), likeValue);

            Predicate buyer = criteriaBuilder.like(root.get("divisionName"), likeValue);

            Predicate brand = criteriaBuilder.like(root.get("brand"), likeValue);

            Predicate market = criteriaBuilder.like(root.get("marketDesc"), likeValue);

            Predicate orTemplate = criteriaBuilder.or(buyer, brand, poNumber, market);

            return criteriaBuilder.and(orTemplate);
        };
    }
}
