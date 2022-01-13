package io.vengine.api.v1.material.mapper;

import io.vengine.api.v1.cbd.dto.NewCbdMaterialInfoRequest;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.companyInfo.mapper.CompanyInfoEntityMapper;
import io.vengine.api.v1.companyInfo.mapper.CompanyInfoMapper;
import io.vengine.api.v1.etc.dto.excel.Accessories;
import io.vengine.api.v1.etc.dto.excel.Fabric;
import io.vengine.api.v1.etc.dto.excel.Trim;
import io.vengine.api.v1.material.dto.*;
import io.vengine.api.v1.material.entity.*;
import io.vengine.api.v1.mcl.dto.NewAdhocMaterialInfoRequest;
import io.vengine.api.v1.mcl.dto.NewMclMaterialInfoRequest;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL,
        uses = {CommonMapper.class, CompanyMapper.class, CompanyInfoMapper.class, CompanyInfoEntityMapper.class})
public interface MaterialMapper {
    MaterialMapper INSTANCE = Mappers.getMapper(MaterialMapper.class);

    @Mappings({
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "materialOffers", source = "materialOffers")
    })
    MaterialResponse toMaterialInfoResponse(MaterialInfo materialInfo);

    List<MaterialResponse> toMaterialInfoResponse(List<MaterialInfo> materialInfos);

    @Mappings({
            @Mapping(target = "category", source = "materialCategory"),
            @Mapping(target = "supplier", source = "supplierCompany"),
            @Mapping(target = "imagePath", source = "materialPic"),
            @Mapping(target = "fabricContents", source = "materialYarns"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user")
    })
    MaterialResponse.MaterialInfo toMaterialInfoDto(MaterialInfo materialInfo);

    @Mappings({
            @Mapping(target = "name", source = "materialInfoRequest.name"),
            @Mapping(target = "supplierCompany", source = "materialInfoRequest.supplierId"),
            @Mapping(target = "materialCategory", source = "materialInfoRequest.categoryId"),
            @Mapping(target = "type", source = "materialInfoRequest.type"),
            @Mapping(target = "subsidiaryDetail", source = "materialInfoRequest.subsidiaryDetail"),
            @Mapping(target = "constructionType", source = "materialInfoRequest.constructionType"),
            @Mapping(target = "yarnSizeWrap", source = "materialInfoRequest.yarnSizeWrap"),
            @Mapping(target = "yarnSizeWeft", source = "materialInfoRequest.yarnSizeWeft"),
            @Mapping(target = "constructionEpi", source = "materialInfoRequest.constructionEpi"),
            @Mapping(target = "constructionPpi", source = "materialInfoRequest.constructionPpi"),
            @Mapping(target = "shrinkagePlus", source = "materialInfoRequest.shrinkagePlus"),
            @Mapping(target = "shrinkageMinus", source = "materialInfoRequest.shrinkageMinus"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "materialPic", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialInfo toMaterialInfo(MaterialInfoRequest materialInfoRequest, String status, User user);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "supplierCompany", source = "request.supplierId"),
            @Mapping(target = "materialCategory", source = "request.categoryId"),
            @Mapping(target = "type", source = "request.type"),
            @Mapping(target = "subsidiaryDetail", source = "request.subsidiaryDetail"),
            @Mapping(target = "constructionType", source = "request.constructionType"),
            @Mapping(target = "yarnSizeWrap", source = "request.yarnSizeWrap"),
            @Mapping(target = "yarnSizeWeft", source = "request.yarnSizeWeft"),
            @Mapping(target = "constructionEpi", source = "request.constructionEpi"),
            @Mapping(target = "constructionPpi", source = "request.constructionPpi"),
            @Mapping(target = "shrinkagePlus", source = "request.shrinkagePlus"),
            @Mapping(target = "shrinkageMinus", source = "request.shrinkageMinus"),
            @Mapping(target = "usageType", source = "request.usageType"),
            @Mapping(target = "susEco", source = "request.susEco"),
            @Mapping(target = "application", source = "request.application"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "materialPic", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialInfo toMaterialInfo(NewAdhocMaterialInfoRequest request, String status, User user);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "supplierCompany", source = "request.supplierId"),
            @Mapping(target = "materialCategory", source = "request.categoryId"),
            @Mapping(target = "type", source = "type"),
            @Mapping(target = "subsidiaryDetail", source = "request.subsidiaryDetail"),
            @Mapping(target = "constructionType", source = "request.constructionType"),
            @Mapping(target = "yarnSizeWrap", source = "request.yarnSizeWrap"),
            @Mapping(target = "yarnSizeWeft", source = "request.yarnSizeWeft"),
            @Mapping(target = "constructionEpi", source = "request.constructionEpi"),
            @Mapping(target = "constructionPpi", source = "request.constructionPpi"),
            @Mapping(target = "shrinkagePlus", source = "request.shrinkagePlus"),
            @Mapping(target = "shrinkageMinus", source = "request.shrinkageMinus"),
            @Mapping(target = "usageType", source = "request.usageType"),
            @Mapping(target = "susEco", source = "request.susEco"),
            @Mapping(target = "application", source = "request.application"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "materialPic", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialInfo toMaterialInfo(String type, NewCbdMaterialInfoRequest request, String status, User user);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "supplierCompany", source = "request.supplierId"),
            @Mapping(target = "materialCategory", source = "request.categoryId"),
            @Mapping(target = "type", source = "type"),
            @Mapping(target = "subsidiaryDetail", source = "request.subsidiaryDetail"),
            @Mapping(target = "constructionType", source = "request.constructionType"),
            @Mapping(target = "yarnSizeWrap", source = "request.yarnSizeWrap"),
            @Mapping(target = "yarnSizeWeft", source = "request.yarnSizeWeft"),
            @Mapping(target = "constructionEpi", source = "request.constructionEpi"),
            @Mapping(target = "constructionPpi", source = "request.constructionPpi"),
            @Mapping(target = "shrinkagePlus", source = "request.shrinkagePlus"),
            @Mapping(target = "shrinkageMinus", source = "request.shrinkageMinus"),
            @Mapping(target = "usageType", source = "request.usageType"),
            @Mapping(target = "susEco", source = "request.susEco"),
            @Mapping(target = "application", source = "request.application"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "materialPic", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialInfo toMaterialInfo(String type, NewMclMaterialInfoRequest request, String status, User user);

    @Mappings({
            @Mapping(target = "name", source = "materialInfoRequest.name"),
            @Mapping(target = "supplierCompany", source = "materialInfoRequest.supplierId"),
            @Mapping(target = "materialCategory", source = "materialInfoRequest.categoryId"),
            @Mapping(target = "subsidiaryDetail", source = "materialInfoRequest.subsidiaryDetail"),
            @Mapping(target = "constructionType", source = "materialInfoRequest.constructionType"),
            @Mapping(target = "yarnSizeWrap", source = "materialInfoRequest.yarnSizeWrap"),
            @Mapping(target = "yarnSizeWeft", source = "materialInfoRequest.yarnSizeWeft"),
            @Mapping(target = "constructionEpi", source = "materialInfoRequest.constructionEpi"),
            @Mapping(target = "constructionPpi", source = "materialInfoRequest.constructionPpi"),
            @Mapping(target = "shrinkagePlus", source = "materialInfoRequest.shrinkagePlus"),
            @Mapping(target = "shrinkageMinus", source = "materialInfoRequest.shrinkageMinus"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "type", ignore = true),
            @Mapping(target = "materialPic", ignore = true),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toMaterialInfo(MaterialInfoRequest materialInfoRequest, User user, @MappingTarget MaterialInfo materialInfo);

    @Mappings({
            @Mapping(target = "name", source = "fabricMaterial.itemName"),
            @Mapping(target = "constructionType", source = "fabricMaterial.structure"),
            @Mapping(target = "supplierCompany", source = "supplier"),
            @Mapping(target = "materialCategory", source = "materialType"),
            @Mapping(target = "type", source = "type"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "materialPic", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialInfo toMaterialInfo(Company supplier, CommonMaterialType materialType, Fabric fabricMaterial, String type, String status, User user);

    @Mappings({
            @Mapping(target = "name", source = "trimMaterialExcel.itemName"),
            @Mapping(target = "subsidiaryDetail", source = "trimMaterialExcel.itemDetail"),
            @Mapping(target = "supplierCompany", source = "supplier"),
            @Mapping(target = "materialCategory", source = "materialType"),
            @Mapping(target = "type", source = "type"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "materialPic", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialInfo toMaterialInfo(Company supplier, CommonMaterialType materialType, Trim trimMaterialExcel, String type, String status, User user);

    @Mappings({
            @Mapping(target = "name", source = "accessoriesMaterialExcel.itemName"),
            @Mapping(target = "subsidiaryDetail", source = "accessoriesMaterialExcel.itemDetail"),
            @Mapping(target = "supplierCompany", source = "supplier"),
            @Mapping(target = "materialCategory", source = "materialType"),
            @Mapping(target = "type", source = "type"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "materialPic", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialInfo toMaterialInfo(Company supplier, CommonMaterialType materialType, Accessories accessoriesMaterialExcel, String type, String status, User user);

    @Mappings({
            @Mapping(target = "materialNo", source = "myMillarticle"),
            @Mapping(target = "brand", source = "vendorBrand"),
            @Mapping(target = "buyer", source = "buyerCompany"),
            @Mapping(target = "deputyCompany", source = "deputyCompany"),
            @Mapping(target = "mcq", source = "mcqQuantity"),
            @Mapping(target = "moq", source = "moqQuantity"),
            @Mapping(target = "uom", source = "commonUom"),
            @Mapping(target = "itemOption", source = "materialOffer"),
            @Mapping(target = "itemSizeOption", source = "materialOffer"),
            @Mapping(target = "seasonYear", source = "seasonYear"),
            @Mapping(target = "season", source = "season"),
            @Mapping(target = "fabricFullWidth", source = "fabricFullWidth"),
            @Mapping(target = "fullWidthUom", source = "commonFabricFullWeightUom"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "deputyUser")
    })
    MaterialResponse.MaterialOffer toMaterialOfferDto(MaterialOffer materialOffer);

    @Mappings({
            @Mapping(target = "dyeing", source = "materialAfterManufacturingDyeing"),
            @Mapping(target = "printing", source = "materialAfterManufacturingFashion"),
            @Mapping(target = "finishing", source = "materialAfterManufacturingFinishing"),
            @Mapping(target = "weight", source = "fabricWeight"),
            @Mapping(target = "weightUom", source = "commonFabricWeightUom"),
            @Mapping(target = "cw", source = "fabricCw"),
            @Mapping(target = "cwUom", source = "commonFabricCwUom"),
    })
    MaterialResponse.ItemOption toMaterialOfferItemOption(MaterialOffer materialOffer);

    @Mappings({
            @Mapping(target = "size", source = "size"),
            @Mapping(target = "sizeUom", source = "commonSubsidiarySizeUom")
    })
    MaterialResponse.ItemSizeOption toMaterialOfferItemSizeOption(MaterialOffer materialOffer);

    List<MaterialResponse.MaterialOffer> toMaterialOfferDto(List<MaterialOffer> materialOffers);

    @Mappings({
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "myMillarticle", source = "request.materialNo"),
            @Mapping(target = "unitPrice", source = "request.unitPrice"),
            @Mapping(target = "mcqQuantity", source = "request.mcq"),
            @Mapping(target = "moqQuantity", source = "request.moq"),
            @Mapping(target = "commonUom", source = "request.uomId"),
            @Mapping(target = "currency", source = "request.currencyId"),
            @Mapping(target = "vendorBrand", source = "request.brandId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "buyerCompany", source = "request.buyerId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "recipient", source = "request.recipientId",  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "materialAfterManufacturingDyeing", source = "request.dyeing"),
            @Mapping(target = "materialAfterManufacturingFashion", source = "request.printing"),
            @Mapping(target = "materialAfterManufacturingFinishing", source = "request.finishing"),
            @Mapping(target = "fabricWeight", source = "request.weight"),
            @Mapping(target = "commonFabricWeightUom", source = "request.weightUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricCw", source = "request.cw"),
            @Mapping(target = "commonFabricCwUom", source = "request.cwUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "size", source = "request.size"),
            @Mapping(target = "commonSubsidiarySizeUom", source = "request.sizeUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "seasonYear", source = "request.seasonYear"),
            @Mapping(target = "season", source = "request.seasonID", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricFullWidth", source = "request.fabricFullWidth"),
            @Mapping(target = "commonFabricFullWeightUom", source = "request.fullWidthUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialOffer toMaterialOffer(MaterialOfferRequest request, MaterialInfo materialInfo);

    @Mappings({
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "myMillarticle", source = "request.materialNo"),
            @Mapping(target = "unitPrice", source = "request.unitPrice"),
            @Mapping(target = "commonUom", source = "request.uomId"),
            @Mapping(target = "currency", source = "request.currencyId"),
            @Mapping(target = "recipient", source = "company",  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "materialAfterManufacturingDyeing", source = "request.dyeing"),
            @Mapping(target = "materialAfterManufacturingFashion", source = "request.printing"),
            @Mapping(target = "materialAfterManufacturingFinishing", source = "request.finishing"),
            @Mapping(target = "fabricWeight", source = "request.weight"),
            @Mapping(target = "commonFabricWeightUom", source = "request.weightUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricCw", source = "request.cw"),
            @Mapping(target = "commonFabricCwUom", source = "request.cwUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "size", source = "request.size"),
            @Mapping(target = "commonSubsidiarySizeUom", source = "request.sizeUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "characteristic", source = "request.characteristic"),
            @Mapping(target = "solidPattern", source = "request.solidPattern"),
            @Mapping(target = "function", source = "request.function"),
            @Mapping(target = "performance", source = "request.performance"),
            @Mapping(target = "stretch", source = "request.stretch"),
            @Mapping(target = "leadTime", source = "request.leadTime"),
            @Mapping(target = "seasonYear", source = "request.seasonYear"),
            @Mapping(target = "season", source = "request.seasonID", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricFullWidth", source = "request.fabricFullWidth"),
            @Mapping(target = "commonFabricFullWeightUom", source = "request.fullWidthUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "mcqQuantity", source = "request.mcq"),
            @Mapping(target = "moqQuantity", source = "request.moq"),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialOffer toMaterialOffer(NewAdhocMaterialInfoRequest request, MaterialInfo materialInfo, Company company);

    @Mappings({
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "myMillarticle", source = "request.materialNo"),
            @Mapping(target = "unitPrice", source = "request.unitPrice"),
            @Mapping(target = "mcqQuantity", source = "request.mcq"),
            @Mapping(target = "moqQuantity", source = "request.moq"),
            @Mapping(target = "commonUom", source = "request.uomId"),
            @Mapping(target = "currency", source = "currency"),
            @Mapping(target = "vendorBrand", source = "buyer"),
            @Mapping(target = "buyerCompany", source = "brand"),
            @Mapping(target = "recipient", source = "company"),
            @Mapping(target = "materialAfterManufacturingDyeing", source = "request.dyeing"),
            @Mapping(target = "materialAfterManufacturingFashion", source = "request.printing"),
            @Mapping(target = "materialAfterManufacturingFinishing", source = "request.finishing"),
            @Mapping(target = "fabricWeight", source = "request.weight"),
            @Mapping(target = "commonFabricWeightUom", source = "request.weightUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricCw", source = "request.cw"),
            @Mapping(target = "commonFabricCwUom", source = "request.cwUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "size", source = "request.size"),
            @Mapping(target = "characteristic", source = "request.characteristic"),
            @Mapping(target = "solidPattern", source = "request.solidPattern"),
            @Mapping(target = "function", source = "request.function"),
            @Mapping(target = "performance", source = "request.performance"),
            @Mapping(target = "stretch", source = "request.stretch"),
            @Mapping(target = "leadTime", source = "request.leadTime"),
            @Mapping(target = "commonSubsidiarySizeUom", source = "request.sizeUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "seasonYear", source = "request.seasonYear"),
            @Mapping(target = "season", source = "request.seasonID", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricFullWidth", source = "request.fabricFullWidth"),
            @Mapping(target = "commonFabricFullWeightUom", source = "request.fullWidthUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialOffer toMaterialOffer(NewCbdMaterialInfoRequest request, MaterialInfo materialInfo, Company buyer, Company brand, CommonBasicInfo currency, Company company);

    @Mappings({
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "myMillarticle", source = "request.materialNo"),
            @Mapping(target = "unitPrice", source = "request.unitPrice"),
            @Mapping(target = "mcqQuantity", source = "request.mcq"),
            @Mapping(target = "moqQuantity", source = "request.moq"),
            @Mapping(target = "commonUom", source = "request.uomId"),
            @Mapping(target = "currency", source = "currency"),
            @Mapping(target = "vendorBrand", source = "buyer"),
            @Mapping(target = "buyerCompany", source = "brand"),
            @Mapping(target = "recipient", source = "company"),
            @Mapping(target = "materialAfterManufacturingDyeing", source = "request.dyeing"),
            @Mapping(target = "materialAfterManufacturingFashion", source = "request.printing"),
            @Mapping(target = "materialAfterManufacturingFinishing", source = "request.finishing"),
            @Mapping(target = "fabricWeight", source = "request.weight"),
            @Mapping(target = "commonFabricWeightUom", source = "request.weightUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricCw", source = "request.cw"),
            @Mapping(target = "commonFabricCwUom", source = "request.cwUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "size", source = "request.size"),
            @Mapping(target = "commonSubsidiarySizeUom", source = "request.sizeUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "characteristic", source = "request.characteristic"),
            @Mapping(target = "solidPattern", source = "request.solidPattern"),
            @Mapping(target = "function", source = "request.function"),
            @Mapping(target = "performance", source = "request.performance"),
            @Mapping(target = "stretch", source = "request.stretch"),
            @Mapping(target = "leadTime", source = "request.leadTime"),
            @Mapping(target = "seasonYear", source = "request.seasonYear"),
            @Mapping(target = "season", source = "request.seasonID", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricFullWidth", source = "request.fabricFullWidth"),
            @Mapping(target = "commonFabricFullWeightUom", source = "request.fullWidthUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialOffer toMaterialOffer(NewMclMaterialInfoRequest request, MaterialInfo materialInfo, Company buyer, Company brand, CommonBasicInfo currency, Company company);

    @Mappings({
            @Mapping(target = "myMillarticle", source = "materialNo"),
            @Mapping(target = "unitPrice", source = "unitPrice"),
            @Mapping(target = "mcqQuantity", source = "mcq"),
            @Mapping(target = "moqQuantity", source = "moq"),
            @Mapping(target = "commonUom", source = "uomId"),
            @Mapping(target = "currency", source = "currencyId"),
            @Mapping(target = "vendorBrand", source = "brandId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "buyerCompany", source = "buyerId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "recipient", source = "recipientId"),
            @Mapping(target = "materialAfterManufacturingDyeing", source = "dyeing"),
            @Mapping(target = "materialAfterManufacturingFashion", source = "printing"),
            @Mapping(target = "materialAfterManufacturingFinishing", source = "finishing"),
            @Mapping(target = "fabricWeight", source = "weight"),
            @Mapping(target = "commonFabricWeightUom", source = "weightUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricCw", source = "cw"),
            @Mapping(target = "commonFabricCwUom", source = "cwUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "size", source = "size"),
            @Mapping(target = "commonSubsidiarySizeUom", source = "sizeUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "seasonYear", source = "seasonYear"),
            @Mapping(target = "season", source = "seasonID", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricFullWidth", source = "fabricFullWidth"),
            @Mapping(target = "commonFabricFullWeightUom", source = "fullWidthUomId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toMaterialOffer(MaterialOfferRequest materialOfferRequest, @MappingTarget MaterialOffer materialOffer);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "contents", source = "commonMaterialYarn"),
            @Mapping(target = "rate", source = "used")
    })
    MaterialResponse.MaterialYarn toMaterialYarnDto(MaterialYarn materialYarn);

    List<MaterialResponse.MaterialYarn> toMaterialYarnDto(List<MaterialYarn> materialYarns);

    @Mappings({
            @Mapping(target = "commonMaterialYarn", source = "contentsId"),
            @Mapping(target = "used", source = "rate"),
            @Mapping(target = "materialInfo", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toMaterialYarn(MaterialYarnRequest materialYarnRequest, @MappingTarget MaterialYarn materialYarn);

    @Mappings({
            @Mapping(target = "commonMaterialYarn", source = "materialYarnRequest.contentsId"),
            @Mapping(target = "used", source = "materialYarnRequest.rate"),
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "id", ignore = true)
    })
    MaterialYarn toMaterialYarn(MaterialYarnRequest materialYarnRequest, MaterialInfo materialInfo);

    @Mappings({
            @Mapping(target = "commonMaterialYarn", source = "commonMaterialYarn"),
            @Mapping(target = "used", source = "rate"),
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialYarn toMaterialYarn(CommonBasicInfo commonMaterialYarn, BigDecimal rate, MaterialInfo materialInfo);

    @Mapping(target = "id", source = "id")
    MaterialInfo toMaterialInfo(Long id);

    //Assigned Material Info
    @Mappings({
            @Mapping(target = "supplierCompany", source = "user.compId"),
            @Mapping(target = "parentMaterialInfo", source = "materialInfo.id"),
            @Mapping(target = "status", source = "materialInfo.status"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialInfo toAssignedMaterialInfo(MaterialInfo materialInfo, User user);

    //Assigned Material Offer
    @Mappings({
            @Mapping(target = "materialInfo", source = "copyMaterialInfo"),
            @Mapping(target = "originalMillarticleId", source = "materialOffer.id"),
            @Mapping(target = "unitPrice", source = "materialOffer.unitPrice"),
            @Mapping(target = "mcqQuantity", source = "materialOffer.mcqQuantity"),
            @Mapping(target = "moqQuantity", source = "materialOffer.moqQuantity"),
            @Mapping(target = "commonUom", source = "materialOffer.commonUom"),
            @Mapping(target = "currency", source = "materialOffer.currency"),
            @Mapping(target = "recipient", source = "company"),
            @Mapping(target = "materialAfterManufacturingDyeing", source = "materialOffer.materialAfterManufacturingDyeing"),
            @Mapping(target = "materialAfterManufacturingFashion", source = "materialOffer.materialAfterManufacturingFashion"),
            @Mapping(target = "materialAfterManufacturingFinishing", source = "materialOffer.materialAfterManufacturingFinishing"),
            @Mapping(target = "fabricWeight", source = "materialOffer.fabricWeight"),
            @Mapping(target = "commonFabricWeightUom", source = "materialOffer.commonFabricWeightUom", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricCw", source = "materialOffer.fabricCw"),
            @Mapping(target = "commonFabricCwUom", source = "materialOffer.commonFabricCwUom", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "size", source = "materialOffer.size"),
            @Mapping(target = "commonSubsidiarySizeUom", source = "materialOffer.commonSubsidiarySizeUom", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "cbdMaterialInfos", ignore = true),
            @Mapping(target = "mclMaterialInfos", ignore = true),
            @Mapping(target = "vendorBrand", ignore = true),
            @Mapping(target = "buyerCompany", ignore = true),
            @Mapping(target = "myMillarticle", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "useYN", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialOffer toMaterialOffer(MaterialOffer materialOffer, MaterialInfo copyMaterialInfo, Company company);

    @Mappings({
            @Mapping(target = "commonMaterialYarn", source = "materialYarn.commonMaterialYarn"),
            @Mapping(target = "used", source = "materialYarn.used"),
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialYarn toAssignedMaterialYarn(MaterialYarn materialYarn, MaterialInfo materialInfo);

    @Mappings({
            @Mapping(target = "materialInfo", source = "materialOffer.materialInfo"),
            @Mapping(target = "originalMillarticleId", source = "materialOffer.id"),
            @Mapping(target = "unitPrice", source = "unitPrice"),
            @Mapping(target = "mcqQuantity", source = "materialOffer.mcqQuantity"),
            @Mapping(target = "moqQuantity", source = "materialOffer.moqQuantity"),
            @Mapping(target = "commonUom", source = "commonUom"),
            @Mapping(target = "currency", source = "materialOffer.currency"),
            @Mapping(target = "recipient", source = "company"),
            @Mapping(target = "materialAfterManufacturingDyeing", source = "materialOffer.materialAfterManufacturingDyeing"),
            @Mapping(target = "materialAfterManufacturingFashion", source = "materialOffer.materialAfterManufacturingFashion"),
            @Mapping(target = "materialAfterManufacturingFinishing", source = "materialOffer.materialAfterManufacturingFinishing"),
            @Mapping(target = "fabricWeight", source = "materialOffer.fabricWeight"),
            @Mapping(target = "commonFabricWeightUom", source = "materialOffer.commonFabricWeightUom", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "fabricCw", source = "materialOffer.fabricCw"),
            @Mapping(target = "commonFabricCwUom", source = "materialOffer.commonFabricCwUom", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "size", source = "materialOffer.size"),
            @Mapping(target = "commonSubsidiarySizeUom", source = "materialOffer.commonSubsidiarySizeUom", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "cbdMaterialInfos", ignore = true),
            @Mapping(target = "mclMaterialInfos", ignore = true),
            @Mapping(target = "vendorBrand", ignore = true),
            @Mapping(target = "buyerCompany", ignore = true),
            @Mapping(target = "myMillarticle", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "useYN", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MaterialOffer toMaterialOffer(MaterialOffer materialOffer, CommonBasicInfo commonUom, BigDecimal unitPrice, Company company);
}
