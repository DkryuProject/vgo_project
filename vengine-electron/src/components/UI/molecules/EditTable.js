import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
    useContext,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { Table, Form, InputNumber, Input } from 'antd';

import styled from 'styled-components';
import { Select } from '../atoms';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false} size="small">
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    selectBox, // Select 유무
    inputType, // ex) number, decimals
    inputValidate, // 조건
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing && !selectBox) {
            inputRef.current.focus();
        }
    }, [selectBox, editing]);

    const toggleEdit = () => {
        setEditing(!editing);

        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async (e) => {
        try {
            const values = await form.validateFields();
            // 소수점 일때 자릿수 받고 반올림
            if (inputType === 'decimals') {
                const value = values[dataIndex];
                values[dataIndex] = Number.isInteger(value)
                    ? value
                    : parseFloat(value).toFixed(inputValidate?.maxLength);
            }

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    const onSelect = async (value, option) => {
        const values = {
            [dataIndex]: {
                id: option.value,
                name: option.children,
            },
        };

        toggleEdit();
        handleSave({ ...record, ...values });
    };

    const step = useMemo(() => {
        if (inputType === 'decimals' && inputValidate?.maxLength) {
            switch (inputValidate.maxLength) {
                case 1:
                    return '0.1';
                case 2:
                    return '0.01';
                case 3:
                    return '0.001';
                case 4:
                    return '0.0001';
                default:
                    return '1';
            }
        }
    }, [inputType, inputValidate]);

    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                name={dataIndex}
                // rules={[
                //     {
                //         required: true,
                //     },
                // ]}
                style={{
                    margin: 0,
                }}
                size="small"
            >
                {selectBox ? (
                    <Select
                        _key={selectBox?._key}
                        _value={selectBox?._value}
                        _text={selectBox?._text}
                        placeholder={selectBox?.placeholder}
                        onRequestApi={selectBox?.onRequestApi}
                        onSelect={onSelect}
                        autoFocus={true}
                        defaultOpen={true}
                        bordered={false}
                    />
                ) : inputType === 'number' ? (
                    <InputNumber
                        ref={inputRef}
                        onBlur={save}
                        max={inputValidate?.max}
                        formatter={(value) =>
                            value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={(value) =>
                            parseInt(value.replace(/\$\s?|(,*)/g, '')) || 0
                        }
                        style={{ width: '100%' }}
                        bordered={false}
                    />
                ) : inputType === 'decimals' ? (
                    <InputNumber
                        ref={inputRef}
                        onBlur={save}
                        max={inputValidate?.max}
                        step={step}
                        formatter={(value) =>
                            value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        style={{ width: '100%' }}
                        bordered={false}
                    />
                ) : (
                    <Input
                        type="text"
                        ref={inputRef}
                        maxLength={inputValidate?.maxLength}
                        onPressEnter={save}
                        onBlur={save}
                        bordered={false}
                    />
                )}
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" onClick={toggleEdit}>
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};

const EditTable = (props, ref) => {
    const {
        initialColumns,
        title,
        footer,
        rowKey,
        summary,
        loading,
        pagination,
        rowSelection,
        rowSelectionType, // checkbox or radio
        onRow,
        onChange,
        expandable,
        onExpand,
        defaultExpandAllRows,
        onIsRender,
        onGetCheckboxProps, // disabled checkbox
        scroll,
        locale,
    } = props;

    const id = typeof rowKey === 'string' ? rowKey : 'id';
    const [count, setCount] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const handleAddRow = () => {
        const newRowData = {
            [id]: 'new' + count,
            rowStatus: 'new',
        };

        initialColumns.map((v) => {
            return (newRowData[v.dataIndex] = null);
        });

        setDataSource([newRowData, ...dataSource]);
        // 행추가시 자동으로 select 체크 처리
        setSelectedRowKeys([...selectedRowKeys, newRowData[id]]);
        setSelectedRows([...selectedRows, newRowData]);
        setCount((count) => count + 1);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row[id] === item[id]);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        handleSelectRows(row);
    };

    //input 입력, select 선택 시 자동으로 select 체크 처리
    const handleSelectRows = useCallback(
        (row) => {
            const newSelectRowKeys = [...selectedRowKeys];
            const newSelectRows = [...selectedRows];

            if (newSelectRows.length === 0) {
                newSelectRows.push({ ...row });
            } else {
                let rowIdx = newSelectRows.findIndex(
                    (item) => row[id] === item[id]
                );
                if (rowIdx === -1) {
                    newSelectRows.push({ ...row });
                } else {
                    let selectedRow = newSelectRows[rowIdx];
                    newSelectRows.splice(rowIdx, 1, { ...selectedRow, ...row });
                }
            }
            if (newSelectRowKeys.length === 0) {
                newSelectRowKeys.push(row[id]);
            } else {
                let keyIdx = newSelectRowKeys.findIndex(
                    (item) => row[id] === item
                );
                if (keyIdx === -1) {
                    newSelectRowKeys.push(row[id]);
                }
            }
            setSelectedRows(newSelectRows);
            setSelectedRowKeys(newSelectRowKeys);
        },
        [selectedRowKeys, selectedRows, id, setSelectedRows, setSelectedRowKeys]
    );

    const handleTableChange = useCallback(
        (pagination, _filters, _sorter) => {
            if (onChange) return onChange?.(pagination);
        },
        [onChange]
    );

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    };

    const initialSelectRows = () => {
        setSelectedRows([]);
        setSelectedRowKeys([]);
    };

    useImperativeHandle(ref, () => ({
        handleAddRow,
        selectedRows,
        selectedRowKeys,
        handleSelectRows,
        onSelectChange,
        initialSelectRows,
        dataSource,
    }));

    useEffect(() => {
        initialSelectRows();
        setDataSource(props?.dataSource || []);
    }, [props.dataSource]);

    // 렌더링 끝난 시점을 부모 컴포넌트한테 알려주려 onIsRender 함수를 사용
    useEffect(() => {
        if (onIsRender) {
            onIsRender((isRender) => !isRender);
        }
    }, [onIsRender, selectedRows]);

    const mapColumns = (col) => {
        // material에서 supplier와 vendor 관계 조건 때문에 주석처리

        // if (!col.editable) {
        //     return col;
        // }
        const newCol = {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                selectBox: col.selectBox,
                inputType: col.inputType,
                inputValidate: col.inputValidate,
                handleSave: handleSave,
            }),
        };
        if (col.children) {
            newCol.children = col.children.map(mapColumns);
        }
        return newCol;
    };

    const columns = initialColumns.map(mapColumns);

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const ResultTable = useCallback(
        () => (
            <Table
                title={title}
                footer={footer}
                rowKey={
                    typeof rowKey === 'string'
                        ? (record) => record[rowKey]
                        : rowKey
                }
                columns={columns}
                dataSource={dataSource}
                components={components}
                pagination={
                    pagination
                        ? {
                              ...pagination,
                              pageSizeOptions: ['15', '30', '50'],
                              showSizeChanger: true,
                          }
                        : false
                }
                onChange={handleTableChange}
                loading={loading}
                rowSelection={
                    rowSelection && {
                        type: rowSelectionType,
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            return onSelectChange(
                                selectedRowKeys,
                                selectedRows
                            );
                        },
                        getCheckboxProps: onGetCheckboxProps,
                    }
                }
                rowClassName={() => 'editable-row'}
                size="small"
                summary={summary}
                onRow={onRow}
                expandable={expandable}
                onExpand={onExpand}
                defaultExpandAllRows={defaultExpandAllRows}
                scroll={{ x: -1 }}
                locale={locale}
            />
        ),
        [
            title,
            footer,
            components,
            rowKey,
            dataSource,
            columns,
            pagination,
            loading,
            rowSelection,
            rowSelectionType,
            selectedRowKeys,
            summary,
            expandable,
            defaultExpandAllRows,
            onExpand,
            onRow,
            handleTableChange,
            onGetCheckboxProps,
            locale,
        ]
    );
    return (
        <EditTableStyle>
            {defaultExpandAllRows ? (
                <ResultTable />
            ) : (
                <Table
                    title={title}
                    footer={footer}
                    rowKey={
                        typeof rowKey === 'string'
                            ? (record) => record[rowKey]
                            : rowKey
                    }
                    columns={columns}
                    dataSource={dataSource}
                    components={components}
                    pagination={
                        pagination
                            ? {
                                  ...pagination,
                                  pageSizeOptions: ['15', '30', '50'],
                                  showSizeChanger: true,
                              }
                            : false
                    }
                    onChange={handleTableChange}
                    loading={loading}
                    rowSelection={
                        rowSelection && {
                            type: rowSelectionType,
                            selectedRowKeys,
                            onChange: (selectedRowKeys, selectedRows) => {
                                return onSelectChange(
                                    selectedRowKeys,
                                    selectedRows
                                );
                            },
                            getCheckboxProps: onGetCheckboxProps,
                        }
                    }
                    rowClassName={() => 'editable-row'}
                    size="small"
                    summary={summary}
                    onRow={onRow}
                    expandable={expandable}
                    onExpand={onExpand}
                    defaultExpandAllRows={defaultExpandAllRows}
                    scroll={{ ...scroll, x: -1 }}
                    locale={locale}
                />
            )}
        </EditTableStyle>
    );
};

const EditTableStyle = styled.div`
    .ant-table-thead tr th.ant-table-cell {
        text-align: center;
        ${({ theme }) => theme.fonts.h6};
        border-top: 1px solid black;
        border-bottom: 1px solid black;
    }
    .ant-table-tbody tr td.ant-table-cell,
    .ant-table-tbody
        tr
        td.ant-table-cell
        div
        span.ant-statistic-content-suffix {
        text-align: center;
        ${({ theme }) => theme.fonts.display_0};
        // border: 1px solid white;
    }

    .ant-statistic
        .ant-statistic-content
        .ant-statistic-content-value
        .ant-statistic-content-value-int {
        text-align: center;
        ${({ theme }) => theme.fonts.display_1};
    }

    .ant-statistic
        .ant-statistic-content
        .ant-statistic-content-value
        .ant-statistic-content-value-decimal {
        text-align: center;
        ${({ theme }) => theme.fonts.display_1};
    }

    .ant-statistic .ant-statistic-content {
        text-align: center;
        ${({ theme }) => theme.fonts.display_1};
    }
`;

export default forwardRef(EditTable);
