import React from 'react';
import { Select } from 'antd';
// import styled from "styled-components";
import { PlusOutlined } from '@ant-design/icons';

const FilterSelect = (props) => {
    const {
        _key,
        _value,
        value,
        text,
        defaultValue,
        placeholder,
        filter,
        filterType,
        // ref, // 삭제
        data,
        onData,
        onAddItem,
        onChange,
        onBlur, // 삭제
        keep,
        disabled,
    } = props;

    // console.log("_key ====> ", _key);
    // console.log("_value ====> ", _value);
    // console.log("value ====> ", value);
    // console.log("filter ====> ", filter);
    // console.log("filterType ====> ", filterType);
    // console.log("defaultValue ====> ", defaultValue);
    // console.log("data ====> ", data);
    // console.log("onData ====> ", onData);
    // console.log("keep ====> ", keep);
    // console.log("disabled ====> ", disabled);

    const handleOption = () => {
        if (data.data) {
            if (filter) {
                return data.data.list.filter(filter).map((v) => {
                    return (
                        <Select.Option
                            key={v[_key]}
                            value={
                                _value || value
                                    ? v[_value || value]
                                    : JSON.stringify(v)
                            }
                        >
                            {v[text]}
                        </Select.Option>
                    );
                });
            }

            if (data.data.type && data.data.type === filterType) {
                return data.data.result.list.map((v) => {
                    return (
                        <Select.Option key={v[_key]} value={v[_value || value]}>
                            {v[text]}
                        </Select.Option>
                    );
                });
            }

            // common Enums
            if (data.data.data && data.data.data.hasOwnProperty(filterType)) {
                return data.data.data[filterType].map((v) => {
                    return (
                        <Select.Option key={v[_key]} value={v[_value || value]}>
                            {v[text]}
                        </Select.Option>
                    );
                });
            }

            return (
                data.data.list &&
                data.data.list.map((v) => {
                    return (
                        <Select.Option
                            key={v[_key]}
                            value={
                                _value || value
                                    ? v[_value || value]
                                    : JSON.stringify(v)
                            }
                        >
                            {v[text]}
                        </Select.Option>
                    );
                })
            );
        } else {
            return null;
        }
    };

    const option = handleOption();

    return (
        <Select
            defaultValue={defaultValue}
            placeholder={placeholder}
            showSearch
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onDropdownVisibleChange={(e) => {
                if (keep ? e && !data.data : e) {
                    if (onData) onData();
                }
            }}
            notFoundContent={
                onAddItem && (
                    <div onClick={onAddItem}>
                        <PlusOutlined />
                        Add item
                    </div>
                )
            }
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            readOnly={true}
            loading={data.isLoading}
            bordered={false}
            style={{ minWidth: '200px' }}
        >
            <Select.Option key={null} value={null}>
                No item is selected
            </Select.Option>
            {option}
        </Select>
    );
};

// Select 밖에 div로 감싸면 view가 안된다.
// const FilterSelectWrap = styled.div`
//     .ant-select-selection-placeholder,
//     .ant-select-selection-item {
//         text-align: left;
//     }
// `;

export default FilterSelect;

/* <FilterSelect
    _key="id"
    value="typeB"
    text="typeB"
    placeholder="Select Fabric type"
    filter={(v) => v.typeA.toLowerCase() === 'fabric'}
    filterType=""
    data={commonMaterialGetLists}
    onData={handleCommonMaterialGetLists}
    keep
/> */
