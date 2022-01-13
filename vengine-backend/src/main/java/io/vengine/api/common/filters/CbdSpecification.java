package io.vengine.api.common.filters;

import io.vengine.api.common.utils.StringUtil;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import io.vengine.api.v1.companyInfo.entity.CompanyOrderType;
import io.vengine.api.v1.companyInfo.entity.CompanySeason;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CbdSpecification {
    public static Specification<CBDCover> serchCbdCover(String searchKeyWord, User user){
        return (root, query, criteriaBuilder) -> {
            String likeValue = "%"+searchKeyWord+"%";

            query.orderBy(criteriaBuilder.desc(root.get("updatedAt")));

            //buyer name join
            Join<CBDCover, Company> buyerJoin = root.join("buyer", JoinType.INNER);
            Predicate buyer = criteriaBuilder.like(buyerJoin.get("name"), likeValue);

            //brand name join
            Join<CBDCover, Company> brandJoin = root.join("vendorBrandId", JoinType.INNER);
            Predicate brand = criteriaBuilder.like(brandJoin.get("name"), likeValue);

            //season join
            Join<CBDCover, CompanySeason> seasonJoin = root.join("season", JoinType.INNER);
            Predicate season = criteriaBuilder.like(seasonJoin.get("name"), likeValue);

            //gender join
            Join<CBDCover, CommonBasicInfo> genderJoin = root.join("commonGenderId", JoinType.INNER);
            Predicate gender = criteriaBuilder.like(genderJoin.get("cmName1"), likeValue);

            //fabric type join
            Join<CBDCover, CommonMaterialType> fabricTypeJoin = root.join("materialCategoryId", JoinType.INNER);
            Predicate fabricType = criteriaBuilder.like(fabricTypeJoin.get("categoryB"), likeValue);

            //garment type join
            Join<CBDCover, CommonBasicInfo> garmentTypeJoin = root.join("commonGarmentCategoryId", JoinType.INNER);
            Predicate garmentType = criteriaBuilder.like(garmentTypeJoin.get("cmName1"), likeValue);

            //order type join
            Join<CBDCover, CompanyOrderType> orderTypeJoin = root.join("orderType", JoinType.INNER);
            Predicate orderType = criteriaBuilder.like(orderTypeJoin.get("name"), likeValue);

            Predicate cbdName = criteriaBuilder.like(root.get("cbdName").as(String.class), likeValue);

            //user join
            Join<CBDCover, User> userJoin = root.join("user", JoinType.INNER);
            Predicate userName = criteriaBuilder.like(userJoin.get("fullName"), likeValue);

            Predicate designNumber = criteriaBuilder.like(root.get("designNumber"), searchKeyWord);
            Predicate orTemplate = criteriaBuilder.or(buyer, brand, season, gender, fabricType, garmentType, orderType, cbdName, designNumber, userName);

            Predicate userCompany = criteriaBuilder.equal(root.get("company").as(Company.class), user.getCompId());
            Predicate delFlag = criteriaBuilder.notEqual(root.get("delFlag").as(String.class), "D");
            return criteriaBuilder.and(userCompany, delFlag, orTemplate);
        };
    }

    public static Specification<CBDCover> searchCbdCover(Map<String, Object> filter, Company company){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            filter.forEach((key, value) -> {
                String likeValue = "%"+value+"%";

                switch (key) {
                    case "brand":
                        Join<CBDCover, Company> brandJoin = root.join("vendorBrandId", JoinType.INNER);
                        predicates.add(criteriaBuilder.equal(brandJoin.get("id").as(Long.class), value));
                        break;

                    case "designNumber":
                        predicates.add(criteriaBuilder.like(root.get(key).as(String.class), likeValue));
                        break;

                    case "seasonName":
                        Join<CBDCover, CompanySeason> seasonJoin = root.join("season", JoinType.INNER);
                        predicates.add(criteriaBuilder.equal(seasonJoin.get("id").as(Long.class), value));
                        break;

                    case "seasonYear":
                        predicates.add(criteriaBuilder.equal(root.get(key).as(Integer.class), value));
                        break;

                    case "orderType":
                        Join<CBDCover, CompanyOrderType> orderTypeJoin = root.join("orderType", JoinType.INNER);
                        predicates.add(criteriaBuilder.equal(orderTypeJoin.get("id").as(Long.class), value));
                        break;
                }
            });

            return  criteriaBuilder.and(criteriaBuilder.and(predicates.toArray(new Predicate[0])),
                    criteriaBuilder.equal(root.get("company").as(Company.class), company));
        };
    }
}
