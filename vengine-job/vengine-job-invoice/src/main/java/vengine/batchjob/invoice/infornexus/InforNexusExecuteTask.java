package vengine.batchjob.invoice.infornexus;

import lombok.extern.slf4j.Slf4j;
import vengine.batchjob.invoice.dto.BuyerApiInfoDto;
import vengine.batchjob.invoice.infornexus.model.InforNexusInvoiceAcknowledgementQ2;
import vengine.batchjob.invoice.infornexus.model.InforNexusInvoiceDetail;
import vengine.batchjob.invoice.infornexus.model.InforNexusPackingListDetail;
import vengine.batchjob.invoice.infornexus.model.InforNexusTask;
import vengine.batchjob.invoice.service.InterfaceInfoNexusExternalApi;
import vengine.batchjob.invoice.service.InvoiceDraftedTasklet;
import vengine.batchjob.invoice.service.InvoicePublishedTasklet;
import vengine.batchjob.invoice.service.InvoiceRejectedTasklet;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
public class InforNexusExecuteTask implements InterfaceInfoNexusExternalApi {

    @Override
    public void invoicePublished(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, InvoicePublishedTasklet invoicePublishedTasklet) throws Exception {
        InforNexusClient inforNexusClient = new InforNexusClient(buyerApiInfoDto);

        List<InforNexusTask.Result> results = inforNexusClient.taskInvoice(latestDateTimeUTC, InforNexusClient.Status.Completed);

        AtomicBoolean skip = new AtomicBoolean(false);

        results.stream().forEach(result -> {

            if (skip.get()) {
                return;
            }

            try {
                Optional<InforNexusInvoiceDetail> inforNexusInvoiceDetailoptional = inforNexusClient
                        .executeInvoiceDetail(result.getUid(), result.getStatus(), result.getDocumentId());

                if (!inforNexusInvoiceDetailoptional.isPresent()) {
                    return;
                }

                Long shipmentDocumentId = inforNexusInvoiceDetailoptional.get().getShipmentDocumentReferences().get(0)
                        .getUid();

                Optional<InforNexusPackingListDetail> inforNexusPackingListDetailOptional = inforNexusClient
                        .executePackingListDetail(result.getDocumentId(), result.getStatus(), shipmentDocumentId);

                if (!inforNexusPackingListDetailOptional.isPresent()) {
                    return;
                }

                invoicePublishedTasklet.publishedInvoiceCallBack(result, inforNexusInvoiceDetailoptional.get(),
                        inforNexusPackingListDetailOptional.get(), buyerApiInfoDto.getCompany());

            } catch (Exception e) {
                {
                    String f = String.format("%10s, %25s, %25s, %10s, %20s, %15s, %-25s, %-20s, %15s", result.getUid(),
                            result.getDocumentType(), result.getObjectType(), result.getRole(),
                            result.getBusinessAction(), result.getStatus(), result.getMetaData().getModifyTimestamp(),
                            result.getDocumentRefNumber(), result.getDocumentId());
                    System.out.println(f);
                }
                e.printStackTrace();

                skip.set(true);
            }
        });
    }

    @Override
    public void invoiceDrafted(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, InvoiceDraftedTasklet invoiceDraftedTasklet) throws Exception {
        InforNexusClient inforNexusClient = new InforNexusClient(buyerApiInfoDto);

        List<InforNexusTask.Result> results = inforNexusClient.taskInvoice(latestDateTimeUTC, InforNexusClient.Status.Assigned);

        AtomicBoolean skip = new AtomicBoolean(false);

        results.stream().forEach(result -> {

            if (skip.get()) {
                return;
            }

            try {
                Optional<InforNexusInvoiceDetail> inforNexusInvoiceDetailoptional = inforNexusClient
                        .executeInvoiceDetail(result.getUid(), result.getStatus(), result.getDocumentId());

                if (!inforNexusInvoiceDetailoptional.isPresent()) {
                    return;
                }

                Long shipmentDocumentId = inforNexusInvoiceDetailoptional.get().getShipmentDocumentReferences().get(0).getUid();

                Optional<InforNexusPackingListDetail> inforNexusPackingListDetailOptional = inforNexusClient.executePackingListDetail(result.getDocumentId(), result.getStatus(), shipmentDocumentId);

                if (!inforNexusPackingListDetailOptional.isPresent()) {
                    return;
                }

                invoiceDraftedTasklet.assignedInvoiceCallBack(result, inforNexusInvoiceDetailoptional.get(), inforNexusPackingListDetailOptional.get(), buyerApiInfoDto.getCompany());

            } catch (Exception e) {
                {
                    String f = String.format("%10s, %25s, %25s, %10s, %20s, %15s, %-25s, %-20s, %15s", result.getUid(),
                            result.getDocumentType(), result.getObjectType(), result.getRole(),
                            result.getBusinessAction(), result.getStatus(), result.getMetaData().getModifyTimestamp(),
                            result.getDocumentRefNumber(), result.getDocumentId());
                    System.out.println(f);
                }
                e.printStackTrace();
                skip.set(true);
            }

        });
    }

    @Override
    public void invoiceRejected(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, InvoiceRejectedTasklet invoiceRejectedTasklet) throws Exception{
        InforNexusClient inforNexusClient = new InforNexusClient(buyerApiInfoDto);

        List<InforNexusTask.Result> results = inforNexusClient.taskInvoiceRejected(latestDateTimeUTC, InforNexusClient.Status.Assigned);

        AtomicBoolean skip = new AtomicBoolean(false);

        results.stream().forEach(result -> {

            if (skip.get()) {
                return;
            }

            try {
                Optional<InforNexusInvoiceAcknowledgementQ2> inforNexusInvoiceAcknowledgementQ2 = inforNexusClient
                        .executeInvoiceAcknowledgementQ2(result.getUid(), result.getStatus(), result.getDocumentId());

                if (!inforNexusInvoiceAcknowledgementQ2.isPresent()) {
                    return;
                }

                invoiceRejectedTasklet.rejectedInvoiceCallBack(result, inforNexusInvoiceAcknowledgementQ2.get(), buyerApiInfoDto.getCompany());

            } catch (Exception e) {
                {
                    String f = String.format("%10s, %25s, %25s, %10s, %20s, %15s, %-25s, %-20s, %15s", result.getUid(),
                            result.getDocumentType(), result.getObjectType(), result.getRole(),
                            result.getBusinessAction(), result.getStatus(), result.getMetaData().getModifyTimestamp(),
                            result.getDocumentRefNumber(), result.getDocumentId());
                    System.out.println(f);
                }
                e.printStackTrace();

                skip.set(true);
            }
        });
    }
}
