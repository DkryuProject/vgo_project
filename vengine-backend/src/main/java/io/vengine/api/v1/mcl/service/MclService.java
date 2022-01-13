package io.vengine.api.v1.mcl.service;

import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.mcl.dto.*;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.user.entity.User;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface MclService {
    void saveMclCover(CBDCover cbdCover, User user);

    //Mcl Option
    MclOption saveMclOption(MclOption mclOption);

    Optional<MclOption> findMclOptionById(Long mclOptionID);

    List<MclOption> findMclOptionByCbdCoverId(CBDCover toCover);

    void deleteMclOption(Long mclOptionID, User user);

    //Mcl Factory Allocation
    MclFactoryAlloc saveMclFactoryAllocation(MclFactoryAlloc mclFactoryAlloc);

    MclFactoryAlloc findMclFactoryAllocationById(Long mclFactoryAllocationId);

    List<MclFactoryAlloc> findMclFactoryAllocationByMclOption(Map<String, Object> serchFilter, User user);

    void deleteMclFactoryAllocation(Long id, User user);

    //Mcl Cbd Assign
    void assignMclCbdAssign(MclOption mclOption, List<MclCbdAssignDto.CbdAssignRequest> cbdAssignRequests, User user);

    List<MclCbdAssignDto> findMclCbdAssignByMclOption(Long mclOptionId);

    //Mcl Pre Booking
    Optional<MclPreBooking> findMclPreBookingById(Long mclPreBookingId);

    MclPreBooking saveMclPreBooking(MclPreBooking mclPreBooking);

    List<MclPreBooking> findMclPreBookingByMclOption(Long mclOptionId, User user);

    void deleteMclPreBooking(Long id, User user);

    //Mcl Pre Booking Po
    List<AssignedPODto> findMclPreBookingPoByMclOption(Long mclOptionId);

    void deleteMclPreBookingPo(Long id, User user);

    //Mcl Garment Color
    void saveMclGarmentColor(Long mclOptionId, List<MclCommonDto.ColorRequest> colorRequests, User user);

    void deleteMclGarmentColor(List<Long> mclGarmentColorIds, User user);

    List<MclCommonDto> findMclGarmentColorByMclOptionID(Long mclOptionID);

    List<String> findAssignedPoItemColor(Long id);

    //Mcl Garment Size
    void saveMclGarmentSize(Long mclOptionId, List<MclCommonDto.SizeRequest> sizeID, User user);

    void deleteMclGarmentSize(List<Long> mclGarmentSizeIds, User user);

    List<MclCommonDto> findMclGarmentSizeByMclOptionID(Long mclOptionID);

    List<String> findAssignedPoItemSize(Long id);

    //MCL Garment Market
    List<String> findAssignedPoMarket(Long id);

    void saveMclGarmentMarket(Long mclOptionId, List<MclCommonDto.MarketRequest> marketRequests, User user);

    void deleteMclGarmentMarket(List<Long> marketIds, User user);

    List<MclCommonDto> findMclGarmentMarketByMclOptionID(Long mclOptionID);

    //MCL Assign PO
    void saveAssignPO(Long id, List<MclAssignedPODto.MclAssignedPORequest> request, User user);

    //MCL ORDER QUANTITY
    MclOrderQtyDto findMclOrderQtyByMclOption(Long mclOptionId);

    void saveMclOrderQty(Long mclOptionId, MclOrderQtyRequestDto requests, User user);

    List<BigInteger> findStyleNumber(Long mclOptionID);

    //MCL ORDER QUANTITY OPTION
    MclOrderQuantityOption findMclOrderQtyOption(Long id);

    //MCL MATERIAL INFO
    MclMaterialInfoDto findMclMaterialInfoByMclOption(Long mclOptionId, User user);

    Optional<MclMaterialInfo> findMclMaterialInfoById(Long id);

    void deleteMclMaterialInfo(MclMaterialInfo mclMaterialInfo, User user);

    void modifyMclMaterialInfo(MclMaterialInfo mclMaterialInfo, MclMaterialInfoRequestDto request, User user);

    void addMclMaterialInfo(MclOption mclOption, List<Long> materialOfferIds, User user);

    void copyMclMaterialInfo(MclMaterialInfo mclMaterialInfo, MclMaterialInfoRequestDto request, User user);

    List<MclOrderItemDto.OrderItem> findMclMaterialInfoByOrderItem(MclMaterialPurchaseOrder order);

    void newMclMaterialInfo(String type, MclOption mclOption, NewMclMaterialInfoRequest request, User user);

    MclDocumentDto findMclDocument(MclOption mclOption);

    AvailableSettingDto findAvailableSettingItems(MclOption mclOption);
}
