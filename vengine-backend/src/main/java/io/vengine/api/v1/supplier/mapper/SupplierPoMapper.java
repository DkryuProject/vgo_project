package io.vengine.api.v1.supplier.mapper;

import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderPublish;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderPublish;
import io.vengine.api.v1.mcl.mapper.MclMapper;
import io.vengine.api.v1.supplier.dto.SupplierPoRequest;
import io.vengine.api.v1.supplier.dto.SupplierPoResponse;
import io.vengine.api.v1.supplier.entity.SupplierAdhocPoChecking;
import io.vengine.api.v1.supplier.entity.SupplierPoChecking;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {CommonMapper.class, CompanyMapper.class, MclMapper.class})
public interface SupplierPoMapper {
    SupplierPoMapper INSTANCE = Mappers.getMapper(SupplierPoMapper.class);

    @Mappings({
            @Mapping(target = "mclMaterialPurchaseOrderPublish", source = "mclMaterialPurchaseOrderPublish.id"),
            @Mapping(target = "poConfirm", source = "supplierPoRequest.poConfirm"),
            @Mapping(target = "revertMemo", source = "supplierPoRequest.revertMemo"),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    SupplierPoChecking toSupplierPoChecking(SupplierPoRequest supplierPoRequest,
                                            MclMaterialPurchaseOrderPublish mclMaterialPurchaseOrderPublish,
                                            User user);

    @Mappings({
            @Mapping(target = "mclMaterialAdhocPurchaseOrderPublish", source = "mclMaterialAdhocPurchaseOrderPublish"),
            @Mapping(target = "poConfirm", source = "supplierPoRequest.poConfirm"),
            @Mapping(target = "revertMemo", source = "supplierPoRequest.revertMemo"),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    SupplierAdhocPoChecking toSupplierAdhocPoChecking(SupplierPoRequest supplierPoRequest, MclMaterialAdhocPurchaseOrderPublish mclMaterialAdhocPurchaseOrderPublish, User user);
}
