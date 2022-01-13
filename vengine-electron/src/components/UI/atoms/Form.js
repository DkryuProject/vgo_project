import React from 'react';
import { Form as AntForm } from 'antd';
import styled from 'styled-components';

const defaultLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const typeTemplate = '${label} is not a valid ${type}'; // eslint-disable-line

const defaultValidateMessages = {
    default: 'Validation error on field ${label}', // eslint-disable-line
    required: '${label} is required', // eslint-disable-line
    enum: '${label} must be one of [${enum}]', // eslint-disable-line
    whitespace: '${label} cannot be empty', // eslint-disable-line
    date: {
        format: '${label} is invalid for format date', // eslint-disable-line
        parse: '${label} could not be parsed as date', // eslint-disable-line
        invalid: '${label} is invalid date', // eslint-disable-line
    },
    types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        boolean: typeTemplate,
        integer: typeTemplate,
        float: typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate,
    },
    string: {
        len: '${label} must be exactly ${len} characters', // eslint-disable-line
        min: '${label} must be at least ${min} characters', // eslint-disable-line
        max: '${label} cannot be longer than ${max} characters', // eslint-disable-line
        range: '${label} must be between ${min} and ${max} characters', // eslint-disable-line
    },
    number: {
        len: '${label} must equal ${len}', // eslint-disable-line
        min: '${label} cannot be less than ${min}', // eslint-disable-line
        max: '${label} cannot be greater than ${max}', // eslint-disable-line
        range: '${label} must be between ${min} and ${max}', // eslint-disable-line
    },
    array: {
        len: '${label} must be exactly ${len} in length', // eslint-disable-line
        min: '${label} cannot be less than ${min} in length', // eslint-disable-line
        max: '${label} cannot be greater than ${max} in length', // eslint-disable-line
        range: '${label} must be between ${min} and ${max} in length', // eslint-disable-line
    },
    pattern: {
        mismatch: '${label} does not match pattern ${pattern}', // eslint-disable-line
    },
};

const Form = (props) => {
    const {
        children,
        ref,
        form,
        onFinish,
        initialValues,
        validateMessages,
        size,
        layout,
        labelAlign,
        style,
    } = props;

    return (
        <FormStyle style={style}>
            <AntForm
                ref={ref}
                form={form}
                onFinish={onFinish}
                initialValues={initialValues}
                validateMessages={validateMessages}
                size={size}
                layout={layout}
                labelCol={layout ? null : defaultLayout?.labelCol}
                wrapperCol={layout ? null : defaultLayout?.wrapperCol}
                labelAlign={labelAlign}
            >
                {children}
            </AntForm>
        </FormStyle>
    );
};

const Item = (props) => {
    const {
        children,
        name,
        label,
        initialValue,
        rules,
        hidden,
        noStyle,
        style,
    } = props;

    return (
        <ItemStyle style={style}>
            <AntForm.Item
                name={name}
                label={label}
                initialValue={initialValue}
                rules={rules}
                hidden={hidden}
                noStyle={noStyle}
            >
                {children}
            </AntForm.Item>
        </ItemStyle>
    );
};

Form.Item = Item;

Form.defaultProps = {
    children: null,
    ref: null,
    form: null,
    onFinish: () => {},
    validateMessages: defaultValidateMessages,
    size: 'small',
    // bordered: true,
};

Item.defaultProps = {
    children: null,
    name: null,
    label: null,
    rules: null,
};

const FormStyle = styled.div`
    .ant-form-item {
        margin-bottom: 0;

        label {
            ${(props) => props.theme.fonts.h5}
        }
    }

    ${(props) => props.style}
`;

const ItemStyle = styled.div`
    ${(props) => props.style}
`;

export default Form;
