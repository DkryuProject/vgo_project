import React from 'react';
import { Route } from 'react-router-dom';
import PartnerManagementLists from './PartnerManagementLists';
// import PartnerManagementNew from './PartnerManagementNew';
import PartnerManagementRelation from './PartnerManagementRelation';
import { Signup } from 'components/sign';

const PartnerManagementContainer = (props) => {
    const { history, match } = props;
    return (
        <>
            <Route
                path={`${match.path}`}
                exact
                component={PartnerManagementLists}
            />
            <Route
                path={`${match.path}/relation`}
                exact
                component={PartnerManagementRelation}
            />
            <Route
                path={`${match.path}/relation/new`}
                exact
                component={() => <Signup history={history} type="partner" />}
            />
        </>
    );
};

export default PartnerManagementContainer;
