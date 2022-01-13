package vengine.batchjob.po.infornexus.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class InforNexusInvoiceDetail {

	private String redirectUrl;
	private String invoiceNumber;
	private Long invoiceUid;
	private String invoiceTypeCode;

	@SerializedName(value = "orderReference")
	private List<OrderReference> orderReferences;

	@SerializedName(value = "shipmentDocumentReference")
	private List<ShipmentDocumentReference> shipmentDocumentReferences;

	@SerializedName(value = "invoiceTotals")
	private InvoiceTotals invoiceTotals;

	public String getRedirectUrl() {
		return redirectUrl;
	}

	public String getInvoiceNumber() {
		return invoiceNumber;
	}

	public Long getInvoiceUid() {
		return invoiceUid;
	}

	public String getInvoiceTypeCode() {
		return invoiceTypeCode;
	}

	public List<OrderReference> getOrderReferences() {
		return orderReferences;
	}

	public List<ShipmentDocumentReference> getShipmentDocumentReferences() {
		return shipmentDocumentReferences;
	}

	public InvoiceTotals getInvoiceTotals() {
		return invoiceTotals;
	}

	@Override
	public String toString() {
		return "InforNexusInvoiceDetail [redirectUrl=" + redirectUrl + ", invoiceNumber=" + invoiceNumber + ", invoiceUid="
				+ invoiceUid + ", invoiceTypeCode=" + invoiceTypeCode + ", orderReferences=" + orderReferences
				+ ", shipmentDocumentReferences=" + shipmentDocumentReferences + "]";
	}

	public class OrderReference {

		private String poNumber;
		private Long orderUid;
		@SerializedName(value = "reference")
		private Reference reference;

		public String getPoNumber() {
			return poNumber;
		}

		public Long getOrderUid() {
			return orderUid;
		}

		public Reference getReference() {
			return reference;
		}

		@Override
		public String toString() {
			return "OrderReference [poNumber=" + poNumber + ", orderUid=" + orderUid + ", reference=" + reference + "]";
		}

		public class Reference {

		}

	}

	public class ShipmentDocumentReference {
		private Long uid;

		public Long getUid() {
			return uid;
		}

		@Override
		public String toString() {
			return "ShipmentDocumentReference [uid=" + uid + "]";
		}

	}

	public class InvoiceTotals {

		private Float totalQuantity;
		private Float totalMerchandiseAmount;
		private Float totalAllowanceChargeAmount;
		private Float totalTaxAmount;
		private Float totalDocumentAmount;

		public Float getTotalQuantity() {
			return totalQuantity;
		}

		public Float getTotalMerchandiseAmount() {
			return totalMerchandiseAmount;
		}

		public Float getTotalAllowanceChargeAmount() {
			return totalAllowanceChargeAmount;
		}

		public Float getTotalTaxAmount() {
			return totalTaxAmount;
		}

		public Float getTotalDocumentAmount() {
			return totalDocumentAmount;
		}

		@Override
		public String toString() {
			return "InvoiceTotals [totalQuantity=" + totalQuantity + ", totalMerchandiseAmount=" + totalMerchandiseAmount
					+ ", totalAllowanceChargeAmount=" + totalAllowanceChargeAmount + ", totalTaxAmount=" + totalTaxAmount
					+ ", totalDocumentAmount=" + totalDocumentAmount + "]";
		}

	}

}
