import React from 'react';
import { Route } from 'react-router-dom';

import {
    General
} from 'components/company/database';

const DatabasePage = (props) => {
    const { match } = props;

    return (
        <div>
            <Route
                path={`${match.path}/general`}
                component={General}
            />
        </div>
    );
};

export default DatabasePage;
