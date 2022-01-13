package vengine.batchjob.po.infornexus;

import lombok.extern.slf4j.Slf4j;
import vengine.batchjob.po.dto.OrderChangeDescriptionDto;
import vengine.batchjob.po.dto.OrderDto;
import vengine.batchjob.po.dto.OrderItemDto;
import vengine.batchjob.po.dto.OrderPartyDto;
import vengine.batchjob.po.infornexus.model.InforNexusOrderDetail;
import vengine.batchjob.po.infornexus.model.InforNexusTask;
import vengine.batchjob.po.infornexus.model.InforNexusOrderDetail.Party.PartyInfo.Address;
import vengine.batchjob.po.infornexus.model.InforNexusOrderDetail.Party.PartyInfo.Contact;
import vengine.batchjob.po.infornexus.model.InforNexusOrderDetail.OrderItem;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
public class InforNexusConverter {

	private InforNexusConverter() {
	}

	public static OrderDto transferTo(InforNexusTask.Result result, InforNexusOrderDetail inforNexusOrderDetail, Long companyID) {

		List<OrderItemDto> buyerOrderItems = new ArrayList<>();

		Set<String> poType = new HashSet<>(Arrays.asList("PO Manual", "PO Summary", "DPO"));

		if (!poType.contains(inforNexusOrderDetail.getOrderTerms().getReference().getOrderClass())) {
			log.info("OrderClass not Match");
			return null;
		}

		OrderDto orderDto = new OrderDto();
		orderDto.setCompanyID(companyID);
		orderDto.setUid(String.valueOf(result.getUid()));
		orderDto.setAssignedToUserId(result.getAssignedToUserId());
		orderDto.setObjectType(result.getObjectType());
		orderDto.setDocumentType(result.getDocumentType());
		orderDto.setDocumentId(String.valueOf(result.getDocumentId()));
		orderDto.setDocumentRefNumber(result.getDocumentRefNumber());
		orderDto.setAssignedOn(result.getAssignedOn());
		orderDto.setAcceptedOn(result.getCompletedOn());
		orderDto.setUrl(inforNexusOrderDetail.getRedirectUrl());
		orderDto.setOrderClass(inforNexusOrderDetail.getOrderTerms().getReference().getOrderClass());
		orderDto.setDeptName(inforNexusOrderDetail.getOrderTerms().getReference().getDeptName());
		orderDto.setDeptCode(inforNexusOrderDetail.getOrderTerms().getReference().getDeptCode());
		orderDto.setShipmentMethodCode(inforNexusOrderDetail.getOrderTerms().getShipmentMethodCode());
		orderDto.setOriginCity(inforNexusOrderDetail.getOrderTerms().getReference().getOriginCity());
		orderDto.setDestinationCountry(inforNexusOrderDetail.getOrderTerms().getReference().getDestinationCountry());
		orderDto.setMarketDesc(inforNexusOrderDetail.getOrderTerms().getReference().getMarketDesc());
		orderDto.setOriginCountry(inforNexusOrderDetail.getOrderTerms().getReference().getOriginCountry());
		orderDto.setBrand(inforNexusOrderDetail.getOrderTerms().getReference().getBrand());
		orderDto.setDivisionName(inforNexusOrderDetail.getOrderTerms().getReference().getDivisionName());
		orderDto.setMarketPONo(inforNexusOrderDetail.getOrderTerms().getReference().getMarketPONo());
		orderDto.setIncotermCode(inforNexusOrderDetail.getOrderTerms().getIncotermCode());
		orderDto.setIssueDate(inforNexusOrderDetail.getOrderTerms().getOrderDate().getIssue());
		orderDto.setCancelAfterDate(inforNexusOrderDetail.getOrderTerms().getOrderDate().getCancelAfter());
		orderDto.setLatestDate(inforNexusOrderDetail.getOrderTerms().getOrderDate().getLatest());
		orderDto.setEarliestDate(inforNexusOrderDetail.getOrderTerms().getOrderDate().getEarliest());
		orderDto
				.setContractShipCancelDate(inforNexusOrderDetail.getOrderTerms().getReference().getContractShipCancelDate());

		orderDto.setRevisionNumber(inforNexusOrderDetail.getRevisionNumber());
		orderDto.setCurrencyCode(inforNexusOrderDetail.getOrderTerms().getCurrencyCode());
		orderDto.setBuildTypeCode(inforNexusOrderDetail.getOrderTerms().getReference().getPOBuildTypeCode());

		List<OrderChangeDescriptionDto> orderChangeDescriptionDtos = new ArrayList<>();

		if (inforNexusOrderDetail.getChangeDescriptions() != null) {
			inforNexusOrderDetail.getChangeDescriptions().forEach(changeDescription -> {
				if (changeDescription.getText() != null) {
					int length = changeDescription.getText().length();
					if (length > 500) {
						length = 500;
					}

					OrderChangeDescriptionDto orderChangeDescriptionDto = new OrderChangeDescriptionDto();
					orderChangeDescriptionDto.setText(changeDescription.getText().substring(0, length));
					orderChangeDescriptionDtos.add(orderChangeDescriptionDto);
				}
			});
		}
		orderDto.setOrderChangeDescriptionDtos(orderChangeDescriptionDtos);
		orderDto.setTimestamp(new Date());

		List<OrderPartyDto> orderPartyDtos = new ArrayList<>();

		InforNexusOrderDetail.Party.PartyInfo party = null;

		if (inforNexusOrderDetail.getParty().getAdditionalParty() == null
				|| inforNexusOrderDetail.getParty().getAdditionalParty().get(0) == null) {
			party = partyforce();
		} else {
			party = inforNexusOrderDetail.getParty().getAdditionalParty().get(0);
		}
		OrderPartyDto bop = new OrderPartyDto();
		bop.setRole("Purchaser");
		bop.setCompanyID(companyID);
		bop.setAddressLine1(party.getAddress().getAddressLine1());
		bop.setAddressLine2(party.getAddress().getAddressLine2());
		bop.setCity(party.getAddress().getCity());
		bop.setCountryCode(party.getAddress().getCountryCode());
		bop.setDepartment(party.getContact().getDepartment());
		bop.setName(party.getName());
		bop.setPostalCodeNumber(party.getAddress().getPostalCodeNumber());
		bop.setStateOrProvince(party.getAddress().getStateOrProvince());
		orderPartyDtos.add(bop);

		if (inforNexusOrderDetail.getParty().getSeller() == null || inforNexusOrderDetail.getParty().getSeller().get(0) == null) {
			party = partyforce();
		} else {
			party = inforNexusOrderDetail.getParty().getSeller().get(0);
		}
		bop = new OrderPartyDto();
		bop.setRole("Vendor");
		bop.setCompanyID(companyID);
		bop.setAddressLine1(party.getAddress().getAddressLine1());
		bop.setAddressLine2(party.getAddress().getAddressLine2());
		bop.setCity(party.getAddress().getCity());
		bop.setCountryCode(party.getAddress().getCountryCode());
		bop.setDepartment(party.getContact().getDepartment());
		bop.setName(party.getName());
		bop.setPostalCodeNumber(party.getAddress().getPostalCodeNumber());
		bop.setStateOrProvince(party.getAddress().getStateOrProvince());
		orderPartyDtos.add(bop);

		if (inforNexusOrderDetail.getParty().getOriginOfGoods() == null
				|| inforNexusOrderDetail.getParty().getOriginOfGoods().get(0) == null) {
			party = partyforce();
		} else {
			party = inforNexusOrderDetail.getParty().getOriginOfGoods().get(0);
		}
		bop = new OrderPartyDto();
		bop.setRole("Factory");
		bop.setCompanyID(companyID);
		bop.setAddressLine1(party.getAddress().getAddressLine1());
		bop.setAddressLine2(party.getAddress().getAddressLine2());
		bop.setCity(party.getAddress().getCity());
		bop.setCountryCode(party.getAddress().getCountryCode());
		bop.setDepartment(party.getContact().getDepartment());
		bop.setName(party.getName());
		bop.setPostalCodeNumber(party.getAddress().getPostalCodeNumber());
		bop.setStateOrProvince(party.getAddress().getStateOrProvince());
		orderPartyDtos.add(bop);

		if (inforNexusOrderDetail.getParty().getShipmentDestination() == null
				|| inforNexusOrderDetail.getParty().getShipmentDestination().get(0) == null) {
			party = partyforce();
		} else {
			party = inforNexusOrderDetail.getParty().getShipmentDestination().get(0);
		}
		bop = new OrderPartyDto();
		bop.setRole("ShipTo");
		bop.setCompanyID(companyID);
		bop.setAddressLine1(party.getAddress().getAddressLine1());
		bop.setAddressLine2(party.getAddress().getAddressLine2());
		bop.setCity(party.getAddress().getCity());
		bop.setCountryCode(party.getAddress().getCountryCode());
		bop.setDepartment(party.getContact().getDepartment());
		bop.setName(party.getName());
		bop.setPostalCodeNumber(party.getAddress().getPostalCodeNumber());
		bop.setStateOrProvince(party.getAddress().getStateOrProvince());
		orderPartyDtos.add(bop);

		orderDto.setOrderPartyDtos(orderPartyDtos);

		addItems(inforNexusOrderDetail.getItems(), null, orderDto, inforNexusOrderDetail, buyerOrderItems, companyID);
		if (buyerOrderItems.isEmpty()) {
			log.info("["+orderDto.getDocumentRefNumber()+"] buyerOrderItems is empty");
			return null;
		}

		AtomicInteger qty = new AtomicInteger();
		buyerOrderItems.forEach(item -> {
			qty.getAndAdd(Integer.parseInt(item.getQty()));
		});
		orderDto.setOrderedQuantity(qty.get());
		orderDto.setOrderItemDtos(buyerOrderItems);

		return orderDto;
	}

	private static void addItems(List<OrderItem> orderItems, OrderItem parent, OrderDto orderDto,
								 InforNexusOrderDetail inforNexusOrderDetail, List<OrderItemDto> orderItemDtos, Long companyID) {

		if (orderItems == null) {
			return;
		}

		for (OrderItem item : orderItems) {

			String itemStatus = item.getBaseItem().getReference().getItemStatus();
			if (itemStatus != null && !itemStatus.toLowerCase().equals("open")) {
				continue;
			}

			if (item.getOrderItems() != null) {
				addItems(item.getOrderItems(), item, orderDto, inforNexusOrderDetail, orderItemDtos, companyID);
			} else {
				OrderItemDto orderItemDto = new OrderItemDto();

				orderItemDto.setCompanyID(companyID);
				orderItemDto.setItemUid(item.getBaseItem().getItemUid());
				orderItemDto.setItemTypeCode(item.getBaseItem().getItemTypeCode());
				orderItemDto.setQty(item.getBaseItem().getQuantity());
				orderItemDto.setPricePerUnit(item.getItemPrice().getPricePerUnit());
				orderItemDto.setTotalPrice(item.getItemPrice().getTotalPrice());
				orderItemDto.setSize(item.getBaseItem().getItemDescriptor().getDescSellerSize());
				orderItemDto.setColor(item.getBaseItem().getReference().getClrDesc());

				if (orderDto.getRetailSeason() == null) {
					if (item.getBaseItem().getReference().getRetailSeason() == null) {
						orderDto.setRetailSeason(parent.getBaseItem().getReference().getRetailSeason());
					} else {
						orderDto.setRetailSeason(item.getBaseItem().getReference().getRetailSeason());
					}
				}

				if (orderDto.getInDcDate() == null || orderDto.getInDcDate().equals("-")) {
					if (item.getBaseItem().getReference().getFinalDestinationDate() == null && parent != null) {
						orderDto.setInDcDate(parent.getBaseItem().getReference().getFinalDestinationDate());
					} else {
						orderDto.setInDcDate(item.getBaseItem().getReference().getFinalDestinationDate());
					}
				}

				if (orderDto.getInStoreDate() == null || orderDto.getInStoreDate().equals("-")) {
					if (item.getBaseItem().getReference().getInStoreDate() == null && parent != null) {
						orderDto.setInStoreDate(parent.getBaseItem().getReference().getInStoreDate());
					} else {
						orderDto.setInStoreDate(item.getBaseItem().getReference().getInStoreDate());
					}
				}

				if (item.getBaseItem().getItemIdentifier().getStyleNumber() == null) {
					orderItemDto.setStyleNumber(parent.getBaseItem().getItemIdentifier().getStyleNumber());

				} else {
					orderItemDto.setStyleNumber(item.getBaseItem().getItemIdentifier().getStyleNumber());
				}

				if (item.getBaseItem().getReference().getPrepackType() == null) {
					if (parent != null) {
						orderItemDto.setPrepackType(parent.getBaseItem().getReference().getPrepackType());
					}
				} else {
					orderItemDto.setPrepackType(item.getBaseItem().getReference().getPrepackType());
				}

				if (orderItemDto.getPrepackType() == null) {
					orderItemDto.setPrepackType("Bulk");
				}

				if (item.getBaseItem().getReference().getFullCartonIndicator() == null) {
					if (parent != null) {
						orderItemDto.setFullCartonIndicator(parent.getBaseItem().getReference().getFullCartonIndicator());
					}
				} else {
					orderItemDto.setFullCartonIndicator(item.getBaseItem().getReference().getFullCartonIndicator());
				}

				if (item.getBaseItem().getPackageInstruction() == null
						|| item.getBaseItem().getPackageInstruction().getQuantityPerOuterPackage() == null) {
					orderItemDto.setQtyPerOuterPack(inforNexusOrderDetail.getOrderTerms().getReference().getCartonPackFactorNo());
				} else {
					orderItemDto.setQtyPerOuterPack(item.getBaseItem().getPackageInstruction().getQuantityPerOuterPackage());
				}

				if (item.getBaseItem().getPackageInstruction() == null) {
					if (parent != null) {
						orderItemDto.setQtyPerInnerPack(parent.getBaseItem().getPackageInstruction().getQuantityPerInnerPackage());
						orderItemDto.setLine(parent.getBaseItem().getItemIdentifier().getItemSequenceNumber());
					}

				} else {
					orderItemDto.setQtyPerInnerPack(item.getBaseItem().getPackageInstruction().getQuantityPerInnerPackage());
					orderItemDto.setPackInstructionReference(
							(item.getBaseItem().getPackageInstruction().getPackInstructionReference()));
					orderItemDto.setLine(item.getBaseItem().getItemIdentifier().getItemSequenceNumber());
				}

				if (orderItemDto.getQtyPerInnerPack() != null) {
					orderItemDto.setQtyPerOuterPack(null);
				}

				if (item.getBaseItem().getItemIdentifier().getSkuNumber() == null) {
					orderItemDto.setSku(parent.getBaseItem().getItemIdentifier().getSkuNumber());
				} else {
					orderItemDto.setSku(item.getBaseItem().getItemIdentifier().getSkuNumber());
				}

				try {
					orderItemDto.setDescription(parent.getBaseItem().getItemIdentifier().getShortDescription());
				} catch (Exception e) {
					orderItemDto.setDescription(item.getBaseItem().getItemIdentifier().getShortDescription());
				}
				orderItemDtos.add(orderItemDto);
			}
		}
	}

	private static InforNexusOrderDetail.Party.PartyInfo partyforce() {
		InforNexusOrderDetail.Party.PartyInfo party = new InforNexusOrderDetail.Party.PartyInfo();
		Address address = new Address();
		address.setAddressLine1("N/A");
		address.setAddressLine2("N/A");
		address.setCity("N/A");
		address.setCountryCode("N/A");
		address.setPostalCodeNumber("N/A");
		address.setStateOrProvince("N/A");
		party.setAddress(address);

		Contact contact = new Contact();
		contact.setDepartment("N/A");
		party.setContact(contact);
		party.setName("N/A");
		return party;
	}

	public static OrderDto transferTo(InforNexusTask.Result result, InforNexusOrderDetail inforNexusOrderDetail, OrderDto orderDto) {
		orderDto.setUid(String.valueOf(result.getUid()));
		orderDto.setAssignedToUserId(result.getAssignedToUserId());
		orderDto.setObjectType(result.getObjectType());
		orderDto.setDocumentType(result.getDocumentType());
		orderDto.setAssignedOn(result.getAssignedOn());
		orderDto.setAcceptedOn(result.getCompletedOn());
		orderDto.setUrl(inforNexusOrderDetail.getRedirectUrl());
		orderDto.setOrderClass(inforNexusOrderDetail.getOrderTerms().getReference().getOrderClass());
		orderDto.setDeptName(inforNexusOrderDetail.getOrderTerms().getReference().getDeptName());
		orderDto.setDeptCode(inforNexusOrderDetail.getOrderTerms().getReference().getDeptCode());
		orderDto.setShipmentMethodCode(inforNexusOrderDetail.getOrderTerms().getShipmentMethodCode());
		orderDto.setOriginCity(inforNexusOrderDetail.getOrderTerms().getReference().getOriginCity());
		orderDto.setDestinationCountry(inforNexusOrderDetail.getOrderTerms().getReference().getDestinationCountry());
		orderDto.setMarketDesc(inforNexusOrderDetail.getOrderTerms().getReference().getMarketDesc());
		orderDto.setOriginCountry(inforNexusOrderDetail.getOrderTerms().getReference().getOriginCountry());
		orderDto.setBrand(inforNexusOrderDetail.getOrderTerms().getReference().getBrand());
		orderDto.setDivisionName(inforNexusOrderDetail.getOrderTerms().getReference().getDivisionName());
		orderDto.setMarketPONo(inforNexusOrderDetail.getOrderTerms().getReference().getMarketPONo());
		orderDto.setIncotermCode(inforNexusOrderDetail.getOrderTerms().getIncotermCode());
		orderDto.setIssueDate(inforNexusOrderDetail.getOrderTerms().getOrderDate().getIssue());
		orderDto.setCancelAfterDate(inforNexusOrderDetail.getOrderTerms().getOrderDate().getCancelAfter());
		orderDto.setLatestDate(inforNexusOrderDetail.getOrderTerms().getOrderDate().getLatest());
		orderDto.setEarliestDate(inforNexusOrderDetail.getOrderTerms().getOrderDate().getEarliest());
		orderDto.setContractShipCancelDate(inforNexusOrderDetail.getOrderTerms().getReference().getContractShipCancelDate());
		orderDto.setRevisionNumber(inforNexusOrderDetail.getRevisionNumber());
		orderDto.setCurrencyCode(inforNexusOrderDetail.getOrderTerms().getCurrencyCode());
		orderDto.setBuildTypeCode(inforNexusOrderDetail.getOrderTerms().getReference().getPOBuildTypeCode());
		orderDto.setTimestamp(new Date());

		return orderDto;
	}

	public static OrderPartyDto transferTo(OrderDto orderDto, InforNexusOrderDetail.Party.PartyInfo partyInfo, String role, Long companyID) {
		if(partyInfo == null){
			partyInfo = partyforce();
		}

		OrderPartyDto bop = new OrderPartyDto();
		bop.setRole(role);
		bop.setCompanyID(companyID);
		bop.setAddressLine1(partyInfo.getAddress().getAddressLine1());
		bop.setAddressLine2(partyInfo.getAddress().getAddressLine2());
		bop.setCity(partyInfo.getAddress().getCity());
		bop.setCountryCode(partyInfo.getAddress().getCountryCode());
		bop.setDepartment(partyInfo.getContact().getDepartment());
		bop.setName(partyInfo.getName());
		bop.setPostalCodeNumber(partyInfo.getAddress().getPostalCodeNumber());
		bop.setStateOrProvince(partyInfo.getAddress().getStateOrProvince());
		bop.setBuyerOrderInfoId(orderDto.getId());
		return bop;
	}

	public static void transferTo(OrderDto orderDto, OrderItem item, OrderItemDto orderItemDto, InforNexusOrderDetail inforNexusOrderDetail) {
		orderItemDto.setItemUid(item.getBaseItem().getItemUid());
		orderItemDto.setItemTypeCode(item.getBaseItem().getItemTypeCode());
		orderItemDto.setQty(item.getBaseItem().getQuantity());
		orderItemDto.setPricePerUnit(item.getItemPrice().getPricePerUnit());
		orderItemDto.setTotalPrice(item.getItemPrice().getTotalPrice());
		orderItemDto.setSize(item.getBaseItem().getItemDescriptor().getDescSellerSize());
		orderItemDto.setColor(item.getBaseItem().getReference().getClrDesc());

		if (orderDto.getRetailSeason() == null) {
			if (item.getBaseItem().getReference().getRetailSeason() != null) {
				orderDto.setRetailSeason(item.getBaseItem().getReference().getRetailSeason());
			}
		}

		if (orderDto.getInDcDate() == null || orderDto.getInDcDate().equals("-")) {
			if (item.getBaseItem().getReference().getFinalDestinationDate() != null) {
				orderDto.setInDcDate(item.getBaseItem().getReference().getFinalDestinationDate());
			}
		}

		if (orderDto.getInStoreDate() == null || orderDto.getInStoreDate().equals("-")) {
			if (item.getBaseItem().getReference().getInStoreDate() != null ) {
				orderDto.setInStoreDate(item.getBaseItem().getReference().getInStoreDate());
			}
		}

		if (item.getBaseItem().getItemIdentifier().getStyleNumber() != null) {
			orderItemDto.setStyleNumber(item.getBaseItem().getItemIdentifier().getStyleNumber());
		}

		if (item.getBaseItem().getReference().getPrepackType() != null) {
			orderItemDto.setPrepackType(item.getBaseItem().getReference().getPrepackType());
		}

		if (orderItemDto.getPrepackType() == null) {
			orderItemDto.setPrepackType("Bulk");
		}

		if (item.getBaseItem().getReference().getFullCartonIndicator() != null) {
			orderItemDto.setFullCartonIndicator(item.getBaseItem().getReference().getFullCartonIndicator());
		}

		if (item.getBaseItem().getPackageInstruction() == null
				|| item.getBaseItem().getPackageInstruction().getQuantityPerOuterPackage() == null) {
			orderItemDto.setQtyPerOuterPack(inforNexusOrderDetail.getOrderTerms().getReference().getCartonPackFactorNo());
		} else {
			orderItemDto.setQtyPerOuterPack(item.getBaseItem().getPackageInstruction().getQuantityPerOuterPackage());
		}

		if (item.getBaseItem().getPackageInstruction() != null) {
			orderItemDto.setQtyPerInnerPack(item.getBaseItem().getPackageInstruction().getQuantityPerInnerPackage());
			orderItemDto.setPackInstructionReference(
					(item.getBaseItem().getPackageInstruction().getPackInstructionReference()));
			orderItemDto.setLine(item.getBaseItem().getItemIdentifier().getItemSequenceNumber());
		}

		if (orderItemDto.getQtyPerInnerPack() != null) {
			orderItemDto.setQtyPerOuterPack(null);
		}

		if (item.getBaseItem().getItemIdentifier().getSkuNumber() != null) {
			orderItemDto.setSku(item.getBaseItem().getItemIdentifier().getSkuNumber());
		}

		orderItemDto.setDescription(item.getBaseItem().getItemIdentifier().getShortDescription());
		orderItemDto.setBuyerOrderInfoId(orderDto.getId());
	}
}
