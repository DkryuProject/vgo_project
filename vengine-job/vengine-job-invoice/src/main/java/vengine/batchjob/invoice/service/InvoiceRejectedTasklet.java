package vengine.batchjob.invoice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import vengine.batchjob.invoice.config.MatterMostSender;
import vengine.batchjob.invoice.dto.BuyerApiInfoDto;
import vengine.batchjob.invoice.infornexus.InforNexusExecuteTask;
import vengine.batchjob.invoice.infornexus.model.InforNexusInvoiceAcknowledgementQ2;
import vengine.batchjob.invoice.infornexus.model.InforNexusTask;
import vengine.batchjob.invoice.mapper.OrderMapper;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

@Slf4j
public class InvoiceRejectedTasklet implements Tasklet, StepExecutionListener {
    @Autowired
    OrderMapper orderMapper;

    @Autowired
    private MatterMostSender matterMostSender;

    private final  InterfaceService interfaceService;

    public InvoiceRejectedTasklet(InterfaceService interfaceService) {
        this.interfaceService = interfaceService;
    }

    @Override
    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext){
        List<BuyerApiInfoDto> buyerApiInfoDtos = orderMapper.searchBuyerApiInfo();

        for (BuyerApiInfoDto buyerApiInfoDto: buyerApiInfoDtos){
            String latestDateTimeUTC = interfaceService.findLatestRejectedDate(buyerApiInfoDto.getCompany());

            if(latestDateTimeUTC == null){
                latestDateTimeUTC = "2021-01-01T00:00:00Z";
            }
            log.info("Company ID("+buyerApiInfoDto.getCompany()+") rejected invoice start :" + latestDateTimeUTC);
            try {
                InterfaceInfoNexusExternalApi api = new InforNexusExecuteTask();
                api.invoiceRejected(latestDateTimeUTC,  buyerApiInfoDto, this);
            } catch (Exception e) {
                e.printStackTrace();
                matterMostSender.sendMessage(e);
            }
            log.info("Company ID("+buyerApiInfoDto.getCompany()+") rejected invoice end :" + latestDateTimeUTC);
        }
        return RepeatStatus.FINISHED;
    }

    public void rejectedInvoiceCallBack(InforNexusTask.Result result, InforNexusInvoiceAcknowledgementQ2 inforNexusInvoiceAcknowledgementQ2, Long companyID) {
        try {
            interfaceService.rejectedInvoice(result, inforNexusInvoiceAcknowledgementQ2, companyID);
        }catch (Exception e){
            e.printStackTrace();
            matterMostSender.sendMessage(e);
        }
    }

    @Override
    public void beforeStep(StepExecution stepExecution) {

    }

    @Override
    public ExitStatus afterStep(StepExecution stepExecution) {
        return null;
    }
}
