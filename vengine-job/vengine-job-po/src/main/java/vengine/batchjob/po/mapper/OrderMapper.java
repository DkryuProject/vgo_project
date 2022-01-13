package vengine.batchjob.po.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import vengine.batchjob.po.dto.*;

import java.util.List;

@Repository
@Mapper
public interface OrderMapper {
    String selectLatestAcceptedOn(Long company);

    String selectLatestAssignedOn(Long companyID);

    String selectLatestCancelledOn(Long companyID);

    OrderDto selectPurchaseOrderByUid(String uid);

    OrderDto selectPurchaseOrderByDocumentId(String documentId, Long companyID);

    List<OrderDto> selectByStatusAndOrderStatusCodeAndDocumentRefNumber(String status, String orderStatus, String documentRefNumber, Long companyID);

    void cancelledPurchaseOrder(OrderDto orderDto);

    void acceptedPurchaseOrder(OrderDto orderDto);

    void acceptedPurchaseOrderAmendment(OrderDto orderDto);

    void insertPurchaseOrder(OrderDto orderDto);

    void updatePurchaseOrder(OrderDto orderDto);

    void insertOrderChangeDescription(OrderChangeDescriptionDto orderChangeDescriptionDto);

    void insertOrderParty(OrderPartyDto orderPartyDto);

    void insertOrderItem(OrderItemDto orderItemDto);

    void deleteOrderParty(Long buyerOrderInfoId);

    OrderItemDto searchItemByItemUid(String itemUid, Long companyID);

    void updateOrderItem(OrderItemDto orderItemDto);

    void deleteOrderChangeDescription(Long buyerOrderInfoId);

    List<BuyerApiInfoDto> searchBuyerApiInfo();

    List<OrderItemDto> selectOrderItems(Long orderId, Long companyID);

    void updateOrderInfo(OrderDto orderDto);
}
