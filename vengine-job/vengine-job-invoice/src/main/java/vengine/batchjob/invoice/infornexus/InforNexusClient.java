package vengine.batchjob.invoice.infornexus;

import com.google.gson.Gson;
import vengine.batchjob.invoice.dto.BuyerApiInfoDto;
import vengine.batchjob.invoice.infornexus.model.InforNexusInvoiceAcknowledgementQ2;
import vengine.batchjob.invoice.infornexus.model.InforNexusInvoiceDetail;
import vengine.batchjob.invoice.infornexus.model.InforNexusPackingListDetail;
import vengine.batchjob.invoice.infornexus.model.InforNexusTask;
import vengine.batchjob.invoice.utils.PropertyUtil;
import vengine.batchjob.invoice.utils.Utils;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class InforNexusClient {
	private Logger logger = Logger.getLogger(InforNexusClient.class.getName());

	private String userId;
	private String accessKeyId;
	private String secretAccessKey;
	private String dataKey;

	private URL url;
	private String xDapiDate;

	String filePath= PropertyUtil.getProperty("infornexus.filePath");

	String today;

    public InforNexusClient(BuyerApiInfoDto buyerApiInfoDto) {
		this.userId = buyerApiInfoDto.getApiUserId();
		this.accessKeyId = buyerApiInfoDto.getAccessKeyId();
		this.secretAccessKey = buyerApiInfoDto.getSecretAccessKey();
		this.dataKey = buyerApiInfoDto.getDataKey();

		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		today = sdf.format(date);
    }

    private byte[] computeSignature()
			throws UnsupportedEncodingException, InvalidKeyException, NoSuchAlgorithmException {

		String signingBase = createSigningBase();
		return signature(signingBase);

	}

	private String createSigningBase() throws UnsupportedEncodingException {

		SortedMap<String, String> d = new TreeMap<String, String>();
		d.put("method", "GET");
		d.put("date", xDapiDate);
		if (url.getQuery() != null) {
			d.put("pathInfo", url.getPath() + "?" + url.getQuery());
		} else {
			d.put("pathInfo", url.getPath());
		}

		StringBuffer signingBase = new StringBuffer();

		for (Map.Entry<String, String> fc : d.entrySet()) {
			signingBase.append(fc.getValue().toLowerCase());
		}

		return signingBase.toString();
	}

	private String authorizationHeader()
			throws UnsupportedEncodingException, InvalidKeyException, NoSuchAlgorithmException {

		byte[] signature = computeSignature();
		return String.format("HMAC_1 %s:%s:%s", accessKeyId, Base64.getEncoder().encodeToString(signature), userId);

	}

	private byte[] signature(String signingBase)
			throws UnsupportedEncodingException, NoSuchAlgorithmException, InvalidKeyException {

		SecretKey secretKey = new SecretKeySpec(secretAccessKey.getBytes("UTF-8"), "HmacSHA256");
		Mac mac = Mac.getInstance("HmacSHA256");
		mac.init(secretKey);

		return mac.doFinal(signingBase.getBytes("UTF-8"));
	}

	private void xDapiDateGenerate() {

		TimeZone tz = TimeZone.getTimeZone("UTC");
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSSZ");
		df.setTimeZone(tz);

		xDapiDate = df.format(Calendar.getInstance().getTime());

	}

	private InforNexusTask executeTask(Integer offset, String oql)
			throws InvalidKeyException, NoSuchAlgorithmException, IOException {

		xDapiDateGenerate();

		Integer size = 3000;

		StringBuffer parameter = new StringBuffer(oql);

		parameter.append("&offset=" + offset * size);
		parameter.append("&limit=" + size);

		url = new URL("https://network.gtnexus.com/rest/3.1/Task/query?" + parameter.toString());

		HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
		httpURLConnection.addRequestProperty("dataKey", dataKey);
		httpURLConnection.addRequestProperty("x-dapi-date", xDapiDate);
		httpURLConnection.addRequestProperty("Authorization", authorizationHeader());

		@SuppressWarnings("unused")
		int responseCode = httpURLConnection.getResponseCode();

		ByteArrayOutputStream baos = new ByteArrayOutputStream();

		byte[] data = new byte[512];
		int len = -1;

		while ((len = httpURLConnection.getInputStream().read(data, 0, data.length)) != -1) {
			baos.write(data, 0, len);
		}

		try (InputStream firstClone = new ByteArrayInputStream(baos.toByteArray());
			 InputStream secondClone = new ByteArrayInputStream(baos.toByteArray());

			 BufferedReader reader = new BufferedReader(new InputStreamReader(secondClone));) {

			InforNexusTask inforNexusTask = new Gson().fromJson(reader, InforNexusTask.class);

			if (inforNexusTask != null && !inforNexusTask.getResults().isEmpty()) {
				logger.info("filePath:  "+ filePath);
				File folder = new File(filePath + "/data/"+today);
				if(!folder.exists()){
					folder.mkdir();
				}
				FileOutputStream fos = new FileOutputStream(filePath + "/data/"+today+"/InforNexusTaskRS-"
						+ inforNexusTask.getResults().get(0).getUid() + ".json");
				fos.write(baos.toByteArray());
				fos.flush();
				fos.close();

			}

			inforNexusTask = (inforNexusTask == null) ? InforNexusTask.empty() : inforNexusTask;
			logger.info(inforNexusTask.getResultInfo().toString());
			return inforNexusTask;

		} finally {
			baos.close();
		}
	}

	public List<InforNexusTask.Result> taskInvoice(String latestDateTimeUTC, Status status)
			throws InvalidKeyException, NoSuchAlgorithmException, IOException {

		String date = latestDateTimeUTC.substring(0, 10);
		String whereTemplate = " documentType IN ( 'CommercialInvoice' )  "
				.concat(" AND status = '%s'  %s  ORDER BY %s ASC");

		String andCondition = null;

		if (status == Status.Assigned) {
			andCondition = "AND assignedOn >= '".concat(date).concat("'").concat(" AND ( completedOn IS NULL )");
		} else if (status == Status.Completed) {
			andCondition = "AND completedOn >= '".concat(date).concat("'").concat(" AND ( completedOn IS NOT NULL )");
		} else {
			throw new IllegalArgumentException(status.name() + " is not defined.");
		}

		String where = String.format(whereTemplate, status.code(), " ".concat(andCondition).concat(" "),
				status.orderingName());
		System.out.println("-> " + where);
		String oql = "oql=" + Utils.urlEncoder(where);

		InforNexusTask inforNexusTask = null;

		List<InforNexusTask.Result> results = new ArrayList<>();
		final AtomicBoolean discovered = new AtomicBoolean(false);

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));

		long baseDataTime;
		try {
			baseDataTime = sdf.parse(latestDateTimeUTC).getTime();
		} catch (ParseException e1) {
			throw new IllegalArgumentException(" latestDateTimeUTC : ( " + latestDateTimeUTC + " )" + e1.getMessage());
		}

		AtomicInteger offset = new AtomicInteger(0);

		do {
			inforNexusTask = executeTask(offset.getAndIncrement(), oql);

			results.addAll(inforNexusTask.getResults().stream().filter(filter -> {

				if (discovered.get()) {
					return true;
				}

				String cDateTime = null;

				if (status == Status.Assigned) {
					cDateTime = filter.getAssignedOn();
				} else if (status == Status.Completed) {
					cDateTime = filter.getCompletedOn();
				} else {
					return false;
				}

				long dateTime = 0;

				try {
					dateTime = sdf.parse(cDateTime).getTime();
				} catch (ParseException e) {
					e.printStackTrace();
					System.exit(-1);
				}

				if (dateTime >= baseDataTime) {
					discovered.set(true);
				}

				return discovered.get();

			}).collect(Collectors.toList()));

		} while (inforNexusTask.getResultInfo().isHasMore() && results.isEmpty());

		return results;

	}

	public List<InforNexusTask.Result> taskInvoiceRejected(String latestDateTimeUTC, Status status)
			throws InvalidKeyException, NoSuchAlgorithmException, IOException {

		String date = latestDateTimeUTC.substring(0, 10);
		String whereTemplate = " objectType = '$InvoiceAcknowledgementQ2'  "
				.concat(" AND status = '%s'  %s  ORDER BY %s ASC");

		String andCondition = null;

		if (status == Status.Assigned) {
			andCondition = "AND assignedOn >= '".concat(date).concat("'").concat(" AND ( completedOn IS NULL )");
		} else if (status == Status.Completed) {
			andCondition = "AND completedOn >= '".concat(date).concat("'").concat(" AND ( completedOn IS NOT NULL )");
		} else {
			throw new IllegalArgumentException(status.name() + " is not defined.");
		}

		String where = String.format(whereTemplate, status.code(), " ".concat(andCondition).concat(" "),
				status.orderingName());
		System.out.println("-> " + where);
		String oql = "oql=" + Utils.urlEncoder(where);

		InforNexusTask inforNexusTask = null;

		List<InforNexusTask.Result> results = new ArrayList<>();
		final AtomicBoolean discovered = new AtomicBoolean(false);

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));

		long baseDataTime;
		try {
			baseDataTime = sdf.parse(latestDateTimeUTC).getTime();
		} catch (ParseException e1) {
			throw new IllegalArgumentException(" latestDateTimeUTC : ( " + latestDateTimeUTC + " )" + e1.getMessage());
		}

		AtomicInteger offset = new AtomicInteger(0);

		do {
			inforNexusTask = executeTask(offset.getAndIncrement(), oql);

			results.addAll(inforNexusTask.getResults().stream().filter(filter -> {

				if (discovered.get()) {
					return true;
				}

				String cDateTime = null;

				if (status == Status.Assigned) {
					cDateTime = filter.getAssignedOn();
				} else if (status == Status.Completed) {
					cDateTime = filter.getCompletedOn();
				} else {
					return false;
				}

				long dateTime = 0;

				try {
					dateTime = sdf.parse(cDateTime).getTime();
				} catch (ParseException e) {
					e.printStackTrace();
					System.exit(-1);
				}

				if (dateTime >= baseDataTime) {
					discovered.set(true);
				}

				return discovered.get();

			}).collect(Collectors.toList()));

		} while (inforNexusTask.getResultInfo().isHasMore() && results.isEmpty());

		return results;

	}

	public static enum Status {

		Assigned("Assigned", "assignedOn"), Completed("Completed", "completedOn"), Cancelled("Cancelled", "assignedOn");

		private String code;
		private String orderingName;

		private Status(String code, String orderingName) {
			this.code = code;
			this.orderingName = orderingName;
		}

		public String orderingName() {
			return orderingName;
		}

		public String code() {
			return code;
		}

	}

	public List<InforNexusTask.Result> taskPurchaseOrder(String latestDateTimeUTC, Status status,
			String documentRefNumber) throws InvalidKeyException, NoSuchAlgorithmException, IOException {

		String date = latestDateTimeUTC.substring(0, 10);
		String whereTemplate = "NOT ( documentRefNumber contains 'Commitment' OR documentRefNumber contains 'Hang Tag' )"
				.concat(" ").concat("AND documentRefNumber = '" + documentRefNumber + "' ").concat(" ")
				.concat("AND ( documentType IN ( 'PurchaseOrder' , 'PurchaseOrderAmendment' ) ) AND status = '%s' AND role = 'CounterParty' %s ORDER BY %s ASC");

		String andCondition = null;

		if (status == Status.Assigned) {
			andCondition = "AND assignedOn >= '".concat(date).concat("'");
		} else if (status == Status.Completed) {
			andCondition = "AND completedOn >= '".concat(date).concat("'").concat(" AND ( completedOn IS NOT NULL )");
		} else if (status == Status.Cancelled) {
			andCondition = "AND assignedOn >= '".concat(date).concat("'").concat(" AND ( completedOn IS NULL )");
		} else {
			throw new IllegalArgumentException(status.name() + " is not defined.");
		}

		String where = String.format(whereTemplate, status.code(), " ".concat(andCondition).concat(" "),
				status.orderingName());
		logger.info(where);
		String oql = "oql=" + Utils.urlEncoder(where);

		InforNexusTask inforNexusTask = null;

		List<InforNexusTask.Result> results = new ArrayList<>();
		final AtomicBoolean discovered = new AtomicBoolean(false);

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));

		long baseDataTime;
		try {
			baseDataTime = sdf.parse(latestDateTimeUTC).getTime();
		} catch (ParseException e1) {
			throw new IllegalArgumentException(" latestDateTimeUTC : ( " + latestDateTimeUTC + " )" + e1.getMessage());
		}

		AtomicInteger offset = new AtomicInteger(0);

		do {
			inforNexusTask = executeTask(offset.getAndIncrement(), oql);

			results.addAll(inforNexusTask.getResults().stream().filter(filter -> {

				if (discovered.get()) {
					return true;
				}

				String cDateTime = null;

				if (status == Status.Assigned) {
					cDateTime = filter.getAssignedOn();
				} else if (status == Status.Completed) {
					cDateTime = filter.getCompletedOn();
				} else if (status == Status.Cancelled) {
					cDateTime = filter.getAssignedOn();
				} else {
					return false;
				}

				long dateTime = 0;

				try {
					dateTime = sdf.parse(cDateTime).getTime();
				} catch (ParseException e) {
					e.printStackTrace();
					System.exit(-1);
				}

				if (dateTime >= baseDataTime) {
					discovered.set(true);
				}

				return discovered.get();

			}).collect(Collectors.toList()));

		} while (inforNexusTask.getResultInfo().isHasMore() && results.isEmpty());

		return results;
	}

	public Optional<InforNexusInvoiceDetail> executeInvoiceDetail(Long taskUid, String status, Long documentId)
			throws IOException, InvalidKeyException, NoSuchAlgorithmException {

		File folder = new File(filePath + "/data/"+today+"/invoice");
		if(!folder.exists()){
			folder.mkdirs();
		}

		File file = new File(filePath + "/data/"+today+"/invoice/InvoiceDetail-" + taskUid + "-" + status
				+ "-" + documentId + ".json");

		if (file.isFile()) {
			FileInputStream fis = new FileInputStream(file);
			BufferedReader reader = new BufferedReader(new InputStreamReader(fis));
			return Optional.of(new Gson().fromJson(reader, InforNexusInvoiceDetail.class));
		}

		xDapiDateGenerate();

		url = new URL("https://network.gtnexus.com/rest/3.1/InvoiceDetail/" + documentId);

		HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
		httpURLConnection.addRequestProperty("dataKey", dataKey);
		httpURLConnection.addRequestProperty("x-dapi-date", xDapiDate);

		httpURLConnection.addRequestProperty("Authorization", authorizationHeader());

		@SuppressWarnings("unused")
		int responseCode = httpURLConnection.getResponseCode();
		ByteArrayOutputStream baos = new ByteArrayOutputStream();

		byte[] data = new byte[512];
		int len = -1;

		while ((len = httpURLConnection.getInputStream().read(data, 0, data.length)) != -1) {
			baos.write(data, 0, len);
		}

		if (baos.size() > 10) {
			FileOutputStream fos = new FileOutputStream(file);
			fos.write(baos.toByteArray());
			fos.flush();
			fos.close();
		}

		try (InputStream firstClone = new ByteArrayInputStream(baos.toByteArray());
			 InputStream secondClone = new ByteArrayInputStream(baos.toByteArray());
			 BufferedReader reader = new BufferedReader(new InputStreamReader(secondClone));) {
			InforNexusInvoiceDetail inforNexusInvoiceDetail = new Gson().fromJson(reader, InforNexusInvoiceDetail.class);
			return inforNexusInvoiceDetail == null ? Optional.empty() : Optional.of(inforNexusInvoiceDetail);
		} finally {
			baos.close();
		}
	}

	public Optional<InforNexusPackingListDetail> executePackingListDetail(Long taskUid, String taskStatus,
																		  Long documentId) throws IOException, InvalidKeyException, NoSuchAlgorithmException {
		File folder = new File(filePath + "/data/"+today+"/packingList");
		if(!folder.exists()){
			folder.mkdirs();
		}

		File file = new File(filePath + "/data/"+today+"/packingList/PackingListDetail-" + taskUid + "-"
				+ taskStatus + "-" + documentId + ".json");

		if (file.isFile()) {
			FileInputStream fis = new FileInputStream(file);
			BufferedReader reader = new BufferedReader(new InputStreamReader(fis));
			return Optional.of(new Gson().fromJson(reader, InforNexusPackingListDetail.class));
		}

		xDapiDateGenerate();

		url = new URL("https://network.gtnexus.com/rest/3.1/PackingListDetail/" + documentId);

		HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
		httpURLConnection.addRequestProperty("dataKey", dataKey);
		httpURLConnection.addRequestProperty("x-dapi-date", xDapiDate);

		httpURLConnection.addRequestProperty("Authorization", authorizationHeader());

		@SuppressWarnings("unused")
		int responseCode = httpURLConnection.getResponseCode();

		ByteArrayOutputStream baos = new ByteArrayOutputStream();

		byte[] data = new byte[512];
		int len = -1;

		while ((len = httpURLConnection.getInputStream().read(data, 0, data.length)) != -1) {
			baos.write(data, 0, len);
		}

		if (baos.size() > 10) {
			FileOutputStream fos = new FileOutputStream(file);
			fos.write(baos.toByteArray());
			fos.flush();
			fos.close();
		}

		try (InputStream firstClone = new ByteArrayInputStream(baos.toByteArray());
			 InputStream secondClone = new ByteArrayInputStream(baos.toByteArray());
			 BufferedReader reader = new BufferedReader(new InputStreamReader(secondClone));) {
			InforNexusPackingListDetail inforNexusPackingListDetail = new Gson().fromJson(reader, InforNexusPackingListDetail.class);
			return inforNexusPackingListDetail == null ? Optional.empty() : Optional.of(inforNexusPackingListDetail);
		} finally {
			baos.close();
		}
	}

	public Optional<InforNexusInvoiceAcknowledgementQ2> executeInvoiceAcknowledgementQ2(Long taskUid, String status,
																						Long documentId) throws IOException, InvalidKeyException, NoSuchAlgorithmException {
		File folder = new File(filePath + "/data/"+today+"/invoice");
		if(!folder.exists()){
			folder.mkdirs();
		}

		File file = new File(filePath + "/data/"+today+"/invoice/InvoiceAcknowledgementQ2-" + taskUid + "-" + status + "-" + documentId + ".json");

		if (file.isFile()) {
			FileInputStream fis = new FileInputStream(file);
			BufferedReader reader = new BufferedReader(new InputStreamReader(fis));
			return Optional.of(new Gson().fromJson(reader, InforNexusInvoiceAcknowledgementQ2.class));
		}

		xDapiDateGenerate();

		url = new URL("https://network.gtnexus.com/rest/3.1/$InvoiceAcknowledgementQ2/" + documentId);

		HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
		httpURLConnection.addRequestProperty("dataKey", dataKey);
		httpURLConnection.addRequestProperty("x-dapi-date", xDapiDate);

		httpURLConnection.addRequestProperty("Authorization", authorizationHeader());

		@SuppressWarnings("unused")
		int responseCode = httpURLConnection.getResponseCode();

		ByteArrayOutputStream baos = new ByteArrayOutputStream();

		byte[] data = new byte[512];
		int len = -1;

		while ((len = httpURLConnection.getInputStream().read(data, 0, data.length)) != -1) {
			baos.write(data, 0, len);
		}

		if (baos.size() > 10) {
			FileOutputStream fos = new FileOutputStream(file);
			fos.write(baos.toByteArray());
			fos.flush();
			fos.close();
		}

		try (InputStream firstClone = new ByteArrayInputStream(baos.toByteArray());
			 InputStream secondClone = new ByteArrayInputStream(baos.toByteArray());

			 BufferedReader reader = new BufferedReader(new InputStreamReader(secondClone));) {

			InforNexusInvoiceAcknowledgementQ2 inforNexusInvoiceAcknowledgementQ2 = new Gson().fromJson(reader,
					InforNexusInvoiceAcknowledgementQ2.class);
			return inforNexusInvoiceAcknowledgementQ2 == null ? Optional.empty()
					: Optional.of(inforNexusInvoiceAcknowledgementQ2);

		} finally {
			baos.close();
		}

	}
}
