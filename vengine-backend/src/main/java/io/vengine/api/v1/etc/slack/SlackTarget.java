package io.vengine.api.v1.etc.slack;

import lombok.Getter;

@Getter
public enum SlackTarget {
    CH_BOT_VENGINE_DEV("https://hooks.slack.com/services/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", "dev_slack"),
    CH_BOT_PO("https://hooks.slack.com/services/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", "gt_nexus_order"),
    CH_BOT_INVOICE("https://hooks.slack.com/services/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", "gt_nexus_invoice"),
    CH_BOT_PACKINGLIST("https://hooks.slack.com/services/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", "gt_nexus_packinglist"),
    CH_BOT_USERCONFIRM("https://hooks.slack.com/services/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", "vengine_user_mgt"),
    ;

    private final String webHookUrl;
    private final String channel;

    SlackTarget(String webHookUrl, String channel) {
        this.webHookUrl = webHookUrl;
        this.channel = channel;
    }
}
