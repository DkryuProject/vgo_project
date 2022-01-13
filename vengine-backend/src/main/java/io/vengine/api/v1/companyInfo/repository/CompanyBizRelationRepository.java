package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.common.enums.RelationType;
import io.vengine.api.v1.companyInfo.entity.CompanyBizRelation;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyBizRelationRepository extends JpaRepository<CompanyBizRelation, Long>, CompanyBizRelationRepositoryCustom {
    Optional<CompanyBizRelation> findByRelationTypeAndBizCompanyAndCompanyRegister(RelationType relationType, Company bizCompany, Company companyRegister);

    List<CompanyBizRelation> findByRelationTypeAndStatusAndCompanyRegister(RelationType relationType, String status, Company company);

    List<CompanyBizRelation> findByStatusAndCompanyRegister(String status, Company company);

    List<CompanyBizRelation> findByRelationTypeAndStatusNotAndCompanyRegister(RelationType of, String a, Company company);

    List<CompanyBizRelation> findByStatusNotAndCompanyRegister(String d, Company company);
}
