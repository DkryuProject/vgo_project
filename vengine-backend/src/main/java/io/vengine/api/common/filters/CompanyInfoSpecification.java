package io.vengine.api.common.filters;

import io.vengine.api.v1.companyInfo.entity.CompanyCost;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CompanyInfoSpecification {
    public static Specification<CompanyCost> searchCost(Map<String, Object> filter){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            filter.forEach((key, value) -> {
                String likeValue = "%"+value+"%";

                switch (key) {
                    case "name":
                        predicates.add(criteriaBuilder.like(root.get(key).as(String.class), likeValue));
                        break;

                    case "type":
                        predicates.add(criteriaBuilder.equal(root.get(key).as(String.class), value));
                        break;
                }
            });
            return  criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
