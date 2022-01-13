package io.vengine.api.v1.buyer.enums;

public enum EnumShipmentMethodCode {

	S("Ocean"), A("Air"), U("UPS"), NA("N/A");

	private String mode;

	private EnumShipmentMethodCode(String mode) {
		this.mode = mode;
	}

	public String getMode() {
		return mode;
	}

}
