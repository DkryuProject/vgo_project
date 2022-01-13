package io.vengine.api.v1.user.repository.impl;

import io.vengine.api.v1.user.entity.CompanyAddress;
import io.vengine.api.v1.user.entity.QCompanyAddress;
import io.vengine.api.v1.user.repository.CompanyAddressRepositoryCustom;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

public class CompanyAddressRepositoryImpl extends QuerydslRepositorySupport implements CompanyAddressRepositoryCustom {
    public CompanyAddressRepositoryImpl() {
        super(CompanyAddress.class);
    }

    @Override
    public Long updateRepresentitive(CompanyAddress companyAddress) {
        QCompanyAddress address = QCompanyAddress.companyAddress;

        return  update(address)
                .set(address.representitive,0)
                .where(address.company.eq(companyAddress.getCompany()),
                        address.id.ne(companyAddress.getId()),
                        address.representitive.eq(1))
                .execute();
    }
}
