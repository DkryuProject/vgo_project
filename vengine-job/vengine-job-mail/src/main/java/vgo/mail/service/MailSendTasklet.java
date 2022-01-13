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
import vgo.mail.dto.MailDto;

import java.util.List;

public class MailSendTasklet implements Tasklet, StepExecutionListener {
    @Autowired
    private MatterMostSender matterMostSender;

    private final MailSendService mailSendService;

    public MailSendTasklet(MailSendService mailSendService) {
        this.mailSendService = mailSendService;
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
        List<MailDto> sendMailList = mailSendService.searchSendMailList();

        for (MailDto mailDto: sendMailList){
            try {
                mailSendService.mailSend(mailDto);
                mailDto.setStatus(1);
            }catch (Exception e){
                e.printStackTrace();
                mailDto.setStatus(2);
                matterMostSender.sendMessage(e);
            }
            mailSendService.updateMailStatus(mailDto);
        }
        return RepeatStatus.FINISHED;
    }
}
