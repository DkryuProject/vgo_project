package io.vengine.api.v1.material.repository;

import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<MaterialInfo, Long>, JpaSpecificationExecutor<MaterialInfo> {
    Page<MaterialInfo> findByCompanyAndDelFlagNot(Company company, String delFlag, Pageable pageable);

    @Query(value = "SELECT * FROM material_info\n" +
            "where item_name = :name \n" +
            "and supplier_comp_id = :supplierId \n" +
            "and cm_material_type_id = :categoryId \n" +
            "and yarn_size_wrap = :yarnSizeWrap \n" +
            "and yarn_size_weft = :yarnSizeWeft \n" +
            "and construction_epi = :constructionEpi \n" +
            "and construction_ppi = :constructionPpi \n" +
            "limit 1\n", nativeQuery = true)
    Optional<MaterialInfo> findMaterialInfo(String name, Long supplierId, Long categoryId,
                                            String yarnSizeWrap, String yarnSizeWeft,
                                            int constructionEpi, int constructionPpi
    );

    @Query(value = "SELECT * FROM material_info\n" +
            "where item_name = :name \n" +
            "and supplier_comp_id = :supplierId \n" +
            "and cm_material_type_id = :categoryId \n" +
            "and item_detail = :subsidiaryDetail \n" +
            "limit 1\n", nativeQuery = true)
    Optional<MaterialInfo> findMaterialInfo(String name, Long supplierId, Long categoryId, String subsidiaryDetail);
}
