import React from 'react';
import { Route } from 'react-router-dom';

import {
    CoverLists,
    CoverWrite,
    CoverDetail,
    CbdContainer,
    MclContainer,
} from './';

const ProductLifecycleContainer = (props) => {
    const { match } = props;

    return (
        <>
            <Route path={`${match.path}`} exact component={CoverLists} />
            <Route path={`${match.path}/write`} exact component={CoverWrite} />
            <Route
                path={`${match.path}/update/:id`}
                exact
                component={CoverWrite}
            />
            <Route
                path={`${match.path}/detail/:id`}
                exact
                component={CoverDetail}
            />
            <Route
                path={`${match.path}/cbd/write`}
                exact
                component={CbdContainer}
            />
            <Route
                path={`${match.path}/cbd/update/:cbdId`}
                exact
                component={CbdContainer}
            />

            <Route
                path={`${match.path}/mcl/write`}
                exact
                component={MclContainer}
            />
            <Route
                path={`${match.path}/mcl/update/:mclOptionId`}
                // exact
                component={MclContainer}
            />
        </>
    );
};

export default ProductLifecycleContainer;
