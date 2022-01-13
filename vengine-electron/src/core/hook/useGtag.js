import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const useGtag = () => {
    const location = useLocation();
    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const trackPageView = useCallback((args) => {
        return window.gtag('config', process.env.REACT_APP_TRACKING_ID, {
            ...args,
            page_location: location?.pathname,
            user_id: userGetEmail.data?.data?.userId,
            user_email: userGetEmail.data?.data?.email,
            user_company_id: userGetEmail.data?.data?.company?.companyID,
            user_company_name: userGetEmail.data?.data?.company?.companyName,
        });
    }, [location, userGetEmail]);

    return { trackPageView };
};

export default useGtag;
