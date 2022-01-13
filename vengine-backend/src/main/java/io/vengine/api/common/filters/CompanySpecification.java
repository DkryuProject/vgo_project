package io.vengine.api.common.filters;

import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class CompanySpecification<T> implements Specification<T> {
    private final Company company;

    public CompanySpecification(Company company) {
        this.company = company;
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        //query.orderBy(criteriaBuilder.desc(root.get("updatedAt")));
        Predicate userCompany = criteriaBuilder.equal(root.get("company").as(Company.class), this.company);
        //Predicate delFlag = criteriaBuilder.notEqual(root.get("delFlag").as(String.class), "D");
        return criteriaBuilder.and(userCompany);
    }
}
