package vgo.mail.job;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vgo.mail.service.MailSendService;
import vgo.mail.service.MailSendTasklet;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class MailSendJob {
    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final MailSendService mailSendService;

    @Bean
    public Tasklet mailSendTasklet(MailSendService mailSendService){
        return new MailSendTasklet(mailSendService);
    }

    @Bean(name = "MAIL_SEND_JOB")
    public Job job(){
        return jobBuilderFactory.get("MAIL_SEND_JOB")
                .start(mailSendStep())
                .build();
    }

    private Step mailSendStep() {
        return stepBuilderFactory.get("mailSendStep")
                .tasklet(mailSendTasklet(mailSendService))
                .build();
    }
}
