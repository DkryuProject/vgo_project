package vgo.mail.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaterialDto {
    private String companyName;

    private String userCompanyName;

    private String materialName;

    private Long supplierCompanyID;

    private String supplierCompany;

    private String registerCompany;

    private Long registerCompanyID;

    private int cnt;
}
