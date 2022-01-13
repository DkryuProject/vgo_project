package vengine.batchjob.invoice.infornexus.model;

import com.google.gson.annotations.SerializedName;

public class InforNexusInvoiceAcknowledgementQ2 {

	private String invoiceAcknowledgementId;

	private String referenceDocumentType;
	private String referenceDocumentId;
	private String referenceDocumentNote;

	@SerializedName("__metadata")
	private MetaData metaData;

	public String getInvoiceAcknowledgementId() {
		return invoiceAcknowledgementId;
	}

	public MetaData getMetaData() {
		return metaData;
	}

	public String getReferenceDocumentType() {
		return referenceDocumentType;
	}

	public String getReferenceDocumentId() {
		return referenceDocumentId;
	}

	public String getReferenceDocumentNote() {
		return referenceDocumentNote;
	}

	public class MetaData {

		private String createTimestamp;
		private String modifyTimestamp;
		private String redirectUrl;

		public String getCreateTimestamp() {
			return createTimestamp;
		}

		public String getModifyTimestamp() {
			return modifyTimestamp;
		}

		public String getRedirectUrl() {
			return redirectUrl;
		}

		@Override
		public String toString() {
			return "MetaData [createTimestamp=" + createTimestamp + ", modifyTimestamp=" + modifyTimestamp + ", redirectUrl="
					+ redirectUrl + "]";
		}

	}
}
