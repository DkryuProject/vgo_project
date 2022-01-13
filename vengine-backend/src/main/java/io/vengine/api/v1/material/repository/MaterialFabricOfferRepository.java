package io.vengine.api.v1.material.repository;

import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialFabricOfferRepository extends JpaRepository<MaterialOffer, Long> {
    List<MaterialOffer> findByCompanyAndDelFlagNot(Company company, String delFlag);

    Optional<MaterialOffer> findByRecipientAndVendorBrand(Company recipientCompany, Company brand);

    List<MaterialOffer> findByOriginalMillarticleId(Long originalId);

    Optional<MaterialOffer> findByMaterialInfoAndOriginalMillarticleId(MaterialInfo copyMaterialInfo, Long materialOfferId);
}
