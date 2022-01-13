package vengine.batchjob.invoice.infornexus.model;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.google.gson.annotations.SerializedName;

public class InforNexusPackingListDetail {

	private String packingListNumber;

	private List<ShipmentItem> shipmentItem;

	@SerializedName("__metadata")
	private ShipmentItem.MetaData metaData;

	public String getPackingListNumber() {
		return packingListNumber;
	}

	public List<ShipmentItem> getShipmentItem() {
		return shipmentItem;
	}

	public ShipmentItem.MetaData getMetaData() {
		return metaData;
	}

	@Override
	public String toString() {
		return "GTNPackingListDetail [packingListNumber=" + packingListNumber + ", shipmentItem=" + shipmentItem + ", metaData="
				+ metaData + "]";
	}

	public class ShipmentItem {

		private String poNumber;
		private String orderedQuantity;

		private List<ShipmentItem> shipmentItem;

		private BaseItem baseItem;

		public String getPoNumber() {
			return poNumber;
		}

		public String getOrderedQuantity() {
			return orderedQuantity;
		}

		public List<ShipmentItem> getShipmentItem() {
			return shipmentItem;
		}

		public BaseItem getBaseItem() {
			return baseItem;
		}

		@Override
		public String toString() {
			return "ShipmentItem [poNumber=" + poNumber + ", orderedQuantity=" + orderedQuantity + ", shipmentItem="
					+ shipmentItem + ", baseItem=" + baseItem + "]";
		}

		public class BaseItem {
			private String quantity;
			private ItemIdentifier itemIdentifier;
			private ItemDescriptor itemDescriptor;
			private PackageInstruction packageInstruction;

			public PackageInstruction getPackageInstruction() {
				return packageInstruction;
			}

			public String getQuantity() {
				return quantity;
			}

			public ItemIdentifier getItemIdentifier() {
				return itemIdentifier;
			}

			public ItemDescriptor getItemDescriptor() {
				return itemDescriptor;
			}

			@Override
			public String toString() {
				return "BaseItem [quantity=" + quantity + ", itemIdentifier=" + itemIdentifier + ", itemDescriptor="
						+ itemDescriptor + ", packageInstruction=" + packageInstruction + "]";
			}

			public class ItemIdentifier {
				private String SkuNumber;
				private String ItemSequenceNumber;

				public String getItemSequenceNumber() {
					return ItemSequenceNumber;
				}

				public String getSkuNumber() {
					return SkuNumber;
				}

				@Override
				public String toString() {
					return "ItemIdentifier [SkuNumber=" + SkuNumber + ", ItemSequenceNumber=" + ItemSequenceNumber + "]";
				}
			}

			public class PackageInstruction {
				private String packInstructionReference;
				private String quantityPerInnerPackage;

				public String getPackInstructionReference() {
					return packInstructionReference;
				}

				public String getQuantityPerInnerPackage() {
					return quantityPerInnerPackage;
				}

				@Override
				public String toString() {
					return "PackageInstruction [packInstructionReference=" + packInstructionReference
							+ ", quantityPerInnerPackage=" + quantityPerInnerPackage + "]";
				}

			}

			public class ItemDescriptor {
				private String DescSellerSize;

				public String getDescSellerSize() {
					return DescSellerSize;
				}

				@Override
				public String toString() {
					return "ItemDescriptor [DescSellerSize=" + DescSellerSize + "]";
				}

			}

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

	public static void main(String[] args) throws JsonSyntaxException, JsonIOException, FileNotFoundException {

		File file = new File(System.getenv("HOME").toString() + "/gtndata/75520760818_75520760818-Action-75520760818-body.json");

		InforNexusPackingListDetail packingListDetail = new Gson().fromJson(new FileReader(file),
				InforNexusPackingListDetail.class);

		packingListDetail.getPackingListNumber();
		packingListDetail.getMetaData().getModifyTimestamp();
		packingListDetail.getMetaData().getRedirectUrl();

		String poNumber = packingListDetail.getShipmentItem().get(0).getPoNumber();
		System.out.println(poNumber);
		System.out.println(packingListDetail.getMetaData().getRedirectUrl());

		DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS").withZone(ZoneOffset.UTC);
		ZonedDateTime zdt = ZonedDateTime.from(dtf1.parse(packingListDetail.getMetaData().getModifyTimestamp()));
		DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZone(ZoneOffset.UTC);

		System.out.println(zdt.format(dtf2));

		List<ShipmentItem> shipmentItems = packingListDetail.getShipmentItem();
		for (ShipmentItem f1 : shipmentItems) {

			if (f1.getShipmentItem() != null) {

				for (ShipmentItem f2 : f1.getShipmentItem()) {

					System.out.print("Line : " + f2.getBaseItem().getItemIdentifier().getItemSequenceNumber());
					System.out.print(" ");
					System.out.print("PackInstructionReference : "
							+ f2.getBaseItem().getPackageInstruction().getPackInstructionReference());
					System.out.print(" ");
					System.out.print("SKU : " + f2.getBaseItem().getItemIdentifier().getSkuNumber());
					System.out.print(" ");

					System.out.print("SIZE : " + f2.getBaseItem().getItemDescriptor().getDescSellerSize());
					System.out.print(" ");

					System.out.print("QTY : " + f2.getBaseItem().getQuantity());
					System.out.print(" ");

					System.out.print("OQTY : " + f2.getOrderedQuantity());
					System.out.println();
				}

			} else {

				System.out.print("Line : " + f1.getBaseItem().getItemIdentifier().getItemSequenceNumber());
				System.out.print(" ");

				System.out.print("PackInstructionReference : N/A");
				System.out.print(" ");

				System.out.print("SKU : " + f1.getBaseItem().getItemIdentifier().getSkuNumber());
				System.out.print(" ");

				System.out.print("SIZE : " + f1.getBaseItem().getItemDescriptor().getDescSellerSize());
				System.out.print(" ");

				System.out.print("QTY : " + f1.getBaseItem().getQuantity());
				System.out.print(" ");

				System.out.print("OQTY : " + f1.getOrderedQuantity());
				System.out.println();

			}

		}

	}

}
