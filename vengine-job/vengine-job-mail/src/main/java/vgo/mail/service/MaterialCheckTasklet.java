package vgo.mail.service;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import vgo.mail.config.MatterMostSender;
import vgo.mail.dto.MaterialDto;

import java.util.List;

public class MaterialCheckTasklet implements Tasklet, StepExecutionListener {
    @Autowired
    private MatterMostSender matterMostSender;

    private final MaterialService materialService;

    public MaterialCheckTasklet(MaterialService materialService) {
        this.materialService = materialService;
    }

    @Override
    public void beforeStep(StepExecution stepExecution) {
        
    }

    @Override
    public ExitStatus afterStep(StepExecution stepExecution) {
        return null;
    }

    @Override
    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) {
        try {
            List<MaterialDto> materialDtoList = materialService.searchMaterialList();
            for(MaterialDto materialDto: materialDtoList){
                materialService.mailSend(materialDto);
            }
        }catch (Exception e){
            e.printStackTrace();
            matterMostSender.sendMessage(e);
        }
        return RepeatStatus.FINISHED;
    }
}
