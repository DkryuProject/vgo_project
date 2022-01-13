import React from 'react';
import styled from 'styled-components';

const Ellipsis = ({ children }) => {
    return <EllipsisStyle>{children}</EllipsisStyle>;
};

const EllipsisStyle = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export default Ellipsis;
