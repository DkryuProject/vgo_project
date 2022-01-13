package vengine.batchjob.invoice.job;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vengine.batchjob.invoice.service.InterfaceService;
import vengine.batchjob.invoice.service.InvoiceDraftedTasklet;
import vengine.batchjob.invoice.service.InvoicePublishedTasklet;
import vengine.batchjob.invoice.service.InvoiceRejectedTasklet;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class InvoiceJob {
    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final InterfaceService interfaceService;

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

    @Bean(name = "INVOICE_JOB")
    public Job job(){
        return jobBuilderFactory.get("INVOICE_JOB")
                .start(invoicePublishedStep())
                .next(invoiceDraftedStep())
                .next(invoiceRejectedStep())
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
