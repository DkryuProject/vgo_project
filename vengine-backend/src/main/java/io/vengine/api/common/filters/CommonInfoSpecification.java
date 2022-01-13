package io.vengine.api.common.filters;

import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CommonInfoSpecification {
    public static Specification<CommonBasicInfo> searchCommonInfo(Map<String, Object> filter){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            filter.forEach((key, value) -> {
                String likeValue = "%"+value+"%";

                switch (key) {
                    case "cmName1":
                    case "cmName2":
                    case "cmName3":
                    case "cmName4":
                        predicates.add(criteriaBuilder.like(root.get(key).as(String.class), likeValue));
                        break;

                    case "cmName5":
                    case "cmName6":
                        predicates.add(criteriaBuilder.equal(root.get(key).as(Long.class), value));
                        break;

                    case "type":
                        predicates.add(criteriaBuilder.equal(root.get(key).as(String.class), value));
                        break;
                }
            });
            return  criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<CommonBasicInfo> searchCommonInfo(String searchKeyWord, String type){
        return (root, query, criteriaBuilder) -> {
            String likeValue = "%"+searchKeyWord+"%";

            Predicate cmName1 = criteriaBuilder.like(root.get("cmName1").as(String.class), likeValue);
            Predicate cmName2 = criteriaBuilder.like(root.get("cmName2").as(String.class), likeValue);
            Predicate cmName3 = criteriaBuilder.like(root.get("cmName3").as(String.class), likeValue);
            Predicate cmName4 = criteriaBuilder.like(root.get("cmName4").as(String.class), likeValue);
            //Predicate cmName5 = criteriaBuilder.equal(root.get("cmName5").as(Long.class), Long.parseLong(searchKeyWord));
            //Predicate cmName6 = criteriaBuilder.equal(root.get("cmName6").as(Long.class), Long.parseLong(searchKeyWord));

            return  criteriaBuilder.and(criteriaBuilder.equal(root.get("type").as(String.class), type),
                    criteriaBuilder.or(cmName1, cmName2, cmName3, cmName4)
                    );
        };
    }

    public static Specification<CommonBasicInfo> searchCommonInfo(Long cmName6) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(criteriaBuilder.equal(root.get("cmName6").as(Long.class), cmName6));
    }


}
