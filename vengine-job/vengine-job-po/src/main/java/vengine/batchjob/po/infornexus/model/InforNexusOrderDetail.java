package vengine.batchjob.po.infornexus.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class InforNexusOrderDetail {

	private String orderUid;
	private String poNumber;
	private String contractNumber;
	private String redirectUrl;
	private String orderStatusCode;
	private String orderFunctionCode;
	private String revisionNumber;

	private OrderTerms orderTerms;

	@SerializedName(value = "orderItem")
	private List<OrderItem> items;

	@SerializedName(value = "changeDescription")
	private List<ChangeDescription> changeDescriptions;

	private Party party;

	@SerializedName("__metadata")
	private MetaData metaData;

	public MetaData getMetaData() {
		return metaData;
	}

	public List<ChangeDescription> getChangeDescriptions() {
		return changeDescriptions;
	}

	public String getOrderStatusCode() {
		return orderStatusCode;
	}

	public void setOrderStatusCode(String orderStatusCode) {
		this.orderStatusCode = orderStatusCode;
	}

	public String getOrderUid() {
		return orderUid;
	}

	public String getPoNumber() {
		return poNumber;
	}

	public String getContractNumber() {
		return contractNumber;
	}

	public OrderTerms getOrderTerms() {
		return orderTerms;
	}

	public List<OrderItem> getItems() {
		return items;
	}

	public String getRedirectUrl() {
		return redirectUrl;
	}

	public void setOrderFunctionCode(String orderFunctionCode) {
		this.orderFunctionCode = orderFunctionCode;
	}

	public String getOrderFunctionCode() {
		return orderFunctionCode;
	}

	public String getRevisionNumber() {
		return revisionNumber;
	}

	public void setRevisionNumber(String revisionNumber) {
		this.revisionNumber = revisionNumber;
	}

	public Party getParty() {
		return party;
	}

	@Override
	public String toString() {
		return "GTNOrderDetail [orderUid=" + orderUid + ", poNumber=" + poNumber + ", contractNumber=" + contractNumber
				+ ", redirectUrl=" + redirectUrl + ", orderStatusCode=" + orderStatusCode + ", orderFunctionCode="
				+ orderFunctionCode + ", revisionNumber=" + revisionNumber + ", orderTerms=" + orderTerms + ", items=" + items
				+ ", party=" + party + "]";
	}

	public class OrderItem {

		private String itemKey;

		@SerializedName(value = "baseItem")
		private BaseItem baseItem;

		@SerializedName(value = "itemPrice")
		private ItemPrice itemPrice;

		@SerializedName(value = "orderItem")
		private List<OrderItem> orderItems;

		public ItemPrice getItemPrice() {
			return itemPrice;
		}

		public String getItemKey() {
			return itemKey;
		}

		public BaseItem getBaseItem() {
			return baseItem;
		}

		public List<OrderItem> getOrderItems() {
			return orderItems;
		}

		@Override
		public String toString() {
			return "orderItem [itemKey=" + itemKey + ", baseItem=" + baseItem + ", itemPrice=" + itemPrice + ", orderItems="
					+ orderItems + "]";
		}

		public class BaseItem {
			private String itemUid;

			private String itemTypeCode;

			@SerializedName(value = "reference")
			private Reference reference;

			private String quantity;

			@SerializedName(value = "itemIdentifier")
			private ItemIdentifier itemIdentifier;

			@SerializedName(value = "itemDescriptor")
			private ItemDescriptor itemDescriptor;

			@SerializedName(value = "itemDate")
			private ItemDate itemDate;

			private PackageInstruction packageInstruction;

			public Reference getReference() {
				return reference;
			}

			public String getQuantity() {
				return quantity;
			}

			public ItemDescriptor getItemDescriptor() {
				return itemDescriptor;
			}

			public ItemIdentifier getItemIdentifier() {
				return itemIdentifier;
			}

			public ItemDate getItemDate() {
				return itemDate;
			}

			public PackageInstruction getPackageInstruction() {
				return packageInstruction;
			}

			public String getItemUid() {
				return itemUid;
			}

			public String getItemTypeCode() {
				return itemTypeCode;
			}

			@Override
			public String toString() {
				return "baseItem [reference=" + reference + ", quantity=" + quantity + ", itemIdentifier=" + itemIdentifier
						+ ", itemDescriptor=" + itemDescriptor + ", itemDate=" + itemDate + "]";
			}

			public class ItemDate {

				private String EarliestDate;
				private String LatestDate;

				public String getEarliestDate() {
					return EarliestDate;
				}

				public String getLatestDate() {
					return LatestDate;
				}

				@Override
				public String toString() {
					return "itemDate [earliestDate=" + EarliestDate + ", latestDate=" + LatestDate + "]";
				}

			}

			public class ItemDescriptor {
				@SerializedName(value = "DescSellerSize")
				private String DescSellerSize;

				public String getDescSellerSize() {
					return DescSellerSize;
				}

				public void setDescSellerSize(String descSellerSize) {
					DescSellerSize = descSellerSize;
				}

				@Override
				public String toString() {
					return "ItemDescriptor [DescSellerSize=" + DescSellerSize + "]";
				}

			}

			public class ItemIdentifier {
				@SerializedName(value = "IdColor")
				private String IdColor;

				@SerializedName(value = "BuyerNumber")
				private String styleNumber;

				@SerializedName(value = "ItemSequenceNumber")
				private String itemSequenceNumber;

				private String SkuNumber;

				private String ShortDescription;

				public String getShortDescription() {
					return ShortDescription;
				}

				public String getIdColor() {
					return IdColor;
				}

				public String getStyleNumber() {
					return styleNumber;
				}

				public String getSkuNumber() {
					return SkuNumber;
				}

				public String getItemSequenceNumber() {
					return itemSequenceNumber;
				}

				@Override
				public String toString() {
					return "ItemIdentifier [IdColor=" + IdColor + ", styleNumber=" + styleNumber + ", itemSequenceNumber="
							+ itemSequenceNumber + ", SkuNumber=" + SkuNumber + ", ShortDescription=" + ShortDescription + "]";
				}

			}

			public class Reference {

				private String GapSku;
				private String RetailSeason;
				private String DestCtryCd;
				private String PrepackType;
				private String FullCartonIndicator;
				private String ClrDesc;
				private String InStoreDate;
				private String ItemStatus;
				private String FinalDestinationDate;

				public String getFinalDestinationDate() {
					return FinalDestinationDate;
				}

				public String getItemStatus() {
					return ItemStatus;
				}

				public void setGapSku(String gapSku) {
					GapSku = gapSku;
				}

				public void setRetailSeason(String retailSeason) {
					RetailSeason = retailSeason;
				}

				public void setDestCtryCd(String destCtryCd) {
					DestCtryCd = destCtryCd;
				}

				public void setClrDesc(String clrDesc) {
					ClrDesc = clrDesc;
				}

				public String getGapSku() {
					return GapSku;
				}

				public String getRetailSeason() {
					return RetailSeason;
				}

				public String getDestCtryCd() {
					return DestCtryCd;
				}

				public String getClrDesc() {
					return ClrDesc;
				}

				public String getPrepackType() {
					return PrepackType;
				}

				public String getFullCartonIndicator() {
					return FullCartonIndicator;
				}

				public String getInStoreDate() {
					return InStoreDate;
				}

				@Override
				public String toString() {
					return "Reference [GapSku=" + GapSku + ", RetailSeason=" + RetailSeason + ", DestCtryCd=" + DestCtryCd
							+ ", PrepackType=" + PrepackType + ", FullCartonIndicator=" + FullCartonIndicator + ", ClrDesc="
							+ ClrDesc + ", InStoreDate=" + InStoreDate + ", ItemStatus=" + ItemStatus + ", FinalDestinationDate="
							+ FinalDestinationDate + "]";
				}

			}

			public class PackageInstruction {
				private String quantityPerOuterPackage;
				private String quantityPerInnerPackage;
				private String packInstructionReference;

				public String getPackInstructionReference() {
					return packInstructionReference;
				}

				public String getQuantityPerOuterPackage() {
					return quantityPerOuterPackage;
				}

				public String getQuantityPerInnerPackage() {
					return quantityPerInnerPackage;
				}

				@Override
				public String toString() {
					return "PackageInstruction [quantityPerOuterPackage=" + quantityPerOuterPackage + ", quantityPerInnerPackage="
							+ quantityPerInnerPackage + ", packInstructionReference=" + packInstructionReference + "]";
				}

			}
		}

		public class ItemPrice {
			private String pricePerUnit;
			private String totalPrice;

			public String getPricePerUnit() {
				return pricePerUnit;
			}

			public String getTotalPrice() {
				return totalPrice;
			}

			@Override
			public String toString() {
				return "ItemPrice [pricePerUnit=" + pricePerUnit + ", totalPrice=" + totalPrice + "]";
			}

		}
	}

	public class OrderTerms {

		private OrderDate orderDate;
		private Reference reference;
		private String incotermCode;
		private String shipmentMethodCode;
		private String currencyCode;

		public OrderDate getOrderDate() {
			return orderDate;
		}

		public Reference getReference() {
			return reference;
		}

		public String getIncotermCode() {
			return incotermCode;
		}

		public String getShipmentMethodCode() {
			if (shipmentMethodCode == null) {
				return "NA";
			}
			return shipmentMethodCode;
		}

		public String getCurrencyCode() {
			return currencyCode;
		}

		@Override
		public String toString() {
			return "OrderTerms [orderDate=" + orderDate + ", reference=" + reference + ", incotermCode=" + incotermCode
					+ ", shipmentMethodCode=" + shipmentMethodCode + ", currencyCode=" + currencyCode + "]";
		}

		public class Reference {

			private String OrderClass;
			private String DeptCode;
			private String DeptName;
			private String ContractShipCancelDate;
			private String DestinationCountry;
			private String OriginCountry;
			private String OriginCity;
			private String Brand;
			private String OriginalPONumber;
			private String DivisionName;
			private String MarketPONo;
			private String POBuildTypeCode;
			private String MarketDesc;

			private String CartonPackFactorNo;

			public String getOrderClass() {
				if (MarketPONo == null) {
					return "PO Manual";
				}
				return OrderClass;
			}

			public String getDeptCode() {
				return DeptCode;
			}

			public String getDeptName() {
				return DeptName;
			}

			public String getContractShipCancelDate() {
				return ContractShipCancelDate;
			}

			public String getDestinationCountry() {
				return DestinationCountry;
			}

			public String getOriginCountry() {
				return OriginCountry;
			}

			public String getBrand() {
				return Brand;
			}

			public String getOriginalPONumber() {
				return OriginalPONumber;
			}

			public String getDivisionName() {
				return DivisionName;
			}

			public String getMarketPONo() {
				if (MarketPONo == null) {
					return OriginalPONumber;
				}
				return MarketPONo;
			}

			public String getPOBuildTypeCode() {
				return POBuildTypeCode;
			}

			public String getMarketDesc() {
				return MarketDesc;
			}

			public String getCartonPackFactorNo() {
				return CartonPackFactorNo;
			}

			public String getOriginCity() {
				return OriginCity;
			}

			@Override
			public String toString() {
				return "Reference [OrderClass=" + OrderClass + ", DeptCode=" + DeptCode + ", DeptName=" + DeptName
						+ ", ContractShipCancelDate=" + ContractShipCancelDate + ", DestinationCountry=" + DestinationCountry
						+ ", OriginCountry=" + OriginCountry + ", OriginCity=" + OriginCity + ", Brand=" + Brand
						+ ", OriginalPONumber=" + OriginalPONumber + ", DivisionName=" + DivisionName + ", MarketPONo="
						+ MarketPONo + ", POBuildTypeCode=" + POBuildTypeCode + ", MarketDesc=" + MarketDesc
						+ ", CartonPackFactorNo=" + CartonPackFactorNo + "]";
			}

		}

		public class OrderDate {

			@SerializedName(value = "Issue")
			private String issue;
			@SerializedName(value = "CancelAfter")
			private String cancelAfter;
			@SerializedName(value = "Latest")
			private String latest;
			@SerializedName(value = "Earliest")
			private String earliest;

			public String getIssue() {
				return issue;
			}

			public String getCancelAfter() {
				return cancelAfter;
			}

			public String getLatest() {
				return latest;
			}

			public String getEarliest() {
				return earliest;
			}

			@Override
			public String toString() {
				return "OrderDate [issue=" + issue + ", cancelAfter=" + cancelAfter + ", latest=" + latest + ", earliest="
						+ earliest + "]";
			}

		}
	}

	public static class Party {
		@SerializedName(value = "AdditionalParty")
		private List<PartyInfo> additionalParty;

		@SerializedName(value = "Seller")
		private List<PartyInfo> seller;

		@SerializedName(value = "OriginOfGoods")
		private List<PartyInfo> originOfGoods;

		@SerializedName(value = "ShipmentDestination")
		private List<PartyInfo> shipmentDestination;

		public List<PartyInfo> getAdditionalParty() {
			return additionalParty;
		}

		public List<PartyInfo> getOriginOfGoods() {
			return originOfGoods;
		}

		public List<PartyInfo> getShipmentDestination() {
			return shipmentDestination;
		}

		public List<PartyInfo> getSeller() {
			return seller;
		}

		@Override
		public String toString() {
			return "Party [additionalParty=" + additionalParty + ", seller=" + seller + ", originOfGoods=" + originOfGoods
					+ ", shipmentDestination=" + shipmentDestination + "]";
		}

		public static class PartyInfo {
			private String partyRoleCode;
			private String name;
			private Contact contact;
			private Address address;

			public String getPartyRoleCode() {
				return partyRoleCode;
			}

			public String getName() {
				return name;
			}

			public Contact getContact() {
				return contact;
			}

			public Address getAddress() {
				return address;
			}

			public void setPartyRoleCode(String partyRoleCode) {
				this.partyRoleCode = partyRoleCode;
			}

			public void setName(String name) {
				this.name = name;
			}

			public void setContact(Contact contact) {
				this.contact = contact;
			}

			public void setAddress(Address address) {
				this.address = address;
			}

			@Override
			public String toString() {
				return "PartyInfo [partyRoleCode=" + partyRoleCode + ", name=" + name + ", contact=" + contact + ", address="
						+ address + "]";
			}

			public static class Contact {
				private String department;

				public String getDepartment() {
					return department;
				}

				public void setDepartment(String department) {
					this.department = department;
				}

				@Override
				public String toString() {
					return "Contact [department=" + department + "]";
				}

			}

			public static class Address {
				private String addressLine1;
				private String addressLine2;
				private String city;
				private String stateOrProvince;
				private String postalCodeNumber;
				private String countryCode;

				public void setAddressLine1(String addressLine1) {
					this.addressLine1 = addressLine1;
				}

				public void setAddressLine2(String addressLine2) {
					this.addressLine2 = addressLine2;
				}

				public void setCity(String city) {
					this.city = city;
				}

				public void setStateOrProvince(String stateOrProvince) {
					this.stateOrProvince = stateOrProvince;
				}

				public void setPostalCodeNumber(String postalCodeNumber) {
					this.postalCodeNumber = postalCodeNumber;
				}

				public void setCountryCode(String countryCode) {
					this.countryCode = countryCode;
				}

				public String getAddressLine1() {
					return addressLine1;
				}

				public String getAddressLine2() {
					return addressLine2;
				}

				public String getCity() {
					return city;
				}

				public String getStateOrProvince() {
					return stateOrProvince;
				}

				public String getPostalCodeNumber() {
					return postalCodeNumber;
				}

				public String getCountryCode() {
					return countryCode;
				}

				@Override
				public String toString() {
					return "Address [addressLine1=" + addressLine1 + ", addressLine2=" + addressLine2 + ", city=" + city
							+ ", stateOrProvince=" + stateOrProvince + ", postalCodeNumber=" + postalCodeNumber + ", countryCode="
							+ countryCode + "]";
				}

			}
		}

	}

	public class ChangeDescription {
		private String text;

		public String getText() {
			return text;
		}

		@Override
		public String toString() {
			return "ChangeDescription [text=" + text + "]";
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
