package io.vengine.api.v1.material.service;

import io.vengine.api.common.dto.ExcelResponse;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.material.dto.MaterialInfoRequest;
import io.vengine.api.v1.material.entity.*;
import io.vengine.api.v1.mcl.dto.NewAdhocMaterialInfoRequest;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;


import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface MaterialService {

    MaterialInfo saveMaterialInfo(MaterialInfoRequest materialInfoRequest, User user);

    List<MaterialYarn> findYarnByMaterialId(Long materialInfoId, User user);

    MaterialOffer saveMaterialOffer(MaterialOffer materialOffer, User user);

    List<MaterialOffer> findOfferByMaterialId(Long materialInfoId, User user);

    Optional<MaterialOffer> findOfferById(Long id);

    Optional<MaterialInfo> findMaterialInfoById(Long id);

    MaterialInfo saveMaterialImage(Long id, MultipartFile file);

    void saveMaterialYarn(MaterialYarn materialYarn, User user);

    List<MaterialYarn> saveMaterialYarn(List<MaterialYarn> materialYarns, User user);

    Page<MaterialInfo> findAllMaterialInfo(String searchKeyWord, String type, int page, int size, User user);

    List<MaterialInfo> findAllMaterialInfo(Map<String, Object> searchKeyWord, User user);

    void deleteFlagUpdateMaterialOffer(Long id, User user);

    void deleteFlagUpdateMaterialYarn(Long id, User user);

    void deleteFlagUpdateMaterialInfo(Long id, User user);

    List<CommonBasicInfo> findChiefContents(User user);

    void saveNewMaterialInfo(NewAdhocMaterialInfoRequest request, User user);

    void saveFabricMaterialExcel(String excelDataJson, User user);

    void saveTrimMaterialExcel(String excelDataJson, User user);

    void saveAccessoriesMaterialExcel(String excelDataJson, User user);

    void modifyMaterialInfo(MaterialInfo materialInfo, MaterialInfoRequest materialInfoRequest, User user);

    List<MaterialOffer> findMyOwnMaterialOfferList(MaterialInfo materialInfo, Company compId);

    Optional<MaterialInfo> findMaterialInfo(String name, Long supplierId, Long categoryId,
                                            String yarnSizeWrap, String yarnSizeWeft,
                                            int constructionEpi, int constructionPpi);

    Optional<MaterialInfo> findMaterialInfo(String name, Long supplierId, Long categoryId, String subsidiaryDetail);

    MaterialInfo saveMaterialInfo(MaterialInfo materialInfo);

    void assignedMaterialOffer(Long materialOfferId, MaterialInfo copyMaterialInfo, User user);

    void modifyMaterialOffer(MaterialOffer materialOffer, User user);
}
