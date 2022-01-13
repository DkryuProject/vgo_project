package vgo.mail.dto;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDto {
    private String poNumber;

    private String companyName;

    private String userCompanyName;
}
