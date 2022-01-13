package vengine.batchjob.po.dto;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@Builder
@ToString
public class SlackDto {

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

    public SlackDto addExceptionInfo(Exception e) {
        this.title = e.getClass().getSimpleName();
        StringBuilder sb = new StringBuilder(text);

        sb.append("**Error Message**").append("\n").append("\n").append(e.getMessage()).append("\n").append("\n");

        this.text = sb.toString();

        return this;
    }
}
