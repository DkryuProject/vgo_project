package io.vengine.api.v1.cbd.mapper;

import io.vengine.api.common.enums.Status;
import io.vengine.api.common.utils.FormattingUtil;
import io.vengine.api.v1.cbd.dto.CbdDocumentDto;
import io.vengine.api.v1.cbd.dto.CbdDto;
import io.vengine.api.v1.cbd.dto.NewCbdMaterialInfoRequest;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.cbd.entity.CBDMaterialCosting;
import io.vengine.api.v1.cbd.entity.CBDMaterialInfo;
import io.vengine.api.v1.cbd.entity.CBDOption;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.enums.CostingType;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.companyInfo.mapper.CompanyInfoEntityMapper;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL,
        uses = {CommonMapper.class, CompanyInfoEntityMapper.class, CompanyMapper.class, MaterialMapper.class})
public interface CBDMapper {
    CBDMapper INSTANCE = Mappers.getMapper(CBDMapper.class);

    @Mappings({
            @Mapping(target = "buyer", source = "request.companyId"),
            @Mapping(target = "vendorBrandId", source = "request.vendorBrandId"),
            @Mapping(target = "commonGenderId", source = "request.commonGenderId"),
            @Mapping(target = "materialCategoryId", source = "request.materialCategoryId"),
            @Mapping(target = "season", source = "request.seasonId"),
            @Mapping(target = "seasonYear", source = "request.seasonYear"),
            @Mapping(target = "orderType", source = "request.commonOrderTypeId"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "cbdImg", ignore = true),
            @Mapping(target = "cbdOptions", ignore = true),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toCover(CbdDto.CoverRequest request, User user, @MappingTarget CBDCover cbdCover);

    @Mappings({
            @Mapping(target = "companyCost", source = "request.companyCostId"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toCosting(CbdDto.CbdCostingRequest request, User user, @MappingTarget CBDMaterialCosting cbdMaterialCosting);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "finalCost",source = "request.finalCost"),
            @Mapping(target = "profitCost", source = "request.profitCost"),
            @Mapping(target = "goodsQuantity", source = "request.goodsQuantity"),
            @Mapping(target = "cbdCoverId", source = "request.cbdCoverId"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toOption(CbdDto.OptionRequest request, User user, @MappingTarget CBDOption cbdOption);

    @Mappings({
            @Mapping(target = "usagePlace", source = "request.usagePlace"),
            @Mapping(target = "netYy", source = "request.netYy"),
            @Mapping(target = "tolerance", source = "request.tolerance"),
            @Mapping(target = "cbdMaterialUom", source = "request.uomId"),
            @Mapping(target = "sizeMemo", source = "request.sizeMemo"),
            @Mapping(target = "unitPrice", source = "request.unitPrice"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toMaterial(CbdDto.CbdMaterialInfoRequest request, User user, @MappingTarget CBDMaterialInfo cbdMaterialInfo);

    @Mappings({
            @Mapping(target = "materialOffer", source = "materialOffer"),
            @Mapping(target = "supplierMaterial", source = "materialOffer.myMillarticle"),
            @Mapping(target = "cbdMaterialUom", ignore = true),
            @Mapping(target = "unitPrice", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toMaterial(MaterialOffer materialOffer, @MappingTarget CBDMaterialInfo cbdMaterialInfo);

    @Mappings({
            @Mapping(target = "coverId", source = "id"),
            @Mapping(target = "buyer", source = "buyer"),
            @Mapping(target = "brand", source = "vendorBrandId"),
            @Mapping(target = "gender", source = "commonGenderId"),
            @Mapping(target = "materialCategory", source = "materialCategoryId"),
            @Mapping(target = "garmentCategory", source = "commonGarmentCategoryId"),
            @Mapping(target = "imagPath", source = "cbdImg"),
            @Mapping(target = "commonCurrency", source = "commonCurrencyId"),
            @Mapping(target = "mclCover", source = "mclCover"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user"),
    })
    CbdDto.Cover toCoverDTO(CBDCover cbdCover);

    @Mappings({
            @Mapping(target = "cbdCostingId", source = "id"),
            @Mapping(target = "companyCost", source = "companyCost"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user"),
    })
    CbdDto.CbdCosting toCostingDTO(CBDMaterialCosting cbdMaterialCosting);

    @Mappings({
            @Mapping(target = "optionId", source = "id"),
            @Mapping(target = "targetProfit", source = "profitCost"),
            @Mapping(target = "profit", source = "cbdOption", qualifiedByName = "setCbdOptionProfit"),
            @Mapping(target = "itemPortion", source = "cbdOption"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user"),
    })
    CbdDto.Option toOptionDTO(CBDOption cbdOption);

    @Mappings({
            @Mapping(target = "cbdMaterialInfoId", source = "id"),
            @Mapping(target = "cbdOption", source = "cbdOption"),
            @Mapping(target = "type", source = "type"),
            @Mapping(target = "fabricWeight", source = "materialOffer.fabricWeight"),
            @Mapping(target = "fabricWeightUom", source = "materialOffer.commonFabricWeightUom"),
            @Mapping(target = "fabricCw", source = "materialOffer.fabricCw"),
            @Mapping(target = "fabricCwUom", source = "materialOffer.commonFabricCwUom"),
            @Mapping(target = "supplierMaterial", source = "supplierMaterial"),
            @Mapping(target = "unitPrice", source = "unitPrice"),
            @Mapping(target = "usagePlace", source = "usagePlace"),
            @Mapping(target = "netYy", source = "netYy"),
            @Mapping(target = "tolerance", source = "tolerance"),
            @Mapping(target = "grossYy", source = "grossYy"),
            @Mapping(target = "amount", source = "amount"),
            @Mapping(target = "cbdMaterialUom", source = "cbdMaterialUom"),
            @Mapping(target = "offerUom", source = "materialOffer.commonUom"),
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "materialAfterManufacturingDyeing", source = "materialOffer.materialAfterManufacturingDyeing"),
            @Mapping(target = "materialAfterManufacturingFashion", source = "materialOffer.materialAfterManufacturingFashion"),
            @Mapping(target = "materialAfterManufacturingFinishing", source = "materialOffer.materialAfterManufacturingFinishing"),
            @Mapping(target = "subsidiarySize", source = "materialOffer.size"),
            @Mapping(target = "subsidiarySizeUom", source = "materialOffer.commonSubsidiarySizeUom"),
            @Mapping(target = "characteristic", source = "materialOffer.characteristic"),
            @Mapping(target = "solidPattern", source = "materialOffer.solidPattern"),
            @Mapping(target = "function", source = "materialOffer.function"),
            @Mapping(target = "performance", source = "materialOffer.performance"),
            @Mapping(target = "stretch", source = "materialOffer.stretch"),
            @Mapping(target = "leadTime", source = "materialOffer.leadTime"),
            @Mapping(target = "subsidiaryDetail", source = "subsidiaryDetail"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user"),
    })
    CbdDto.CbdMaterialInfo toMaterialDTO(CBDMaterialInfo cbdMaterialInfo);

    @Mappings({
            @Mapping(target = "cbdOption", source = "cbdOption"),
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "materialOffer", source = "materialOffer"),
            @Mapping(target = "type", source = "materialInfo.type"),
            @Mapping(target = "subsidiaryDetail", source = "materialInfo.subsidiaryDetail"),
            @Mapping(target = "supplierMaterial", source = "materialOffer.myMillarticle"),
            @Mapping(target = "unitPrice", source = "materialOffer.unitPrice"),
            @Mapping(target = "cbdMaterialUom", source = "materialOffer", qualifiedByName = "setCbdMaterialInfoUom"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "mclMaterialInfos", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "useYN", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    CBDMaterialInfo toMaterial(CBDOption cbdOption, MaterialInfo materialInfo, MaterialOffer materialOffer, User user);

    @Mappings({
            @Mapping(target = "cbdOption", source = "cbdOption"),
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "materialOffer", source = "materialOffer"),
            @Mapping(target = "type", source = "materialInfo.type"),
            @Mapping(target = "subsidiaryDetail", source = "materialInfo.subsidiaryDetail"),
            @Mapping(target = "supplierMaterial", source = "materialOffer.myMillarticle"),
            @Mapping(target = "unitPrice", source = "materialOffer.unitPrice"),
            @Mapping(target = "usagePlace", source = "request.usagePlace"),
            @Mapping(target = "netYy", source = "request.netYy"),
            @Mapping(target = "tolerance", source = "request.tolerance"),
            @Mapping(target = "sizeMemo", source = "request.sizeMemo"),
            @Mapping(target = "cbdMaterialUom", source = "materialOffer", qualifiedByName = "setCbdMaterialInfoUom"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "mclMaterialInfos", ignore = true),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "useYN", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    CBDMaterialInfo toMaterial(NewCbdMaterialInfoRequest request, CBDOption cbdOption, MaterialInfo materialInfo, MaterialOffer materialOffer, User user);

    @Mapping(target = "id", source = "id")
    CBDOption toOption(Long id);

    @Mapping(target = "id", source = "id")
    CBDCover toCover(Long id);

    List<CbdDto.CbdCosting> toCostingDTO(List<CBDMaterialCosting> cbdMaterialCosting);

    List<CbdDto.Cover> toCoverDTO(List<CBDCover> cbdCover);

    List<CbdDto.Option> toOptionDTO(List<CBDOption> cbdOption);

    List<CbdDto.CbdMaterialInfo> toMaterialDTO(List<CBDMaterialInfo> materialInfoById);

    @Mappings({
            @Mapping(target = "orderQuantity", source = "goodsQuantity"),
            @Mapping(target = "finalCost", source = "finalCost"),
            @Mapping(target = "amount", source = "cbdOption", qualifiedByName = "setCbdOptionAmount"),
            @Mapping(target = "profit", source = "cbdOption", qualifiedByName = "setCbdOptionProfit")
    })
    CbdDocumentDto.CbdHeader toDocumentHeader(CBDOption cbdOption);

    @Mappings({
            @Mapping(target = "usage", source = "usagePlace"),
            @Mapping(target = "millNo", source = "cbdMaterialInfo.supplierMaterial"),
            @Mapping(target = "size", source = "cbdMaterialInfo.materialOffer", qualifiedByName = "setSize"),
            @Mapping(target = "uom", source = "cbdMaterialUom.cmName3"),
            @Mapping(target = "netYy", source = "netYy"),
            @Mapping(target = "loss", source = "tolerance"),
            @Mapping(target = "unitPrice", source = "unitPrice"),
            @Mapping(target = "grossYy", source = "grossYy"),
            @Mapping(target = "amount", source = "amount"),
            @Mapping(target = "portion", source = "portion"),
            @Mapping(target = "supplierName", source = "materialInfo.supplierCompany.name")
    })
    CbdDocumentDto.CbdDetail toDocumentDetail(CBDMaterialInfo cbdMaterialInfo);

    @Mappings({
            @Mapping(target = "usage", source = "companyCost.name")
    })
    CbdDocumentDto.CbdDetail toDocumentDetail(CBDMaterialCosting cbdMaterialCosting);

    @Mappings({
            @Mapping(target = "fabric", source = "cbdOption.cbdMaterialInfos", qualifiedByName = "setFabricProfit"),
            @Mapping(target = "trim", source = "cbdOption.cbdMaterialInfos", qualifiedByName = "setTrimProfit"),
            @Mapping(target = "accessories", source = "cbdOption.cbdMaterialInfos", qualifiedByName = "setAccessoriesProfit"),
            @Mapping(target = "direct", source = "cbdOption.cbdMaterialCostings", qualifiedByName = "setDirectCostingProfit"),
            @Mapping(target = "indirect", source = "cbdOption.cbdMaterialCostings", qualifiedByName = "setIndirectCostingProfit")
    })
    CbdDto.ItemPortion toItemPortion(CBDOption cbdOption);

    //CBD Option Copy
    @Mappings({
            @Mapping(target = "cbdCoverId", source = "cbdCover"),
            @Mapping(target = "name", source = "cbdOptionName"),
            @Mapping(target = "finalCost",source = "cbdOption.finalCost"),
            @Mapping(target = "profitCost", source = "targetProfit"),
            @Mapping(target = "goodsQuantity", source = "cbdOption.goodsQuantity"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "useYN", ignore = true),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    CBDOption toCopyOption(CBDCover cbdCover, CBDOption cbdOption, String cbdOptionName, double targetProfit, Status status, User user);

    @Mappings({
            @Mapping(target = "cbdOption", source = "copyCbdOption"),
            @Mapping(target = "type", source = "cbdMaterialInfo.type"),
            @Mapping(target = "supplierMaterial", source = "cbdMaterialInfo.supplierMaterial"),
            @Mapping(target = "materialInfo", source = "cbdMaterialInfo.materialInfo"),
            @Mapping(target = "subsidiaryDetail", source = "cbdMaterialInfo.subsidiaryDetail"),
            @Mapping(target = "usagePlace", source = "cbdMaterialInfo.usagePlace"),
            @Mapping(target = "netYy", source = "cbdMaterialInfo.netYy"),
            @Mapping(target = "unitPrice", source = "cbdMaterialInfo.unitPrice"),
            @Mapping(target = "tolerance", source = "cbdMaterialInfo.tolerance"),
            @Mapping(target = "cbdMaterialUom", source = "cbdMaterialInfo.cbdMaterialUom"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "useYN", ignore = true),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    CBDMaterialInfo toCopyMaterialInfo(CBDOption copyCbdOption, CBDMaterialInfo cbdMaterialInfo, User user);

    @Mappings({
            @Mapping(target = "cbdOptionId", source = "copyCbdOption"),
            @Mapping(target = "companyCost", source = "cbdMaterialCosting.companyCost"),
            @Mapping(target = "type", source = "cbdMaterialCosting.type"),
            @Mapping(target = "costValue", source = "cbdMaterialCosting.costValue"),
            @Mapping(target = "valueKind", source = "cbdMaterialCosting.valueKind"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    CBDMaterialCosting toCopyMaterialCosting(CBDOption copyCbdOption, CBDMaterialCosting cbdMaterialCosting, User user);

    @Named("setCbdOptionAmount")
    static double setCbdOptionAmount(CBDOption cbdOption){
        if(cbdOption.getFinalCost() == null || cbdOption.getGoodsQuantity() == 0){
            return 0;
        }
        return FormattingUtil.withMathRound(cbdOption.getFinalCost().doubleValue() * cbdOption.getGoodsQuantity(), 2);
    }

    @Named("setCbdOptionProfit")
    static double setCbdOptionProfit(CBDOption cbdOption){
        if(cbdOption.getGoodsQuantity() == 0 || cbdOption.getFinalCost() == null){
            return 0;
        }
        if(cbdOption.getFinalCost().doubleValue() == 0){
            return 0;
        }
        double materialAmountSum = cbdOption.getCbdMaterialInfos().stream()
                .mapToDouble(CBDMaterialInfo::getAmount).sum();
        double materialCostingAmountSum = cbdOption.getCbdMaterialCostings().stream().mapToDouble(CBDMaterialCosting::getAmount).sum();

        return FormattingUtil.withMathRound (
                (cbdOption.getFinalCost().doubleValue()-(materialAmountSum+materialCostingAmountSum))/cbdOption.getFinalCost().doubleValue()*100, 2);
    }

    @Named("setSize")
    static String setSize(MaterialOffer materialOffer){
        if(materialOffer == null){
            return null;
        }

        if(materialOffer.getFabricCw() == null){
            return null;
        }
        String uom = "";
        if(materialOffer.getCommonFabricCwUom() != null){
            uom = materialOffer.getCommonFabricCwUom().getCmName3() ;
        }
        return materialOffer.getFabricCw().doubleValue()+" "+uom;
    }

    @Named("setFabricProfit")
    static double setFabricProfit(List<CBDMaterialInfo> materialInfos){
        return FormattingUtil.withMathRound(
                materialInfos.stream().filter(item-> item.getType().equals("fabric")).mapToDouble(CBDMaterialInfo::getPortion).sum(), 3
        );
    }

    @Named("setTrimProfit")
    static double setTrimProfit(List<CBDMaterialInfo> materialInfos){
        return FormattingUtil.withMathRound(
                materialInfos.stream().filter(item-> item.getType().equals("trim")).mapToDouble(CBDMaterialInfo::getPortion).sum(), 3
        );
    }

    @Named("setAccessoriesProfit")
    static double setAccessoriesProfit(List<CBDMaterialInfo> materialInfos){
        return FormattingUtil.withMathRound(
                materialInfos.stream().filter(item-> item.getType().equals("accessories")).mapToDouble(CBDMaterialInfo::getPortion).sum(), 3
        );
    }

    @Named("setDirectCostingProfit")
    static double setDirectCostingProfit(List<CBDMaterialCosting> materialCostings){
        return FormattingUtil.withMathRound(
                materialCostings.stream().filter(item-> item.getType().equals(CostingType.direct)).mapToDouble(CBDMaterialCosting::getPortion).sum(), 3
        );
    }

    @Named("setIndirectCostingProfit")
    static double setIndirectCostingProfit(List<CBDMaterialCosting> materialCostings){
        return FormattingUtil.withMathRound(
                materialCostings.stream().filter(item-> item.getType().equals(CostingType.indirect)).mapToDouble(CBDMaterialCosting::getPortion).sum(), 3
        );
    }

    @Named("setCbdMaterialInfoUom")
    static CommonBasicInfo setCbdMaterialInfoUom(MaterialOffer materialOffer){
        CommonBasicInfo uom = null;
        if(!materialOffer.getMaterialInfo().getType().equals("fabric")){
            uom = materialOffer.getCommonUom();
        }
        return uom;
    }
}
