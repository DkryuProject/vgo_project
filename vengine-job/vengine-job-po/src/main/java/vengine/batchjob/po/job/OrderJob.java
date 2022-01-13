package vengine.batchjob.po.job;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vengine.batchjob.po.service.*;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class OrderJob {
    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final InterfaceService interfaceService;

    @Bean
    public Tasklet orderAssignedTasklet(InterfaceService interfaceService){
        return new OrderAssignedTasklet(interfaceService);
    }

    @Bean
    public Tasklet orderAcceptedTasklet(InterfaceService interfaceService){
        return new OrderAcceptedTasklet(interfaceService);
    }

    @Bean
    public Tasklet orderCancelledTasklet(InterfaceService interfaceService){
        return new OrderCancelledTasklet(interfaceService);
    }

    @Bean
    public Tasklet invoicePublishedTasklet(InterfaceService interfaceService){
        return new InvoicePublishedTasklet(interfaceService);
    }

    @Bean
    public Tasklet invoiceDraftedTasklet(InterfaceService interfaceService){
        return new InvoiceDraftedTasklet(interfaceService);
    }

    @Bean
    public Tasklet invoiceRejectedTasklet(InterfaceService interfaceService){
        return new InvoiceRejectedTasklet(interfaceService);
    }

    @Bean(name = "ORDER_JOB")
    public Job job(){
        return jobBuilderFactory.get("ORDER_JOB")
                .start(orderAssignedStep())
                .next(orderAcceptedStep())
                .next(orderCancelledStep())
                .next(invoicePublishedStep())
                .next(invoiceDraftedStep())
                .next(invoiceRejectedStep())
                .build();
    }

    private Step orderAssignedStep() {
        return stepBuilderFactory.get("orderAssignedStep")
                .tasklet(orderAssignedTasklet(interfaceService))
                .build();
    }

    private Step orderAcceptedStep() {
        return stepBuilderFactory.get("orderAcceptedStep")
                .tasklet(orderAcceptedTasklet(interfaceService))
                .build();
    }

    private Step orderCancelledStep() {
        return stepBuilderFactory.get("orderCancelledStep")
                .tasklet(orderCancelledTasklet(interfaceService))
                .build();
    }

    private Step invoicePublishedStep() {
        return stepBuilderFactory.get("invoicePublishedStep")
                .tasklet(invoicePublishedTasklet(interfaceService))
                .build();
    }

    private Step invoiceDraftedStep() {
        return stepBuilderFactory.get("invoiceDraftedStep")
                .tasklet(invoiceDraftedTasklet(interfaceService))
                .build();
    }

    private Step invoiceRejectedStep() {
        return stepBuilderFactory.get("invoiceRejectedStep")
                .tasklet(invoiceRejectedTasklet(interfaceService))
                .build();
    }
}
