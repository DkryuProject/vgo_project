package vengine.batchjob.invoice.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import vengine.batchjob.invoice.dto.BuyerApiInfoDto;
import vengine.batchjob.invoice.dto.OrderDto;
import vengine.batchjob.invoice.dto.OrderItemDto;

import java.util.List;

@Repository
@Mapper
public interface OrderMapper {
    List<OrderDto> selectByStatusAndOrderStatusCodeAndDocumentRefNumber(String status, String orderStatus, String documentRefNumber, Long companyID);

    List<OrderItemDto> selectOrderItems(Long orderId, Long companyID);

    void updateOrderInfo(OrderDto orderDto);

    List<BuyerApiInfoDto> searchBuyerApiInfo();
}
