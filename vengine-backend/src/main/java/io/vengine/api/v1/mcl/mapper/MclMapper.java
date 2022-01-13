package io.vengine.api.v1.mcl.mapper;

import io.vengine.api.common.enums.Status;
import io.vengine.api.common.utils.FormattingUtil;
import io.vengine.api.v1.buyer.mapper.BuyerOrderMapper;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.cbd.mapper.CBDMapper;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.companyInfo.mapper.CompanyInfoEntityMapper;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.mcl.dto.*;
import io.vengine.api.v1.mcl.entity.*;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import io.vengine.api.v1.user.mapper.UserMapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL,
        uses = {CommonMapper.class, CompanyMapper.class, CBDMapper.class, CompanyInfoEntityMapper.class, BuyerOrderMapper.class, MaterialMapper.class, UserMapper.class})
public interface MclMapper {
    MclMapper INSTANCE = Mappers.getMapper(MclMapper.class);

    //MCL COVER
    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user")
    })
    MclCoverDto toCoverDTO(MclCover mclCover);

    @Mapping(target = "id", source = "id")
    MclCover toCover(Long id);

    //MCL OPTION
    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "mclCbdAssigns", source = "mclCbdAssigns"),
            @Mapping(target = "factory", source = "factory"),
            @Mapping(target = "pcdDate", source = "pcdDate", qualifiedByName = "localDateString"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "mclAmount", source = "mclOption"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user")
    })
    MclOptionDto.Option toOptionDto(MclOption mclOption);

    List<MclOptionDto.Option> toOptionDto(List<MclOption> mclOption);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "mclCover", source = "request.mclCoverID"),
            @Mapping(target = "factory", source = "request.factoryID"),
            @Mapping(target = "pcdDate", source = "request.pcdDate", qualifiedByName = "localDate"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toOption(MclOptionDto.MclOptionRequest request, User user, @MappingTarget MclOption mclOption);

    @Mapping(target = "id", source = "id")
    MclOption toOption(Long id);

    //MCL FACTORY ALLOCATION
    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "commonMaterialProduct", source = "commonMaterialProduct"),
            @Mapping(target = "factory", source = "factory"),
            @Mapping(target = "poTotalQuantity", source = "poTotalQuantity"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user")
    })
    MclFactoryAllocDto.FactoryAlloc toFactoryAllocDto(MclFactoryAlloc malFactoryAlloc);

    List<MclFactoryAllocDto.FactoryAlloc> toFactoryAllocDto(List<MclFactoryAlloc> malFactoryAlloc);

    @Mappings({
            @Mapping(target = "mclOption", source = "request.mclOptionID"),
            @Mapping(target = "commonMaterialProduct", source = "request.commonMaterialProductID"),
            @Mapping(target = "factory", source = "request.factoryID"),
            @Mapping(target = "poTotalQuantity", source = "request.poTotalQty"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toFactoryAlloc(MclFactoryAllocDto.FactoryAllocRequest request, User user, @MappingTarget MclFactoryAlloc mclFactoryAlloc);

    @Mapping(target = "id", source = "id")
    MclFactoryAlloc toFactoryAlloc(Long id);

    //MCL COMMENT
    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "remark", source = "remark"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user")
    })
    MclCommentDto.Comment toCommentDto(MclComment mclComment);

    //MCL PRE BOOKING
    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "shipDateFrom", source = "shipDateFrom", dateFormat = "YYYY-MM-dd"),
            @Mapping(target = "shipDateTo", source = "shipDateTo", dateFormat = "YYYY-MM-dd"),
            @Mapping(target = "styleNumber", source = "styleNumber"),
            @Mapping(target = "program", source = "companyGarmentProgram"),
            @Mapping(target = "cbdOption", source = "cbdOption"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user")
    })
    MclPreBookingDto.MclPreBooking toPreBookingDto(MclPreBooking mclPreBookings);

    List<MclPreBookingDto.MclPreBooking> toPreBookingDto(List<MclPreBooking> mclPreBookings);

    @Mappings({
            @Mapping(target = "mclOption", source = "request.mclOptionID"),
            @Mapping(target = "shipDateFrom", source = "request.shipDateFrom", qualifiedByName = "localDatetime"),
            @Mapping(target = "shipDateTo", source = "request.shipDateTo", qualifiedByName = "localDatetime"),
            @Mapping(target = "styleNumber", source = "request.styleNumber"),
            @Mapping(target = "companyGarmentProgram", source = "request.companyProgramID"),
            @Mapping(target = "cbdOption", source = "request.cbdOptionId"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toPreBooking(MclPreBookingDto.MclPreBookingRequest request, User user, @MappingTarget MclPreBooking mclPreBooking);

    @Mapping(target = "id", source = "id")
    MclPreBooking toPreBooking(Long id);

    //MCL CBD ASSIGN
    @Mappings({
            @Mapping(target = "cbdOption", source = "request.cbdOptionID"),
            @Mapping(target = "mclOption", source = "mclOptionId"),
            @Mapping(target = "fabricCheck", source = "request.fabricCheck"),
            @Mapping(target = "trimsCheck", source = "request.trimsCheck"),
            @Mapping(target = "accessoriesCheck", source = "request.accessoriesCheck"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "company", source = "user.compId"),
            @Mapping(target = "department", source = "user.deptId"),
            @Mapping(target = "id", ignore = true)
    })
    void toCbdAssign(Long mclOptionId, MclCbdAssignDto.CbdAssignRequest request, User user, @MappingTarget MclCbdAssign mclCbdAssign);

    @Mapping(target = "id", source = "id")
    MclCbdAssign toCbdAssign(Long id);

    @Mappings({
            @Mapping(target = "cbdOption", source = "cbdOption"),
            @Mapping(target = "assigned", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user")
    })
    MclCbdAssignDto toCbdAssignDto(CBDOption cbdOption);

    List<MclCbdAssignDto> toCbdAssignDto(List<CBDOption> cbdOptions);
    //MCL PO ASSIGN
    @Mappings({
            @Mapping(target = "buyerOrderItem", source = "id"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "mclPreBookingPo", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclPreBookingPoItem toAssignPOItem(Long id, User user);

    @Mappings({
            @Mapping(target = "mclOption", source = "id"),
            @Mapping(target = "buyerOrderInfo", source = "orderId"),
            @Mapping(target = "mclPreBooking", source = "mclPreBookingId"),
            @Mapping(target = "mclPreBookingPoItems", source = "itemList"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    MclPreBookingPo toAssignPO(Long id, Long mclPreBookingId, Long orderId, List<MclPreBookingPoItem> itemList, User user);

    @Mappings({
            @Mapping(target = "assignedPoId", source = "id"),
            @Mapping(target = "order", source = "buyerOrderInfo"),
            @Mapping(target = "items", ignore = true),
            @Mapping(target = "assigned", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user")
    })
    MclAssignedPODto.MclAssignedPOResponse toAssignPODto(MclPreBookingPo mclPreBookingPo);

    List<MclAssignedPODto.MclAssignedPOResponse> toAssignPODto(List<MclPreBookingPo> mclPreBookingPos);

    //MCL GARMENT COLOR
    @Mapping(target = "id", source = "id")
    MclGarmentColor toColor(Long id);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "garmentColor", source = "garmentColor"),
            @Mapping(target = "poGarmentColor", source = "poGarmentColor")
    })
    MclCommonDto toColorDto(MclGarmentColor color);

    List<MclCommonDto> toColorDto(List<MclGarmentColor> colors);
    //MCL GARMENT SIZE
    @Mappings({
            @Mapping(target = "mclOption", source = "mclOptionID"),
            @Mapping(target = "size", source = "sizeID"),
            @Mapping(target = "poGarmentSize", source = "poSize"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    MclGarmentSize toSize(Long mclOptionID, Long sizeID, String poSize,User user);

    @Mapping(target = "id", source = "id")
    MclGarmentSize toSize(Long id);

    @Mappings({
            @Mapping(target = "size", source = "sizeRequest.garmentSizeId"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "mclOption", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toSize(MclCommonDto.SizeRequest sizeRequest, User user, @MappingTarget MclGarmentSize mclGarmentSize);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "garmentSize", source = "size"),
            @Mapping(target = "poGarmentSize", source = "poGarmentSize")
    })
    MclCommonDto toSizeDto(MclGarmentSize mclGarmentSize);

    List<MclCommonDto> toSizeDto(List<MclGarmentSize> sizes);

    @Mapping(target = "id", source = "id")
    MclGarmentMarket toMarket(Long id);

    @Mappings({
            @Mapping(target = "market", source = "marketRequest.garmentMarketId"),
            @Mapping(target = "poGarmentMarket", source = "marketRequest.poGarmentMarket"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "mclOption", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toMarket(MclCommonDto.MarketRequest marketRequest, User user, @MappingTarget MclGarmentMarket mclGarmentMarket);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "garmentMarket", source = "market"),
            @Mapping(target = "poGarmentMarket", source = "poGarmentMarket")
    })
    MclCommonDto toMarketDto(MclGarmentMarket market);

    List<MclCommonDto> toMarketDto(List<MclGarmentMarket> markets);

    //MCL ORDER QTY
    @Mappings({
            @Mapping(target = "mclOption", source = "mclOptionId"),
            @Mapping(target = "measuredQuantity", source = "request.qty"),
            @Mapping(target = "mclGarmentColor", source = "request.colorId"),
            @Mapping(target = "mclGarmentSize", source = "request.sizeId"),
            @Mapping(target = "mclGarmentMarket", source = "request.market"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    MclOrderQuantity toMclOrderQty(Long mclOptionId, MclOrderQtyRequestDto.Qty request, User user);

    //MCL MATERIAL INFO
    @Mappings({
            @Mapping(target = "mclMaterialUom", source = "mclMaterialUom", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "commonActualColor", source = "commonActualColor", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "mclMaterialPurchaseOrderDependencyItems", ignore = true),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialInfo toCopyMclMaterial(MclMaterialInfo mclMaterialInfo);

    @Mappings({
            @Mapping(target = "mclOption", source = "mclOptionId"),
            @Mapping(target = "type", source = "cbdMaterialInfo.type"),
            @Mapping(target = "supplierMaterial", source = "cbdMaterialInfo.supplierMaterial"),
            @Mapping(target = "materialInfo", source = "cbdMaterialInfo.materialInfo"),
            @Mapping(target = "materialOffer", source = "cbdMaterialInfo.materialOffer"),
            @Mapping(target = "mclMaterialUom", source = "cbdMaterialInfo.cbdMaterialUom"),
            @Mapping(target = "subsidiaryDetail", source = "cbdMaterialInfo.subsidiaryDetail"),
            @Mapping(target = "unitPrice", source = "cbdMaterialInfo.unitPrice"),
            @Mapping(target = "usagePlace", source = "cbdMaterialInfo.usagePlace"),
            @Mapping(target = "netYy", source = "cbdMaterialInfo.netYy"),
            @Mapping(target = "tolerance", source = "cbdMaterialInfo.tolerance"),
            @Mapping(target = "cbdMaterialInfo", source = "cbdMaterialInfo"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "mclMaterialPurchaseOrderItems", ignore = true),
            @Mapping(target = "mclMaterialPurchaseOrderDependencyItems", ignore = true),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialInfo toMaterialInfo(Long mclOptionId, CBDMaterialInfo cbdMaterialInfo, Status status, User user);

    @Mappings({
            @Mapping(target = "mclOption", source = "mclOption"),
            @Mapping(target = "supplier", source = "materialInfo.supplierCompany"),
            @Mapping(target = "buyer", source = "mclOption.mclCover.cbdCover.buyer"),
            @Mapping(target = "factory", source = "mclOption.factory"),
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "materialOffer", source = "materialOffer"),
            @Mapping(target = "subsidiaryDetail", source = "materialInfo.subsidiaryDetail"),
            @Mapping(target = "type", source = "materialInfo.type"),
            @Mapping(target = "supplierMaterial", source = "materialOffer.myMillarticle"),
            @Mapping(target = "unitPrice", source = "materialOffer.unitPrice"),
            @Mapping(target = "mclMaterialUom", source = "materialOffer", qualifiedByName = "setMclMaterialInfoUom"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "useYN", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialInfo toMaterialInfo(MclOption mclOption, MaterialInfo materialInfo, MaterialOffer materialOffer, Status status, User user);

    @Mappings({
            @Mapping(target = "mclOption", source = "mclOption"),
            @Mapping(target = "supplier", source = "materialInfo.supplierCompany"),
            @Mapping(target = "buyer", source = "mclOption.mclCover.cbdCover.buyer"),
            @Mapping(target = "factory", source = "mclOption.factory"),
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "materialOffer", source = "materialOffer"),
            @Mapping(target = "subsidiaryDetail", source = "materialInfo.subsidiaryDetail"),
            @Mapping(target = "type", source = "materialInfo.type"),
            @Mapping(target = "supplierMaterial", source = "materialOffer.myMillarticle"),
            @Mapping(target = "unitPrice", source = "materialOffer.unitPrice"),
            @Mapping(target = "usagePlace", source = "request.usagePlace"),
            @Mapping(target = "netYy", source = "request.netYy"),
            @Mapping(target = "tolerance", source = "request.tolerance"),
            @Mapping(target = "colorDependency", source = "request.colorDependency.type"),
            @Mapping(target = "sizeDependency", source = "request.sizeDependency.type"),
            @Mapping(target = "marketDependency", source = "request.marketDependency.type"),
            @Mapping(target = "fabricColorName", source = "request.itemColor"),
            @Mapping(target = "commonActualColor", source = "request.actualColor", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "sizeMemo", source = "request.sizeMemo"),
            @Mapping(target = "mclMaterialUom", source = "materialOffer", qualifiedByName = "setMclMaterialInfoUom"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "useYN", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialInfo toMaterialInfo(NewMclMaterialInfoRequest request, MclOption mclOption, MaterialInfo materialInfo, MaterialOffer materialOffer, Status status, User user);

    @Mappings({
            @Mapping(target = "materialOffer", source = "materialOffer"),
            @Mapping(target = "supplierMaterial", source = "materialOffer.myMillarticle"),
            @Mapping(target = "mclMaterialUom", ignore = true),
            @Mapping(target = "unitPrice", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toMaterialInfo(MaterialOffer materialOffer, @MappingTarget MclMaterialInfo mclMaterialInfo);

    @Mapping(target = "id", source = "id")
    MclMaterialInfo toMaterialInfo(Long id);

    @Mappings({
            @Mapping(target = "usagePlace", source = "request.usagePlace"),
            @Mapping(target = "netYy", source = "request.netYy"),
            @Mapping(target = "tolerance", source = "request.tolerance"),
            @Mapping(target = "unitPrice", source = "request.unitPrice"),
            @Mapping(target = "colorDependency", source = "request.colorDependency.type"),
            @Mapping(target = "sizeDependency", source = "request.sizeDependency.type"),
            @Mapping(target = "marketDependency", source = "request.marketDependency.type"),
            @Mapping(target = "fabricColorName", source = "request.itemColor"),
            @Mapping(target = "commonActualColor", source = "request.actualColor", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "sizeMemo", source = "request.sizeMemo"),
            @Mapping(target = "mclMaterialUom", source = "request.mclMaterialUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "status", source = "request.status"),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toMaterialInfo(MclMaterialInfoRequestDto request, User user, @MappingTarget MclMaterialInfo mclMaterialInfo);

    @Mappings({
            @Mapping(target = "id", source = "mclMaterialInfo.id"),
            @Mapping(target = "mclOption", source = "mclMaterialInfo.mclOption"),
            @Mapping(target = "fabricWeight", source = "mclMaterialInfo.materialOffer.fabricWeight"),
            @Mapping(target = "fabricWeightUom", source = "mclMaterialInfo.materialOffer.commonFabricWeightUom"),
            @Mapping(target = "fabricCw", source = "mclMaterialInfo.materialOffer.fabricCw"),
            @Mapping(target = "fabricCwUom", source = "mclMaterialInfo.materialOffer.commonFabricCwUom"),
            @Mapping(target = "supplierMaterial", source = "mclMaterialInfo.supplierMaterial"),
            @Mapping(target = "unitPrice", source = "mclMaterialInfo.unitPrice"),
            @Mapping(target = "usagePlace", source = "mclMaterialInfo.usagePlace"),
            @Mapping(target = "netYy", source = "mclMaterialInfo.netYy"),
            @Mapping(target = "tolerance", source = "mclMaterialInfo.tolerance"),
            @Mapping(target = "materialInfo", source = "mclMaterialInfo.materialInfo"),
            @Mapping(target = "colorDependency.type", source = "mclMaterialInfo.colorDependency"),
            @Mapping(target = "colorDependency.infos", source = "colors"),
            @Mapping(target = "sizeDependency.type", source = "mclMaterialInfo.sizeDependency"),
            @Mapping(target = "sizeDependency.infos", source = "sizes"),
            @Mapping(target = "marketDependency.type", source = "mclMaterialInfo.marketDependency"),
            @Mapping(target = "marketDependency.infos", source = "markets"),
            @Mapping(target = "materialAfterManufacturingDyeing", source = "mclMaterialInfo.materialOffer.materialAfterManufacturingDyeing"),
            @Mapping(target = "materialAfterManufacturingFashion", source = "mclMaterialInfo.materialOffer.materialAfterManufacturingFashion"),
            @Mapping(target = "materialAfterManufacturingFinishing", source = "mclMaterialInfo.materialOffer.materialAfterManufacturingFinishing"),
            @Mapping(target = "subsidiarySize", source = "mclMaterialInfo.materialOffer.size"),
            @Mapping(target = "subsidiarySizeUom", source = "mclMaterialInfo.materialOffer.commonSubsidiarySizeUom"),
            @Mapping(target = "characteristic", source = "mclMaterialInfo.materialOffer.characteristic"),
            @Mapping(target = "solidPattern", source = "mclMaterialInfo.materialOffer.solidPattern"),
            @Mapping(target = "function", source = "mclMaterialInfo.materialOffer.function"),
            @Mapping(target = "performance", source = "mclMaterialInfo.materialOffer.performance"),
            @Mapping(target = "stretch", source = "mclMaterialInfo.materialOffer.stretch"),
            @Mapping(target = "leadTime", source = "mclMaterialInfo.materialOffer.leadTime"),
            @Mapping(target = "subsidiaryDetail", source = "mclMaterialInfo.subsidiaryDetail"),
            @Mapping(target = "fabricColorName", source = "mclMaterialInfo.fabricColorName"),
            @Mapping(target = "commonActualColor", source = "mclMaterialInfo.commonActualColor"),
            @Mapping(target = "mclMaterialUom", source = "mclMaterialInfo.mclMaterialUom"),
            @Mapping(target = "supplier", source = "mclMaterialInfo.supplier"),
            @Mapping(target = "buyer", source = "mclMaterialInfo.buyer"),
            @Mapping(target = "factory", source = "mclMaterialInfo.factory"),
            @Mapping(target = "updated", source = "mclMaterialInfo.updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "mclMaterialInfo.user"),
    })
    MclMaterialInfoDto.MaterialInfo toMaterialInfoDto(MclMaterialInfo mclMaterialInfo, List<MclGarmentColor> colors, List<MclGarmentSize> sizes, List<MclGarmentMarket> markets);

    @Mappings({
            @Mapping(target = "id", source = "mclMaterialInfo.id"),
            @Mapping(target = "mclOption", source = "mclMaterialInfo.mclOption"),
            @Mapping(target = "fabricWeight", source = "mclMaterialInfo.materialOffer.fabricWeight"),
            @Mapping(target = "fabricWeightUom", source = "mclMaterialInfo.materialOffer.commonFabricWeightUom"),
            @Mapping(target = "fabricCw", source = "mclMaterialInfo.materialOffer.fabricCw"),
            @Mapping(target = "fabricCwUom", source = "mclMaterialInfo.materialOffer.commonFabricCwUom"),
            @Mapping(target = "supplierMaterial", source = "mclMaterialInfo.supplierMaterial"),
            @Mapping(target = "unitPrice", source = "mclMaterialInfo.unitPrice"),
            @Mapping(target = "usagePlace", source = "mclMaterialInfo.usagePlace"),
            @Mapping(target = "netYy", source = "mclMaterialInfo.netYy"),
            @Mapping(target = "tolerance", source = "mclMaterialInfo.tolerance"),
            @Mapping(target = "grossYy", source = "mclMaterialInfo.grossYy"),
            @Mapping(target = "materialInfo", source = "mclMaterialInfo.materialInfo"),
            @Mapping(target = "colorDependency.type", source = "mclMaterialInfo.colorDependency"),
            @Mapping(target = "sizeDependency.type", source = "mclMaterialInfo.sizeDependency"),
            @Mapping(target = "marketDependency.type", source = "mclMaterialInfo.marketDependency"),
            @Mapping(target = "materialAfterManufacturingDyeing", source = "mclMaterialInfo.materialOffer.materialAfterManufacturingDyeing"),
            @Mapping(target = "materialAfterManufacturingFashion", source = "mclMaterialInfo.materialOffer.materialAfterManufacturingFashion"),
            @Mapping(target = "materialAfterManufacturingFinishing", source = "mclMaterialInfo.materialOffer.materialAfterManufacturingFinishing"),
            @Mapping(target = "subsidiarySize", source = "mclMaterialInfo.materialOffer.size"),
            @Mapping(target = "subsidiarySizeUom", source = "mclMaterialInfo.materialOffer.commonSubsidiarySizeUom"),
            @Mapping(target = "characteristic", source = "mclMaterialInfo.materialOffer.characteristic"),
            @Mapping(target = "solidPattern", source = "mclMaterialInfo.materialOffer.solidPattern"),
            @Mapping(target = "function", source = "mclMaterialInfo.materialOffer.function"),
            @Mapping(target = "performance", source = "mclMaterialInfo.materialOffer.performance"),
            @Mapping(target = "stretch", source = "mclMaterialInfo.materialOffer.stretch"),
            @Mapping(target = "leadTime", source = "mclMaterialInfo.materialOffer.leadTime"),
            @Mapping(target = "subsidiaryDetail", source = "mclMaterialInfo.subsidiaryDetail"),
            @Mapping(target = "fabricColorName", source = "mclMaterialInfo.fabricColorName"),
            @Mapping(target = "commonActualColor", source = "mclMaterialInfo.commonActualColor"),
            @Mapping(target = "mclMaterialUom", source = "mclMaterialInfo.mclMaterialUom"),
            @Mapping(target = "offerUom", source = "materialOffer.commonUom"),
            @Mapping(target = "supplier", source = "mclMaterialInfo.supplier"),
            @Mapping(target = "buyer", source = "mclMaterialInfo.buyer"),
            @Mapping(target = "factory", source = "mclMaterialInfo.factory"),
            @Mapping(target = "updated", source = "mclMaterialInfo.updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "mclMaterialInfo.user"),
    })
    MclMaterialInfoDto.MaterialInfo toMaterialInfoDto(MclMaterialInfo mclMaterialInfo);

    List<MclMaterialInfoDto.MaterialInfo> toMaterialInfoDto(List<MclMaterialInfo> mclMaterialInfos);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "color", source = "mclGarmentColor"),
            @Mapping(target = "size",source = "mclGarmentSize"),
            @Mapping(target = "market",source = "mclGarmentMarket"),
            @Mapping(target = "total",source = "measuredQuantity"),
    })
    MclOrderQtyDto.TotalQty toMclOrderQtyDto(MclOrderQuantity mclOrderQuantity);

    //MCL DEPENDENCY COLOR
    @Mappings({
            @Mapping(target = "mclOption", source = "mclMaterialInfo.mclOption"),
            @Mapping(target = "materialType", source = "mclMaterialInfo.type"),
            @Mapping(target = "mclGarmentColor", source = "colorID"),
            @Mapping(target = "mclMaterialInfo", source = "mclMaterialInfo.id"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialDependencyColor toDependencyColor(MclMaterialInfo mclMaterialInfo, Long colorID, User user);

    //MCL DEPENDENCY MARKET
    @Mappings({
            @Mapping(target = "mclOption", source = "mclMaterialInfo.mclOption"),
            @Mapping(target = "materialType", source = "mclMaterialInfo.type"),
            @Mapping(target = "mclGarmentMarket", source = "marketID"),
            @Mapping(target = "mclMaterialInfo", source = "mclMaterialInfo.id"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialDependencyMarket toDependencyMarket(MclMaterialInfo mclMaterialInfo, Long marketID, User user);

    //MCL DEPENDENCY SIZE
    @Mappings({
            @Mapping(target = "mclOption", source = "mclMaterialInfo.mclOption"),
            @Mapping(target = "materialType", source = "mclMaterialInfo.type"),
            @Mapping(target = "mclGarmentSize", source = "sizeID"),
            @Mapping(target = "mclMaterialInfo", source = "mclMaterialInfo.id"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialDependencySize toDependencySize(MclMaterialInfo mclMaterialInfo, Long sizeID, User user);

    //MCL PURCHASE ORDER
    @Mappings({
            @Mapping(target = "order", source = "mclMaterialPurchaseOrder"),
            @Mapping(target = "styleNumbers", source = "styleNumbers"),
            @Mapping(target = "itemQty", source = "itemQty"),
            @Mapping(target = "totalPoQty", source = "totalPoQty"),
            @Mapping(target = "totalPoAmt", source = "totalPoAmt")
    })
    MclOrderDto toOrderDto(MclMaterialPurchaseOrder mclMaterialPurchaseOrder);

    List<MclOrderDto> toOrderDto(List<MclMaterialPurchaseOrder> mclMaterialPurchaseOrders);

    @Mappings({
            @Mapping(target = "mclOption", source = "mclOption"),
            @Mapping(target = "materialPurchaseCompany", source = "user.compId"),
            @Mapping(target = "materialSellingCompany", source = "request.sellingCompanyID"),
            @Mapping(target = "materialSellingCompanyAddress", source = "request.sellingCompanyAddressID"),
            //@Mapping(target = "shipperCompany", source = "request.shipperCompanyID"),
            //@Mapping(target = "shipperCompanyAddress", source = "request.shipperCompanyAddressID"),
            @Mapping(target = "incoterms", source = "request.incoterms"),
            @Mapping(target = "shippingMethod", source = "request.shippingMethod"),
            @Mapping(target = "paymentTerm", source = "request.paymentTerm"),
            @Mapping(target = "paymentBase", source = "request.paymentBase"),
            @Mapping(target = "paymentPeriod", source = "request.paymentPeriod"),
            @Mapping(target = "loadingBasicCountry", source = "request.loadingBasicCountry", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "loadingPort", source = "request.loadingPort", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "dischargeBasicCountry", source = "request.dischargeBasicCountry", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "dischargePort", source = "request.dischargePort", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "forwarder", source = "request.forwarderCompanyID", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "forwarderCompanyAddress", source = "request.forwarderCompanyAddressID", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "consigneeCompany", source = "request.consigneeCompanyID"),
            @Mapping(target = "consigneeCompanyAddress", source = "request.consigneeCompanyAddressID"),
            @Mapping(target = "shipToCompany", source = "request.shipToCompanyID"),
            @Mapping(target = "shipToCompanyAddress", source = "request.shipToCompanyAddressID"),
            @Mapping(target = "estimatedDate", source = "request.estimatedDate", qualifiedByName = "localDate"),
            @Mapping(target = "infactoryDate", source = "request.infactoryDate", qualifiedByName = "localDate"),
            @Mapping(target = "exMill", source = "request.exMill", qualifiedByName = "localDate"),
            @Mapping(target = "memo", source = "request.memo"),
            @Mapping(target = "partialShipment", source = "request.partialShipment"),
            @Mapping(target = "plusTolerance", source = "request.plusTolerance"),
            @Mapping(target = "minusTolerance", source = "request.minusTolerance"),
            @Mapping(target = "currency", source = "request.currency"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toOrder(MclOption mclOption, MclOrderRequestDto request, User user, @MappingTarget  MclMaterialPurchaseOrder order);

    //Order Item
    @Mappings({
            @Mapping(target = "orderID", source = "id"),
            @Mapping(target = "poNumber", source = "materialPurchaseOrderNumber"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "designNumber", source = "mclOption.mclCover.cbdCover.designNumber"),
            @Mapping(target = "buyer.companyID", source = "mclOption.mclCover.cbdCover.buyer.id"),
            @Mapping(target = "buyer.companyName", source = "mclOption.mclCover.cbdCover.buyer.name"),
            @Mapping(target = "brand.companyID", source = "mclOption.mclCover.cbdCover.vendorBrandId.id"),
            @Mapping(target = "brand.companyName", source = "mclOption.mclCover.cbdCover.vendorBrandId.name"),
            @Mapping(target = "purchaser.companyID", source = "materialPurchaseCompany.id"),
            @Mapping(target = "purchaser.companyName", source = "materialPurchaseCompany.name"),
            @Mapping(target = "purchaser.address", source = "materialPurchaseCompanyAddress"),
            @Mapping(target = "supplier.companyID", source = "materialSellingCompany.id"),
            @Mapping(target = "supplier.companyName", source = "materialSellingCompany.name"),
            @Mapping(target = "supplier.address", source = "materialSellingCompanyAddress"),
            @Mapping(target = "consignee.companyID", source = "consigneeCompany.id"),
            @Mapping(target = "consignee.companyName", source = "consigneeCompany.name"),
            @Mapping(target = "consignee.address", source = "consigneeCompanyAddress"),
            //@Mapping(target = "shipper.companyID", source = "shipperCompany.id"),
            //@Mapping(target = "shipper.companyName", source = "shipperCompany.name"),
            //@Mapping(target = "shipper.address", source = "shipperCompanyAddress"),
            @Mapping(target = "forwarder.companyID", source = "forwarder.id"),
            @Mapping(target = "forwarder.companyName", source = "forwarder.name"),
            @Mapping(target = "forwarder.address", source = "forwarderCompanyAddress"),
            @Mapping(target = "shipTo.companyID", source = "shipToCompany.id"),
            @Mapping(target = "shipTo.companyName", source = "shipToCompany.name"),
            @Mapping(target = "shipTo.address", source = "shipToCompanyAddress"),
            @Mapping(target = "incoterms", source = "incoterms"),
            @Mapping(target = "shippingMethod", source = "shippingMethod"),
            @Mapping(target = "paymentTerm", source = "paymentTerm"),
            @Mapping(target = "paymentBase", source = "paymentBase"),
            @Mapping(target = "paymentPeriod", source = "paymentPeriod"),
            @Mapping(target = "loadingBasicCountry", source = "loadingBasicCountry"),
            @Mapping(target = "loadingPort", source = "loadingPort"),
            @Mapping(target = "dischargeBasicCountry", source = "dischargeBasicCountry"),
            @Mapping(target = "dischargePort", source = "dischargePort"),
            @Mapping(target = "currency", source = "currency"),
            @Mapping(target = "estimatedDate", source = "estimatedDate"),
            @Mapping(target = "infactoryDate", source = "infactoryDate"),
            @Mapping(target = "exMill", source = "exMill"),
            @Mapping(target = "memo", source = "memo"),
            @Mapping(target = "userName", source = "userName"),
            @Mapping(target = "partialShipment", source = "partialShipment"),
            @Mapping(target = "plusTolerance", source = "plusTolerance"),
            @Mapping(target = "minusTolerance", source = "minusTolerance"),
            @Mapping(target = "poTerms", source = "poTerms"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "userInfo", source = "user")
    })
    MclOrderDto.Order toOrderDetailDto(MclMaterialPurchaseOrder mclMaterialPurchaseOrder);

    @Mappings({
            @Mapping(target = "itemID", source = "item.id"),
            @Mapping(target = "currency", source = "order.currency"),
            @Mapping(target = "designNumber", source = "order.mclOption.mclCover.cbdCover.designNumber"),
            @Mapping(target = "brand", source = "order.mclOption.mclCover.cbdCover.vendorBrandId"),
            @Mapping(target = "season", source = "order.mclOption.mclCover.cbdCover.season"),
            @Mapping(target = "seasonYear", source = "order.mclOption.mclCover.cbdCover.seasonYear"),
            @Mapping(target = "styleNumbers", source = "item.styleNumbers"),
            @Mapping(target = "orderType", source = "item.companyOrderType"),
            @Mapping(target = "mclMaterialInfo", source = "item.mclMaterialInfo"),
            @Mapping(target = "unitPrice", source = "item.unitPrice"),
            @Mapping(target = "requiredQty", source = "item.requireQty"),
            @Mapping(target = "issuedQty", source = "item.issuedQty"),
            @Mapping(target = "purchaseQty", source = "item.purchaseQty"),
            @Mapping(target = "balanceQty", source = "item.balanceQty"),
            @Mapping(target = "orderedUom", source = "item.orderedUom"),
            @Mapping(target = "orderedAdjUom", source = "item.orderedAdjUom"),
            @Mapping(target = "fromToUom", source = "item.fromToUom"),
            @Mapping(target = "sampleOrder", source = "item"),
            @Mapping(target = "dependencyItemList", source = "dependencyItems")
    })
    MclOrderItemDto.OrderItem toOrderItemDto(
            MclMaterialPurchaseOrder order,
            MclMaterialPurchaseOrderItem item,
            List<MclOrderItemDto.DependencyItem> dependencyItems
    );

    List<MclOrderItemDto.OrderItem> toOrderItemDto(List<MclMaterialPurchaseOrderItem> items);

    @Mappings({
            @Mapping(target = "preProductionQty", source = "preProductionQty"),
            @Mapping(target = "preProductionUom", source = "preProductionUom"),
            @Mapping(target = "preProductionUnitPrice", source = "preProductionUnitPrice"),
            @Mapping(target = "preProductionOrderType", source = "preProductionOrderType"),
            @Mapping(target = "advertisementQty", source = "advertisementQty"),
            @Mapping(target = "advertisementUom", source = "advertisementUom"),
            @Mapping(target = "advertisementUnitPrice", source = "advertisementUnitPrice"),
            @Mapping(target = "advertisementOrderType", source = "advertisementOrderType"),
    })
    MclOrderItemDto.SampleOrder toSampleOrderDto(MclMaterialPurchaseOrderItem mclMaterialPurchaseOrderItem);

    @Mappings({
            @Mapping(target = "currency", source = "order.currency"),
            @Mapping(target = "designNumber", source = "order.mclOption.mclCover.cbdCover.designNumber"),
            @Mapping(target = "mclMaterialInfo", source = "mclMaterialInfo"),
            @Mapping(target = "styleNumbers", source = "mclMaterialInfo.styleNumbers"),
            @Mapping(target = "requiredQty", source = "mclMaterialInfo.requireQty"),
            @Mapping(target = "issuedQty", source = "mclMaterialInfo.orderQty"),
            @Mapping(target = "balanceQty", source = "mclMaterialInfo.balanceQty"),
            @Mapping(target = "orderedUom", source = "mclMaterialInfo.mclMaterialUom")
    })
    MclOrderItemDto.OrderItem toOrderItemDto(MclMaterialInfo mclMaterialInfo, MclMaterialPurchaseOrder order);

    @Mappings({
            @Mapping(target = "mclMaterialPurchaseOrder", source = "order"),
            @Mapping(target = "commonMaterialType", source = "mclMaterialInfo.materialInfo.materialCategory"),
            @Mapping(target = "mclMaterialInfo", source = "mclMaterialInfo.id"),
            @Mapping(target = "materialType", source = "mclMaterialInfo.type"),
            @Mapping(target = "orderedUom", source = "mclMaterialInfo.mclMaterialUom"),
            @Mapping(target = "orderedAdjUom", source = "mclMaterialInfo.mclMaterialUom"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "mclMaterialPurchaseOrderDependencyItems", ignore = true),
            @Mapping(target = "mclMaterialPurchaseOrderStyles", ignore = true),
            @Mapping(target = "styleNumbers", ignore = true),
            @Mapping(target = "purchaseQty", ignore = true),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialPurchaseOrderItem toOrderItem(MclMaterialPurchaseOrder order, MclMaterialInfo mclMaterialInfo, User user);

    @Mappings({
            @Mapping(target = "styleNumber", source = "styleNumber"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialPurchaseOrderStyle toOrderStyle(BigInteger styleNumber, User user);

    @Mappings({
            @Mapping(target = "mclMaterialInfo", source = "materialInfo.id"),
            @Mapping(target = "mclMaterialType", source = "materialInfo.type"),
            @Mapping(target = "mclGarmentColor", source = "dependencyItemRequest.colorId"),
            @Mapping(target = "mclGarmentSize", source = "dependencyItemRequest.sizeId"),
            @Mapping(target = "mclGarmentMarket", source = "dependencyItemRequest.marketId"),
            @Mapping(target = "orderedQty", source = "dependencyItemRequest.purchaseQty"),
            @Mapping(target = "orderedUom", source = "dependencyItemRequest.orderedUomId"),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialPurchaseOrderDependencyItem toDependencyItem(MclOrderItemRequestDto.DependencyItemRequest dependencyItemRequest, MclMaterialInfo materialInfo, User user);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "color", source = "mclGarmentColor"),
            @Mapping(target = "market", source = "mclGarmentMarket"),
            @Mapping(target = "size", source = "mclGarmentSize"),
            @Mapping(target = "orderQty", source = "issuedQty"),
            @Mapping(target = "purchaseQty", source = "orderedQty"),
            @Mapping(target = "orderedUom", source = "orderedUom")
    })
    MclOrderItemDto.DependencyItem toDependencyItemDto(MclMaterialPurchaseOrderDependencyItem item);

    List<MclOrderItemDto.DependencyItem> toDependencyItemDto(List<MclMaterialPurchaseOrderDependencyItem> items);

    @Mappings({
            @Mapping(target = "mclMaterialInfo", source = "dependencyItem.mclMaterialInfo.id"),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialPurchaseOrderDependencyItemPublish toDependencyItemPublish(MclMaterialPurchaseOrderDependencyItem dependencyItem);

    @Mappings({
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialPurchaseOrderStylePublish toOrderStylePublish(MclMaterialPurchaseOrderStyle style);

    @Mappings({
            @Mapping(target = "mclMaterialInfo", source = "item.mclMaterialInfo.id"),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialPurchaseOrderItemPublish toOrderItemPublish(MclMaterialPurchaseOrderItem item);

    @Mappings({
            @Mapping(target = "mclMaterialPurchaseOrder", source = "mclMaterialPurchaseOrder"),
            @Mapping(target = "cbdCover", source = "mclMaterialPurchaseOrder.mclOption.mclCover.cbdCover"),
            @Mapping(target = "cbdBuyerName", source = "mclMaterialPurchaseOrder.mclOption.mclCover.cbdCover.buyer.name"),
            @Mapping(target = "cbdBrandName", source = "mclMaterialPurchaseOrder.mclOption.mclCover.cbdCover.vendorBrandId.name"),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialPurchaseOrderPublish toOrderPublish(MclMaterialPurchaseOrder mclMaterialPurchaseOrder);

    @Mapping(target = "id", source = "id")
    MclMaterialPurchaseOrderPublish toOrderPublish(Long id);

    @Mappings({
            @Mapping(target = "manufacture", source = "factory.name"),
            @Mapping(target = "pcdDate", source = "pcdDate"),
            @Mapping(target = "orderQuantity", ignore = true)
    })
    MclDocumentDto.MclHeader toMclDocumentHeader(MclOption mclOption);

    @Mappings({
            @Mapping(target = "usageSupplier", source = "mclMaterialInfo"),
            @Mapping(target = "itemName", source = "mclMaterialInfo"),
            @Mapping(target = "itemColorSize", source = "mclMaterialInfo"),
            @Mapping(target = "yardageYield", source = "mclMaterialInfo"),
            @Mapping(target = "qtyInfo", source = "mclMaterialInfo"),
            @Mapping(target = "uom", source = "mclMaterialUom.cmName3"),
            @Mapping(target = "dependency", source = "mclMaterialInfo"),
    })
    MclDocumentDto.MclDetail toMclDocumentDetail(MclMaterialInfo mclMaterialInfo);

    @Mappings({
            @Mapping(target = "usage", source = "usagePlace"),
            @Mapping(target = "supplierName", source = "supplier.name")
    })
    MclDocumentDto.MclDetail.UsageSupplier toUsageSupplierDto(MclMaterialInfo mclMaterialInfo);

    @Mappings({
            @Mapping(target = "color", source = "colorDependency"),
            @Mapping(target = "size", source = "sizeDependency"),
            @Mapping(target = "market", source = "marketDependency"),
    })
    MclDocumentDto.MclDetail.MclDependency toMclDependencyDto(MclMaterialInfo mclMaterialInfo);

    @Mappings({
            @Mapping(target = "category", source = "materialInfo.materialCategory"),
            @Mapping(target = "name", source = "materialInfo.name"),
            @Mapping(target = "materialNo", source = "supplierMaterial"),
    })
    MclDocumentDto.MclDetail.ItemName toItemNameDto(MclMaterialInfo mclMaterialInfo);

    @Mappings({
            @Mapping(target = "color", source = "fabricColorName"),
            @Mapping(target = "actualColor", source = "commonActualColor.cmName1"),
            @Mapping(target = "size", source = "materialOffer.size", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "sizeUom", source = "materialOffer.commonSubsidiarySizeUom.cmName1", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
    })
    MclDocumentDto.MclDetail.ItemColorSize toItemColorSizeDto(MclMaterialInfo mclMaterialInfo);

    @Mappings({
            @Mapping(target = "net", source = "netYy"),
            @Mapping(target = "loss", source = "tolerance"),
            @Mapping(target = "gross", source = "grossYy"),
    })
    MclDocumentDto.MclDetail.YardageYield toYardageYieldDto(MclMaterialInfo mclMaterialInfo);

    @Mappings({
            @Mapping(target = "requireQty", source = "requireQty"),
            @Mapping(target = "orderQty", source = "orderQty"),
            @Mapping(target = "balanceQty", source = "balanceQty"),
    })
    MclDocumentDto.MclDetail.QuantityInfo toQtyInfoDto(MclMaterialInfo mclMaterialInfo);

    @Mappings({
            @Mapping(target = "requiredTotalAmount", source = "mclMaterialInfos", qualifiedByName = "setRequiredTotalAmount"),
            @Mapping(target = "issuedTotalAmount", source = "mclMaterialInfos", qualifiedByName = "setIssuedTotalAmount")
    })
    MclOptionDto.MclAmount toMclAmount(MclOption mclOption);

    //Order Option
    @Mappings({
            @Mapping(target = "mclMaterialPurchaseOrder", source = "order"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "department", source = "user.deptId"),
            @Mapping(target = "company", source = "user.compId"),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialPurchaseOrderOption toPurchaseOrderOption(MclMaterialPurchaseOrder order, MclPurchaseOrderOptionRequest orderOptionRequest, User user);

    MclOrderDto.PurchaseOrderOption toPurchaseOrderOptionDto(MclMaterialPurchaseOrderOption orderOption);

    List<MclOrderDto.PurchaseOrderOption> toPurchaseOrderOptionDto(List<MclMaterialPurchaseOrderOption> orderOptions);

    @Mappings({
            @Mapping(target = "mclMaterialPurchaseOrderPublish", source = "orderPublish"),
            @Mapping(target = "name", source = "orderOption.name"),
            @Mapping(target = "type", source = "orderOption.type"),
            @Mapping(target = "value", source = "orderOption.value"),
            @Mapping(target = "user", source = "orderOption.user"),
            @Mapping(target = "department", source = "orderOption.department"),
            @Mapping(target = "company", source = "orderOption.company"),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialPurchaseOrderOptionPublish toPurchaseOrderOptionPublish(MclMaterialPurchaseOrderPublish orderPublish, MclMaterialPurchaseOrderOption orderOption);

    //Named
    @Named("localDateTime")
    static LocalDateTime localDatetime(String date) {
        if (date == null) {
            return null;
        }
        return LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd")).atTime(0,0);
    }

    @Named("localDate")
    static LocalDate localDate(String date) {
        if (date == null) {
            return null;
        }
        return LocalDate.parse(date);
    }

    @Named("localDateString")
    static String localDateString(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.toString();
    }

    @Named("setRequiredTotalAmount")
    static double setRequiredTotalAmount(List<MclMaterialInfo> mclMaterialInfos) {
        if (mclMaterialInfos.size() == 0) {
            return 0;
        }
        return FormattingUtil.withMathRound(mclMaterialInfos.stream().mapToDouble(MclMaterialInfo::getRequiredAmount).sum(),2);
    }

    @Named("setIssuedTotalAmount")
    static double setIssuedTotalAmount(List<MclMaterialInfo> mclMaterialInfos) {
        if (mclMaterialInfos.size() == 0) {
            return 0;
        }
        return FormattingUtil.withMathRound(mclMaterialInfos.stream().mapToDouble(MclMaterialInfo::getOrderAmount).sum(),2);
    }

    @Named("setMclMaterialInfoUom")
    static CommonBasicInfo setMclMaterialInfoUom(MaterialOffer materialOffer){
        CommonBasicInfo uom = null;
        if(!materialOffer.getMaterialInfo().getType().equals("fabric")){
            uom = materialOffer.getCommonUom();
        }
        return uom;
    }
}
