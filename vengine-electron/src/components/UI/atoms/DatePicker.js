import React from 'react';
import styled from 'styled-components';
import { DatePicker as AntDatePicker } from 'antd';

const DatePicker = (props) => {
    const { bordered, ...restProps } = props || {};
    return (
        <DatePickerStyle bordered={bordered}>
            <AntDatePicker {...restProps} bordered={bordered} />
        </DatePickerStyle>
    );
};

const DatePickerStyle = styled.span`
    display: inline-block;
    width: 100%;
    // padding: 3px 0 3px 0;

    ${(props) =>
        props.bordered === false && 'border-bottom: 1px solid lightgray'};

    .ant-picker {
        width: 100%;
    }
    input {
        height: 18.2px;
        ${(props) => props.theme.fonts.h5};
    }
`;

export default DatePicker;
