package io.vengine.api.v1.buyer.service.impl;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import io.vengine.api.common.dto.ExcelResponse;
import io.vengine.api.common.filters.BuyerOrderSpecification;
import io.vengine.api.common.service.ExcelReader;
import io.vengine.api.common.utils.FormattingUtil;
import io.vengine.api.common.utils.JsonUtil;
import io.vengine.api.common.utils.S3Uploader;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.buyer.dto.*;
import io.vengine.api.v1.buyer.entity.BuyerApiInfo;
import io.vengine.api.v1.buyer.entity.BuyerOrderInfo;
import io.vengine.api.v1.buyer.entity.BuyerOrderItem;
import io.vengine.api.v1.buyer.entity.BuyerOrderParty;
import io.vengine.api.v1.buyer.enums.EnumOrderStatusCode;
import io.vengine.api.v1.buyer.enums.EnumRole;
import io.vengine.api.v1.buyer.enums.EnumStatus;
import io.vengine.api.v1.buyer.mapper.BuyerOrderMapper;
import io.vengine.api.v1.buyer.repository.BuyerApiInfoRepository;
import io.vengine.api.v1.buyer.repository.BuyerOrderInfoRepository;
import io.vengine.api.v1.buyer.repository.BuyerOrderItemRepository;
import io.vengine.api.v1.buyer.repository.BuyerOrderPartyRepository;
import io.vengine.api.v1.buyer.service.BuyerOrderService;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.mcl.entity.MclPreBooking;
import io.vengine.api.v1.mcl.repository.MclPreBookingPoItemRepository;
import io.vengine.api.v1.mcl.repository.MclPreBookingPoRepository;
import io.vengine.api.v1.mcl.service.MclService;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BuyerOrderServiceImpl implements BuyerOrderService {

    @Autowired
    BuyerOrderInfoRepository buyerOrderInfoRepository;

    @Autowired
    BuyerOrderItemRepository buyerOrderItemRepository;

    @Autowired
    BuyerOrderPartyRepository buyerOrderPartyRepository;

    @Autowired
    MclPreBookingPoRepository mclPreBookingPoRepository;

    @Autowired
    MclPreBookingPoItemRepository mclPreBookingPoItemRepository;

    @Autowired
    BuyerApiInfoRepository buyerApiInfoRepository;

    @Autowired
    MclService mclService;

    @Autowired
    S3Uploader s3Uploader;

    @Override
    public Page<BuyerOrderInfo> findAllBuyerOrder(String searchKeyWord, int page, int size, Company company) {
        if(searchKeyWord == null){
            searchKeyWord = "";
        }
        Specification<BuyerOrderInfo> specification = BuyerOrderSpecification.searchBuyerOrder(searchKeyWord, company);
        return buyerOrderInfoRepository.findAll(specification, PageRequest.of((page == 0) ? 0 : (page - 1), size));
    }

    @Override
    public List<MappedOrderDto> findMappedPO(Long mclOptionId, User user) {
        List<MappedOrderDto> list = new ArrayList<>();
        List<MclPreBooking> mclPreBookings = mclService.findMclPreBookingByMclOption(mclOptionId, user);
        for (MclPreBooking mclPreBooking : mclPreBookings){
            list.addAll(buyerOrderItemRepository.findMappedPO(mclPreBooking)
                    .stream().map(m-> {
                        m.setMclPreBookingId(mclPreBooking.getId());
                        return  m;
                    }).collect(Collectors.toList())
            );
        }
        return list;
    }

    @Override
    public GarmentPoDto findGarmentPoByStyle(String styleNumber, User user) {
        GarmentPoDto garmentPoDto = new GarmentPoDto();
        List<BuyerOrderItem> buyerOrderItems = buyerOrderItemRepository.findByStyleNumberAndCompanyID(styleNumber, user.getCompId().getId())
                .stream()
                .filter(item-> !item.getBuyerOrderInfo().getOrderStatusCode().equals(EnumOrderStatusCode.Cancelled)
                        && !item.getBuyerOrderInfo().getOrderClass().equals("PO Summary")
                        && item.getColor() != null)
                .collect(Collectors.toList());

        List<String> sizes = orderItemSizes(buyerOrderItems);
        garmentPoDto.setOrderSummaries(getGarmentPoSummary(buyerOrderItems, sizes));
        garmentPoDto.setOrderDetails(getGarmentPoDetail(buyerOrderItems, sizes));
        return garmentPoDto;
    }

    @Override
    public GarmentPoDto findGarmentPoByDesign(CBDCover cover, User user) {
        GarmentPoDto garmentPoDto = new GarmentPoDto();
        List<BuyerOrderItem> buyerOrderItems = buyerOrderItemRepository.findByCbdCover(cover);

        List<String> sizes = orderItemSizes(buyerOrderItems);
        garmentPoDto.setOrderSummaries(getGarmentPoSummary(buyerOrderItems, sizes));
        garmentPoDto.setOrderDetails(getGarmentPoDetail(buyerOrderItems, sizes));
        return garmentPoDto;
    }

    @Override
    public ExcelResponse buyerOrderReadExcel(MultipartFile file) {
        ExcelResponse excelResponse = new ExcelResponse();
        try {
            ExcelReader excelReader = new ExcelReader(file, OrderExcelDto::from);

            excelResponse.setExcelList((List) excelReader.getExcelList().stream().limit(20).collect(Collectors.toList()));
            excelResponse.setErrorList(excelReader.getErrorFieldList());
            if(excelResponse.getErrorList().size() == 0){
                excelResponse.setFileName(s3Uploader.excelDataUpload(new Gson().toJson(excelReader.getExcelList())));
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
        return excelResponse;
    }

    @Override
    @Transactional
    public void saveBuyerOrderExcel(String buyer, String brand, String programType, String fileName, User user) {
        String excelDataJson = "";
        try{
            excelDataJson = s3Uploader.getData(fileName);

            List<OrderExcelDto> orderExcelDtoList = new Gson().fromJson(excelDataJson, new TypeToken<List<OrderExcelDto>>(){}.getType());
            log.info("excel data: {}", orderExcelDtoList);

            List<String> poNumbers = orderExcelDtoList.stream()
                    .map(i->i.getPoNumber())
                    .distinct()
                    .collect(Collectors.toList());

            for (OrderExcelDto orderExcel: orderExcelDtoList){
                BuyerOrderInfo buyerOrderInfo =  buyerOrderInfoRepository.findByCompanyIDAndDocumentRefNumber(user.getCompId().getId(), orderExcel.getPoNumber());

                if(buyerOrderInfo == null){
                    buyerOrderInfo = transferTo(orderExcel, buyer, brand, programType, user);
                }else{
                    BuyerOrderMapper.INSTANCE.toBuyerOrder(orderExcel, buyer, brand, programType, buyerOrderInfo);
                }
                BuyerOrderInfo resultOrderInfo = buyerOrderInfoRepository.save(buyerOrderInfo);

                // buyer order Item save
                BuyerOrderItem orderItem = buyerOrderItemRepository.findByBuyerOrderInfoAndSku(resultOrderInfo, orderExcel.getSku());

                if(orderItem == null){
                    orderItem = transferTo(orderExcel, user, resultOrderInfo);
                }else{
                    BuyerOrderMapper.INSTANCE.toBuyerOrderItem(orderExcel, orderItem);
                    double qty = 0;
                    if(orderExcel.getQty() != null){
                        qty = Double.valueOf(orderItem.getQty());
                    }
                    double unitPrice = 0;
                    if(orderExcel.getUnitPrice() != null){
                        unitPrice = Double.valueOf(orderItem.getPricePerUnit());
                    }
                    orderItem.setTotalPrice(
                            String.valueOf(FormattingUtil.withMathRound(qty*unitPrice, 2))
                    );
                }
                buyerOrderItemRepository.save(orderItem);

                //buyer order info order quantity 계산
                resultOrderInfo.setOrderedQuantity(
                        resultOrderInfo.getBuyerOrderItems()
                        .stream().mapToInt(i->Integer.parseInt(i.getQty())).sum()
                );
                buyerOrderInfoRepository.save(resultOrderInfo);
            }
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }

    private BuyerOrderItem transferTo(OrderExcelDto orderExcel, User user, BuyerOrderInfo buyerOrderInfo) {
        BuyerOrderItem buyerOrderItem = new BuyerOrderItem();

        buyerOrderItem.setColor(orderExcel.getColor());
        buyerOrderItem.setSize(orderExcel.getSize());
        buyerOrderItem.setQty(orderExcel.getQty());
        buyerOrderItem.setPricePerUnit(orderExcel.getUnitPrice());

        double qty = 0;
        if(orderExcel.getQty() != null){
            qty = Double.valueOf(orderExcel.getQty());
        }
        double unitPrice = 0;
        if(orderExcel.getUnitPrice() != null){
            unitPrice = Double.valueOf(orderExcel.getUnitPrice());
        }
        buyerOrderItem.setTotalPrice(
                String.valueOf(FormattingUtil.withMathRound(qty*unitPrice, 2))
        );
        buyerOrderItem.setPrepackType("Bulk");
        buyerOrderItem.setSku(orderExcel.getSku());
        buyerOrderItem.setStyleNumber(orderExcel.getStyle());
        buyerOrderItem.setItemTypeCode("Main");
        buyerOrderItem.setCompanyID(user.getCompId().getId());
        buyerOrderItem.setUserID(user.getEmail());
        buyerOrderItem.setBuyerOrderInfo(buyerOrderInfo);
        LocalDateTime localDateTime = LocalDateTime.now();
        buyerOrderItem.setCreatedAt(Timestamp.valueOf(localDateTime));
        return buyerOrderItem;
    }

    private BuyerOrderInfo transferTo(OrderExcelDto orderExcel, String buyer, String brand, String programType, User user) {
        BuyerOrderInfo buyerOrderInfo = new BuyerOrderInfo();

        buyerOrderInfo.setBuyer(buyer);
        buyerOrderInfo.setObjectType("OrderDetail");
        buyerOrderInfo.setDocumentType("ManualPurchaseOrder");
        buyerOrderInfo.setDocumentRefNumber(orderExcel.getPoNumber());
        buyerOrderInfo.setStatus(EnumStatus.Issued);
        buyerOrderInfo.setOrderStatusCode(EnumOrderStatusCode.New);
        buyerOrderInfo.setOrderClass("PO Manual");
        buyerOrderInfo.setDestinationCountry(orderExcel.getDestinationCountry());
        buyerOrderInfo.setOriginCountry(orderExcel.getOriginCountry());
        buyerOrderInfo.setBrand(brand);
        buyerOrderInfo.setEarliestDate(orderExcel.getStart());
        buyerOrderInfo.setLatestDate(orderExcel.getEnd());
        buyerOrderInfo.setBuildTypeCode(programType);
        buyerOrderInfo.setIncotermCode(orderExcel.getIncoterms());
        buyerOrderInfo.setCompanyID(user.getCompId().getId());
        buyerOrderInfo.setUserID(user.getEmail());
        buyerOrderInfo.setCurrencyCode("USD");
        buyerOrderInfo.setMarketDesc(orderExcel.getMarket());
        LocalDateTime localDateTime = LocalDateTime.now();
        buyerOrderInfo.setTimestamp(Timestamp.valueOf(localDateTime));
        buyerOrderInfo.setCreatedAt(Timestamp.valueOf(localDateTime));
        return buyerOrderInfo;
    }

    @Override
    public List<BuyerApiInfoResponse> findBuyerApiInfo() {
        return BuyerOrderMapper.INSTANCE.toBuyerApiResponse(buyerApiInfoRepository.findAll());
    }

    @Override
    public void saveBuyerApiInfo(BuyerApiInfoRequest buyerApiInfoRequest) {
        BuyerApiInfo buyerApiInfo = BuyerOrderMapper.INSTANCE.toBuyerApiInfo(buyerApiInfoRequest);
        buyerApiInfoRepository.save(buyerApiInfo);
    }

    private List<String> orderItemSizes(List<BuyerOrderItem> buyerOrderItems) {
        return buyerOrderItems
                .stream()
                .map(BuyerOrderItem::getSize)
                .distinct().collect(Collectors.toList());
    }

    private List<GarmentPoDto.OrderDetail> getGarmentPoDetail(List<BuyerOrderItem> buyerOrderItems, List<String> sizes) {
        List<GarmentPoDto.OrderDetail> orderDetails = BuyerOrderMapper.INSTANCE.toOrderDetail(
                buyerOrderItems
                        .stream()
                        .map(BuyerOrderItem::getBuyerOrderInfo)
                        .distinct().collect(Collectors.toList())
        );

        return orderDetails.stream()
                    .map(detailItem-> {
                        detailItem.setOrderSummaries(
                                getGarmentPoSummary(
                                        buyerOrderItemRepository.findByBuyerOrderInfo(BuyerOrderMapper.INSTANCE.toOrder(detailItem.getBuyerOrderID())), sizes)
                        );
                        BuyerOrderParty buyerOrderParty = buyerOrderPartyRepository
                                .findByBuyerOrderInfoAndRole(BuyerOrderMapper.INSTANCE.toOrder(detailItem.getBuyerOrderID()), EnumRole.Factory);

                        if(buyerOrderParty != null){
                            detailItem.setFactory(
                                    buyerOrderParty.getName()
                            );
                        }
                       return detailItem;
                    }).collect(Collectors.toList());
    }

    private List<GarmentPoDto.OrderSummary> getGarmentPoSummary(List<BuyerOrderItem> buyerOrderItems, List<String> sizes) {
        List<GarmentPoDto.OrderSummary> orderSummaries = BuyerOrderMapper.INSTANCE.toOrderSummary(
                buyerOrderItems
                        .parallelStream()
                        .map(item-> new BuyerOrderItem(item.getStyleNumber(), item.getColor(), item.getQty(), item.getTotalPrice(), item.getBuyerOrderInfo()))
                        .collect(
                                Collectors.toMap(
                                        sum -> sum.getColor(),
                                        Function.identity(),
                                        (sum1, sum2) -> new BuyerOrderItem(
                                                sum1.getStyleNumber(),
                                                sum1.getColor(),
                                                String.valueOf(Integer.parseInt(sum1.getQty())+ Integer.parseInt(sum2.getQty())),
                                                String.valueOf(Math.round((Float.parseFloat(sum1.getTotalPrice())+Float.parseFloat(sum2.getTotalPrice()))*100)/100.0),
                                                sum1.getBuyerOrderInfo()
                                        )
                                )
                        )
                        .values().stream().collect(Collectors.toList())
        );

        return orderSummaries.stream()
                    .map(summaryItem-> {
                    summaryItem.setUnitPrice(String.valueOf(Math.round((Float.parseFloat(summaryItem.getAmount())/Float.parseFloat(summaryItem.getTotalQty()))*100)/100.0));

                    List<GarmentPoDto.OrderSummary.SizeQuantity> sizeQuantities = new ArrayList<>();
                    for (String size: sizes){
                        sizeQuantities.add(
                                new GarmentPoDto.OrderSummary.SizeQuantity(size,
                                        buyerOrderItems.parallelStream()
                                                .filter(item -> item.getColor().equals(summaryItem.getColor()) && item.getSize().equals(size))
                                                .map(BuyerOrderItem::getQty)
                                                .reduce((a, b)-> String.valueOf(Integer.parseInt(a)+Integer.parseInt(b)))
                                                .orElse("0")
                                        )
                        );
                    }
                    summaryItem.setSizeQuantity(sizeQuantities);
                    BuyerOrderParty buyerOrderParty = buyerOrderPartyRepository
                                .findByBuyerOrderInfoAndRole(BuyerOrderMapper.INSTANCE.toOrder(summaryItem.getBuyerOrderID()), EnumRole.Factory);

                    if(buyerOrderParty != null){
                        summaryItem.setFactory(
                                buyerOrderParty.getName()
                        );
                    }
                    return summaryItem;
                }).collect(Collectors.toList());
    }
}
