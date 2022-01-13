import React from 'react';
import { Modal } from 'antd';
import {
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';

const { confirm } = Modal;

const handleSelectIcon = (type) => {
    switch (type) {
        case 'save':
            return <CheckCircleOutlined style={{ color: '#52c41a' }} />;

        case 'delete':
            return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;

        case 'warning':
            return <ExclamationCircleOutlined />;

        default:
            return <ExclamationCircleOutlined />;
    }
};

const handleSelectContent = (type, content) => {
    if (content) {
        return content;
    }

    switch (type) {
        case 'save':
            return 'Are you sure?';

        case 'delete':
            return 'Will you delete the selected data?';

        case 'warning':
            return 'Would you like to proceed like this?';

        default:
            return 'Would you like to proceed like this?';
    }
};

// Default Type = 'warning'
export const handlePopConfirm = (props) => {
    const { type, content, callbackOk, callbackCancel } = props || {};

    return confirm({
        icon: handleSelectIcon(type),
        content: handleSelectContent(type, content),
        onOk() {
            if (callbackOk) {
                callbackOk();
            }
        },
        onCancel() {
            if (callbackCancel) {
                callbackCancel();
            }
        },
    });
};
