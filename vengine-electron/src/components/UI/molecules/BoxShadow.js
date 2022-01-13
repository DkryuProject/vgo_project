import React from 'react';
import styled from 'styled-components';

const BoxShadow = (props) => {
    const { children, style } = props;
    return <BoxShadowStyle style={style}>{children}</BoxShadowStyle>;
};

const BoxShadowStyle = styled.div`
    padding: 1rem;
    border: 1px solid lightgray;
    border-radius: 3px;
    box-shadow: 3px 3px gray;
    ${(props) => props.style}
`;

export default BoxShadow;
