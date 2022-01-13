package io.vengine.api.v1.dashboard.service;

import io.vengine.api.common.enums.OrderStatus;
import io.vengine.api.v1.cbd.repository.CBDCoverRepository;
import io.vengine.api.v1.cbd.repository.CBDOptionRepository;
import io.vengine.api.v1.dashboard.dto.DailyOrderDto;
import io.vengine.api.v1.dashboard.dto.MonthlyCountDto;
import io.vengine.api.v1.dashboard.dto.OrderCountDto;
import io.vengine.api.v1.mcl.repository.MclMaterialAdhocPurchaseOrderPublishRepository;
import io.vengine.api.v1.mcl.repository.MclMaterialPurchaseOrderRepository;
import io.vengine.api.v1.mcl.repository.MclOptionRepository;
import io.vengine.api.v1.supplier.repository.SupplierAdhocPoCheckingRepository;
import io.vengine.api.v1.supplier.repository.SupplierPoCheckingRepository;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class DashBordService {

    @Autowired
    CBDCoverRepository cbdCoverRepository;

    @Autowired
    CBDOptionRepository cbdOptionRepository;

    @Autowired
    MclOptionRepository mclOptionRepository;

    @Autowired
    MclMaterialPurchaseOrderRepository mclMaterialPurchaseOrderRepository;

    @Autowired
    MclMaterialAdhocPurchaseOrderPublishRepository adhocPurchaseOrderPublishRepository;

    @Autowired
    SupplierPoCheckingRepository poCheckingRepository;

    @Autowired
    SupplierAdhocPoCheckingRepository adhocPoCheckingRepository;

    public MonthlyCountDto findDashBoardCountByMonth(Company company, int year, int month) {
        List<DailyOrderDto> createdOrders =  mclMaterialPurchaseOrderRepository.findOrders(company, null, year, month);
        List<DailyOrderDto> createdAdhocOrders =  adhocPurchaseOrderPublishRepository.findOrders(company, null, year, month);
        List<DailyOrderDto> confirmOrders =  poCheckingRepository.findOrders(company, "confirm", year, month);
        List<DailyOrderDto> confirmAdhocOrders =  adhocPoCheckingRepository.findOrders(company, "confirm", year, month);
        List<DailyOrderDto> revertOrders =  poCheckingRepository.findOrders(company, "revert", year, month);
        List<DailyOrderDto> revertAdhocOrders =  adhocPoCheckingRepository.findOrders(company, "revert", year, month);

        return MonthlyCountDto.builder()
                .month(month+"")
                .coverCount(cbdCoverRepository.findCbdCoverCountByMonth(company, year, month))
                .cbdOptionCount(cbdOptionRepository.findCbdOptionCountByMonth(company, year, month))
                .mclOptionCount(mclOptionRepository.findMclOptionCountByMonth(company, year, month))
                .poCount(
                        OrderCountDto.builder()
                                .created(createdOrders.size())
                                .confirm(confirmOrders.size())
                                .revert(revertOrders.size())
                                .build()
                )
                .adhocPoCount(
                        OrderCountDto.builder()
                                .created(createdAdhocOrders.size())
                                .confirm(confirmAdhocOrders.size())
                                .revert(revertAdhocOrders.size())
                                .build()
                )
                .createdOrders(Stream.of(createdOrders, createdAdhocOrders)
                        .flatMap(x-> x.stream())
                        .collect(Collectors.toList())
                )
                .confirmOrders(Stream.of(confirmOrders, confirmAdhocOrders)
                        .flatMap(x-> x.stream())
                        .collect(Collectors.toList())
                )
                .revertOrders(Stream.of(revertOrders, revertAdhocOrders)
                        .flatMap(x-> x.stream())
                        .collect(Collectors.toList())
                )
                .build();
    }
}
