package io.vengine.api.v1.mcl.repository;

import io.vengine.api.common.enums.Status;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.mcl.entity.MclMaterialInfo;
import io.vengine.api.v1.mcl.entity.MclOption;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MclMaterialInfoRepository extends JpaRepository<MclMaterialInfo, Long> {
    List<MclMaterialInfo> findByMclOption(MclOption mclOption);

    List<MclMaterialInfo> findByMclOptionAndType(MclOption mclOption, String type);

    List<MclMaterialInfo> findByMclOptionAndMaterialInfo(MclOption mclOption, MaterialInfo materialInfo);

    List<MclMaterialInfo> findByStatusAndBuyerAndSupplierAndFactory(Status close, Company buyer, Company supplier, Company factory);

    List<MclMaterialInfo> findByMclOptionAndCbdMaterialInfo(MclOption mclOption, CBDMaterialInfo cbdMaterialInfo);
}
