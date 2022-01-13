package io.vengine.api.v1.buyer.enums;

public enum EnumRole {
    Purchaser(1), Vendor(2), Factory(3), ShipTo(4);

    private int index;

    private EnumRole(int index) {
        this.index = index;
    }

    public int index() {
        return index;
    }
}
