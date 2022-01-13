package vengine.batchjob.po.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import vengine.batchjob.po.config.MatterMostSender;
import vengine.batchjob.po.dto.BuyerApiInfoDto;
import vengine.batchjob.po.infornexus.InforNexusExecuteTask;
import vengine.batchjob.po.infornexus.model.InforNexusOrderDetail;
import vengine.batchjob.po.infornexus.model.InforNexusTask;
import vengine.batchjob.po.mapper.OrderMapper;

import java.util.List;

@Slf4j
public class OrderCancelledTasklet implements Tasklet, StepExecutionListener {
    @Autowired
    OrderMapper orderMapper;

    @Autowired
    private MatterMostSender matterMostSender;

    private final  InterfaceService interfaceService;

    public OrderCancelledTasklet(InterfaceService interfaceService) {
        this.interfaceService = interfaceService;
    }

    @Override
    public void beforeStep(StepExecution stepExecution) {

    }

    @Override
    public ExitStatus afterStep(StepExecution stepExecution) {
        return null;
    }

    @Override
    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext){
        List<BuyerApiInfoDto> buyerApiInfoDtos = orderMapper.searchBuyerApiInfo();

        for (BuyerApiInfoDto buyerApiInfoDto: buyerApiInfoDtos){
            String latestDateTimeUTC = orderMapper.selectLatestCancelledOn(buyerApiInfoDto.getCompany());

            if(latestDateTimeUTC == null){
                latestDateTimeUTC = "2021-01-01T00:00:00Z";
            }
            log.info("Company ID("+buyerApiInfoDto.getCompany()+") cancelled order start :" + latestDateTimeUTC);

            InterfaceInfoNexusExternalApi api = new InforNexusExecuteTask();
            try {
                api.purchaseOrderCancelled(latestDateTimeUTC, buyerApiInfoDto,this);
            } catch (Exception e) {
                e.printStackTrace();
                matterMostSender.sendMessage(e);
            }
            log.info("Company ID("+buyerApiInfoDto.getCompany()+") cancelled order end :" + latestDateTimeUTC);
        }

        return RepeatStatus.FINISHED;
    }

    public void cancelledPurchaseOrderCallBack(InforNexusTask.Result result, InforNexusOrderDetail inforNexusOrderDetail, Long companyID){
        cancelledPurchaseOrderAmendmentCallBack(result, inforNexusOrderDetail, companyID);
    }

    public void cancelledPurchaseOrderAmendmentCallBack(InforNexusTask.Result result, InforNexusOrderDetail inforNexusOrderDetail, Long companyID){
        try {
            interfaceService.cancelledPurchaseOrder(result, inforNexusOrderDetail, companyID);
        }catch (Exception e){
            e.printStackTrace();
            matterMostSender.sendMessage(e);
        }
    }
}
