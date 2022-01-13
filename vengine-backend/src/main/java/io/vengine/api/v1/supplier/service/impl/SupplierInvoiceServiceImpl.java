package io.vengine.api.v1.supplier.service.impl;

import io.vengine.api.common.filters.SupplierInvoiceSpecification;
import io.vengine.api.v1.supplier.dto.SupplierInvoiceRequest;
import io.vengine.api.v1.supplier.entity.SupplierInvoice;
import io.vengine.api.v1.supplier.repository.SupplierInvoiceRepository;
import io.vengine.api.v1.supplier.service.SupplierInvoiceService;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class SupplierInvoiceServiceImpl implements SupplierInvoiceService {

    @Autowired
    private SupplierInvoiceRepository supplierInvoiceRepository;

    @Override
    public Page<SupplierInvoice> findSupplierInvoice(int page, int size, String supplierName, Company company) {
        Specification<SupplierInvoice> invoiceSpecification = Specification.where(SupplierInvoiceSpecification.searchInvoiceByCompany(company));

        if(supplierName != null){
            invoiceSpecification = invoiceSpecification.and(SupplierInvoiceSpecification.searchInvoiceBySupplier(supplierName));
        }
        return supplierInvoiceRepository.findAll(invoiceSpecification, PageRequest.of((page == 0) ? 0 : (page - 1), size));
    }

    @Override
    public void deleteSupplierInvoice(Long id) {
        supplierInvoiceRepository.deleteById(id);
    }

    @Override
    public void saveSupplierInvoice(SupplierInvoiceRequest supplierInvoiceRequest, User user) {

    }
}
