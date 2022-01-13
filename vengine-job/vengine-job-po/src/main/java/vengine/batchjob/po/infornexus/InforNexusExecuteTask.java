package vengine.batchjob.po.infornexus;

import lombok.extern.slf4j.Slf4j;
import vengine.batchjob.po.dto.BuyerApiInfoDto;
import vengine.batchjob.po.infornexus.model.*;
import vengine.batchjob.po.service.*;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
public class InforNexusExecuteTask implements InterfaceInfoNexusExternalApi {
    @Override
    public void purchaseOrderCancelled(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, OrderCancelledTasklet orderCancelledTasklet) throws Exception {
        InforNexusClient inforNexusClient = new InforNexusClient(buyerApiInfoDto);

        List<InforNexusTask.Result> results = inforNexusClient.taskPurchaseOrder(latestDateTimeUTC, InforNexusClient.Status.Cancelled);

        log.info("cancelled order results size : " + results.size());

        AtomicBoolean skip = new AtomicBoolean(false);

        results.stream().forEach(result -> {

            if (skip.get()) {
                return;
            }

            try {

                Optional<InforNexusOrderDetail> inforNexusOrderDetailOptional = inforNexusClient
                        .executeOrderDetail(result.getUid(), result.getStatus(), result.getDocumentId(), false);

                if (!inforNexusOrderDetailOptional.isPresent()) {
                    return;
                }

                if (!result.isPurchaseOrderAmendment()) {
                    orderCancelledTasklet.cancelledPurchaseOrderCallBack(result,
                            inforNexusOrderDetailOptional.get(), buyerApiInfoDto.getCompany());
                } else {
                    orderCancelledTasklet.cancelledPurchaseOrderAmendmentCallBack(result,
                            inforNexusOrderDetailOptional.get(), buyerApiInfoDto.getCompany());
                }

            } catch (Exception e) {
                {
                    String f = "Error: "+String.format("%10s, %25s, %25s, %10s, %20s, %15s, %-25s, %-20s, %15s", result.getUid(),
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
    public void purchaseOrderAccepted(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, OrderAcceptedTasklet orderAcceptedTasklet) throws Exception {
        InforNexusClient inforNexusClient = new InforNexusClient(buyerApiInfoDto);

        List<InforNexusTask.Result> results = inforNexusClient.taskPurchaseOrder(latestDateTimeUTC, InforNexusClient.Status.Completed);

        log.info("accepted order results size : " + results.size());

        AtomicBoolean skip = new AtomicBoolean(false);

        results.stream().forEach(result -> {

            if (skip.get()) {
                return;
            }

            try {

                Optional<InforNexusOrderDetail> inforNexusOrderDetailOptional = inforNexusClient
                        .executeOrderDetail(result.getUid(), result.getStatus(), result.getDocumentId(), false);

                if (!inforNexusOrderDetailOptional.isPresent()) {
                    return;
                }

                if (!result.isPurchaseOrderAmendment()) {
                    orderAcceptedTasklet.acceptedPurchaseOrderCallBack(result, inforNexusOrderDetailOptional.get(), buyerApiInfoDto.getCompany());
                } else {
                    orderAcceptedTasklet.acceptedPurchaseOrderAmendmentCallBack(result, inforNexusOrderDetailOptional.get(), buyerApiInfoDto.getCompany());
                }

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
    public void purchaseOrderAssigned(String latestDateTimeUTC, BuyerApiInfoDto buyerApiInfoDto, OrderAssignedTasklet orderAssignedTasklet) throws Exception {
        InforNexusClient inforNexusClient = new InforNexusClient(buyerApiInfoDto);

        List<InforNexusTask.Result> results = inforNexusClient.taskPurchaseOrder(latestDateTimeUTC, InforNexusClient.Status.Assigned);

        log.info("assigned order results size : " + results.size());

        AtomicBoolean skip = new AtomicBoolean(false);

        results.stream().forEach(result -> {

            if (skip.get()) {
                return;
            }

            try {

                Optional<InforNexusOrderDetail> inforNexusOrderDetailOptional = inforNexusClient.executeOrderDetail(
                        result.getUid(), result.getStatus(), result.getDocumentId(), result.isPurchaseOrderAmendment());

                if (!inforNexusOrderDetailOptional.isPresent()) {
                    return;
                }

                if (!result.isPurchaseOrderAmendment()) {
                    orderAssignedTasklet.assignedPurchaseOrderCallBack(result,
                            inforNexusOrderDetailOptional.get(), buyerApiInfoDto.getCompany());
                } else {
                    orderAssignedTasklet.assignedPurchaseOrderAmendmentCallBack(result,
                            inforNexusOrderDetailOptional.get(), buyerApiInfoDto.getCompany());
                }

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
