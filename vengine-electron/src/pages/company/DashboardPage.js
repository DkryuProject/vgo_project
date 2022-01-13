import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// import ReactGA from "react-ga";
// ReactGA.initialize("G-0C7280PGMR", { debug: true });

// ReactGA.set({ page: window.location.pathname });
// ReactGA.set({ title: "dashboard" });
// ReactGA.pageview(window.location.pathname + window.location.search);

const DashboardPage = (props) => {
    const { menuType } = props;
    const history = useHistory();

    useEffect(() => {
        if (menuType?.menuTypeId === 2) {
            return history.push('/vendor/plm/designcover');
        } else {
            return history.push('/supplier/materialregister');
        }
    }, [menuType, history]);
    return <div style={{ padding: '2rem' }}></div>;
};

export default DashboardPage;
