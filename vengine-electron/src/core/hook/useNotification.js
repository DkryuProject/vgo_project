// import { notification } from 'antd';
import React from 'react';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

// 사용하지 않음
const Msg = ({ message, description }) => (
    <div>
        <div>{message}</div>
        <div>{description}</div>
    </div>
);

const useNotification = () => {
    const handleNotification = useCallback((data) => {
        const { type, message, description } = data;

        toast[type](<Msg message={message} description={description} />);
    }, []);

    return [handleNotification];
};

export default useNotification;
