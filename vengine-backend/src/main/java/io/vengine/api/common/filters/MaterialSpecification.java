package io.vengine.api.common.filters;

import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.material.entity.MaterialYarn;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MaterialSpecification {
    public static Specification<MaterialInfo> searchMaterialInfo(String searchKeyWord, String type, User user, List<Company> suppliers){
        return (root, query, criteriaBuilder) -> {
            String likeValue = "%"+searchKeyWord+"%";

            suppliers.add(user.getCompId());

            query.orderBy(criteriaBuilder.desc(root.get("updatedAt")));
            query.distinct(true);

            Predicate name = criteriaBuilder.like(root.get("name").as(String.class), likeValue);

            //supplier name join
            Join<MaterialInfo, Company> supplierJoin = root.join("supplierCompany", JoinType.INNER);
            Predicate supplier = criteriaBuilder.like(supplierJoin.get("name"), likeValue);

            //supplier name join
            Join<MaterialInfo, CommonMaterialType> materialTypeJoin = root.join("materialCategory", JoinType.INNER);
            Predicate materialTypeB = criteriaBuilder.like(materialTypeJoin.get("categoryB"), likeValue);
            Predicate materialTypeC = criteriaBuilder.like(materialTypeJoin.get("categoryC"), likeValue);

            Join<MaterialInfo, MaterialOffer> materialOfferJoin = root.join("materialOffers", JoinType.LEFT);
            Predicate materialNo = criteriaBuilder.like(materialOfferJoin.get("myMillarticle"), likeValue);

            Predicate orTemplate = criteriaBuilder.or(name, supplier, materialTypeB, materialTypeC, materialNo);

            Predicate userCompany = criteriaBuilder.equal(root.get("company").as(Company.class), user.getCompId());

            Predicate supplierCompany = criteriaBuilder.and(root.get("supplierCompany").in(suppliers));

            Predicate orCompany= criteriaBuilder.or(supplierCompany, userCompany);

            if(type.isEmpty()){
                return criteriaBuilder.and(orTemplate, orCompany);
            }else{
                Predicate infoType = criteriaBuilder.equal(root.get("type").as(String.class), type);
                return criteriaBuilder.and(infoType, orTemplate, orCompany);
            }
        };
    }

    public static Specification<MaterialInfo> searchMaterialInfo(Map<String, Object> filter, Company company, List<Company> suppliers){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            suppliers.add(company);

            filter.forEach((key, value) -> {
                String likeValue = "%"+value+"%";

                switch (key) {
                    case "categoryB":
                        Join<MaterialInfo, CommonMaterialType> categoryB = root.join("materialCategory", JoinType.INNER);
                        predicates.add(criteriaBuilder.equal(categoryB.get("categoryB").as(String.class), value));
                        break;

                    case "categoryC":
                        Join<MaterialInfo, CommonMaterialType> categoryC = root.join("materialCategory", JoinType.INNER);
                        predicates.add(criteriaBuilder.equal(categoryC.get("categoryC").as(String.class), value));
                        break;

                    case "chief":
                        Join<MaterialInfo, MaterialYarn> materialYarnJoin = root.join("materialYarns", JoinType.INNER);
                        Join<MaterialYarn, CommonBasicInfo> commonBasicInfoJoin = materialYarnJoin.join("commonMaterialYarn", JoinType.INNER);
                        predicates.add(criteriaBuilder.equal(commonBasicInfoJoin.get("id").as(Long.class), value));
                        break;

                    case "supplier":
                        Join<MaterialInfo, Company> supplierJoin = root.join("supplierCompany", JoinType.INNER);
                        predicates.add(criteriaBuilder.equal(supplierJoin.get("id").as(Long.class), value));
                        break;

                    case "name":
                        predicates.add(criteriaBuilder.like(root.get("name").as(String.class), likeValue));
                        break;
                }
            });
            Predicate userCompany = criteriaBuilder.equal(root.get("company").as(Company.class), company);
            Predicate supplierCompany = null;
            if(suppliers.size()>0){
                supplierCompany = criteriaBuilder.and(root.get("supplierCompany").in(suppliers));
            }

            Predicate orCompany= criteriaBuilder.or(supplierCompany, userCompany);

            return criteriaBuilder.and(criteriaBuilder.and(predicates.toArray(new Predicate[0])), orCompany);
        };
    }

    public static Specification<MaterialInfo> getMaterialInfoByMaterialNo(String searchKeyWord) {
        return (root, query, criteriaBuilder) -> {
            String likeValue = "%" + searchKeyWord + "%";
            ListJoin<MaterialInfo, MaterialOffer> materialOfferJoin = root.joinList("materialOffers");
            Predicate predicate = criteriaBuilder.like(materialOfferJoin.get("myMillarticle"), likeValue);

            query.distinct(true);
            return predicate;
        };
    }
}
