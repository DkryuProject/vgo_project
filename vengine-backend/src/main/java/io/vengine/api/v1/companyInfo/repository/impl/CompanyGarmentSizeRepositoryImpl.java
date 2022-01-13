package io.vengine.api.v1.companyInfo.repository.impl;

import com.querydsl.core.types.Projections;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.companyInfo.entity.CompanyGarmentSize;
import io.vengine.api.v1.companyInfo.entity.QCompanyGarmentSize;
import io.vengine.api.v1.companyInfo.repository.CompanyGarmentSizeRepositoryCustom;
import io.vengine.api.v1.user.entity.Company;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;

public class CompanyGarmentSizeRepositoryImpl extends QuerydslRepositorySupport implements CompanyGarmentSizeRepositoryCustom {
    public CompanyGarmentSizeRepositoryImpl() {
        super(CompanyGarmentSize.class);
    }

    @Override
    public List<String> findGarmentSizeGroups(Company company) {
        QCompanyGarmentSize size = QCompanyGarmentSize.companyGarmentSize;

        return from(size)
                    .select(size.sizeGroup)
                    .distinct()
                    .where(size.company.eq(company), size.delFlag.ne("D"))
                    .orderBy(size.sizeGroup.desc())
                    .fetch();
    }

    @Override
    public List<CompanyInfoDto.Response> findGarmentSizeBySizeGroup(String groupName) {
        QCompanyGarmentSize size = QCompanyGarmentSize.companyGarmentSize;

        return from(size)
                    .select(
                            Projections.bean(
                                    CompanyInfoDto.Response.class,
                                    size.id, size.name
                            )
                    )
                    .where(size.sizeGroup.eq(groupName), size.delFlag.ne("D"))
                    .orderBy(size.name.desc())
                    .fetch();
    }
}
