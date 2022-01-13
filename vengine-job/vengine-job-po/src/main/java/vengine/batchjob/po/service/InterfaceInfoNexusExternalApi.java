package vengine.batchjob.po.service;

import vengine.batchjob.po.dto.BuyerApiInfoDto;

public interface InterfaceInfoNexusExternalApi {
    void purchaseOrderCancelled(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, OrderCancelledTasklet orderCancelledTasklet) throws Exception;

    void purchaseOrderAccepted(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, OrderAcceptedTasklet orderAcceptedTasklet) throws Exception;

    void purchaseOrderAssigned(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, OrderAssignedTasklet orderAssignedTasklet) throws Exception;

    void invoicePublished(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, InvoicePublishedTasklet invoicePublishedTasklet) throws Exception;

    void invoiceDrafted(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, InvoiceDraftedTasklet invoiceDraftedTasklet) throws Exception;

    void invoiceRejected(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, InvoiceRejectedTasklet invoiceRejectedTasklet) throws Exception;
}
