package io.vengine.api.v1.supplier.service;

import io.vengine.api.v1.supplier.dto.SupplierInvoiceRequest;
import io.vengine.api.v1.supplier.entity.SupplierInvoice;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.domain.Page;

public interface SupplierInvoiceService {
    Page<SupplierInvoice> findSupplierInvoice(int page, int size, String supplierName, Company company);

    void deleteSupplierInvoice(Long id);

    void saveSupplierInvoice(SupplierInvoiceRequest supplierInvoiceRequest, User user);
}
