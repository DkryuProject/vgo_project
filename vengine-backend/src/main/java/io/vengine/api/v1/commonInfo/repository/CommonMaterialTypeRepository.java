package io.vengine.api.v1.commonInfo.repository;

import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommonMaterialTypeRepository extends JpaRepository<CommonMaterialType, Long> {
    List<CommonMaterialType> findByCategoryA(String categoryA);

    List<CommonMaterialType> findByCategoryAAndCategoryB(String categoryA, String categoryB);

    Optional<CommonMaterialType> findByCategoryAAndCategoryBAndCategoryC(String categoryA, String categoryB, String categoryC);
}
