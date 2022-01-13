package vengine.batchjob.invoice.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Utils {

	private Utils() {
	}

	public static Map<String, ZonedDateTime> convertTimeZones(String utcTime) {

		Map<String, ZonedDateTime> times = new HashMap<>();
		times.put("Asia/Seoul", Instant.parse(utcTime).atZone(ZoneId.of("Asia/Seoul")));
		times.put("Asia/Jakarta", Instant.parse(utcTime).atZone(ZoneId.of("Asia/Jakarta")));
		times.put("Asia/Ho_Chi_Minh", Instant.parse(utcTime).atZone(ZoneId.of("Asia/Ho_Chi_Minh")));
		return times;

	}

	public static String convertTimeZone(Date utcDate, ZoneId zoneId) {

		ZonedDateTime zdt = Instant.ofEpochMilli(utcDate.getTime()).atZone(zoneId);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss(z)");
		return zdt.format(formatter);

	}

	public static <T> Predicate<T> NOT(Predicate<T> t) {
		return t.negate();
	}

	public static String ordinal(int i) {
		String[] sufixes = new String[] { "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th" };
		switch (i % 100) {
		case 11:
		case 12:
		case 13:
			return i + "th";
		default:
			return i + sufixes[i % 10];

		}
	}

	public static int getNumberOfOrderColumnsOfDataTablesParameters(Enumeration<String> params) {
		Pattern p = Pattern.compile("order\\[[0-9]+\\]\\[column\\]");
		List<String> lstOfParams = new ArrayList<String>();
		while (params.hasMoreElements()) {
			String paramName = (String) params.nextElement();
			Matcher m = p.matcher(paramName);
			if (m.matches()) {
				lstOfParams.add(paramName);
			}
		}
		return lstOfParams.size();
	}

	public static String toUtc(String timestamp) {

		DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern(
				"[yyyy-MM-dd HH:mm:ss.SSS]" + "[yyyy-MM-dd HH:mm:ss.SS]" + "[yyyy-MM-dd HH:mm:ss.S]" + "[yyyy-MM-dd HH:mm:ss]")
				.withZone(ZoneOffset.UTC);
		ZonedDateTime zdt = ZonedDateTime.from(dtf1.parse(timestamp));

		DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZone(ZoneOffset.UTC);

		return zdt.format(dtf2);

	}

	public static String urlEncoder(String text) {

		try {
			return URLEncoder.encode(text, "UTF-8");
		} catch (UnsupportedEncodingException e) {
		}

		throw new NullPointerException();
	}

}
