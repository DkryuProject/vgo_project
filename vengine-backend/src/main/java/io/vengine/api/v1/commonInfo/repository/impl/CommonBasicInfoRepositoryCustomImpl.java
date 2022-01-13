package io.vengine.api.v1.commonInfo.repository.impl;

import com.querydsl.core.types.Projections;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.entity.QCommonBasicInfo;
import io.vengine.api.v1.commonInfo.repository.CommonBasicInfoRepositoryCustom;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;

public class CommonBasicInfoRepositoryCustomImpl extends QuerydslRepositorySupport implements CommonBasicInfoRepositoryCustom {

    public CommonBasicInfoRepositoryCustomImpl() {
        super(CommonBasicInfo.class);
    }

    @Override
    public List<String> findTypes() {
        QCommonBasicInfo qCommonBasicInfo = QCommonBasicInfo.commonBasicInfo;

        return from(qCommonBasicInfo)
                    .distinct()
                    .select(qCommonBasicInfo.type)
                    .fetch();
    }

    @Override
    public List<CommonBasicInfo> findAllCountry() {
        QCommonBasicInfo qCommonBasicInfo = QCommonBasicInfo.commonBasicInfo;
        return from(qCommonBasicInfo)
                    .where(qCommonBasicInfo.type.eq("country"), qCommonBasicInfo.cmName4.isNull())
                    .fetch();
    }

    @Override
    public List<CommonDto.IdName> findCityByCountry(String country) {
        QCommonBasicInfo qCommonBasicInfo = QCommonBasicInfo.commonBasicInfo;
        return from(qCommonBasicInfo)
                    .select(
                            Projections.bean(CommonDto.IdName.class,
                                    qCommonBasicInfo.id.as("id"),
                                    qCommonBasicInfo.cmName4.as("name")
                            )
                    )
                    .where(qCommonBasicInfo.type.eq("country"),
                            qCommonBasicInfo.cmName3.eq(country),
                            qCommonBasicInfo.cmName4.isNotNull())
                    .fetch();
    }

    @Override
    public List<CommonDto.IdName> findUomByGroup(String group) {
        QCommonBasicInfo qCommonBasicInfo = QCommonBasicInfo.commonBasicInfo;
        return from(qCommonBasicInfo)
                .select(
                        Projections.bean(CommonDto.IdName.class,
                                qCommonBasicInfo.id.as("id"),
                                qCommonBasicInfo.cmName3.as("name")
                        )
                )
                .where(qCommonBasicInfo.type.eq("uom"),
                        qCommonBasicInfo.cmName2.eq(group))
                .fetch();
    }

    @Override
    public List<String> findGarmentSizeGroups() {
        QCommonBasicInfo basicInfo = QCommonBasicInfo.commonBasicInfo;

        return from(basicInfo)
                .distinct()
                .select(basicInfo.cmName1)
                .where(basicInfo.type.eq("garment_size"))
                .fetch();
    }
}
