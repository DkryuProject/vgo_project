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
import vgo.mail.service.MaterialCheckTasklet;
import vgo.mail.service.MaterialService;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class MaterialCheckJob {
    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final MaterialService materialService;

    @Bean
    public Tasklet materialCheckTasklet(MaterialService materialService) {
        return new MaterialCheckTasklet(materialService);
    }

    @Bean(name = "MATERIAL_CHECK_JOB")
    public Job job(){
        return jobBuilderFactory.get("MATERIAL_CHECK_JOB")
                .start(materialCheckStep())
                .build();
    }

    private Step materialCheckStep() {
        return stepBuilderFactory.get("materialCheckStep")
                .tasklet(materialCheckTasklet(materialService))
                .build();
    }
}
