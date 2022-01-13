package io.vengine.api.v1.user.repository;

import io.vengine.api.v1.user.entity.TempCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TempCompanyRepository extends JpaRepository<TempCompany, Long> {
    Optional<TempCompany> findByName(String companyName);
}
