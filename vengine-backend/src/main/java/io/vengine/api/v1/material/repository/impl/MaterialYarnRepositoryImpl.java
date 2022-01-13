package io.vengine.api.v1.material.repository.impl;

import com.querydsl.jpa.JPAExpressions;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.material.entity.MaterialYarn;
import io.vengine.api.v1.material.entity.QMaterialYarn;
import io.vengine.api.v1.material.repository.MaterialYarnRepositoryCustom;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;

public class MaterialYarnRepositoryImpl extends QuerydslRepositorySupport implements MaterialYarnRepositoryCustom {

    public MaterialYarnRepositoryImpl() {
        super(MaterialYarn.class);
    }

    @Override
    public List<CommonBasicInfo> findChiefContents(Company company) {
        QMaterialYarn qMaterialYarn = QMaterialYarn.materialYarn;
        QMaterialYarn q = new QMaterialYarn("q");

        return from(qMaterialYarn)
                    .select(qMaterialYarn.commonMaterialYarn)
                    .distinct()
                    .where(qMaterialYarn.materialInfo.company.eq(company),
                            qMaterialYarn.delFlag.ne("D"),
                            qMaterialYarn.used.eq(JPAExpressions.select(q.used.max()).from(q).where(q.materialInfo.eq(qMaterialYarn.materialInfo))))
                    .groupBy(qMaterialYarn.id)
                    .fetch();
    }
}
