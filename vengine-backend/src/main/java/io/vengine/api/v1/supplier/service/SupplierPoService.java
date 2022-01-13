package io.vengine.api.v1.supplier.service;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrder;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrderPublish;
import io.vengine.api.v1.supplier.dto.SupplierPoItemResponse;
import io.vengine.api.v1.supplier.dto.SupplierPoRequest;
import io.vengine.api.v1.supplier.dto.SupplierPoResponse;
import io.vengine.api.v1.supplier.entity.SupplierPoChecking;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface SupplierPoService {
    CommonDto.PageDto<Map<String, Object>> findSupplierOrder(String status, String searchKeyWord, int page, int size, Company compId);

    Optional<SupplierPoChecking> findByPublishOrder(MclMaterialPurchaseOrderPublish purchaseOrderPublish);

    void saveSupplierPoChecking(List<SupplierPoRequest> supplierPoRequests, User user);

    String findRevertMemo(MclMaterialPurchaseOrder item);

    CommonDto.PageDto<SupplierPoItemResponse> findSupplierPoMaterialItem(int page, int size, String supplierName, Company company);

    List<String> findSupplierPoDesignNumbers(String supplierName, Company company);

    List<String> findSupplierPoNumbers(String supplierName, Company compId);
}
