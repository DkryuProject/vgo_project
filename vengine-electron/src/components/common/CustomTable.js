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
import { Table, Form, Input, InputNumber } from 'antd';

import CustomSelect from './CustomSelect';
import styled from 'styled-components';

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
    selectBox,
    selectType,
    // 인풋 타입 ex) number, decimals
    inputType,
    // 인풋 조건
    inputValidate,
    children,
    dataIndex,
    record,
    callback,
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
        try {
            const values = {
                [dataIndex]: {
                    id: option.value,
                    name: option.children,
                    data: option.data,
                },
            };

            // if (dataIndex === 'country') {
            //     callback((data) => ({
            //         ...data,
            //         [record.id]: option.data,
            //     }));
            // } else
            if (dataIndex === 'buyerCompany') {
                if (callback)
                    // return  제거
                    callback((data) => ({
                        ...data,
                        [record.materialOfferId]: option.value,
                    }));
            } else if (dataIndex === 'orderedAdjUom') {
                if (callback) {
                    callback((data) => ({
                        ...data,
                        [record.itemID]: option,
                    }));
                }
            }

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Change failed:', errInfo);
        }
    };

    const onBlur = async () => {
        try {
            toggleEdit();
        } catch (errInfo) {
            console.log('Blur failed:', errInfo);
        }
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
    // 회사 정보 업데이트 부분에서 notEditable가 필요
    // rmPo publish 단계 !(record?.mclMaterialInfo?.materialInfo?.type === 'trim') 추후 수정

    if (
        (dataIndex !== 'notEditable' && record?.rowStatus) ||
        editable
        // ||
        // (dataIndex === 'orderedAdjUom' &&
        //     record?.mclMaterialInfo?.materialInfo?.type === 'fabric')
    ) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: false,
                        // type: 'regexp',
                        // pattern: new RegExp(/\$\s?|(.*)/g),
                    },
                ]}
                size="small"
            >
                {selectBox ? (
                    <CustomSelect
                        onSelect={onSelect}
                        onBlur={onBlur}
                        value={record[dataIndex]}
                        rowId={record.id || record.materialOfferId}
                        selectType={selectType}
                        dataIndex={dataIndex}
                        record={record}
                    />
                ) : inputType === 'number' ? (
                    <InputNumber
                        ref={inputRef}
                        // 엔터시 max가 안먹는다
                        // onPressEnter={save}
                        onBlur={save}
                        // type="number"
                        max={inputValidate?.max}
                        formatter={(value) =>
                            value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={
                            (value) =>
                                parseInt(value.replace(/\$\s?|(,*)/g, '')) || 0
                            // .replace(/[^0-9]/g, '')
                        }
                        style={{ width: '100%' }}
                        bordered={false}
                    />
                ) : inputType === 'decimals' ? (
                    <InputNumber
                        ref={inputRef}
                        // onPressEnter={save}
                        onBlur={save}
                        // type="number"
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

const CustomTable = (props, ref) => {
    const {
        title,
        footer,
        rowKey,
        summary,
        loading,
        rowSelection,
        // checkbox or radio
        rowSelectionType,
        callback,
        onRow,
        expandable,
        onExpand,
        defaultExpandAllRows,
        onIsRender,
        // disabled checkbox
        onGetCheckboxProps,
        scroll,
    } = props;
    const [count, setCount] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const id = typeof rowKey === 'string' ? rowKey : 'id';
    const handleAdd = () => {
        const newRowData = {
            [id]: 'new' + count,
            rowStatus: 'new',
        };
        props.initialColumns.map((v) => {
            return (newRowData[v.dataIndex] = null);
        });

        // props.initialColumns.reduce((acc, cur) => {
        //     if (cur.dataIndex === 'noEditable') {
        //         return acc;
        //     }
        //     newRowData[cur.dataIndex] = null;
        //     return acc;
        // }, {});

        setDataSource([newRowData, ...dataSource]);
        //행추가시 자동으로 select 체크 처리
        setSelectedRowKeys([...selectedRowKeys, newRowData[id]]);
        setSelectedRows([...selectedRows, newRowData]);
        setCount((prev) => prev + 1);
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
        (pagination, filters, sorter) => {
            props.onChange && props.onChange(pagination);
        },
        [props]
    );

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('onSelectChange');
        console.log('selectedRowKeys: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    };

    const initialSelectRows = () => {
        setSelectedRows([]);
        setSelectedRowKeys([]);
    };

    useImperativeHandle(ref, () => ({
        handleAdd,
        selectedRows,
        selectedRowKeys,
        handleSelectRows,
        onSelectChange,
        initialSelectRows,
        dataSource,
    }));

    useEffect(() => {
        initialSelectRows();
        // 삭제시 refresh 떄문에 주석 처리
        // if (props.dataSource?.length) {
        //     setDataSource(props?.dataSource || []);
        // }
        setDataSource(props?.dataSource || []);
    }, [props.dataSource]);

    // 렌더링 끝난 시점을 부모 컴포넌트한테 알려주려 onIsRender 함수를 사용
    useEffect(() => {
        if (onIsRender) {
            onIsRender((isRender) => !isRender);
        }
    }, [
        onIsRender,
        // , selectedRows
    ]);

    // console.log("datasource ====> ", dataSource);

    // const sortData = (data) => {
    //     return data && data.slice().sort((a, b) => a.createdby
    // }

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
                selectType: col.selectType,
                inputType: col.inputType,
                inputValidate: col.inputValidate,
                callback: callback,
                handleSave: handleSave,
            }),
        };
        if (col.children) {
            newCol.children = col.children.map(mapColumns);
        }
        return newCol;
    };

    const columns = props.initialColumns.map(mapColumns);
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
                // bordered
                dataSource={dataSource}
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }}
                columns={columns}
                pagination={
                    props.pagination
                        ? {
                              ...props.pagination,
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
                        onChange: onSelectChange,
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
            />
        ),
        [
            title,
            footer,
            rowKey,
            dataSource,
            columns,
            props.pagination,
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
        ]
    );

    return (
        <TableWrap>
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
                    // bordered
                    dataSource={dataSource}
                    components={{
                        body: {
                            row: EditableRow,
                            cell: EditableCell,
                        },
                    }}
                    columns={columns}
                    pagination={
                        props.pagination
                            ? {
                                  ...props.pagination,
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
                            onChange: onSelectChange,
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
                />
            )}
        </TableWrap>
    );
};

const TableWrap = styled.div`
    .titleWrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

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

export default forwardRef(CustomTable);
