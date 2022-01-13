package io.vengine.api.v1.material.repository;

import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialYarn;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialYarnRepository extends JpaRepository<MaterialYarn, Long>, MaterialYarnRepositoryCustom {
    List<MaterialYarn> findByCompanyAndDelFlagNot(Company company, String delFlag);

    List<MaterialYarn> findByMaterialInfo(MaterialInfo materialInfo);
}
