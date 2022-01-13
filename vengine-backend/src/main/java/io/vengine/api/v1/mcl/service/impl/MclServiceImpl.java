package io.vengine.api.v1.mcl.service.impl;

import io.vengine.api.common.enums.DependencyType;
import io.vengine.api.common.enums.Status;
import io.vengine.api.common.filters.CompanySpecification;
import io.vengine.api.common.filters.MclSpecification;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.cbd.mapper.CBDMapper;
import io.vengine.api.v1.cbd.service.CBDService;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.companyInfo.mapper.CompanyInfoEntityMapper;
import io.vengine.api.v1.material.dto.MaterialYarnRequest;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.material.entity.MaterialYarn;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.material.service.MaterialService;
import io.vengine.api.v1.mcl.dto.*;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.mcl.mapper.MclMapper;
import io.vengine.api.v1.mcl.repository.*;
import io.vengine.api.v1.mcl.service.MclService;
import io.vengine.api.v1.user.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MclServiceImpl implements MclService {
    @Autowired
    MclCoverRepository mclCoverRepository;

    @Autowired
    MclOptionRepository mclOptionRepository;

    @Autowired
    MclFactoryAllocRepository mclFactoryAllocRepository;

    @Autowired
    MclCbdAssignRepository mclCbdAssignRepository;

    @Autowired
    MclCommentRepository mclCommentRepository;

    @Autowired
    MclPreBookingRepository mclPreBookingRepository;

    @Autowired
    MclPreBookingPoRepository mclPreBookingPoRepository;

    @Autowired
    MclGarmentColorRepository mclGarmentColorRepository;

    @Autowired
    MclGarmentSizeRepository mclGarmentSizeRepository;

    @Autowired
    MclGarmentMarketRepository mclGarmentMarketRepository;

    @Autowired
    MclPreBookingPoItemRepository mclPreBookingPoItemRepository;

    @Autowired
    MclOrderQuantityRepository mclOrderQuantityRepository;

    @Autowired
    MclOrderQuantityOptionRepository mclOrderQuantityOptionRepository;

    @Autowired
    MclMaterialInfoRepository mclMaterialInfoRepository;

    @Autowired
    MclMaterialDependencyColorRepository mclMaterialDependencyColorRepository;

    @Autowired
    MclMaterialDependencyMarketRepository mclMaterialDependencyMarketRepository;

    @Autowired
    MclMaterialDependencySizeRepository mclMaterialDependencySizeRepository;

    @Autowired
    MclMaterialPurchaseOrderDependencyItemRepository mclMaterialPurchaseOrderDependencyItemRepository;

    @Autowired
    MclMaterialPurchaseOrderItemRepository mclMaterialPurchaseOrderItemRepository;

    @Autowired
    CBDService cbdService;

    @Autowired
    MaterialService materialService;

    @Autowired
    CommonService commonService;

    @Override
    public void saveMclCover(CBDCover cbdCover, User user) {
        MclCover mclCover = new MclCover();
        mclCover.setCbdCover(cbdCover);
        mclCover.setStatus(Status.OPEN);
        mclCover.setUser(user);
        mclCoverRepository.save(mclCover);
    }

    @Override
    public MclOption saveMclOption(MclOption mclOption) {
        return mclOptionRepository.save(mclOption);
    }

    @Override
    public Optional<MclOption> findMclOptionById(Long mclOptionID) {
        return mclOptionRepository.findById(mclOptionID);
    }

    @Override
    public List<MclOption> findMclOptionByCbdCoverId(CBDCover cbdCover) {
        return mclOptionRepository.findByCbdCover(cbdCover);
    }

    @Override
    public void deleteMclOption(Long mclOptionID, User user) {
        MclOption mclOption = findMclOptionById(mclOptionID)
                .orElseThrow(()-> new BusinessException( ErrorCode.MCL_OPTION_NOT_FOUND));

        /*
        if(mclOption.getMclGarmentColors().size()>0
                || mclOption.getMclGarmentSizes().size()>0
                || mclOption.getMclMaterialInfos().size()>0){
            throw new BusinessException(ErrorCode.MCL_OPTION_CAN_NOT_DELETE);
        }
        */
        mclOption.setDelFlag("D");
        mclOption.setUser(user);
        mclOptionRepository.save(mclOption);
    }

    @Override
    public MclFactoryAlloc saveMclFactoryAllocation(MclFactoryAlloc mclFactoryAlloc) {
        return mclFactoryAllocRepository.save(mclFactoryAlloc);
    }

    @Override
    public MclFactoryAlloc findMclFactoryAllocationById(Long id) {
        return mclFactoryAllocRepository.findById(id).orElseThrow(()->new BusinessException("Mcl Factory Allocation Not Found", ErrorCode.INTERNAL_SERVER_ERROR));
    }

    @Override
    public List<MclFactoryAlloc> findMclFactoryAllocationByMclOption(Map<String, Object> serchFilter, User user) {
        CompanySpecification<MclFactoryAlloc>  companySpecification = new CompanySpecification(user.getCompId());
        return mclFactoryAllocRepository.findAll(
                MclSpecification.searchMclFactoryAlloc(serchFilter).and(companySpecification));
    }

    @Override
    public void deleteMclFactoryAllocation(Long id, User user) {
        MclFactoryAlloc mclFactoryAlloc = findMclFactoryAllocationById(id);
        mclFactoryAlloc.setDelFlag("D");
        mclFactoryAlloc.setUser(user);
        mclFactoryAllocRepository.save(mclFactoryAlloc);
    }

    @Override
    @Transactional
    public void assignMclCbdAssign(MclOption mclOption, List<MclCbdAssignDto.CbdAssignRequest> cbdAssignRequests, User user) {
        MclCbdAssign mclCbdAssign = null;
        for (MclCbdAssignDto.CbdAssignRequest cbdAssignRequest: cbdAssignRequests){
            mclCbdAssign = new MclCbdAssign();
            if(cbdAssignRequest.getMclCbdAssignId() != null){
                mclCbdAssign = mclCbdAssignRepository.findById(cbdAssignRequest.getMclCbdAssignId())
                        .orElseThrow(()-> new BusinessException(ErrorCode.MCL_CBD_ASSIGN_NOT_FOUND));
            }else{
                if(mclCbdAssignRepository.findByMclOptionAndCbdOption(mclOption,
                        CBDMapper.INSTANCE.toOption(cbdAssignRequest.getCbdOptionID())) != null)
                {
                    throw new BusinessException(ErrorCode.MCL_CBD_ASSIGN_DUPLICATION);
                }
            }
            MclMapper.INSTANCE.toCbdAssign(mclOption.getId(), cbdAssignRequest, user, mclCbdAssign);
            mclCbdAssignRepository.save(mclCbdAssign);

            //MCL MATERIAL INFO 저장
            if(cbdAssignRequest.getFabricCheck() == 1){
                saveMclMaterialInfo(mclOption, user, cbdAssignRequest.getCbdOptionID(), "fabric");
            }

            if(cbdAssignRequest.getTrimsCheck() == 1){
                saveMclMaterialInfo(mclOption, user, cbdAssignRequest.getCbdOptionID(), "trim");
            }

            if(cbdAssignRequest.getAccessoriesCheck() == 1){
                saveMclMaterialInfo(mclOption, user, cbdAssignRequest.getCbdOptionID(), "accessories");
            }
        }
    }

    public void saveMclMaterialInfo(MclOption mclOption, User user, Long cbdOptionID, String type) {
        List<CBDMaterialInfo> cbdMaterialInfos = cbdService.findMaterialInfoByTypeAndOptionID(cbdOptionID, type);
        log.info(type +" item size: "+ cbdMaterialInfos.size());

        for (CBDMaterialInfo cbdMaterialInfo: cbdMaterialInfos){
            if(cbdMaterialInfo.getUsagePlace() == null){
                throw new BusinessException(ErrorCode.USAGE_PLACE_NULL);
            }

            if(mclMaterialInfoRepository.findByMclOptionAndCbdMaterialInfo(mclOption, cbdMaterialInfo).isEmpty())
            {
                MclMaterialInfo mclMaterialInfo = MclMapper.INSTANCE.toMaterialInfo(mclOption.getId(), cbdMaterialInfo, Status.OPEN, user);
                mclMaterialInfo.setSupplier(cbdMaterialInfo.getMaterialInfo().getSupplierCompany());
                mclMaterialInfo.setFactory(mclOption.getFactory());
                mclMaterialInfo.setBuyer(cbdMaterialInfo.getCbdOption().getCbdCoverId().getBuyer());

                mclMaterialInfoRepository.save(mclMaterialInfo);
            }
        }
    }

    @Override
    public List<MclCbdAssignDto> findMclCbdAssignByMclOption(Long mclOptionId) {
        MclOption mclOption = mclOptionRepository.findById(mclOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        //Cbd Option Close 조회
        List<CBDOption> cbdOptions = cbdService.findClosedCbdOptionByCover(mclOption.getMclCover().getCbdCover());

        List<MclCbdAssignDto> mclCbdAssignDtoList = MclMapper.INSTANCE.toCbdAssignDto(cbdOptions)
                .stream().map(data ->{
                    MclCbdAssign mclCbdAssign = mclCbdAssignRepository.findByMclOptionAndCbdOption(mclOption, CBDMapper.INSTANCE.toOption(data.getCbdOption().getOptionId()));
                    if(mclCbdAssign != null){
                        data.setMclCbdAssignId(mclCbdAssign.getId());
                        data.setFabricCheck(mclCbdAssign.getFabricCheck());
                        data.setTrimsCheck(mclCbdAssign.getTrimsCheck());
                        data.setAccessoriesCheck(mclCbdAssign.getAccessoriesCheck());
                    }

                    return data;
                }).collect(Collectors.toList());

        return mclCbdAssignDtoList;
    }

    @Override
    public Optional<MclPreBooking> findMclPreBookingById(Long id) {
        return mclPreBookingRepository.findById(id);
    }

    @Override
    public MclPreBooking saveMclPreBooking(MclPreBooking mclPreBooking) {
        return mclPreBookingRepository.save(mclPreBooking);
    }

    @Override
    public List<MclPreBooking> findMclPreBookingByMclOption(Long mclOptionId, User user) {
        Map<String, Object> searchFilter = new HashMap<>();
        searchFilter.put("mclOptionID", mclOptionId);
        CompanySpecification<MclPreBooking> companySpecification = new CompanySpecification(user.getCompId());
        return mclPreBookingRepository.findAll(MclSpecification.searchMclPrebooking(searchFilter).and(companySpecification));
    }

    @Override
    @Transactional
    public void deleteMclPreBooking(Long id, User user) {
        MclPreBooking mclPreBooking = findMclPreBookingById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_PRE_BOOKING_NOT_FOUND));

        //Pre Booking Po 삭제
        for (MclPreBookingPo mclPreBookingPo : mclPreBooking.getMclPreBookingPos()){
            mclPreBookingPo.setDelFlag("D");
            mclPreBookingPo.setUser(user);
            mclPreBookingPoRepository.save(mclPreBookingPo);
        }

        //Pre Booking 삭제
        mclPreBooking.setDelFlag("D");
        mclPreBooking.setUser(user);
        mclPreBookingRepository.save(mclPreBooking);
    }

    @Override
    public List<AssignedPODto> findMclPreBookingPoByMclOption(Long mclOptionId) {
        return mclPreBookingPoItemRepository.findMclPreBookingPoByMclOption(mclOptionId);
    }

    @Override
    public void deleteMclPreBookingPo(Long id, User user) {
        MclPreBookingPo mclPreBookingPo = mclPreBookingPoRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_PRE_BOOKING_PO_NOT_FOUND));
        mclPreBookingPo.setDelFlag("D");
        mclPreBookingPo.setUser(user);
        mclPreBookingPoRepository.save(mclPreBookingPo);
    }

    @Override
    public void saveMclGarmentColor(Long mclOptionId, List<MclCommonDto.ColorRequest> colorRequests, User user) {
        MclOption mclOption = findMclOptionById(mclOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        for (MclCommonDto.ColorRequest colorRequest: colorRequests){
            MclGarmentColor mclGarmentColor = new MclGarmentColor();
            if(colorRequest.getId() != null){
                mclGarmentColor = mclGarmentColorRepository.findById(
                        colorRequest.getId()).orElseThrow(()-> new BusinessException(ErrorCode.MCL_GARMENT_COLOR_NOT_FOUND));
            }else{
                if(mclGarmentColorRepository.findByMclOptionAndGarmentColor(mclOption, colorRequest.getGarmentColor().trim()).isPresent()){
                    throw new BusinessException(ErrorCode.MCL_SAME_GARMENT_COLOR);
                }
            }
            mclGarmentColor.setMclOption(mclOption);
            mclGarmentColor.setGarmentColor(colorRequest.getGarmentColor());
            mclGarmentColor.setPoGarmentColor(colorRequest.getPoGarmentColor());
            mclGarmentColor.setUser(user);

            mclGarmentColorRepository.save(mclGarmentColor);
        }
    }

    @Override
    @Transactional
    public void deleteMclGarmentColor(List<Long> mclGarmentColorIds, User user) {
        for (Long mclGarmentColorId : mclGarmentColorIds){
            MclGarmentColor mclGarmentColor = mclGarmentColorRepository.findById(mclGarmentColorId)
                    .orElseThrow(()-> new BusinessException(ErrorCode.MCL_GARMENT_COLOR_NOT_FOUND));

            if(mclGarmentColor.getMclMaterialPurchaseOrderDependencyItems().size() > 0){
                throw new BusinessException(ErrorCode.MCL_COLOR_CAN_NOT_DELETE);
            }

            mclGarmentColor.setDelFlag("D");
            mclGarmentColorRepository.save(mclGarmentColor);

            List<MclOrderQuantity> mclOrderQuantities = mclOrderQuantityRepository.findByMclGarmentColor(mclGarmentColor);

            for(MclOrderQuantity mclOrderQuantity : mclOrderQuantities){
                mclOrderQuantity.setDelFlag("D");
                mclOrderQuantity.setUser(user);
                mclOrderQuantityRepository.save(mclOrderQuantity);
            }

            List<MclMaterialDependencyColor> materialDependencyColors = mclMaterialDependencyColorRepository.findByMclGarmentColor(mclGarmentColor);

            for(MclMaterialDependencyColor materialDependencyColor : materialDependencyColors){
                materialDependencyColor.setDelFlag("D");
                materialDependencyColor.setUser(user);
                mclMaterialDependencyColorRepository.save(materialDependencyColor);
            }
        }
    }

    @Override
    public List<MclCommonDto> findMclGarmentColorByMclOptionID(Long mclOptionID) {
        MclOption mclOption = mclOptionRepository.findById(mclOptionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        return MclMapper.INSTANCE.toColorDto(
                mclOption.getMclGarmentColors()
                .stream().sorted(Comparator.comparing(MclGarmentColor::getGarmentColor))
                .collect(Collectors.toList())
        );
    }

    @Override
    public List<String> findAssignedPoItemColor(Long id) {
        return mclPreBookingPoItemRepository.findItemColors(id);
    }

    @Override
    public void saveMclGarmentSize(Long mclOptionId, List<MclCommonDto.SizeRequest> sizeRequests, User user) {
        MclOption mclOption = findMclOptionById(mclOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        for (MclCommonDto.SizeRequest size: sizeRequests){
            MclGarmentSize mclGarmentSize = new MclGarmentSize();
            if(size.getId() != null){
                mclGarmentSize = mclGarmentSizeRepository.findById(size.getId())
                        .orElseThrow(()-> new BusinessException(ErrorCode.MCL_GARMENT_SIZE_NOT_FOUND));
            }else{
                if(mclGarmentSizeRepository.findByMclOptionAndSize(mclOption, CommonMapper.INSTANCE.toCommonBasic(size.getGarmentSizeId())).isPresent()){
                    throw new BusinessException(ErrorCode.MCL_SAME_GARMENT_SIZE);
                }
            }

            MclMapper.INSTANCE.toSize(size, user, mclGarmentSize );
            mclGarmentSize.setMclOption(mclOption);
            mclGarmentSizeRepository.save(mclGarmentSize);
        }
    }

    @Override
    @Transactional
    public void deleteMclGarmentSize(List<Long> mclGarmentSizeIds, User user) {
        for (Long mclGarmentSizeId: mclGarmentSizeIds){
            MclGarmentSize mclGarmentSize = mclGarmentSizeRepository.findById(mclGarmentSizeId)
                    .orElseThrow(()-> new BusinessException(ErrorCode.MCL_GARMENT_SIZE_NOT_FOUND));

            if(mclGarmentSize.getMclMaterialPurchaseOrderDependencyItems().size() > 0){
                throw new BusinessException(ErrorCode.MCL_SIZE_CAN_NOT_DELETE);
            }

            mclGarmentSize.setDelFlag("D");
            mclGarmentSizeRepository.save(mclGarmentSize);

            List<MclOrderQuantity> mclOrderQuantities = mclOrderQuantityRepository.findByMclGarmentSize(mclGarmentSize);

            for(MclOrderQuantity mclOrderQuantity : mclOrderQuantities){
                mclOrderQuantity.setDelFlag("D");
                mclOrderQuantity.setUser(user);
                mclOrderQuantityRepository.save(mclOrderQuantity);
            }

            List<MclMaterialDependencySize> mclMaterialDependencySizes = mclMaterialDependencySizeRepository.findByMclGarmentSize(mclGarmentSize);

            for(MclMaterialDependencySize mclMaterialDependencySize : mclMaterialDependencySizes){
                mclMaterialDependencySize.setDelFlag("D");
                mclMaterialDependencySize.setUser(user);
                mclMaterialDependencySizeRepository.save(mclMaterialDependencySize);
            }
        }
    }

    @Override
    public List<MclCommonDto> findMclGarmentSizeByMclOptionID(Long mclOptionID) {
        MclOption mclOption = findMclOptionById(mclOptionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        return MclMapper.INSTANCE.toSizeDto(
                mclOption.getMclGarmentSizes()
                .stream()
                .sorted(Comparator.comparing(mclGarmentSize -> mclGarmentSize.getSize().getCmName2()))
                .collect(Collectors.toList())
        );
    }

    @Override
    public List<String> findAssignedPoItemSize(Long id) {
        return mclPreBookingPoItemRepository.findItemSizes(id);
    }

    @Override
    public List<String> findAssignedPoMarket(Long id) {
        MclOption mclOption = findMclOptionById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        List<String> markets = new ArrayList<>();
        for (MclPreBookingPo mclPreBookingPo: mclOption.getMclPreBookingPos()){
            markets.add(mclPreBookingPo.getBuyerOrderInfo().getMarketDesc());
        }
        return markets.stream()
                .distinct()
                .sorted(Collections.reverseOrder())
                .collect(Collectors.toList());
    }

    @Override
    public void saveMclGarmentMarket(Long mclOptionId, List<MclCommonDto.MarketRequest> marketRequests, User user) {
        MclOption mclOption = findMclOptionById(mclOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        for (MclCommonDto.MarketRequest marketRequest: marketRequests){
            MclGarmentMarket mclGarmentMarket = new MclGarmentMarket();
            if(marketRequest.getId() != null){
                mclGarmentMarket = mclGarmentMarketRepository.findById(marketRequest.getId())
                        .orElseThrow(()-> new BusinessException(ErrorCode.MCL_GARMENT_MARKET_NOT_FOUND));
            }else{
                if(mclGarmentMarketRepository.findByMclOptionAndMarket(mclOption, CompanyInfoEntityMapper.INSTANCE.toMarket(marketRequest.getGarmentMarketId())).isPresent()){
                    throw new BusinessException(ErrorCode.MCL_SAME_GARMENT_MARKET);
                }
            }
            MclMapper.INSTANCE.toMarket(marketRequest, user, mclGarmentMarket );
            mclGarmentMarket.setMclOption(mclOption);
            mclGarmentMarketRepository.save(mclGarmentMarket);
        }
    }

    @Override
    @Transactional
    public void deleteMclGarmentMarket(List<Long> marketIds, User user) {
        for (Long marketId: marketIds){
            MclGarmentMarket mclGarmentMarket = mclGarmentMarketRepository.findById(marketId)
                    .orElseThrow(()-> new BusinessException(ErrorCode.MCL_GARMENT_MARKET_NOT_FOUND));

            if(mclGarmentMarket.getMclMaterialPurchaseOrderDependencyItems().size() > 0){
                throw new BusinessException(ErrorCode.MCL_MARKET_CAN_NOT_DELETE);
            }

            mclGarmentMarket.setDelFlag("D");
            mclGarmentMarketRepository.save(mclGarmentMarket);

            List<MclOrderQuantity> mclOrderQuantities = mclOrderQuantityRepository.findByMclGarmentMarket(mclGarmentMarket);
            for(MclOrderQuantity mclOrderQuantity : mclOrderQuantities){
                mclOrderQuantity.setDelFlag("D");
                mclOrderQuantity.setUser(user);
                mclOrderQuantityRepository.save(mclOrderQuantity);
            }

            List<MclMaterialDependencyMarket> mclMaterialDependencyMarkets = mclMaterialDependencyMarketRepository.findByMclGarmentMarket(mclGarmentMarket);
            for(MclMaterialDependencyMarket mclMaterialDependencyMarket : mclMaterialDependencyMarkets){
                mclMaterialDependencyMarket.setDelFlag("D");
                mclMaterialDependencyMarket.setUser(user);
                mclMaterialDependencyMarketRepository.save(mclMaterialDependencyMarket);
            }

            List<MclMaterialPurchaseOrderDependencyItem> items = mclMaterialPurchaseOrderDependencyItemRepository.findByMclGarmentMarket(mclGarmentMarket);
            for(MclMaterialPurchaseOrderDependencyItem mclMaterialPurchaseOrderDependencyItem : items){
                mclMaterialPurchaseOrderDependencyItem.setDelFlag("D");
                mclMaterialPurchaseOrderDependencyItemRepository.save(mclMaterialPurchaseOrderDependencyItem);
            }
        }
    }

    @Override
    public List<MclCommonDto> findMclGarmentMarketByMclOptionID(Long mclOptionID) {
        MclOption mclOption = findMclOptionById(mclOptionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        return MclMapper.INSTANCE.toMarketDto(
                mclOption.getMclGarmentMarkets()
        );
    }

    @Override
    public void saveAssignPO(Long id, List<MclAssignedPODto.MclAssignedPORequest> requests, User user) {
        for (MclAssignedPODto.MclAssignedPORequest request: requests){
            String[] itemArray = request.getOrderItems().split(",");

            List<MclPreBookingPoItem> itemList = new ArrayList<>();
            for (String item: itemArray){
                itemList.add(MclMapper.INSTANCE.toAssignPOItem(Long.parseLong(item), user));
            }
            mclPreBookingPoRepository.save(MclMapper.INSTANCE.toAssignPO(id, request.getMclPreBookingId(), request.getOrderId(), itemList, user));
        }
    }

    @Override
    public MclOrderQtyDto findMclOrderQtyByMclOption(Long mclOptionId) {
        MclOrderQtyDto mclOrderQty = new MclOrderQtyDto();
        List<MclOrderQtyDto.MclOrderQty> orderQtyList = new ArrayList<>();
        List<MclOrderQtyDto.TotalQty> totalQtyList = new ArrayList<>();
        int check = 0;

        MclOption mclOption = findMclOptionById(mclOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        List<MclGarmentMarket> markets =  mclGarmentMarketRepository.findByMclOptionOrderByMarket(mclOption);
        List<MclGarmentSize> sizes =  mclGarmentSizeRepository.findByMclOptionOrderBySize(mclOption);
        List<MclCommonDto> colors =  findMclGarmentColorByMclOptionID(mclOptionId);

        if(colors.isEmpty()){
            throw new BusinessException(ErrorCode.MCL_COLOR_NOT_FOUND);
        }

        List<MclOrderQuantity> mclOrderQuantities = mclOrderQuantityRepository.findByMclOption(mclOption);

        MclOrderQtyDto.MclOrderQty mclOrderQtyDto = null;
        List<MclOrderQtyDto.Color> colorList = null;
        if(markets.isEmpty() && sizes.isEmpty() && !colors.isEmpty()){
            log.info("color만 있을 경우");
            mclOrderQtyDto = new MclOrderQtyDto.MclOrderQty();
            colorList= mclOrderQuantityRepository.findMclOrderQtyByColor(mclOptionId);
            for (MclOrderQtyDto.Color color: colorList){
                if(color.getOrderQtyId() != null){
                    check++;
                }
            }
            mclOrderQtyDto.setColors(colorList);
            orderQtyList.add(mclOrderQtyDto);
        }

        else if(!markets.isEmpty() && sizes.isEmpty() && !colors.isEmpty()){
            log.info("color, market이 있을 경우");
            for (MclGarmentMarket market : markets){
                mclOrderQtyDto = new MclOrderQtyDto.MclOrderQty();
                mclOrderQtyDto.setMarket(MclMapper.INSTANCE.toMarketDto(market));
                colorList= mclOrderQuantityRepository.findMclOrderQtyByColorAndMarket(mclOptionId, market);
                for (MclOrderQtyDto.Color color: colorList){
                    if(color.getOrderQtyId() != null){
                        check++;
                    }
                }
                mclOrderQtyDto.setColors(colorList);
                orderQtyList.add(mclOrderQtyDto);
            }
        }
        else if(markets.isEmpty() && !sizes.isEmpty() && !colors.isEmpty()){
            log.info("color, size가 있을 경우");
            for (MclGarmentSize size: sizes){
                mclOrderQtyDto = new MclOrderQtyDto.MclOrderQty();
                mclOrderQtyDto.setSize(MclMapper.INSTANCE.toSizeDto(size));
                colorList= mclOrderQuantityRepository.findMclOrderQtyByColorAndSize(mclOptionId, size);

                for (MclOrderQtyDto.Color color: colorList){
                    if(color.getOrderQtyId() != null){
                        check++;
                    }
                }
                mclOrderQtyDto.setColors(colorList);
                orderQtyList.add(mclOrderQtyDto);
            }
        }
        else if(!markets.isEmpty() && !sizes.isEmpty() && !colors.isEmpty()){
            log.info("color, market, size가 있을 경우");
            for (MclGarmentMarket market : markets){
                for (MclGarmentSize size: sizes){
                    mclOrderQtyDto = new MclOrderQtyDto.MclOrderQty();
                    mclOrderQtyDto.setMarket(MclMapper.INSTANCE.toMarketDto(market));
                    mclOrderQtyDto.setSize(MclMapper.INSTANCE.toSizeDto(size));
                    colorList= mclOrderQuantityRepository.findMclOrderQtyByColorAndSizeAndMarket(mclOptionId, size, market);

                    for (MclOrderQtyDto.Color color: colorList){
                        if(color.getOrderQtyId() != null){
                            check++;
                        }
                    }
                    mclOrderQtyDto.setColors(colorList);
                    orderQtyList.add(mclOrderQtyDto);
                }
            }

        }

        if(check == 0 && mclOrderQuantities.size()>0){
            for (MclOrderQuantity mclOrderQuantity: mclOrderQuantities){
                totalQtyList.add(MclMapper.INSTANCE.toMclOrderQtyDto(mclOrderQuantity));
            }
        }

        mclOrderQty.setMclOrders(orderQtyList);
        mclOrderQty.setPreMclOrders(totalQtyList);
        return mclOrderQty;
    }

    @Override
    @Transactional
    public void saveMclOrderQty(Long mclOptionId, MclOrderQtyRequestDto requestDto, User user) {
        if(requestDto.getPreMclOrderQtyList() != null){
            for (MclOrderQtyRequestDto.PreMclOrderQty preMclOrderQty : requestDto.getPreMclOrderQtyList()){
                MclOrderQuantity preMclOrderQuantity = mclOrderQuantityRepository.findById(preMclOrderQty.getId())
                        .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_QUANTITY_NOT_FOUND));
                preMclOrderQuantity.setDelFlag("D");
                mclOrderQuantityRepository.save(preMclOrderQuantity);
            }
        }

        for (MclOrderQtyRequestDto.Qty request: requestDto.getQtyList()){
            if(request.getId() == null){
                mclOrderQuantityRepository.save(MclMapper.INSTANCE.toMclOrderQty(mclOptionId, request, user));
            }else{
                MclOrderQuantity mclOrderQuantity = mclOrderQuantityRepository.findById(request.getId())
                        .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_QUANTITY_NOT_FOUND));
                mclOrderQuantity.setMeasuredQuantity(request.getQty());
                mclOrderQuantityRepository.save(mclOrderQuantity);
            }
        }
    }

    @Override
    public List<BigInteger> findStyleNumber(Long mclOptionID) {
        MclOption mclOption = findMclOptionById(mclOptionID)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        return mclOption.getMclPreBookings()
                .stream()
                .map(MclPreBooking::getStyleNumber)
                .collect(Collectors.toList());
    }

    @Override
    public MclOrderQuantityOption findMclOrderQtyOption(Long id) {
        return mclOrderQuantityOptionRepository.findByMclOrderQuantity(
                mclOrderQuantityRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ErrorCode.MCL_ORDER_QUANTITY_NOT_FOUND)));
    }

    @Override
    public MclMaterialInfoDto findMclMaterialInfoByMclOption(Long mclOptionId, User user) {
        MclOption mclOption = findMclOptionById(mclOptionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.MCL_OPTION_NOT_FOUND));

        MclMaterialInfoDto mclMaterialInfos = new MclMaterialInfoDto();

        mclMaterialInfos.setFabricMaterialInfos(
                MclMapper.INSTANCE.toMaterialInfoDto(
                        mclOption.getMclMaterialInfos()
                                .stream()
                                .filter(item-> item.getType().equals("fabric"))
                                .collect(Collectors.toList())
                )
        );

        mclMaterialInfos.setTrimsMaterialInfos(
                MclMapper.INSTANCE.toMaterialInfoDto(
                        mclOption.getMclMaterialInfos()
                                .stream()
                                .filter(item-> item.getType().equals("trim"))
                                .collect(Collectors.toList())
                )
        );

        mclMaterialInfos.setAccessoriesMaterialInfos(
                MclMapper.INSTANCE.toMaterialInfoDto(
                        mclOption.getMclMaterialInfos()
                                .stream()
                                .filter(item-> item.getType().equals("accessories"))
                                .collect(Collectors.toList())
                )
        );
        return mclMaterialInfos;
    }

    @Override
    public Optional<MclMaterialInfo> findMclMaterialInfoById(Long id) {
        return mclMaterialInfoRepository.findById(id);
    }

    @Override
    public void deleteMclMaterialInfo(MclMaterialInfo mclMaterialInfo, User user) {

        if(mclMaterialInfo.getMclMaterialPurchaseOrderItems().size() > 0)
        {
            throw new BusinessException(ErrorCode.MCL_MATERIAL_INFO_CAN_NOT_DELETE);
        }

        mclMaterialInfo.setDelFlag("D");
        mclMaterialInfo.setUser(user);
        mclMaterialInfoRepository.save(mclMaterialInfo);
    }

    @Override
    @Transactional
    public void modifyMclMaterialInfo(MclMaterialInfo mclMaterialInfo, MclMaterialInfoRequestDto request, User user) {
        MclMapper.INSTANCE.toMaterialInfo(request, user, mclMaterialInfo);

        //CommonBasicInfo commonUom = commonService.findCommonBasicInfoById(request.getMclMaterialUomId());

        MaterialOffer materialOffer = mclMaterialInfo.getMaterialOffer();
        if(request.getMaterialOfferId() != null){
            materialOffer = materialService.findOfferById(request.getMaterialOfferId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_OFFER_NOT_FOUND));
        }
        /*
        //offer의 단가와 요청 단가가 다르면 offer 새로 생성
        if(materialOffer.getUnitPrice().doubleValue() != request.getUnitPrice().doubleValue()
                || materialOffer.getCommonUom().getId() != commonUom.getId()
        ){
            materialOffer = materialService.saveMaterialOffer(
                    MaterialMapper.INSTANCE.toMaterialOffer(
                            materialOffer, commonUom, request.getUnitPrice(), user.getCompId()), user
            );
        }
        */
        MclMapper.INSTANCE.toMaterialInfo(materialOffer, mclMaterialInfo);

        mclMaterialInfoRepository.save(mclMaterialInfo);

        //dependency 삭제 후 저장
        mclMaterialDependencySizeRepository.deleteAll(mclMaterialInfo.getMclMaterialDependencySizes());
        mclMaterialDependencyColorRepository.deleteAll(mclMaterialInfo.getMclMaterialDependencyColors());
        mclMaterialDependencyMarketRepository.deleteAll(mclMaterialInfo.getMclMaterialDependencyMarkets());

        saveMclDependency(mclMaterialInfo
                , request.getColorDependency()
                , request.getSizeDependency()
                , request.getMarketDependency()
                ,user
        );
    }

    @Override
    public void addMclMaterialInfo(MclOption mclOption, List<Long> materialOfferIds, User user) {
        for (Long materialOfferId: materialOfferIds){
            MaterialOffer materialOffer = materialService.findOfferById(materialOfferId)
                    .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_OFFER_NOT_FOUND));

            mclMaterialInfoRepository.save(
                    MclMapper.INSTANCE.toMaterialInfo(mclOption, materialOffer.getMaterialInfo(), materialOffer, Status.OPEN, user)
            );
        }
    }

    @Override
    @Transactional
    public void copyMclMaterialInfo(MclMaterialInfo mclMaterialInfo, MclMaterialInfoRequestDto request, User user) {
        MclMapper.INSTANCE.toMaterialInfo(request, user, mclMaterialInfo);

        if(request.getMaterialOfferId() != null){
            MaterialOffer materialOffer = materialService.findOfferById(request.getMaterialOfferId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_OFFER_NOT_FOUND));

            MclMapper.INSTANCE.toMaterialInfo(materialOffer, mclMaterialInfo);
        }

        saveMclDependency(mclMaterialInfoRepository.save(mclMaterialInfo)
                , request.getColorDependency()
                , request.getSizeDependency()
                , request.getMarketDependency()
                ,user
        );
    }

    @Override
    public List<MclOrderItemDto.OrderItem> findMclMaterialInfoByOrderItem(MclMaterialPurchaseOrder order) {
        List<MclMaterialInfo> mclMaterialInfos = mclMaterialInfoRepository
                .findByStatusAndBuyerAndSupplierAndFactory(Status.CLOSE,
                        order.getMclOption().getMclCover().getCbdCover().getBuyer(),
                        order.getMaterialSellingCompany(),
                        order.getMclOption().getFactory())
                .stream()
                .filter(item-> item.getBalanceQty() > 0)
                .collect(Collectors.toList());

        List<MclOrderItemDto.OrderItem> result = new ArrayList<>();

        for (MclMaterialInfo mclMaterialInfo: mclMaterialInfos){
            MclOrderItemDto.OrderItem data  = MclMapper.INSTANCE.toOrderItemDto(mclMaterialInfo, order);
            data.setDependencyItemList(getDependencyItem(mclMaterialInfo));
            result.add(data);
        }

        return result;
    }

    private List<MclOrderItemDto.DependencyItem> getDependencyItem(MclMaterialInfo mclMaterialInfo) {
        List<MclMaterialDependencyColor> colors =mclMaterialInfo.getMclMaterialDependencyColors();

        List<MclMaterialDependencySize> sizes = mclMaterialInfo.getMclMaterialDependencySizes();

        List<MclMaterialDependencyMarket> markets = mclMaterialInfo.getMclMaterialDependencyMarkets();

        List<MclOrderItemDto.DependencyItem> dataList = new ArrayList<>();
        MclOrderItemDto.DependencyItem item = null;
        if(colors.size() > 0){
            if(sizes.size() >0){
                if(markets.size() > 0){
                    for (MclMaterialDependencyColor color: colors){
                        for (MclMaterialDependencyMarket market: markets){
                            for (MclMaterialDependencySize size: sizes){
                                item = new MclOrderItemDto.DependencyItem();
                                item.setColor(MclMapper.INSTANCE.toColorDto(color.getMclGarmentColor()));
                                item.setMarket(MclMapper.INSTANCE.toMarketDto(market.getMclGarmentMarket()));
                                item.setSize(MclMapper.INSTANCE.toSizeDto(size.getMclGarmentSize()));
                                dataList.add(item);
                            }
                        }
                    }
                }else{
                    for (MclMaterialDependencyColor color: colors){
                        for (MclMaterialDependencySize size: sizes){
                            item = new MclOrderItemDto.DependencyItem();
                            item.setColor(MclMapper.INSTANCE.toColorDto(color.getMclGarmentColor()));
                            item.setSize(MclMapper.INSTANCE.toSizeDto(size.getMclGarmentSize()));
                            dataList.add(item);
                        }
                    }
                }
            }else{
                if(markets.size() > 0){
                    for (MclMaterialDependencyColor color: colors){
                        for (MclMaterialDependencyMarket market: markets){
                            item = new MclOrderItemDto.DependencyItem();
                            item.setColor(MclMapper.INSTANCE.toColorDto(color.getMclGarmentColor()));
                            item.setMarket(MclMapper.INSTANCE.toMarketDto(market.getMclGarmentMarket()));
                            dataList.add(item);
                        }
                    }
                }else{
                    for (MclMaterialDependencyColor color: colors){
                        item = new MclOrderItemDto.DependencyItem();
                        item.setColor(MclMapper.INSTANCE.toColorDto(color.getMclGarmentColor()));
                        dataList.add(item);
                    }
                }
            }
        }else{
            if(sizes.size() >0){
                if(markets.size() > 0){
                    for (MclMaterialDependencyMarket market: markets){
                        for (MclMaterialDependencySize size: sizes){
                            item = new MclOrderItemDto.DependencyItem();
                            item.setMarket(MclMapper.INSTANCE.toMarketDto(market.getMclGarmentMarket()));
                            item.setSize(MclMapper.INSTANCE.toSizeDto(size.getMclGarmentSize()));
                            dataList.add(item);
                        }
                    }
                }else{
                    for (MclMaterialDependencySize size: sizes){
                        item = new MclOrderItemDto.DependencyItem();
                        item.setSize(MclMapper.INSTANCE.toSizeDto(size.getMclGarmentSize()));
                        dataList.add(item);
                    }
                }
            }else{
                if(markets.size() > 0){
                    for (MclMaterialDependencyMarket market: markets){
                        item = new MclOrderItemDto.DependencyItem();
                        item.setMarket(MclMapper.INSTANCE.toMarketDto(market.getMclGarmentMarket()));
                        dataList.add(item);
                    }
                }else{
                    item = new MclOrderItemDto.DependencyItem();
                    dataList.add(item);
                }
            }
        }
        return dataList;
    }

    public void saveMclDependency(MclMaterialInfo mclMaterialInfo
            , MclMaterialInfoRequestDto.DependencyInfoRequest colorDependency
            , MclMaterialInfoRequestDto.DependencyInfoRequest sizeDependency
            , MclMaterialInfoRequestDto.DependencyInfoRequest marketDependency
            , User user
    ){
        if(mclMaterialInfo.getColorDependency() != null){
            if(mclMaterialInfo.getColorDependency().equals(DependencyType.All)){
                List<MclGarmentColor> colors = mclGarmentColorRepository.findByMclOption(mclMaterialInfo.getMclOption());

                for (MclGarmentColor color : colors){
                    if(!mclMaterialDependencyColorRepository
                            .findByMclMaterialInfoAndMclGarmentColor(mclMaterialInfo, color)
                            .isPresent()){
                        MclMaterialDependencyColor materialDependencyColor = MclMapper.INSTANCE.toDependencyColor(mclMaterialInfo, color.getId(), user);
                        materialDependencyColor.setMclMaterialInfo(mclMaterialInfo);
                        mclMaterialDependencyColorRepository.save(materialDependencyColor);
                    }
                }
            }else if(mclMaterialInfo.getColorDependency().equals(DependencyType.Selective)){
                for(Long id : colorDependency.getIds()){
                    if(!mclMaterialDependencyColorRepository
                            .findByMclMaterialInfoAndMclGarmentColor(mclMaterialInfo, MclMapper.INSTANCE.toColor(id))
                            .isPresent()){
                        MclMaterialDependencyColor materialDependencyColor = MclMapper.INSTANCE.toDependencyColor(mclMaterialInfo, id, user);
                        materialDependencyColor.setMclMaterialInfo(mclMaterialInfo);
                        mclMaterialDependencyColorRepository.save(materialDependencyColor);
                    }
                }
            }
        }

        if(mclMaterialInfo.getMarketDependency() != null){
            if(mclMaterialInfo.getMarketDependency().equals(DependencyType.All)){
                List<MclGarmentMarket> markets = mclGarmentMarketRepository.findByMclOption(mclMaterialInfo.getMclOption());

                for (MclGarmentMarket market : markets){
                    if(!mclMaterialDependencyMarketRepository
                            .findByMclMaterialInfoAndMclGarmentMarket(mclMaterialInfo, market)
                            .isPresent()){
                        MclMaterialDependencyMarket mclMaterialDependencyMarket = MclMapper.INSTANCE.toDependencyMarket(mclMaterialInfo, market.getId(), user);
                        mclMaterialDependencyMarket.setMclMaterialInfo(mclMaterialInfo);
                        mclMaterialDependencyMarketRepository.save(mclMaterialDependencyMarket);
                    }
                }
            }else if(mclMaterialInfo.getMarketDependency().equals(DependencyType.Selective)){
                for(Long id : marketDependency.getIds()){
                    if(!mclMaterialDependencyMarketRepository
                            .findByMclMaterialInfoAndMclGarmentMarket(mclMaterialInfo, MclMapper.INSTANCE.toMarket(id))
                            .isPresent()){
                        MclMaterialDependencyMarket mclMaterialDependencyMarket = MclMapper.INSTANCE.toDependencyMarket(mclMaterialInfo, id, user);
                        mclMaterialDependencyMarket.setMclMaterialInfo(mclMaterialInfo);
                        mclMaterialDependencyMarketRepository.save(mclMaterialDependencyMarket);
                    }
                }
            }
        }

        if(mclMaterialInfo.getSizeDependency() != null){
            if(mclMaterialInfo.getSizeDependency().equals(DependencyType.All)){
                List<MclGarmentSize> sizes = mclGarmentSizeRepository.findByMclOption(mclMaterialInfo.getMclOption());

                for (MclGarmentSize size : sizes){
                    if(!mclMaterialDependencySizeRepository
                            .findByMclMaterialInfoAndMclGarmentSize(mclMaterialInfo, size)
                            .isPresent()){
                        MclMaterialDependencySize mclMaterialDependencySize = MclMapper.INSTANCE.toDependencySize(mclMaterialInfo, size.getId(), user);
                        mclMaterialDependencySize.setMclMaterialInfo(mclMaterialInfo);
                        mclMaterialDependencySizeRepository.save(mclMaterialDependencySize);
                    }
                }
            }else if(mclMaterialInfo.getSizeDependency().equals(DependencyType.Selective)){
                for(Long id : sizeDependency.getIds()){
                    if(!mclMaterialDependencySizeRepository
                            .findByMclMaterialInfoAndMclGarmentSize(mclMaterialInfo, MclMapper.INSTANCE.toSize(id))
                            .isPresent()){
                        MclMaterialDependencySize mclMaterialDependencySize = MclMapper.INSTANCE.toDependencySize(mclMaterialInfo, id, user);
                        mclMaterialDependencySize.setMclMaterialInfo(mclMaterialInfo);
                        mclMaterialDependencySizeRepository.save(mclMaterialDependencySize);
                    }
                }
            }
        }
    }

    @Override
    @Transactional
    public void newMclMaterialInfo(String type, MclOption mclOption, NewMclMaterialInfoRequest request, User user) {
        //Material Info save
        MaterialInfo materialInfo = materialService.saveMaterialInfo(MaterialMapper.INSTANCE.toMaterialInfo(type, request, "NEW", user));

        //material yarn save
        if(request.getMaterialYarnRequestList() != null){
            for (MaterialYarnRequest materialYarnRequest: request.getMaterialYarnRequestList()){
                materialService.saveMaterialYarn(MaterialMapper.INSTANCE.toMaterialYarn(materialYarnRequest, materialInfo), user);
            }
        }

        //material offer save
        MaterialOffer materialOffer = materialService.saveMaterialOffer(
                MaterialMapper.INSTANCE.toMaterialOffer(request,
                        materialInfo,
                        mclOption.getMclCover().getCbdCover().getBuyer(),
                        mclOption.getMclCover().getCbdCover().getVendorBrandId(),
                        mclOption.getMclCover().getCbdCover().getCommonCurrencyId(),
                        user.getCompId()
                ), user
        );

        //MCL Material Info Save
        MclMaterialInfo mclMaterialInfo = mclMaterialInfoRepository.save(
                MclMapper.INSTANCE.toMaterialInfo(request, mclOption, materialOffer.getMaterialInfo(), materialOffer, Status.OPEN, user)
        );

        saveMclDependency(mclMaterialInfo
                , request.getColorDependency()
                , request.getSizeDependency()
                , request.getMarketDependency()
                ,user
        );
    }

    @Override
    public MclDocumentDto findMclDocument(MclOption mclOption) {
        MclDocumentDto mclDocumentDto = new MclDocumentDto();
        List<MclDocumentDto.MclDetail> mclDetails = new ArrayList<>();

        for (MclMaterialInfo mclMaterialInfo: mclOption.getMclMaterialInfos()){
            MclDocumentDto.MclDetail mclDetail = MclMapper.INSTANCE.toMclDocumentDetail(mclMaterialInfo);
            mclDetail.setItemDetail(setItemDetail(mclMaterialInfo));
            //mclDetail.setItemColorSize(setItemColorSize(mclMaterialInfo));
            //double garmentQty = mclOrderQuantityRepository.findMaterialQuantitySum(mclMaterialInfo);
            //mclDetail.setGarmentQty(garmentQty);
            mclDetails.add(mclDetail);
        }

        MclDocumentDto.MclHeader mclHeader = MclMapper.INSTANCE.toMclDocumentHeader(mclOption);
        mclHeader.setOrderQuantity(
                mclOption.getMclOrderQuantities()
                .stream()
                .mapToInt(MclOrderQuantity::getMeasuredQuantity).sum()
        );
        mclHeader.setCo(
                mclOption.getFactory().getCompanyAddresses()
                .stream()
                .filter(item -> item.getRepresentitive() == 1)
                .map(s-> s.getCountryId().getCmName3())
                .collect(Collectors.joining())
        );
        mclHeader.setDestinations(
                mclOption.getMclGarmentMarkets()
                        .stream()
                        .map(item -> item.getMarket().getName())
                        .collect(Collectors.toList())
        );
        mclDocumentDto.setMclHeader(mclHeader);
        mclDocumentDto.setMclDetails(mclDetails);
        return mclDocumentDto;
    }

    @Override
    public AvailableSettingDto findAvailableSettingItems(MclOption mclOption) {
        AvailableSettingDto availableSettingDto = new AvailableSettingDto();

        List<String> colors = findAssignedPoItemColor(mclOption.getId())
                .stream()
                .filter(item -> {
                    if(mclOption.getMclGarmentColors().size()>0){
                        for (MclGarmentColor mclGarmentColor: mclOption.getMclGarmentColors()){
                            if(item.equals(mclGarmentColor.getPoGarmentColor())){
                                return false;
                            }
                        }
                    }
                    return true;
                }).collect(Collectors.toList());
        AvailableSettingDto.AvailableItem color = new AvailableSettingDto.AvailableItem();
        color.setItemCount(colors.size());
        color.setItemName(colors.size()>0 ? colors.get(0) : "");
        availableSettingDto.setColor(color);

        List<String> sizes = findAssignedPoItemSize(mclOption.getId())
                .stream()
                .filter(item -> {
                    if(mclOption.getMclGarmentSizes().size()>0){
                        for (MclGarmentSize mclGarmentSize: mclOption.getMclGarmentSizes()){
                            if(item.equals(mclGarmentSize.getPoGarmentSize())){
                                return false;
                            }
                        }
                    }
                    return true;
                }).collect(Collectors.toList());
        AvailableSettingDto.AvailableItem size = new AvailableSettingDto.AvailableItem();
        size.setItemCount(sizes.size());
        size.setItemName(sizes.size()>0 ? sizes.get(0) : "");
        availableSettingDto.setSize(size);

        List<String> markets = findAssignedPoMarket(mclOption.getId())
                .stream()
                .filter(item -> {
                    if(mclOption.getMclGarmentMarkets().size()>0){
                        for (MclGarmentMarket mclGarmentMarket: mclOption.getMclGarmentMarkets()){
                            if(item.equals(mclGarmentMarket.getPoGarmentMarket())){
                                return false;
                            }
                        }
                    }
                    return true;
                }).collect(Collectors.toList());
        AvailableSettingDto.AvailableItem market = new AvailableSettingDto.AvailableItem();
        market.setItemCount(markets.size());
        market.setItemName(markets.size()>0 ? markets.get(0) : "");
        availableSettingDto.setMarket(market);

        return availableSettingDto;
    }

    private MclDocumentDto.MclDetail.ItemDetail setItemDetail(MclMaterialInfo mclMaterialInfo) {
        MclDocumentDto.MclDetail.ItemDetail itemDetail = new MclDocumentDto.MclDetail.ItemDetail();
        //Item Detail
        itemDetail.setItemDetail(mclMaterialInfo.getMaterialInfo().getSubsidiaryDetail());

        //Contents
        String content = "";
        if(mclMaterialInfo.getMaterialInfo().getMaterialYarns() != null){
            for (MaterialYarn materialYarn:  mclMaterialInfo.getMaterialInfo().getMaterialYarns()){
                content += materialYarn.getUsed()+"% "+materialYarn.getCommonMaterialYarn().getCmName1()+" ";
            }
        }
        itemDetail.setContent(content);

        //Construction
        String construction = "";
        if(mclMaterialInfo.getType().equals("fabric")){
            construction = (mclMaterialInfo.getMaterialInfo().getConstructionType()==null  ? "": mclMaterialInfo.getMaterialInfo().getConstructionType())+" "+
                    (mclMaterialInfo.getMaterialInfo().getYarnSizeWrap()==null ? "": mclMaterialInfo.getMaterialInfo().getYarnSizeWrap())+" "+
                    (mclMaterialInfo.getMaterialInfo().getYarnSizeWeft()==null ? "": mclMaterialInfo.getMaterialInfo().getYarnSizeWeft())+" "+
                    mclMaterialInfo.getMaterialInfo().getConstructionEpi()+ " "+
                    mclMaterialInfo.getMaterialInfo().getConstructionPpi()+" "+
                    (mclMaterialInfo.getMaterialInfo().getUsageType()==null ? "": mclMaterialInfo.getMaterialInfo().getUsageType())+" "+
                    (mclMaterialInfo.getMaterialInfo().getSusEco()==null ? "":mclMaterialInfo.getMaterialInfo().getSusEco())+" "+
                    (mclMaterialInfo.getMaterialInfo().getApplication()==null ? "": mclMaterialInfo.getMaterialInfo().getApplication());
        }
        itemDetail.setConstruction(construction.trim());

        if(mclMaterialInfo.getMaterialOffer() != null){
            MaterialOffer materialOffer = mclMaterialInfo.getMaterialOffer();

            //CW
            String cw = "";
            if(materialOffer.getFabricCw() != null){
                cw += materialOffer.getFabricCw();
            }
            if(materialOffer.getCommonFabricCwUom() != null){
                cw += " "+materialOffer.getCommonFabricCwUom().getCmName3();
            }
            itemDetail.setCw(cw);

            //Weight
            String weight = "";
            if(materialOffer.getFabricWeight() != null){
                weight += materialOffer.getFabricWeight();
            }
            if(materialOffer.getCommonFabricWeightUom() != null){
                weight += " "+materialOffer.getCommonFabricWeightUom().getCmName3();
            }
            itemDetail.setWeight(weight);

            //method
            String finishing = "";
            String dyeing = "";
            String printing = "";
            if(materialOffer.getMaterialAfterManufacturingFashion() == null
                    && materialOffer.getMaterialAfterManufacturingFinishing() == null
                    && materialOffer.getMaterialAfterManufacturingDyeing() == null
            ){
                finishing = "N/A";
                dyeing = "N/A";
                printing = "N/A";
            }else{
                if(materialOffer.getMaterialAfterManufacturingFashion() != null){
                    printing = materialOffer.getMaterialAfterManufacturingFashion();
                }
                if(materialOffer.getMaterialAfterManufacturingFinishing() != null){
                    finishing = materialOffer.getMaterialAfterManufacturingFinishing();
                }
                if(materialOffer.getMaterialAfterManufacturingDyeing() != null){
                    dyeing = materialOffer.getMaterialAfterManufacturingDyeing();
                }
            }
            itemDetail.setFinishing(finishing);
            itemDetail.setDyeing(dyeing);
            itemDetail.setPrinting(printing);

            //Etc
            itemDetail.setCharacteristic(materialOffer.getCharacteristic());
            itemDetail.setSolidPattern(materialOffer.getSolidPattern());
            itemDetail.setFunction(materialOffer.getFunction());
            itemDetail.setPerformance(materialOffer.getPerformance());
            itemDetail.setStretch(materialOffer.getStretch());
            itemDetail.setLeadTime(materialOffer.getLeadTime());
        }
        return itemDetail;
    }
}
