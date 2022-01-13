package vengine.batchjob.invoice.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import vengine.batchjob.invoice.dto.InvoiceDto;

import java.util.List;
import java.util.Optional;

@Repository
@Mapper
public interface InvoiceMapper {
    String selectLatestPublishedDate(Long companyID);

    String selectLatestDraftedDate(Long companyID);

    String selectLatestRejectedDate(Long companyID);

    Optional<InvoiceDto> selectInvoiceByInvoiceUid(String invoiceUid, Long companyID);

    void insertInvoice(InvoiceDto invoiceDto);

    void updateInvoice(InvoiceDto invoiceDto);

    void rejectedInvoice(InvoiceDto invoiceDto);

    List<InvoiceDto> selectInvoiceByStatusAndInvoiceNumber(String status, String invoiceNumber, Long companyID);
}
