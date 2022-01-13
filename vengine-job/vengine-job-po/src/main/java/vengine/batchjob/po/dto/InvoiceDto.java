package vengine.batchjob.po.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceDto {
    private Long id;
    private Long companyID;
    private Long buyerOrderInfoId;
    private String invoiceURL;
    private String invoiceNumber;
    private String invoiceUid;
    private String shipmentDocumentUid;
    private String shipmentURL;
    private String draftedOn;
    private String publishedOn;
    private String cancelledOn;
    private String rejectedOn;
    private String finishedOn;
    private String status;
    private Float totalQuantity;
    private Float totalMerchandiseAmount;
    private Float totalAllowanceChargeAmount;
    private Float totalTaxAmount;
    private Float totalDocumentAmount;
    private String rejectedReferenceDocumentType;
    private String rejectedReferenceDocumentId;
    private String rejectedReferenceDocumentNote;
    private String rejectedReferenceDocumentUrl;
}
