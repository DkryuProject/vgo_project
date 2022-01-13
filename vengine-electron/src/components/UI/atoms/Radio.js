import React from 'react';
import styled from 'styled-components';
import { Radio as AntRadio } from 'antd';

const Radio = ({ children }) => {
    return <div>{children}</div>;
};

const Group = (props) => {
    const { children, value, onChange, size = 'smail', style } = props;

    return (
        <GroupStyle style={style}>
            <AntRadio.Group value={value} onChange={onChange} size={size}>
                {children}
            </AntRadio.Group>
        </GroupStyle>
    );
};

const Button = (props) => {
    const { children, value, style } = props;

    return (
        <AntRadio.Button value={value} style={style}>
            {children}
        </AntRadio.Button>
    );
};

Radio.Group = Group;
Radio.Button = Button;

const GroupStyle = styled.div`
    ${(props) => props.style}
`;

export default Radio;
