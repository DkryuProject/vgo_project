package vengine.batchjob.po.infornexus.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class InforNexusTask {

	@SerializedName(value = "resultInfo")
	@Expose
	private ResultInfo resultInfo;

	@SerializedName(value = "result")
	private List<Result> results = new ArrayList<>();

	public ResultInfo getResultInfo() {
		return resultInfo;
	}

	@Override
	public String toString() {
		return "GtnTask [resultInfo=" + resultInfo + ", results=" + results + "]";
	}

	public List<Result> getResults() {
		return results;
	}

	public static class ResultInfo {

		private int count;
		private int offset;
		private int estimatedTotalCount;
		private boolean hasMore;

		protected ResultInfo() {
		}

		public int getCount() {
			return count;
		}

		public int getOffset() {
			return offset;
		}

		public int getEstimatedTotalCount() {
			return estimatedTotalCount;
		}

		public boolean isHasMore() {
			return hasMore;
		}

		@Override
		public String toString() {
			return "ResultInfo [count=" + count + ", offset=" + offset + ", estimatedTotalCount=" + estimatedTotalCount
					+ ", hasMore=" + hasMore + "]";
		}

	}

	public static class Result {
		private Long uid;
		private String assignedToUserId;
		private String action;
		private String businessAction;
		private String role;

		private String objectType;
		private String documentType;
		private Long documentId;
		private String documentRefNumber;
		private String status;
		private String assignedOn;
		private String completedOn;

		@SerializedName("__metadata")
		private MetaData metaData;

		public MetaData getMetaData() {
			return metaData;
		}

		public String getBusinessAction() {
			return businessAction;
		}

		public Long getUid() {
			return uid;
		}

		public String getAssignedToUserId() {
			return assignedToUserId;
		}

		public String getDocumentType() {
			return documentType;
		}

		public Long getDocumentId() {
			return documentId;
		}

		public String getDocumentRefNumber() {
			return documentRefNumber;
		}

		public String getStatus() {
			return status;
		}

		public String getAction() {
			return action;
		}

		public String getRole() {
			return role;
		}

		public String getObjectType() {
			return objectType;
		}

		public String getAssignedOn() {
			return assignedOn;
		}

		public String getCompletedOn() {
			return completedOn;
		}

		public String getCancelledOn() {
			return toUtc(getMetaData().getModifyTimestamp());
		}

		public boolean isPurchaseOrderAmendment() {
			return documentType.equals("PurchaseOrderAmendment");
		}

		@Override
		public String toString() {
			return "Result [uid=" + uid + ", assignedToUserId=" + assignedToUserId + ", action=" + action + ", role=" + role
					+ ", objectType=" + objectType + ", documentType=" + documentType + ", documentId=" + documentId
					+ ", documentRefNumber=" + documentRefNumber + ", status=" + status + ", assignedOn=" + assignedOn
					+ ", completedOn=" + completedOn + "]";
		}

		public class MetaData {

			private String modifyTimestamp;

			public String getModifyTimestamp() {
				return modifyTimestamp;
			}

		}

	}

	private static String toUtc(String timestamp) {

		DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern(
				"[yyyy-MM-dd HH:mm:ss.SSS]" + "[yyyy-MM-dd HH:mm:ss.SS]" + "[yyyy-MM-dd HH:mm:ss.S]" + "[yyyy-MM-dd HH:mm:ss]")
				.withZone(ZoneOffset.UTC);
		ZonedDateTime zdt = ZonedDateTime.from(dtf1.parse(timestamp));

		DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZone(ZoneOffset.UTC);

		return zdt.format(dtf2);

	}

	public static InforNexusTask empty() {

		ResultInfo resultInfo = new ResultInfo();

		resultInfo.count = 0;
		resultInfo.estimatedTotalCount = 0;
		resultInfo.hasMore = false;
		resultInfo.offset = 0;

		InforNexusTask empty = new InforNexusTask();
		empty.resultInfo = resultInfo;
		empty.results = new ArrayList<>();

		return empty;
	}

}
