package io.vengine.api.common.filters;

import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.companyInfo.entity.CompanyBizRelation;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.CompanyAddress;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

public class UserSpecification {
    public static Specification<Company> searchCompany(String type, String searchKeyword, User user) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = getCompanyWithKeyword(searchKeyword, root, criteriaBuilder);

            if("relation".equals(type)){
                query.orderBy(criteriaBuilder.asc(root.get("name")));

                Subquery<Company> relationSubquery = query.subquery(Company.class);
                Root<CompanyBizRelation> relation = relationSubquery.from(CompanyBizRelation.class);

                relationSubquery.select(relation.get("bizCompany"))
                        .where(criteriaBuilder.equal(relation.get("companyRegister").as(Company.class), user.getCompId()));

                predicates.add(criteriaBuilder.and(
                        criteriaBuilder.notEqual(root.as(Company.class), user.getCompId()),
                        criteriaBuilder.not(criteriaBuilder.in(root).value(relationSubquery))
                ));
            }else{
                query.orderBy(criteriaBuilder.desc(root.get("updatedAt")));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static List<Predicate> getCompanyWithKeyword(String searchKeyword, Root<Company> root, CriteriaBuilder builder) {
        List<Predicate> predicates = new ArrayList<>();

        String likeValue = "%"+searchKeyword+"%";

        Join<Company, CompanyAddress> companyAddressJoin = root.join("companyAddresses", JoinType.INNER);
        companyAddressJoin.on(builder.equal(companyAddressJoin.get("representitive"), 1));

        Join<CompanyAddress, CommonBasicInfo> countryJoin = companyAddressJoin.join("countryId", JoinType.INNER);
        Join<CompanyAddress, CommonBasicInfo> cityJoin = companyAddressJoin.join("cityId", JoinType.LEFT);

        predicates.add(builder.or(
                builder.like(root.get("name").as(String.class), likeValue),
                builder.like(countryJoin.get("cmName1").as(String.class), likeValue),
                builder.like(cityJoin.get("cmName1").as(String.class), likeValue),
                builder.like(companyAddressJoin.get("etc").as(String.class), likeValue),
                builder.like(companyAddressJoin.get("state").as(String.class), likeValue),
                builder.like(companyAddressJoin.get("zipCode").as(String.class), likeValue)
                )
        );
        return predicates;
    }
}
