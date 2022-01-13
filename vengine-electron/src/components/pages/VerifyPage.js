import React, { useEffect } from 'react';
import { useMutation } from 'react-query';
import qs from 'qs';
import { handleNotification } from 'core/utils/notificationUtil';
import { userPostVerifyApi } from 'core/api/user/user';

const VerifyPage = (props) => {
    const { history, location } = props || {};
    const queryString = qs.parse(location?.search);

    const { mutate: userPostVerifyMutate } = useMutation(
        (payload) => userPostVerifyApi(payload),
        {
            onSuccess: () => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Successful authentication request',
                });
            },
            onError: () => {
                handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'Authentication request failed',
                });
            },

            onSettled: () => {
                localStorage.clear();
                return history.push('/signin');
            },
        }
    );

    useEffect(() => {
        const email = queryString['?email'];
        const code = queryString['code'];
        if (email && code) {
            return userPostVerifyMutate({ email, code });
        }
    }, [userPostVerifyMutate, queryString]);
    return <div></div>;
};

export default VerifyPage;
