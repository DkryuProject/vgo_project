package vengine.batchjob.invoice.config;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import vengine.batchjob.invoice.dto.SlackDto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
@RequiredArgsConstructor
public class MatterMostSender {

    @Value("${notification.mattermost.enabled}")
    private boolean mmEnabled;
    @Value("${notification.mattermost.webhook-url}")
    private String webhookUrl;
    @Value("${notification.mattermost.channel}")
    private String channel;
    @Value("${notification.mattermost.preText}")
    private String preText;

    public void sendMessage(Exception excpetion) {
        if (!mmEnabled)
            return;

        try {
            SlackDto attachment = SlackDto.builder()
                    .channel(channel)
                    .color("#ff5d52")
                    .pretext(preText)
                    .title("")
                    .text("")
                    .footer(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                    .build();

            attachment.addExceptionInfo(excpetion);
            String payload = new Gson().toJson(attachment);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-type", MediaType.APPLICATION_JSON_VALUE);

            HttpEntity<String> entity = new HttpEntity<>(payload, headers);
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.postForEntity(webhookUrl, entity, String.class);

        } catch (Exception e) {
            e.printStackTrace();
            log.error("#### ERROR!! Notification Manager : {}", e.getMessage());
        }
    }
}
