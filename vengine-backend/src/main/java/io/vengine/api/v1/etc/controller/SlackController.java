package io.vengine.api.v1.etc.controller;

import io.vengine.api.v1.etc.slack.SlackMessageDto;
import io.vengine.api.v1.etc.slack.SlackSenderManager;
import io.vengine.api.v1.etc.slack.SlackTarget;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

@ApiIgnore
@RestController
@AllArgsConstructor
@RequestMapping(value = "/v1")
public class SlackController {
    private SlackSenderManager slackSenderManager;

    @PostMapping("/slack/basic/{type}")
    public void basic(@PathVariable String type, @RequestBody SlackMessageDto.Basic dto) throws Exception {
        if("dev".equals(type)){
            slackSenderManager.send(SlackTarget.CH_BOT_VENGINE_DEV, dto);
        }else if("po".equals(type)){
            slackSenderManager.send(SlackTarget.CH_BOT_PO, dto);
        }else if("invoice".equals(type)){
            slackSenderManager.send(SlackTarget.CH_BOT_INVOICE, dto);
        }else if("packing".equals(type)){
            slackSenderManager.send(SlackTarget.CH_BOT_PACKINGLIST, dto);
        }else{
            throw new Exception(type+" invalid ");
        }

    }

    @PostMapping("/slack/attachment")
    public void attachment(@RequestBody SlackMessageDto.Attachments dto) {
        slackSenderManager.send(SlackTarget.CH_BOT_VENGINE_DEV, dto);
    }

    @PostMapping("/slack/button")
    public void button(@RequestBody SlackMessageDto.MessageButtons dto) {
        slackSenderManager.send(SlackTarget.CH_BOT_VENGINE_DEV, dto);
    }

}
