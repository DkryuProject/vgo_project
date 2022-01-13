package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.companyInfo.entity.CompanyDomainRelation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyDomainRelationRepository extends JpaRepository<CompanyDomainRelation, Long> {
    Optional<CompanyDomainRelation> findByRelationDomain(String domain);
}
