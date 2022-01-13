package io.vengine.api.v1.cbd.service;

import io.vengine.api.v1.cbd.dto.CbdDocumentDto;
import io.vengine.api.v1.cbd.dto.CbdOptionSimulationDto;
import io.vengine.api.v1.cbd.dto.NewCbdMaterialInfoRequest;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.cbd.entity.CBDMaterialCosting;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface CBDService {

    Optional<CBDCover> findCoverById(Long id);

    Optional<CBDMaterialCosting> findMaterialCostingById(Long id);

    Optional<CBDMaterialInfo> findMaterialInfoById(Long id);

    Optional<CBDOption> findOptionById(Long id);

    Page<CBDCover> findAllCover(String searchKeyWord, int page, int size, User user);

    CBDCover saveCbdCover(CBDCover cbdCover, User user, String saveType);

    CBDCover saveCbdCoverImage(Long id, MultipartFile file, User user);

    CBDOption saveCbdOption(CBDOption cbdOption, User user);

    CBDMaterialCosting saveCbdMaterialCosting(CBDMaterialCosting cbdMaterialCosting);

    void deleteFlagUpdateCbdCover(Long id);

    List<CBDOption> findOptionByCoverId(CBDCover cbdCover);

    void deleteFlagUpdateCbdOption(Long id, User user);

    void deleteFlagUpdateCbdCosting(Long id, User user);

    List<CBDMaterialCosting> findMaterialCostingByTypeAndCoverID(Long optionID, String type, Company company);

    CBDMaterialInfo modifyCbdMaterialInfo(CBDMaterialInfo cbdMaterialInfo, User user);

    void deleteFlagUpdateCbdMaterialInfo(Long id, User user);

    List<CBDMaterialInfo> findMaterialInfoByTypeAndOptionID(Long optionID, String type);

    Optional<CBDCover> findCoverByCbdName(String cbdName);

    Optional<CBDOption> findOptionByCbdCoverAndName(Long cbdCoverID, String name);

    CBDMaterialInfo assignCbdMaterialInfo(CBDOption cbdOption, MaterialOffer materialOffer, User user);

    CBDMaterialInfo saveMaterialAndCbdMaterial(CBDOption cbdOption, NewCbdMaterialInfoRequest request, String type, User user);

    List<CBDOption> findCbdOptionForMclAssign(Long mclOptionId);

    void modifyCbdCoverStatus(Long id, String status);

    List<CBDOption> findClosedCbdOptionByCover(CBDCover cbdCover);

    List<CBDCover> findCoverByDesignNumber(String designNumber);

    List<CbdDocumentDto.CbdDetail> findCbdDocumentDetails(CBDOption cbdOption);

    CbdDocumentDto.CbdHeader findCbdDocumentHeader(CBDOption cbdOption);

    List<CbdOptionSimulationDto> findCbdOptionSimulation(CBDOption cbdOption, double targetProfit);

    List<CBDCover> findAllCover(Map<String, Object> searchFilter, User user);

    void copyCbdOption(CBDOption cbdOption, CBDCover cbdCover, String cbdOptionName, double targetProfit, User user);
}
