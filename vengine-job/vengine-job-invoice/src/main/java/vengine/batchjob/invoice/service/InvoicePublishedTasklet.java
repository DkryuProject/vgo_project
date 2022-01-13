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
import vengine.batchjob.invoice.infornexus.model.InforNexusInvoiceDetail;
import vengine.batchjob.invoice.infornexus.model.InforNexusPackingListDetail;
import vengine.batchjob.invoice.infornexus.model.InforNexusTask;
import vengine.batchjob.invoice.mapper.OrderMapper;

import java.util.List;

@Slf4j
public class InvoicePublishedTasklet implements Tasklet, StepExecutionListener {
    @Autowired
    OrderMapper orderMapper;

    @Autowired
    private MatterMostSender matterMostSender;

    private final  InterfaceService interfaceService;

    public InvoicePublishedTasklet(InterfaceService interfaceService) {
        this.interfaceService = interfaceService;
    }

    @Override
    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext){
        List<BuyerApiInfoDto> buyerApiInfoDtos = orderMapper.searchBuyerApiInfo();

        for (BuyerApiInfoDto buyerApiInfoDto: buyerApiInfoDtos){
            String latestDateTimeUTC = interfaceService.findLatestPublishedDate(buyerApiInfoDto.getCompany());

            if(latestDateTimeUTC == null){
                latestDateTimeUTC = "2021-01-01T00:00:00Z";
            }
            log.info("Company ID("+buyerApiInfoDto.getCompany()+") published invoice start :" + latestDateTimeUTC);

            try {
                InterfaceInfoNexusExternalApi api = new InforNexusExecuteTask();
                api.invoicePublished(latestDateTimeUTC,  buyerApiInfoDto, this);
            } catch (Exception e) {
                e.printStackTrace();
                matterMostSender.sendMessage(e);
            }

            log.info("Company ID("+buyerApiInfoDto.getCompany()+") published invoice end :" + latestDateTimeUTC);
        }

        return RepeatStatus.FINISHED;
    }

    public void publishedInvoiceCallBack(InforNexusTask.Result result, InforNexusInvoiceDetail inforNexusInvoiceDetail, InforNexusPackingListDetail inforNexusPackingListDetail, Long companyID) {
        try {
            interfaceService.publishedInvoice(result, inforNexusInvoiceDetail, inforNexusPackingListDetail, companyID);
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
