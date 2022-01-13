package io.vengine.api.v1.mcl.mapper;

import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.companyInfo.mapper.CompanyInfoEntityMapper;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.entity.MaterialOffer;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.mcl.dto.AdhocOrderDto;
import io.vengine.api.v1.mcl.dto.AdhocOrderRequestDto;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderItemPublish;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderPublish;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import io.vengine.api.v1.user.mapper.UserMapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {CommonMapper.class, CompanyMapper.class, CompanyInfoEntityMapper.class, MaterialMapper.class, UserMapper.class})
public interface AdhocOrderMapper {
    AdhocOrderMapper INSTANCE = Mappers.getMapper(AdhocOrderMapper.class);

    @Mappings({
            @Mapping(target = "materialPurchaseCompany", source = "user.compId"),
            @Mapping(target = "materialSellingCompany", source = "request.sellingCompanyID"),
            @Mapping(target = "materialSellingCompanyAddress", source = "request.sellingCompanyAddressID"),
            //@Mapping(target = "shipperCompany", source = "request.shipperCompanyID"),
            //@Mapping(target = "shipperCompanyAddress", source = "request.shipperCompanyAddressID"),
            @Mapping(target = "forwarder", source = "request.forwarderCompanyID", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "forwarderCompanyAddress", source = "request.forwardCompanyAddressID", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "consigneeCompany", source = "request.consigneeCompanyID"),
            @Mapping(target = "consigneeCompanyAddress", source = "request.consigneeCompanyAddressID"),
            @Mapping(target = "shipToCompany", source = "request.shipToCompanyID"),
            @Mapping(target = "shipToCompanyAddress", source = "request.shipToCompanyAddressID"),
            @Mapping(target = "incoterms", source = "request.incoterms"),
            @Mapping(target = "shippingMethod", source = "request.shippingMethod"),
            @Mapping(target = "paymentTerm", source = "request.paymentTerm"),
            @Mapping(target = "paymentBase", source = "request.paymentBase"),
            @Mapping(target = "paymentPeriod", source = "request.paymentPeriod"),
            @Mapping(target = "loadingBasicCountry", source = "request.loadingBasicCountry", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "loadingPort", source = "request.loadingPort", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "dischargeBasicCountry", source = "request.dischargeBasicCountry", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "dischargePort", source = "request.dischargePort", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "estimatedDate", source = "request.estimatedDate", qualifiedByName = "localDate"),
            @Mapping(target = "infactoryDate", source = "request.infactoryDate", qualifiedByName = "localDate"),
            @Mapping(target = "exMill", source = "request.exMill", qualifiedByName = "localDate"),
            @Mapping(target = "memo", source = "request.memo"),
            @Mapping(target = "partialShipment", source = "request.partialShipment"),
            @Mapping(target = "plusTolerance", source = "request.plusTolerance"),
            @Mapping(target = "minusTolerance", source = "request.minusTolerance"),
            @Mapping(target = "currency", source = "request.currency"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "transhipmentAllow", ignore = true),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toOrder(AdhocOrderRequestDto.OrderInfo request, User user, @MappingTarget MclMaterialAdhocPurchaseOrderPublish order);

    @Mappings({
            @Mapping(target = "fabricColorName", source = "orderItemInfo.color"),
            @Mapping(target = "commonActualColor", source = "orderItemInfo.actualColor", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "materialOffer", source = "materialOffer"),
            @Mapping(target = "unitPrice", source = "orderItemInfo.unitPrice"),
            @Mapping(target = "orderedQty", source = "orderItemInfo.orderedQty"),
            @Mapping(target = "orderedUom", source = "orderItemInfo.orderUomId"),
            @Mapping(target = "orderedAdjUom", source = "orderItemInfo.orderUomId"),
            @Mapping(target = "commonMaterialType",source = "materialInfo.materialCategory"),
            @Mapping(target = "materialType", source = "materialInfo.type"),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "department", ignore = true),
            @Mapping(target = "company", ignore = true),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    MclMaterialAdhocPurchaseOrderItemPublish toOrderItem(AdhocOrderRequestDto.OrderItemInfo orderItemInfo, MaterialInfo materialInfo, MaterialOffer materialOffer);


    @Mappings({
            @Mapping(target = "orderID", source = "id"),
            @Mapping(target = "poNumber", source = "materialPurchaseOrderNumber"),
            @Mapping(target = "status", source = "status"),
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
            @Mapping(target = "partialShipment", source = "partialShipment"),
            @Mapping(target = "plusTolerance", source = "plusTolerance"),
            @Mapping(target = "minusTolerance", source = "minusTolerance"),
            @Mapping(target = "poTerms", source = "terms"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "userInfo", source = "user")
    })
    AdhocOrderDto.AdhocOrder toAdhocOrderDto(MclMaterialAdhocPurchaseOrderPublish mclMaterialAdhocPurchaseOrderPublish);

    List<AdhocOrderDto.AdhocOrder> toAdhocOrderDto(List<MclMaterialAdhocPurchaseOrderPublish> mclMaterialAdhocPurchaseOrderPublishes);

    @Mappings({
            @Mapping(target = "adhocOrder", source = "mclMaterialAdhocPurchaseOrderPublish"),
            @Mapping(target = "adhocOrderItems", source = "mclMaterialAdhocPurchaseOrderPublish.mclMaterialAdhocPurchaseOrderItemPublishes")
    })
    AdhocOrderDto toAdhocOrderDetailDto(MclMaterialAdhocPurchaseOrderPublish mclMaterialAdhocPurchaseOrderPublish);

    @Mappings({
            @Mapping(target = "itemID", source = "id"),
            @Mapping(target = "usagePlace", source = "usagePlace"),
            @Mapping(target = "orderType", source = "companyOrderType"),
            @Mapping(target = "actualColor", source = "commonActualColor"),
            @Mapping(target = "color", source = "fabricColorName"),
            @Mapping(target = "materialInfo", source = "materialInfo"),
            @Mapping(target = "materialOffer", source = "materialOffer"),
            @Mapping(target = "unitPrice", source = "unitPrice"),
            @Mapping(target = "orderedQty", source = "orderedQty"),
            @Mapping(target = "orderedUom", source = "orderedUom")
    })
    AdhocOrderDto.AdhocOrderItem toAdhocOrderItemDto(MclMaterialAdhocPurchaseOrderItemPublish mclMaterialAdhocPurchaseOrderItemPublishe);

    List<AdhocOrderDto.AdhocOrderItem> toAdhocOrderItemDto(List<MclMaterialAdhocPurchaseOrderItemPublish> mclMaterialAdhocPurchaseOrderItemPublishes);
}
