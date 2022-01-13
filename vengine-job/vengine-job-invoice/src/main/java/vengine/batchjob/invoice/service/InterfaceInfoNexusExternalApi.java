package vengine.batchjob.invoice.service;

import vengine.batchjob.invoice.dto.BuyerApiInfoDto;

public interface InterfaceInfoNexusExternalApi {
    void invoicePublished(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, InvoicePublishedTasklet invoicePublishedTasklet) throws Exception;

    void invoiceDrafted(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, InvoiceDraftedTasklet invoiceDraftedTasklet) throws Exception;

    void invoiceRejected(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, InvoiceRejectedTasklet invoiceRejectedTasklet) throws Exception;
}
