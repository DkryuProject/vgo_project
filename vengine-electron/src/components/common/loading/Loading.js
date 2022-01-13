import React from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

const Loading = () => {
    return (
        <FloatLoading>
            <Spin tip="Loading..." />
        </FloatLoading>
    );
};

const FloatLoading = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    z-index: 1049;
`;

export default Loading;
