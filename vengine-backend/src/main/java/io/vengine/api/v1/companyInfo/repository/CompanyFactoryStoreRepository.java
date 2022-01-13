package io.vengine.api.v1.companyInfo.repository;

import io.vengine.api.v1.companyInfo.entity.CompanyFactoryStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyFactoryStoreRepository extends JpaRepository<CompanyFactoryStore, Long>, JpaSpecificationExecutor<CompanyFactoryStore> {
}
