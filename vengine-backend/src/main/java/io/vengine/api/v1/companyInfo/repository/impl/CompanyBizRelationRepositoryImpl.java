package io.vengine.api.v1.companyInfo.repository.impl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import io.vengine.api.common.enums.RelationType;
import io.vengine.api.v1.commonInfo.entity.QCommonBasicInfo;
import io.vengine.api.v1.companyInfo.dto.CompanyBizDto;
import io.vengine.api.v1.companyInfo.entity.CompanyBizRelation;
import io.vengine.api.v1.companyInfo.entity.QCompanyBizRelation;
import io.vengine.api.v1.companyInfo.repository.CompanyBizRelationRepositoryCustom;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.QCompany;
import io.vengine.api.v1.user.entity.QCompanyAddress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class CompanyBizRelationRepositoryImpl extends QuerydslRepositorySupport implements CompanyBizRelationRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public CompanyBizRelationRepositoryImpl() {
        super(CompanyBizRelation.class);
    }

    @Override
    public Page<CompanyBizDto> searchAll(String searchKeyword, Company company, Pageable pageable) {
        JPAQueryFactory queryFactory = new JPAQueryFactory(this.getEntityManager());
        BooleanBuilder builder = new BooleanBuilder();

        QCompanyBizRelation relation = QCompanyBizRelation.companyBizRelation;
        QCompanyAddress address = QCompanyAddress.companyAddress;
        QCompany bizCompany = QCompany.company;
        QCommonBasicInfo basicInfo = QCommonBasicInfo.commonBasicInfo;

        if(searchKeyword == null){
            searchKeyword = "";
        }

        String likeValue = "%"+searchKeyword+"%";
        if(searchKeyword != ""){
            builder.or(relation.bizCompany.name.like(likeValue));
            builder.or(address.countryId.cmName1.like(likeValue));
            //builder.or(address.cityId.cmName4.like(likeValue));
            builder.or(address.etc.like(likeValue));
            builder.or(address.zipCode.like(likeValue));
        }

        QueryResults<CompanyBizDto> result = queryFactory
                .from(relation)
                .select(
                        Projections.bean(
                                CompanyBizDto.class,
                                relation.id,
                                relation.relationType,
                                relation.bizCompany.id.as("companyID"),
                                relation.bizCompany.name.as("companyName"),
                                ExpressionUtils.as(JPAExpressions.select(basicInfo.cmName1).from(basicInfo).where(basicInfo.id.eq(address.countryId.id)),"country"),
                                ExpressionUtils.as(JPAExpressions.select(basicInfo.cmName4).from(basicInfo).where(basicInfo.id.eq(address.cityId.id)),"city"),
                                address.etc.as("address"),
                                address.zipCode.as("postalCode"),
                                relation.status.as("status")
                        )
                )
                .join(bizCompany).on(bizCompany.id.eq(relation.bizCompany.id))
                .leftJoin(address).on(address.companyInfo.id.eq(bizCompany.id), address.representitive.eq(1))
                .where(relation.company.eq(company),
                        builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(relation.updatedAt.desc())
                .fetchResults();

        return new PageImpl<>(result.getResults(), pageable, result.getTotal());
    }
}
