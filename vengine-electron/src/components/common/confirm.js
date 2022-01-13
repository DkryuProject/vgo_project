import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm, success } = Modal;

export const saveConfirm = (callbackFunc) => {
    confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'Are you sure?',
        onOk() {
            callbackFunc(true);
        },
        onCancel() {
            // callbackFunc(false);
        },
    });
};

export const deleteConfirm = (callbackFunc) => {
    confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'Will you delete the selected data?',
        onOk() {
            callbackFunc(true);
        },
        onCancel() {
            // callbackFunc(false);
        },
    });
};

export const successConfirm = (props) => {
    success({
        content: 'Success!!!',
        onOk() {},
    });
};

export const warningConfirm = (text, callbackFunc) => {
    confirm({
        icon: <ExclamationCircleOutlined />,
        content: text,
        onOk() {
            if (callbackFunc) {
                callbackFunc(true);
            }
        },
        onCancel() {
            // callbackFunc(false);
        },
    });
};
