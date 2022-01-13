package io.vengine.api.v1.supplier.mapper;

import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.mcl.mapper.MclMapper;
import io.vengine.api.v1.supplier.dto.SupplierInvoiceResponse;
import io.vengine.api.v1.supplier.entity.SupplierInvoice;
import io.vengine.api.v1.supplier.entity.SupplierInvoiceItemInfo;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {CommonMapper.class, CompanyMapper.class, MclMapper.class})
public interface SupplierInvoiceMapper {
    SupplierInvoiceMapper INSTANCE = Mappers.getMapper(SupplierInvoiceMapper.class);

    @Mappings({
            @Mapping(target = "supplier", source = "supplier.name"),
            @Mapping(target = "invoiceNo", source = "invoiceNo"),
            @Mapping(target = "amount", source = "supplierInvoiceItemInfos", qualifiedByName = "invoiceTotalAmount"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdBy", source = "user")
    })
    SupplierInvoiceResponse toInvoiceResponse(SupplierInvoice supplierInvoice);

    List<SupplierInvoiceResponse> toInvoiceResponse(List<SupplierInvoice> supplierInvoices);

    @Named("invoiceTotalAmount")
    static double setInvoiceTotalAmount(List<SupplierInvoiceItemInfo> supplierInvoiceItemInfos) {
        if (supplierInvoiceItemInfos.size() == 0) {
            return 0;
        }
        return supplierInvoiceItemInfos.stream().mapToDouble(i-> i.getTotalAmount().doubleValue()).sum();
    }
}
