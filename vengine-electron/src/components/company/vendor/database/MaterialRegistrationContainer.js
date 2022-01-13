import React from 'react';
import { Route } from 'react-router-dom';

import { MaterialRegistrationLists, MaterialRegistrationWrite } from './';

const MaterialRegistrationContainer = (props) => {
    const { match } = props;

    return (
        <div>
            <Route
                path={`${match.path}`}
                exact
                component={MaterialRegistrationLists}
            />

            <Route
                path={`${match.path}/write`}
                component={MaterialRegistrationWrite}
            />

            <Route
                path={`${match.path}/detail/:id`}
                component={MaterialRegistrationWrite}
            />
        </div>
    );
};

export default MaterialRegistrationContainer;
