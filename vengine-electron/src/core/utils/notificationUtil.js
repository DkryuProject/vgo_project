import React from 'react';
import { toast } from 'react-toastify';

// 사용
const Msg = ({ message, description }) => (
    <div>
        <div>{message}</div>
        <div>{description}</div>
    </div>
);

export const handleNotification = (props) => {
    const {
        type = 'error',
        message = 'Error',
        description = 'Request failed',
    } = props || {};

    return toast[type](<Msg message={message} description={description} />);
};
