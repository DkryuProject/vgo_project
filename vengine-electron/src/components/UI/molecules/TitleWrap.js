import React from 'react';
import styled from 'styled-components';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

const TitleWrap = (props) => {
    const { children, style } = props;
    return <TitleWrapStyle style={style}>{children}</TitleWrapStyle>;
};

const Title = (props) => {
    const { children, suffix } = props;
    return (
        <TitleStyle>
            <Space>
                {typeof suffix === 'boolean'
                    ? suffix && <CaretRightOutlined />
                    : suffix}
                {children}
            </Space>
        </TitleStyle>
    );
};

const Function = (props) => {
    const { children } = props;
    return (
        <FunctionStyle>
            <Space>{children}</Space>
        </FunctionStyle>
    );
};

TitleWrap.Title = Title;
TitleWrap.Function = Function;

TitleWrap.defaultProps = {
    children: React.createElement('div'),
};

Title.defaultProps = {
    children: React.createElement('div'),
    suffix: false,
};

Function.defaultProps = {
    children: React.createElement('div'),
};

const TitleWrapStyle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${(props) => props.style}
`;

const TitleStyle = styled.div`
    ${(props) => props.theme.fonts.h7}
`;
const FunctionStyle = styled.div``;

export default TitleWrap;
