import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Select as AntSelect } from 'antd';

const Select = (props) => {
    const {
        _key,
        _value,
        _text,
        defaultValue,
        placeholder,
        showSearch,
        isDisabled,
        isReadOnly,
        filterOption,
        onFilter,
        requestKey,
        responseData,
        onRequestApi,
        onChange,
        onSelect,
        onBlur,
        autoFocus,
        defaultOpen,
        size,
        bordered,
        value,
        ...restProps
    } = props;
    const { isFetching, data, refetch } = useQuery(
        requestKey || _text,
        onRequestApi,
        {
            enabled: true,
            cacheTime: 0,
            retry: 0,
        }
    );

    const option = useMemo(() => {
        const _data = responseData || data?.list || [];
        // Filter가 있을 때
        if (onFilter) {
            return _data?.filter(onFilter)?.map((v) => (
                <AntSelect.Option key={v?.[_key]} value={v?.[_value]}>
                    {typeof _text === 'function' ? _text(v) : v?.[_text]}
                </AntSelect.Option>
            ));
        } else {
            return _data?.map((v) => (
                <AntSelect.Option key={v?.[_key]} value={v?.[_value]}>
                    {typeof _text === 'function' ? _text(v) : v?.[_text]}
                </AntSelect.Option>
            ));
        }
    }, [data, responseData, _key, _value, _text, onFilter]);

    return (
        <SelectStyle bordered={bordered}>
            <AntSelect
                defaultValue={defaultValue}
                placeholder={placeholder}
                showSearch={showSearch}
                disabled={isDisabled}
                readOnly={isReadOnly}
                loading={isFetching}
                filterOption={filterOption}
                onDropdownVisibleChange={(e) => {
                    if (e) return refetch();
                }}
                onChange={onChange}
                onSelect={onSelect}
                onBlur={onBlur}
                autoFocus={autoFocus}
                defaultOpen={defaultOpen}
                size={size}
                bordered={bordered}
                {...restProps}
                value={value && typeof value === 'object' ? value?.id : value}
            >
                <AntSelect.Option key={null} value={null}>
                    {placeholder}
                </AntSelect.Option>

                {option}
            </AntSelect>
        </SelectStyle>
    );
};

Select.defaultProps = {
    // defaultValue: null,
    placeholder: 'Select Item',
    showSearch: true,
    isDisabled: false,
    isReadOnly: false,
    filterOption: (input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    onRequestApi: () => {},
    onChange: () => {},
    onSelect: () => {},
    onBlur: () => {},
    size: 'small',
    bordered: true,
};

const SelectStyle = styled.span`
    display: inline-block;
    width: 100%;
    min-width: 200px;
    text-align: left;
    .ant-select {
        width: inherit;
    }
    .ant-select-selection-placeholder {
        ${(props) => props.theme.fonts.h5};
        z-index: 5;
    }
    ${(props) => props.theme.fonts.h5};
    ${(props) =>
        props.bordered === false && 'border-bottom: 1px solid lightgray'};
`;

export default Select;
