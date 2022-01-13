package vengine.batchjob.invoice.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vengine.batchjob.invoice.dto.InvoiceDto;
import vengine.batchjob.invoice.dto.OrderDto;
import vengine.batchjob.invoice.dto.OrderItemDto;
import vengine.batchjob.invoice.infornexus.model.InforNexusInvoiceAcknowledgementQ2;
import vengine.batchjob.invoice.infornexus.model.InforNexusInvoiceDetail;
import vengine.batchjob.invoice.infornexus.model.InforNexusPackingListDetail;
import vengine.batchjob.invoice.infornexus.model.InforNexusTask;
import vengine.batchjob.invoice.mapper.InvoiceMapper;
import vengine.batchjob.invoice.mapper.OrderMapper;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Slf4j
public class InterfaceService {
    @Autowired
    SqlSession sqlSession;

    @Autowired
    InvoiceMapper invoiceMapper;

    @Autowired
    OrderMapper orderMapper;

    public String findLatestPublishedDate(Long companyID) {
        return invoiceMapper.selectLatestPublishedDate(companyID);
    }

    public String findLatestDraftedDate(Long companyID) {
        return invoiceMapper.selectLatestDraftedDate(companyID);
    }

    public String findLatestRejectedDate(Long companyID) {
        return invoiceMapper.selectLatestRejectedDate(companyID);
    }

    @Transactional
    public void publishedInvoice(InforNexusTask.Result result, InforNexusInvoiceDetail inforNexusInvoiceDetail, InforNexusPackingListDetail inforNexusPackingListDetail, Long companyID) {
        Optional<InvoiceDto> invoiceDtoOptional = invoiceMapper.selectInvoiceByInvoiceUid(String.valueOf(inforNexusInvoiceDetail.getInvoiceUid()), companyID);

        if (invoiceDtoOptional.isPresent() && invoiceDtoOptional.get().getStatus() == "Finished") {
            log.info(inforNexusInvoiceDetail.getInvoiceUid() + " [ " + inforNexusInvoiceDetail.getInvoiceNumber() + " ] 이미 존재함.");
            return;
        }

        String documentRefNumber = inforNexusPackingListDetail.getShipmentItem().get(0).getPoNumber();

        List<OrderDto> orderDtos = orderMapper.selectByStatusAndOrderStatusCodeAndDocumentRefNumber("InProgress", "Accepted", documentRefNumber, companyID);

        if (orderDtos.isEmpty()) {
            orderDtos = orderMapper.selectByStatusAndOrderStatusCodeAndDocumentRefNumber("Finished", "Completed", documentRefNumber, companyID);
        }

        if (orderDtos.isEmpty()) {
            log.info(documentRefNumber + " po 가 없음.[ " + inforNexusInvoiceDetail.getInvoiceNumber() + " ]");
            return;
        }

        orderDtos.sort(Comparator.comparing(OrderDto::getUid).reversed());

        Map<String, String> shipment = new HashMap<>();
        List<InforNexusPackingListDetail.ShipmentItem> shipmentItems = inforNexusPackingListDetail.getShipmentItem();
        for (InforNexusPackingListDetail.ShipmentItem f1 : shipmentItems) {
            if (f1.getShipmentItem() != null) {
                for (InforNexusPackingListDetail.ShipmentItem f2 : f1.getShipmentItem()) {
                    StringBuffer key = new StringBuffer();
                    key.append(f2.getBaseItem().getItemDescriptor().getDescSellerSize());
                    key.append("-");
                    key.append(f2.getBaseItem().getPackageInstruction().getPackInstructionReference());
                    key.append("-");
                    key.append(f2.getBaseItem().getItemIdentifier().getSkuNumber());
                    shipment.put(key.toString(), f2.getBaseItem().getQuantity());
                }
            } else {
                StringBuffer key = new StringBuffer();
                key.append(f1.getBaseItem().getItemDescriptor().getDescSellerSize());
                key.append("-");
                key.append("null");
                key.append("-");
                key.append(f1.getBaseItem().getItemIdentifier().getSkuNumber());
                shipment.put(key.toString(), f1.getBaseItem().getQuantity());
            }
        }

        OrderDto orderDto = orderDtos.get(0);

        List<OrderItemDto> orderItemDtos = orderMapper.selectOrderItems(orderDto.getId(), companyID);
        AtomicInteger shipmentQuantity = new AtomicInteger();
        for (OrderItemDto item : orderItemDtos) {

            StringBuffer key = new StringBuffer();
            key.append(item.getSize());
            key.append("-");
            key.append(item.getPackInstructionReference());
            key.append("-");
            key.append(item.getSku());

            item.setPkQty(shipment.get(key.toString()));

            try {
                shipmentQuantity.getAndAdd(Integer.parseInt(item.getPkQty()));
            } catch (Exception e) {
            }
        }

        orderDto.setShipmentUrl(inforNexusPackingListDetail.getMetaData().getRedirectUrl());
        orderDto.setShipmentQuantity(shipmentQuantity.get());

        DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("[yyyy-MM-dd HH:mm:ss.SSS]" + "[yyyy-MM-dd HH:mm:ss.SS]"
                + "[yyyy-MM-dd HH:mm:ss.S]" + "[yyyy-MM-dd HH:mm:ss]" + "[yyyy-MM-dd'T'HH:mm:ss'Z']")
                .withZone(ZoneOffset.UTC);
        ZonedDateTime zdt = ZonedDateTime.from(dtf1.parse(inforNexusPackingListDetail.getMetaData().getModifyTimestamp()));

        DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZone(ZoneOffset.UTC);
        orderDto.setStatus("Finished");
        orderDto.setOrderStatusCode("Completed");
        orderDto.setFinishedOn(zdt.format(dtf2));

        orderMapper.updateOrderInfo(orderDto);

        InvoiceDto invoiceDto = invoiceDtoOptional.orElse(new InvoiceDto());
        invoiceDto.setCompanyID(companyID);
        invoiceDto.setBuyerOrderInfoId(orderDto.getId());
        invoiceDto.setInvoiceNumber(inforNexusInvoiceDetail.getInvoiceNumber());
        invoiceDto.setInvoiceUid(String.valueOf(inforNexusInvoiceDetail.getInvoiceUid()));
        invoiceDto.setInvoiceURL(inforNexusInvoiceDetail.getRedirectUrl());
        invoiceDto.setDraftedOn(result.getAssignedOn());
        invoiceDto.setPublishedOn(result.getCompletedOn());
        invoiceDto.setStatus("Published");
        invoiceDto.setTotalQuantity(inforNexusInvoiceDetail.getInvoiceTotals().getTotalQuantity());
        invoiceDto.setTotalMerchandiseAmount(inforNexusInvoiceDetail.getInvoiceTotals().getTotalMerchandiseAmount());
        invoiceDto.setTotalAllowanceChargeAmount(inforNexusInvoiceDetail.getInvoiceTotals().getTotalAllowanceChargeAmount());
        invoiceDto.setTotalTaxAmount(inforNexusInvoiceDetail.getInvoiceTotals().getTotalTaxAmount());
        invoiceDto.setTotalDocumentAmount(inforNexusInvoiceDetail.getInvoiceTotals().getTotalDocumentAmount());
        invoiceDto.setShipmentDocumentUid(inforNexusPackingListDetail.getPackingListNumber());
        invoiceDto.setShipmentURL(inforNexusPackingListDetail.getMetaData().getRedirectUrl());

        if(invoiceDto.getId() == null){
            invoiceMapper.insertInvoice(invoiceDto);
        }else{
            invoiceMapper.updateInvoice(invoiceDto);
        }

    }

    @Transactional
    public void draftedInvoice(InforNexusTask.Result result, InforNexusInvoiceDetail inforNexusInvoiceDetail, InforNexusPackingListDetail inforNexusPackingListDetail, Long companyID) {
        String documentRefNumber = inforNexusPackingListDetail.getShipmentItem().get(0).getPoNumber();

        Optional<InvoiceDto> invoiceDtoOptional = invoiceMapper.selectInvoiceByInvoiceUid(String.valueOf(inforNexusInvoiceDetail.getInvoiceUid()), companyID);

        if (invoiceDtoOptional.isPresent()) {
            log.info("이미 invoice uid 가 같은 데이터 존재. InvoiceUid : [ " + inforNexusInvoiceDetail.getInvoiceUid() + " ]");
            return;
        }

        List<OrderDto> orderDtos = orderMapper.selectByStatusAndOrderStatusCodeAndDocumentRefNumber("InProgress", "Accepted", documentRefNumber, companyID);

        if (orderDtos.isEmpty()) {
            return;
        }

        if (orderDtos.size() > 1) {
            throw new IllegalArgumentException("InProgress , Accepted 는 1개 이여야 하는데 " + orderDtos.size() + "이다.. [ " + documentRefNumber + " ]");
        }

        OrderDto entity = orderDtos.get(0);

        Map<String, String> shipment = new HashMap<>();

        List<InforNexusPackingListDetail.ShipmentItem> shipmentItems = inforNexusPackingListDetail.getShipmentItem();
        for (InforNexusPackingListDetail.ShipmentItem f1 : shipmentItems) {
            if (f1.getShipmentItem() != null) {
                for (InforNexusPackingListDetail.ShipmentItem f2 : f1.getShipmentItem()) {
                    StringBuffer key = new StringBuffer();
                    key.append(f2.getBaseItem().getItemDescriptor().getDescSellerSize());
                    key.append("-");
                    key.append(f2.getBaseItem().getPackageInstruction().getPackInstructionReference());
                    key.append("-");
                    key.append(f2.getBaseItem().getItemIdentifier().getSkuNumber());

                    shipment.put(key.toString(), f2.getBaseItem().getQuantity());
                }
            } else {
                StringBuffer key = new StringBuffer();
                key.append(f1.getBaseItem().getItemDescriptor().getDescSellerSize());
                key.append("-");
                key.append("null");
                key.append("-");
                key.append(f1.getBaseItem().getItemIdentifier().getSkuNumber());

                shipment.put(key.toString(), f1.getBaseItem().getQuantity());
            }
        }

        AtomicInteger shipmentQuantity = new AtomicInteger();
        List<OrderItemDto> orderItemDtos = orderMapper.selectOrderItems(entity.getId(), companyID);
        for (OrderItemDto item : orderItemDtos) {

            StringBuffer key = new StringBuffer();
            key.append(item.getSize());
            key.append("-");
            key.append(item.getPackInstructionReference());
            key.append("-");
            key.append(item.getSku());

            item.setPkQty(shipment.get(key.toString()));

            try {
                shipmentQuantity.getAndAdd(Integer.parseInt(item.getPkQty()));
            } catch (Exception e) {
            }

        }

        entity.setShipmentUrl(inforNexusPackingListDetail.getMetaData().getRedirectUrl());
        entity.setShipmentQuantity(shipmentQuantity.get());

        DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("[yyyy-MM-dd HH:mm:ss.SSS]" + "[yyyy-MM-dd HH:mm:ss.SS]"
                + "[yyyy-MM-dd HH:mm:ss.S]" + "[yyyy-MM-dd HH:mm:ss]" + "[yyyy-MM-dd'T'HH:mm:ss'Z']")
                .withZone(ZoneOffset.UTC);
        ZonedDateTime zdt = ZonedDateTime
                .from(dtf1.parse(inforNexusPackingListDetail.getMetaData().getModifyTimestamp()));

        DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZone(ZoneOffset.UTC);
        entity.setStatus("Finished");
        entity.setOrderStatusCode("Completed");
        entity.setFinishedOn(zdt.format(dtf2));

        orderMapper.updateOrderInfo(entity);

        InvoiceDto invoiceDto = new InvoiceDto();
        invoiceDto.setCompanyID(companyID);
        invoiceDto.setBuyerOrderInfoId(entity.getId());
        invoiceDto.setInvoiceNumber(inforNexusInvoiceDetail.getInvoiceNumber());
        invoiceDto.setInvoiceUid(String.valueOf(inforNexusInvoiceDetail.getInvoiceUid()));
        invoiceDto.setInvoiceURL(inforNexusInvoiceDetail.getRedirectUrl());
        invoiceDto.setDraftedOn(result.getAssignedOn());
        invoiceDto.setStatus("Drafted");
        invoiceDto.setTotalQuantity(inforNexusInvoiceDetail.getInvoiceTotals().getTotalQuantity());
        invoiceDto.setTotalMerchandiseAmount(inforNexusInvoiceDetail.getInvoiceTotals().getTotalMerchandiseAmount());
        invoiceDto.setTotalAllowanceChargeAmount(inforNexusInvoiceDetail.getInvoiceTotals().getTotalAllowanceChargeAmount());
        invoiceDto.setTotalTaxAmount(inforNexusInvoiceDetail.getInvoiceTotals().getTotalTaxAmount());
        invoiceDto.setTotalDocumentAmount(inforNexusInvoiceDetail.getInvoiceTotals().getTotalDocumentAmount());
        invoiceDto.setShipmentDocumentUid(inforNexusPackingListDetail.getPackingListNumber());
        invoiceDto.setShipmentURL(inforNexusPackingListDetail.getMetaData().getRedirectUrl());

        invoiceMapper.insertInvoice(invoiceDto);
    }

    @Transactional
    public void rejectedInvoice(InforNexusTask.Result result, InforNexusInvoiceAcknowledgementQ2 inforNexusInvoiceAcknowledgementQ2, Long companyID) {
        List<InvoiceDto> invoiceDtos = invoiceMapper.selectInvoiceByStatusAndInvoiceNumber("Published", inforNexusInvoiceAcknowledgementQ2.getInvoiceAcknowledgementId(), companyID);

        if (invoiceDtos.isEmpty()) {
            log.info("not exist : " + inforNexusInvoiceAcknowledgementQ2.getInvoiceAcknowledgementId() + " : " + result.getAssignedOn());
            return;
        }

        InvoiceDto invoiceDto = invoiceDtos.remove(0);

        if (!invoiceDtos.isEmpty()) {
            invoiceDtos.forEach(action -> {
                log.info("duplicate : " + action.getId() + " : " + inforNexusInvoiceAcknowledgementQ2.getInvoiceAcknowledgementId());
            });
        }

        invoiceDto.setStatus("Rejected");
        invoiceDto.setRejectedOn(result.getAssignedOn());
        invoiceDto.setRejectedReferenceDocumentUrl(inforNexusInvoiceAcknowledgementQ2.getMetaData().getRedirectUrl());
        invoiceDto.setRejectedReferenceDocumentType(inforNexusInvoiceAcknowledgementQ2.getReferenceDocumentType());
        invoiceDto.setRejectedReferenceDocumentId(inforNexusInvoiceAcknowledgementQ2.getReferenceDocumentId());
        invoiceDto.setRejectedReferenceDocumentNote(inforNexusInvoiceAcknowledgementQ2.getReferenceDocumentNote());

        invoiceMapper.rejectedInvoice(invoiceDto);
    }
}
