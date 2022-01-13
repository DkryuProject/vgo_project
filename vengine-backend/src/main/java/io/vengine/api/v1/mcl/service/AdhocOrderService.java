package io.vengine.api.v1.mcl.service;

import io.vengine.api.v1.mcl.dto.AdhocOrderRequestDto;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderPublish;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.domain.Page;

public interface AdhocOrderService {
    void saveAdhocPurchaseOrder(AdhocOrderRequestDto request, User user);

    Page<MclMaterialAdhocPurchaseOrderPublish> findAdhocOrder(String searchKeyWord, String status, int page, int size, Company company);

    MclMaterialAdhocPurchaseOrderPublish findAdhocOrderById(Long orderId);

    void saveRePurchaseOrder(MclMaterialAdhocPurchaseOrderPublish mclMaterialAdhocPurchaseOrderPublish, AdhocOrderRequestDto request, User user);
}
