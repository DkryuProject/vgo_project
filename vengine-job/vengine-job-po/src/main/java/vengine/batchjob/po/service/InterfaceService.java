package vengine.batchjob.po.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vengine.batchjob.po.dto.*;
import vengine.batchjob.po.infornexus.InforNexusConverter;
import vengine.batchjob.po.infornexus.model.*;
import vengine.batchjob.po.mapper.InvoiceMapper;
import vengine.batchjob.po.mapper.OrderMapper;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Slf4j
public class InterfaceService {
    @Autowired
    InvoiceMapper invoiceMapper;

    @Autowired
    OrderMapper orderMapper;

    @Transactional
    public void cancelledPurchaseOrder(InforNexusTask.Result result, InforNexusOrderDetail inforNexusOrderDetail, Long companyID) {
        //OrderDto orderDto = orderMapper.selectPurchaseOrderByUid(String.valueOf(result.getUid()));
        OrderDto orderDto = orderMapper.selectPurchaseOrderByDocumentId(String.valueOf(result.getDocumentId()), companyID);

        if (orderDto == null) {
            orderDto = InforNexusConverter.transferTo(result, inforNexusOrderDetail, companyID);
            if (orderDto == null) {
                return;
            }
        }

        orderDto.setStatus("Finished");
        orderDto.setOrderStatusCode("Cancelled");
        orderDto.setCancelledOn(result.getCancelledOn());

        if (orderDto.getAssignedOn() == null) {
            orderDto.setAssignedOn(result.getAssignedOn());
        }

        if(orderDto.getId() != null){
            orderMapper.cancelledPurchaseOrder(orderDto);
        }else{
            insertOrder(orderDto, companyID);
        }
    }

    @Transactional
    public void acceptedPurchaseOrder(InforNexusTask.Result result, InforNexusOrderDetail inforNexusOrderDetail, Long companyID) {
        //OrderDto orderDto = orderMapper.selectPurchaseOrderByUid(String.valueOf(result.getUid()));
        OrderDto orderDto = orderMapper.selectPurchaseOrderByDocumentId(String.valueOf(result.getDocumentId()), companyID);

        if (orderDto == null) {
            orderDto = InforNexusConverter.transferTo(result, inforNexusOrderDetail, companyID);
            if (orderDto == null) {
                return;
            }
        }else{
            updateOrderChangeDescription(orderDto, inforNexusOrderDetail.getChangeDescriptions());
            updateOrderParty(orderDto, inforNexusOrderDetail.getParty(), companyID);
            updateOrderItem(orderDto, inforNexusOrderDetail, companyID);
            updateOrder(result, inforNexusOrderDetail, orderDto);
        }

        orderDto.setStatus("InProgress");
        orderDto.setOrderStatusCode("Accepted");
        orderDto.setAcceptedOn(result.getCompletedOn());

        if (orderDto.getAssignedOn() == null) {
            orderDto.setAssignedOn(result.getAssignedOn());
        }

        if(orderDto.getId() != null){
            orderMapper.acceptedPurchaseOrder(orderDto);
        }else{
            insertOrder(orderDto, companyID);
        }
    }

    @Transactional
    public void acceptedPurchaseOrderAmendment(InforNexusTask.Result result, InforNexusOrderDetail inforNexusOrderDetail, Long companyID) {
        List<OrderDto> orderDtos = new ArrayList<>();

        orderDtos.addAll(orderMapper.selectByStatusAndOrderStatusCodeAndDocumentRefNumber("InProgress", "Accepted", result.getDocumentRefNumber(), companyID));
        orderDtos.addAll(orderMapper.selectByStatusAndOrderStatusCodeAndDocumentRefNumber("Finished", "Completed", result.getDocumentRefNumber(), companyID));

        orderDtos.forEach(orderDto -> {
            orderDto.setStatus("Finished");
            orderDto.setOrderStatusCode("Suspended");
            orderDto.setSuspendedOn(result.getAssignedOn());
            if (orderDto.getAssignedOn() == null) {
                orderDto.setAssignedOn(result.getAssignedOn());
            }
            orderMapper.acceptedPurchaseOrderAmendment(orderDto);
        });

        acceptedPurchaseOrder(result, inforNexusOrderDetail, companyID);
    }

    @Transactional
    public void assignedPurchaseOrder(InforNexusTask.Result result, InforNexusOrderDetail inforNexusOrderDetail, Long companyID) {
        //OrderDto orderDto = orderMapper.selectPurchaseOrderByUid(String.valueOf(result.getUid()));
        OrderDto orderDto = orderMapper.selectPurchaseOrderByDocumentId(String.valueOf(result.getDocumentId()), companyID);

        if (orderDto == null) {
            orderDto = InforNexusConverter.transferTo(result, inforNexusOrderDetail, companyID);
            if (orderDto == null) {
                return;
            }
        }else{
            updateOrderChangeDescription(orderDto, inforNexusOrderDetail.getChangeDescriptions());
            updateOrderParty(orderDto, inforNexusOrderDetail.getParty(), companyID);
            updateOrderItem(orderDto, inforNexusOrderDetail, companyID);
            updateOrder(result, inforNexusOrderDetail, orderDto);
        }

        List<OrderDto> orderDtos = orderMapper
                .selectByStatusAndOrderStatusCodeAndDocumentRefNumber("Issued", "New", orderDto.getDocumentRefNumber(), companyID);

        orderDtos.forEach(buyerOrderInfo -> {
            buyerOrderInfo.setStatus("Finished");
            buyerOrderInfo.setOrderStatusCode("Cancelled");
            buyerOrderInfo.setCancelledOn("0000-00-00T00:00:00Z");
            orderMapper.cancelledPurchaseOrder(buyerOrderInfo);
        });

        orderDto.setStatus("Issued");
        orderDto.setOrderStatusCode("New");
        orderDto.setCancelledOn(null);

        if (orderDto.getAssignedOn() == null) {
            orderDto.setAssignedOn(result.getAssignedOn());
        }

        if(orderDto.getId() != null){
            orderMapper.cancelledPurchaseOrder(orderDto);
        }else{
            insertOrder(orderDto, companyID);
        }
    }

    private void updateOrder(InforNexusTask.Result result, InforNexusOrderDetail inforNexusOrderDetail, OrderDto orderDto) {
        orderMapper.updatePurchaseOrder(InforNexusConverter.transferTo(result, inforNexusOrderDetail, orderDto));
    }

    private void updateOrderItem(OrderDto orderDto, InforNexusOrderDetail inforNexusOrderDetail, Long companyID) {
        if(inforNexusOrderDetail.getItems() != null){
            for(InforNexusOrderDetail.OrderItem item: inforNexusOrderDetail.getItems()){
                String itemStatus = item.getBaseItem().getReference().getItemStatus();
                if (itemStatus != null && !itemStatus.toLowerCase().equals("open")) {
                    OrderItemDto orderItemDto = orderMapper.searchItemByItemUid(item.getBaseItem().getItemUid(), companyID);
                    if(orderItemDto == null){
                        orderItemDto = new OrderItemDto();
                        InforNexusConverter.transferTo(orderDto, item, orderItemDto, inforNexusOrderDetail);
                        orderItemDto.setCompanyID(companyID);
                        orderMapper.insertOrderItem(orderItemDto);
                    }else{
                        InforNexusConverter.transferTo(orderDto, item, orderItemDto, inforNexusOrderDetail);
                        orderMapper.updateOrderItem(orderItemDto);
                    }
                }
            }
        }
    }

    private void updateOrderParty(OrderDto orderDto, InforNexusOrderDetail.Party party, Long companyID) {
        orderMapper.deleteOrderParty(orderDto.getId());

        if (party.getAdditionalParty() == null || party.getAdditionalParty().get(0) == null) {
            orderMapper.insertOrderParty(InforNexusConverter.transferTo(orderDto, null, "Purchaser", companyID));
        } else {
            orderMapper.insertOrderParty(InforNexusConverter.transferTo(orderDto, party.getAdditionalParty().get(0), "Purchaser", companyID));
        }

        if (party.getSeller() == null || party.getSeller().get(0) == null) {
            orderMapper.insertOrderParty(InforNexusConverter.transferTo(orderDto, null, "Vendor", companyID));
        } else {
            orderMapper.insertOrderParty(InforNexusConverter.transferTo(orderDto, party.getSeller().get(0), "Vendor", companyID));
        }

        if (party.getOriginOfGoods() == null || party.getOriginOfGoods().get(0) == null) {
            orderMapper.insertOrderParty(InforNexusConverter.transferTo(orderDto, null, "Factory", companyID));
        } else {
            orderMapper.insertOrderParty(InforNexusConverter.transferTo(orderDto, party.getOriginOfGoods().get(0), "Factory", companyID));
        }

        if (party.getShipmentDestination() == null || party.getShipmentDestination().get(0) == null) {
            orderMapper.insertOrderParty(InforNexusConverter.transferTo(orderDto, null, "ShipTo", companyID));
        } else {
            orderMapper.insertOrderParty(InforNexusConverter.transferTo(orderDto, party.getShipmentDestination().get(0), "ShipTo", companyID));
        }
    }

    private void updateOrderChangeDescription(OrderDto orderDto, List<InforNexusOrderDetail.ChangeDescription> changeDescriptions) {
        orderMapper.deleteOrderChangeDescription(orderDto.getId());

        if (changeDescriptions != null) {
            OrderDto finalOrderDto = orderDto;
            changeDescriptions.forEach(changeDescription -> {
                if (changeDescription.getText() != null) {
                    int length = changeDescription.getText().length();
                    if (length > 500) {
                        length = 500;
                    }

                    OrderChangeDescriptionDto orderChangeDescriptionDto = new OrderChangeDescriptionDto();
                    orderChangeDescriptionDto.setText(changeDescription.getText().substring(0, length));
                    orderChangeDescriptionDto.setBuyerOrderInfoId(finalOrderDto.getId());
                    orderMapper.insertOrderChangeDescription(orderChangeDescriptionDto);
                }
            });
        }
    }

    private void insertOrder(OrderDto orderDto, Long companyID) {
        orderMapper.insertPurchaseOrder(orderDto);

        for(OrderChangeDescriptionDto orderChangeDescriptionDto : orderDto.getOrderChangeDescriptionDtos()){
            orderChangeDescriptionDto.setBuyerOrderInfoId(orderDto.getId());
            orderMapper.insertOrderChangeDescription(orderChangeDescriptionDto);
        }

        for(OrderPartyDto orderPartyDto : orderDto.getOrderPartyDtos()){
            orderPartyDto.setCompanyID(companyID);
            orderPartyDto.setBuyerOrderInfoId(orderDto.getId());
            orderMapper.insertOrderParty(orderPartyDto);
        }

        for(OrderItemDto orderItemDto : orderDto.getOrderItemDtos()){
            orderItemDto.setCompanyID(companyID);
            orderItemDto.setBuyerOrderInfoId(orderDto.getId());
            orderMapper.insertOrderItem(orderItemDto);
        }
    }

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
