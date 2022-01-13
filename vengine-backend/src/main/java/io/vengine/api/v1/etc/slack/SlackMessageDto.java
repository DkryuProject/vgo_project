package io.vengine.api.v1.etc.slack;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;
import lombok.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

public class SlackMessageDto {

    @Getter
    @NoArgsConstructor
    public static class Basic {
        private String text;

        @Builder
        public Basic(String text) {
            this.text = text;
        }
    }


    @Getter
    public static class Attachments {
        private Props props;
        private List<Attachment> attachments;

        public Attachments() {
            attachments = new ArrayList<>();
        }

        public Attachments(List<Attachment> attachments) {
            this.attachments = attachments;
        }

        public Attachments(Attachment attachment) {
            this();
            this.attachments.add(attachment);
        }

        public void addProps(Exception e) {
            props = new Props(e);
        }
    }

    @Getter
    @NoArgsConstructor
    public static class MessageButtons {
        private String text;
        private List<MessageButtonAttachment> attachments;

        @Builder
        public MessageButtons(String text, List<MessageButtonAttachment> attachments) {
            this.text = text;
            this.attachments = attachments;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class MessageButtonAttachment {
        private String text;
        private String fallback;
        @JsonProperty("callback_id")
        private String callbackId;
        private String color;
        @JsonProperty("attachment_type")
        private String attachmentType;
        private List<Action> actions;

        @Builder
        public MessageButtonAttachment(String text, String fallback, String callbackId, String color, String attachmentType, List<Action> actions) {
            this.text = text;
            this.fallback = fallback;
            this.callbackId = callbackId;
            this.color = color;
            this.attachmentType = attachmentType;
            this.actions = actions;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class Action {
        private String name;
        private String text;
        private String type;
        private String value;
        private Confirm confirm;

        @Builder
        public Action(String name, String text, String type, String value, Confirm confirm) {
            this.name = name;
            this.text = text;
            this.type = type;
            this.value = value;
            this.confirm = confirm;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class Confirm {
        private String title;
        private String text;
        @JsonProperty("ok_text")
        private String okText;
        @JsonProperty("dismiss_text")
        private String dismissText;

        @Builder
        public Confirm(String title, String text, String okText, String dismissText) {
            this.title = title;
            this.text = text;
            this.okText = okText;
            this.dismissText = dismissText;
        }
    }

    @Getter
    @AllArgsConstructor
    @Builder
    @ToString
    public static class Attachment {
        private String channel;

        private String pretext;

        private String color;

        @SerializedName("author_name")
        private String authorName;

        @SerializedName("author_icon")
        private String authorIcon;

        private String title;

        private String text;

        private String footer;

        public Attachment addExceptionInfo(Exception e) {
            this.title = e.getClass().getSimpleName();
            StringBuilder sb = new StringBuilder(text);

            sb.append("**Error Message**").append("\n").append("\n").append(e.getMessage()).append("\n").append("\n");

            this.text = sb.toString();

            return this;
        }

        public Attachment addExceptionInfo(Exception e, String uri) {
            this.addExceptionInfo(e);
            StringBuilder sb = new StringBuilder(text);

            sb.append("**Reqeust URL**").append("\n").append("\n").append(uri).append("\n").append("\n");

            this.text = sb.toString();
            return this;
        }

        public Attachment addExceptionInfo(Exception e, String uri, String params) {
            this.addExceptionInfo(e, uri);
            StringBuilder sb = new StringBuilder(text);

            sb.append("**Parameters**").append("\n").append("\n").append(params.toString()).append("\n").append("\n");

            this.text = sb.toString();
            return this;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class Field {
        private String title;
        private String value;

        @Builder
        public Field(String title) {
            this.title = title;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class Props {
        private String card;

        public Props(Exception e) {
            StringBuilder text = new StringBuilder();

            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            text.append("**Stack Trace**").append("\n").append("\n");
            text.append(sw.toString().substring(0,
                    Math.min(5500, sw.toString().length())) + "\n...").append("\n").append("\n");

            this.card = text.toString();
        }
    }
}
