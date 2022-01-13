import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { AutoComplete as AntAutoComplete, Tag } from 'antd';
import { useQuery } from 'react-query';
import { Fragment } from 'react';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

const AutoComplete = (props) => {
    const {
        _key,
        _value,
        _text,
        requestKey,
        onFilter,
        onRequestApi,
        responseData,
        placeholder,
        bordered,
        tag,
        tagNumberLimit = 5,
        isDisabled,
        ...restProps
    } = props || {};

    const rest = { ...restProps };

    const [options, setOptions] = useState([]);
    const [toggle, setToggle] = useState(false);
    const { data } = useQuery(requestKey || _text, onRequestApi, {
        enabled: true,
        // cacheTime: 0,
        retry: 0,
    });

    const option = useMemo(() => {
        const colorTag = (v) => {
            const strChar = v?.[_value]?.charAt()?.toLowerCase();
            let color = 'magenta';
            if (strChar === 'a' || strChar === 'k' || strChar === 'u') {
                color = 'magenta';
            } else if (strChar === 'b' || strChar === 'l' || strChar === 'v') {
                color = 'red';
            } else if (strChar === 'c' || strChar === 'm' || strChar === 'w') {
                color = 'volcano';
            } else if (strChar === 'd' || strChar === 'n' || strChar === 'h') {
                color = 'orange';
            } else if (strChar === 'e' || strChar === 'o' || strChar === 'y') {
                color = 'gold';
            } else if (strChar === 'f' || strChar === 'p' || strChar === 'z') {
                color = 'green';
            } else if (strChar === 'g' || strChar === 'q') {
                color = 'cyan';
            } else if (strChar === 'h' || strChar === 'r') {
                color = 'blue';
            } else if (strChar === 'i' || strChar === 's') {
                color = 'geekblue';
            } else if (strChar === 'j' || strChar === 't') {
                color = 'purple';
            }
            return { value: v?.[_value], color: color };
        };

        const _data = responseData || data?.list || [];
        // Filter가 있을 때
        if (onFilter) {
            return _data?.filter(onFilter)?.map(colorTag)?.sort();
        } else {
            return _data?.map(colorTag)?.sort();
        }
    }, [
        data,
        responseData,
        _value,
        //  _key, _value, _text,
        onFilter,
    ]);

    const handleSearch = (searchText) => {
        setOptions(
            !searchText
                ? []
                : option?.filter(
                      (v) =>
                          v?.value
                              ?.toLowerCase()
                              ?.indexOf(searchText?.toLowerCase()) > -1
                  )
        );
    };

    return (
        <Fragment>
            <AutoCompleteStyle bordered={bordered}>
                <AntAutoComplete
                    options={options}
                    onSearch={handleSearch}
                    placeholder={placeholder || 'Insert Text'}
                    bordered={bordered}
                    disabled={isDisabled}
                    {...rest}
                />
            </AutoCompleteStyle>
            {tag && (
                <TagStyle isDisabled={isDisabled}>
                    {toggle ? (
                        <DownOutlined
                            className="tagNumberToggleButton"
                            onClick={() => setToggle((toggle) => !toggle)}
                        />
                    ) : (
                        <UpOutlined
                            className="tagNumberToggleButton"
                            onClick={() =>
                                setToggle(
                                    (toggle) =>
                                        option?.length > tagNumberLimit &&
                                        !toggle
                                )
                            }
                        />
                    )}

                    {option
                        ?.filter(
                            (_, i, arr) =>
                                i < (toggle ? arr?.length : tagNumberLimit)
                        )
                        ?.map((option) => (
                            <Tag
                                key={option?.value}
                                onClick={(tag) => {
                                    const { value, onChange } = rest || {};
                                    const text = tag?.target?.innerText;
                                    return (
                                        isDisabled ||
                                        onChange(
                                            value
                                                ? value?.includes(text)
                                                    ? value
                                                    : value + ', ' + text
                                                : text
                                        )
                                    );
                                }}
                                color={option?.color}
                            >
                                {option?.value}
                            </Tag>
                        ))}
                    {!toggle && option?.length > tagNumberLimit && (
                        <span className="rest">
                            ... ({option?.length - tagNumberLimit})
                        </span>
                    )}
                </TagStyle>
            )}
        </Fragment>
    );
};

const AutoCompleteStyle = styled.span`
    display: inline-block;
    width: 100%;
    text-align: left;
    .ant-select {
        width: inherit;
    }
    .ant-select-selection-placeholder,
    .ant-select-selection-search-input {
        ${(props) => props.theme.fonts.h5};
    }
    ${(props) => props.theme.fonts.h5};
    ${(props) =>
        props.bordered === false && 'border-bottom: 1px solid lightgray'};
`;

const TagStyle = styled.div`
    border-bottom: 0 !important;
    .ant-tag {
        margin-top: 0.5rem;

        ${(props) => (props.isDisabled ? 'cursor:no-drop' : 'cursor: pointer')};
    }
    .tagNumberToggleButton {
        margin-right: 0.5rem;
    }
    .rest {
        display: inline-block;
        margin-top: 0.5rem;
    }
`;

export default AutoComplete;
