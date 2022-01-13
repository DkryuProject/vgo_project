package vgo.mail.config;

import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.batch.core.configuration.JobLocator;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.configuration.support.JobRegistryBeanPostProcessor;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.PropertiesFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import vgo.mail.job.BatchJob;

import java.io.IOException;
import java.util.Properties;

@Slf4j
@Configuration
public class SchedulingConfiguration {
    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private JobLocator jobLocator;

    @Bean
    public JobRegistryBeanPostProcessor jobRegistryBeanPostProcessor(JobRegistry jobRegistry) {
        JobRegistryBeanPostProcessor jobRegistryBeanPostProcessor = new JobRegistryBeanPostProcessor();
        jobRegistryBeanPostProcessor.setJobRegistry(jobRegistry);
        return jobRegistryBeanPostProcessor;
    }

    @Bean
    public JobDetail jobMailSend() {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("jobName", "MAIL_SEND_JOB");
        jobDataMap.put("jobLauncher", jobLauncher);
        jobDataMap.put("jobLocator", jobLocator);

        return JobBuilder.newJob(BatchJob.class)
                .withIdentity("MAIL_SEND_JOB")
                .setJobData(jobDataMap)
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger jobMailSendTrigger()
    {
        return TriggerBuilder
                .newTrigger()
                .forJob(jobMailSend())
                .withIdentity("jobMailSendTrigger")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 0/1 * * * ?"))
                .build();
    }

    @Bean
    public JobDetail jobMaterialCheck() {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("jobName", "MATERIAL_CHECK_JOB");
        jobDataMap.put("jobLauncher", jobLauncher);
        jobDataMap.put("jobLocator", jobLocator);

        return JobBuilder.newJob(BatchJob.class)
                .withIdentity("MATERIAL_CHECK_JOB")
                .setJobData(jobDataMap)
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger jobMaterialCheckTrigger()
    {
        return TriggerBuilder
                .newTrigger()
                .forJob(jobMaterialCheck())
                .withIdentity("jobMaterialCheckTrigger")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 0 6 * * ?"))
                .build();
    }

    @Bean
    public SchedulerFactoryBean schedulerFactoryBean() throws IOException
    {
        SchedulerFactoryBean scheduler = new SchedulerFactoryBean();
        scheduler.setTriggers(jobMailSendTrigger(), jobMaterialCheckTrigger());
        scheduler.setQuartzProperties(quartzProperties());
        scheduler.setJobDetails(jobMailSend(), jobMaterialCheck());
        return scheduler;
    }

    @Bean
    public Properties quartzProperties() throws IOException
    {
        PropertiesFactoryBean propertiesFactoryBean = new PropertiesFactoryBean();
        propertiesFactoryBean.setLocation(new ClassPathResource("/quartz.properties"));
        propertiesFactoryBean.afterPropertiesSet();
        return propertiesFactoryBean.getObject();
    }
}
