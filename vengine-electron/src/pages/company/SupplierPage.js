import React from 'react';
import { Route } from 'react-router-dom';
import { PoDocumentation } from 'components/company/supplier/plm';

const SupplierPage = (props) => {
    const { match } = props;
    return (
        <>
            <Route
                path={`${match.path}/materialpo`}
                component={PoDocumentation}
            />
        </>
    );
};

export default SupplierPage;
