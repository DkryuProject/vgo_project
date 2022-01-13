package io.vengine.api.v1.buyer.mapper;

import io.vengine.api.v1.buyer.dto.*;
import io.vengine.api.v1.buyer.entity.BuyerApiInfo;
import io.vengine.api.v1.buyer.entity.BuyerOrderInfo;
import io.vengine.api.v1.buyer.entity.BuyerOrderItem;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {CommonMapper.class, CompanyMapper.class})
public interface BuyerOrderMapper {
    BuyerOrderMapper INSTANCE = Mappers.getMapper(BuyerOrderMapper.class);

    //ORDER
    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "poNumber", source = "documentRefNumber"),
            @Mapping(target = "buyer", source = "divisionName"),
            @Mapping(target = "items", source = "buyerOrderItems")
    })
    BuyerOrderDto toBuyerOrderDTO(BuyerOrderInfo buyerOrderInfo);

    List<BuyerOrderDto> toBuyerOrderDTO(List<BuyerOrderInfo> buyerOrderInfos);

    @Mapping(target = "id", source = "id")
    BuyerOrderInfo toOrder(Long id);

    //ORDER ITEM
    BuyerOrderItemDto toBuyerOrderItemDTO(BuyerOrderItem buyerOrderItem);

    List<BuyerOrderItemDto> toBuyerOrderItemDTO(List<BuyerOrderItem> buyerOrderItems);

    @Mapping(target = "id", source = "id")
    BuyerOrderItem toOrderItem(Long id);

    @Mappings({
            @Mapping(target = "buyerOrderID", source = "buyerOrderInfo.id"),
            @Mapping(target = "styleNumber", source = "styleNumber"),
            @Mapping(target = "color", source = "color"),
            @Mapping(target = "totalQty", source = "qty"),
            @Mapping(target = "unitPrice", source = "pricePerUnit"),
            @Mapping(target = "amount", source = "totalPrice")
    })
    GarmentPoDto.OrderSummary toOrderSummary(BuyerOrderItem buyerOrderItem);

    List<GarmentPoDto.OrderSummary> toOrderSummary(List<BuyerOrderItem> buyerOrderItems);

    @Mappings({
            @Mapping(target = "buyerOrderID", source = "id"),
            @Mapping(target = "documentRefNumber", source = "documentRefNumber"),
            @Mapping(target = "shippingWindow.start", source = "earliestDate"),
            @Mapping(target = "shippingWindow.end", source = "latestDate"),
            @Mapping(target = "market", source = "marketDesc"),
            @Mapping(target = "destination", source = "destinationCountry")
    })
    GarmentPoDto.OrderDetail toOrderDetail(BuyerOrderInfo buyerOrderInfo);

    List<GarmentPoDto.OrderDetail> toOrderDetail(List<BuyerOrderInfo> buyerOrderInfos);

    BuyerApiInfoResponse toBuyerApiResponse(BuyerApiInfo buyerApiInfo);

    List<BuyerApiInfoResponse> toBuyerApiResponse(List<BuyerApiInfo> buyerApiInfos);

    @Mappings({
            @Mapping(target = "company", source = "companyID"),
            @Mapping(target = "id", ignore = true)
    })
    BuyerApiInfo toBuyerApiInfo(BuyerApiInfoRequest buyerApiInfoRequest);

    @Mappings({
            @Mapping(target = "buyer", source = "buyer"),
            @Mapping(target = "brand", source = "brand"),
            @Mapping(target = "buildTypeCode", source = "programType"),
            @Mapping(target = "incotermCode", source = "orderExcel.incoterms"),
            @Mapping(target = "originCountry", source = "orderExcel.originCountry"),
            @Mapping(target = "destinationCountry", source = "orderExcel.destinationCountry"),
            @Mapping(target = "earliestDate", source = "orderExcel.start"),
            @Mapping(target = "latestDate", source = "orderExcel.end"),
            @Mapping(target = "documentRefNumber", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toBuyerOrder(OrderExcelDto orderExcel, String buyer, String brand, String programType, @MappingTarget BuyerOrderInfo buyerOrderInfo);

    @Mappings({
            @Mapping(target = "styleNumber", source = "style"),
            @Mapping(target = "pricePerUnit", source = "unitPrice"),
            @Mapping(target = "sku", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toBuyerOrderItem(OrderExcelDto orderExcel, @MappingTarget BuyerOrderItem orderItem);
}
