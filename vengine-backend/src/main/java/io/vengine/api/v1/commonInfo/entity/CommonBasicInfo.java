package io.vengine.api.v1.commonInfo.entity;

import io.vengine.api.common.entity.CommonDateEntity;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "common_basic_info")
public class CommonBasicInfo extends CommonDateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //타입명(회사, 성별, 단위, 가먼트 종류, 국가, 통화, 원사, 인코텀즈, 포트, 선적방법, 컨테이너, 결재종류, 서류종류, 수입형태, 선박코드, 환적형태, 항공회사, 생산공정명, BL종류)
    //vendor(name), gender(name), uom(mcode, lcode), garment_category(name), country(name, scode, lcode), currency(name, lcode),
    //yarn(name), incoterms(name, lcode, year, desc), port(name, lcode, shipping_method_id, country_id),
    //shipping_method(name, type), container(type), payment(name), document(name), importation(name, type, desc),
    //carrier(name, lcode, scac_id), transit(name), airline(name, scode, lcode, n_code, country_id), production(name), bl(name, fullname, desc))
    @Column(name = "type", nullable = false, length = 30)
    private String type;

    @Column(name = "cm_name1", length = 255)
    private String cmName1;

    @Column(name = "cm_name2", length = 255)
    private String cmName2;

    @Column(name = "cm_name3", length = 255)
    private String cmName3;

    @Column(name = "cm_name4", length = 2000)
    private String cmName4;

    @Column(name = "cm_name5", length = 20)
    private Long cmName5;

    @Column(name = "cm_name6", length = 20)
    private Long cmName6;
}
