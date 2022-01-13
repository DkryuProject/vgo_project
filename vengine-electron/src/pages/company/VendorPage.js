import React from 'react';
import { Route } from 'react-router-dom';

import {
    CompanyInfo,
    BuyerSubsidiary,
    BuyerManagement,
} from 'components/company/vendor/database';
import {
    AdhocContainer,
    BuyerPoContainer,
    ProductLifecycleContainer,
} from 'components/company/vendor/plm';
import { PlmHelper } from 'pages/helper/Helper';

const VendorPage = (props) => {
    const { match } = props;
    return (
        <>
            <Route
                exact
                path={`${match.path}/plmHelper`}
                component={PlmHelper}
            />
            <Route
                path={`${match.path}/plm/designcover`}
                component={ProductLifecycleContainer}
            />
            <Route path={`${match.path}/adhoc`} component={AdhocContainer} />
            <Route
                path={`${match.path}/garmentpo`}
                component={BuyerPoContainer}
            />
            {/* 시스템 */}
            <Route
                path={`${match.path}/system/itemregistration`}
                component={CompanyInfo}
            />
            <Route
                path={`${match.path}/system/buyersubsidiaryies`}
                component={BuyerSubsidiary}
            />
            <Route
                path={`${match.path}/system/buyermanagement`}
                component={BuyerManagement}
            />
        </>
    );
};

export default VendorPage;
