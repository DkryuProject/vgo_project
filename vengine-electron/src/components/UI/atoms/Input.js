import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Input as AntInput, InputNumber as AntInputNumber } from 'antd';
import formatNumberUtil from 'core/utils/formatNumberUtil';

const Input = forwardRef((props, ref) => {
    const {
        type,
        step,
        min,
        max,
        maxLength,
        pattern,
        isDisabled,
        isReadOnly,
        placeholder,
        onClick,
        onChange,
        onBlur,
        onPressEnter,
        formatter,
        parser,
        style,
        bordered,
        size,
        suffix,
        ...restProps
    } = props;
    return (
        <InputStyle bordered={bordered}>
            {type === 'number' ? (
                <AntInputNumber
                    {...restProps}
                    ref={ref}
                    step={step}
                    max={max}
                    min={min}
                    disabled={isDisabled}
                    readOnly={isReadOnly}
                    placeholder={placeholder}
                    onClick={onClick}
                    onChange={onChange}
                    onBlur={onBlur}
                    onPressEnter={onPressEnter}
                    formatter={formatter}
                    parser={parser}
                    style={{
                        ...style,
                        width: '100%',
                        fontSize: 'inherit',
                    }}
                    bordered={bordered}
                    size={size}
                    suffix={suffix}
                />
            ) : (
                <AntInput
                    {...restProps}
                    ref={ref}
                    type={type}
                    maxLength={maxLength}
                    disabled={isDisabled}
                    readOnly={isReadOnly}
                    placeholder={placeholder}
                    onClick={onClick}
                    onChange={onChange}
                    onBlur={onBlur}
                    onPressEnter={onPressEnter}
                    style={{
                        ...style,
                        width: '100%',
                        fontSize: 'inherit',
                    }}
                    bordered={bordered}
                    size={size}
                    suffix={suffix}
                />
            )}
        </InputStyle>
    );
});

Input.defaultProps = {
    type: 'text',
    step: '1',
    max: null,
    maxLength: null,
    isDisabled: false,
    isReadOnly: false,
    placeholder: 'Insert Value',
    onChange: () => {},
    onBlur: () => {},
    onPressEnter: () => {},
    // formatter: (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    formatter: (value) => {
        return formatNumberUtil(value);
    },
    parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
    style: null,
    bordered: true,
    size: 'small',
    suffix: null,
};

const InputStyle = styled.span`
    display: inline-block;
    width: 100%;
    padding: 3px 0 3px 0;
    ${(props) => props.theme.fonts.h5};
    ${(props) =>
        props.bordered === false && 'border-bottom: 1px solid lightgray'};

    input {
        height: 18.2px;
    }
`;

export default Input;
