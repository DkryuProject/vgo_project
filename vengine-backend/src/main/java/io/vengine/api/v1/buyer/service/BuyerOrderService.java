package io.vengine.api.v1.buyer.service;

import io.vengine.api.common.dto.ExcelResponse;
import io.vengine.api.v1.buyer.dto.BuyerApiInfoRequest;
import io.vengine.api.v1.buyer.dto.BuyerApiInfoResponse;
import io.vengine.api.v1.buyer.dto.GarmentPoDto;
import io.vengine.api.v1.buyer.dto.MappedOrderDto;
import io.vengine.api.v1.buyer.entity.BuyerOrderInfo;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BuyerOrderService {
    Page<BuyerOrderInfo> findAllBuyerOrder(String searchKeyWord, int page, int size, Company compId);

    List<MappedOrderDto> findMappedPO(Long mclOptionId, User user);

    GarmentPoDto findGarmentPoByStyle(String styleNumber, User user);

    GarmentPoDto findGarmentPoByDesign(CBDCover cover, User user);

    ExcelResponse buyerOrderReadExcel(MultipartFile file);

    List<BuyerApiInfoResponse> findBuyerApiInfo();

    void saveBuyerApiInfo(BuyerApiInfoRequest buyerApiInfoRequest);

    void saveBuyerOrderExcel(String buyer, String brand, String programType, String fileName, User user);
}
