import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Select, Space } from 'antd';
import 'antd/dist/antd.css';
import {
    PlusCircleOutlined,
    CheckOutlined,
    // MinusCircleOutlined,
} from '@ant-design/icons';
import {
    commonBasicGetPagesAsyncAction,
    commonBasicPostAsyncAction,
} from 'store/common/basic/reducer';
import {
    commonAfterGetPagesAsyncAction,
    commonAfterPostAsyncAction,
} from 'store/common/after/reducer';
import {
    commonMaterialGetPagesAsyncAction,
    commonMaterialPostAsyncAction,
} from 'store/common/material/reducer';

import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import { Tooltip } from 'components/common/tooltip';
const { Option } = Select;

const initialColumns = [
    //BASIC INFO
    {
        title: 'Name1',
        dataIndex: 'name1',
        width: 200,
        editable: true,
        screenType: 'basic',
        // align: "center",
        ellipsis: true,
        // textWrap: "word-break",
        // render: (text, record) => (
        //     <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
        //         {text}
        //     </div>
        // ),
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },
    {
        title: 'Name2',
        dataIndex: 'name2',
        width: 200,
        editable: true,
        screenType: 'basic',
        ellipsis: true,
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },
    {
        title: 'Name3',
        dataIndex: 'name3',
        width: 200,
        editable: true,
        screenType: 'basic',
        ellipsis: true,
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },
    {
        title: 'Name4',
        dataIndex: 'name4',
        width: 200,
        editable: true,
        screenType: 'basic',
        ellipsis: true,
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },
    {
        title: 'Name5',
        dataIndex: 'name5',
        width: 200,
        editable: true,
        screenType: 'basic',
        ellipsis: true,
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },
    {
        title: 'Name6',
        dataIndex: 'name6',
        width: 200,
        editable: true,
        screenType: 'basic',
        ellipsis: true,
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },

    //AFTER MANUFACTURING
    {
        title: 'Type',
        dataIndex: 'type',
        width: '50%',
        editable: true,
        screenType: 'after',
        ellipsis: true,
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: '50%',
        editable: true,
        screenType: 'after',
        ellipsis: true,
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },

    //MATERIAL TYPE
    {
        title: 'A Type',
        dataIndex: 'typeA',
        width: '35%',
        editable: true,
        screenType: 'materialType',
        ellipsis: true,
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },
    {
        title: 'B Type',
        dataIndex: 'typeB',
        width: '35%',
        editable: true,
        screenType: 'materialType',
        ellipsis: true,
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },
    {
        title: 'C Type',
        dataIndex: 'typeC',
        width: '30%',
        editable: true,
        screenType: 'materialType',
        ellipsis: true,
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },
];

const options = [
    { key: 'company', value: 'COMPANY' },
    { key: 'gender', value: 'GENDER' },
    { key: 'uom', value: 'UOM' },
    { key: 'garment_category', value: 'GARMENT CATEGORY' },
    { key: 'country', value: 'COUNTRY' },
    { key: 'currency', value: 'CURRENCY' },
    { key: 'yarn', value: 'YARN' },

    // { key: 'menu', value: 'MENU' },

    { key: 'incoterms', value: 'INCOTERMS' },
    { key: 'shipping_method', value: 'SHIPPING METHOD' },
    { key: 'port', value: 'PORT' },
    { key: 'container', value: 'CONTAINER' },
    { key: 'payment_terms', value: 'PAYMENT TERMS' },
    { key: 'payment_period', value: 'PAYMENT PERIOD' },
    { key: 'payment_base', value: 'PAYMENT BASE' },
    { key: 'document_type', value: 'DOCUMENT TYPE' },
    { key: 'importation', value: 'IMPORTATION' },
    { key: 'scac', value: 'SCAC' },
    { key: 'transit', value: 'TRANSIT' },
    { key: 'airline', value: 'AIRLINE' },
    { key: 'production', value: 'PRODUCTION' },
    { key: 'garment_size', value: 'GARMENT SIZE GROUP' },
    { key: 'actual_color', value: 'ACTUAL COLOR' },
    { key: 'purchase_order_type', value: 'PURCHASE ORDER TYPE' },

    // { key: 'ship_mode', value: 'SHIP MODE' },
    // { key: 'after', value: 'AFTER MANUFACTURING' }, company 이동
    { key: 'materialType', value: 'MATERIAL TYPE' },

    { key: 'bl', value: 'BL' },
];

const General = () => {
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [type, setType] = useState('company');
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState();
    const [isLoading, setIsLoading] = useState(false);

    //COMMON BASIC INFO
    const searchResult = useSelector(
        (state) => state.commonBasicReducer.get.pages
    );

    const saveResult = useSelector((state) => state.commonBasicReducer.post);

    const handleCommonBasicPage = useCallback(
        (payload) => dispatch(commonBasicGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const handleCommonBasicPageInit = useCallback(
        () => dispatch(commonBasicGetPagesAsyncAction.initial()),
        [dispatch]
    );

    const handleCommonBasicSave = useCallback(
        (payload) => dispatch(commonBasicPostAsyncAction.request(payload)),
        [dispatch]
    );

    const handleCommonBasicInit = useCallback(
        () => dispatch(commonBasicPostAsyncAction.initial()),
        [dispatch]
    );

    //AFTER MANUFACTURING
    const afterSearchResult = useSelector(
        (state) => state.commonAfterReducer.get.pages
    );

    const afterSaveResult = useSelector(
        (state) => state.commonAfterReducer.post
    );

    const handleAfterPage = useCallback(
        (payload) => dispatch(commonAfterGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const handleAfterPageInit = useCallback(
        () => dispatch(commonAfterGetPagesAsyncAction.initial()),
        [dispatch]
    );

    const handleAfterSave = useCallback(
        (payload) => dispatch(commonAfterPostAsyncAction.request(payload)),
        [dispatch]
    );

    const handleAfterSaveInit = useCallback(
        () => dispatch(commonAfterPostAsyncAction.initial()),
        [dispatch]
    );

    //MATERIAL TYPE
    const materialTypeSearchResult = useSelector(
        (state) => state.commonMaterialReducer.get.pages
    );

    const materialTypeSaveResult = useSelector(
        (state) => state.commonMaterialReducer.post
    );

    const handleMaterialTypePage = useCallback(
        (payload) =>
            dispatch(commonMaterialGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const handleMaterialTypePageInit = useCallback(
        () => dispatch(commonMaterialGetPagesAsyncAction.initial()),
        [dispatch]
    );

    const handleMaterialTypeSave = useCallback(
        (payload) => dispatch(commonMaterialPostAsyncAction.request(payload)),
        [dispatch]
    );

    const handleMaterialTypeSaveInit = useCallback(
        () => dispatch(commonMaterialPostAsyncAction.initial()),
        [dispatch]
    );

    const selectChange = (value, option) => {
        setType(option.value);
    };

    const onChange = (pagination) => {
        setPagination(pagination);
        if (type === 'after') {
            handleCommonBasicPageInit();
            handleMaterialTypePageInit();
            handleAfterPage(pagination);
        } else if (type === 'materialType') {
            handleCommonBasicPageInit();
            handleAfterPageInit();
            handleMaterialTypePage(pagination);
        } else {
            handleAfterPageInit();
            handleMaterialTypePageInit();
            handleCommonBasicPage({ type: type, pagination });
        }
    };

    const handleColumns = (type) => {
        let columns = [];
        if (type === 'after') {
            columns = initialColumns.filter((el) => el.screenType === 'after');
        } else if (type === 'materialType') {
            columns = initialColumns.filter(
                (el) => el.screenType === 'materialType'
            );
        } else {
            columns = initialColumns.filter((el) => el.screenType === 'basic');
        }
        return columns;
    };

    const save = () => {
        var selectItems = editTableRef.current.selectedRows;
        if (selectItems.length === 0) {
            confirm.warningConfirm('No item is selected');
            return;
        }

        confirm.saveConfirm((e) => {
            if (e) {
                for (var z = 0; z < selectItems.length; z++) {
                    if (selectItems[z].rowStatus === 'new') {
                        selectItems[z].id = null;
                    }
                }
                if (type === 'after') {
                    handleAfterSave(selectItems);
                } else if (type === 'materialType') {
                    handleMaterialTypeSave(selectItems);
                } else {
                    handleCommonBasicSave({ type: type, data: selectItems });
                }
            }
        });
    };

    useEffect(() => {
        if (type) {
            setColumns(handleColumns(type));
            if (type === 'after') {
                handleCommonBasicPageInit();
                handleMaterialTypePageInit();
                handleAfterPage({ pagination: { current: 1, pageSize: 15 } });
            } else if (type === 'materialType') {
                handleCommonBasicPageInit();
                handleAfterPageInit();
                handleMaterialTypePage({
                    pagination: { current: 1, pageSize: 15 },
                });
            } else {
                handleAfterPageInit();
                handleMaterialTypePageInit();
                handleCommonBasicPage({
                    type: type,
                    pagination: { current: 1, pageSize: 15 },
                });
            }
        }
    }, [
        type,
        handleCommonBasicPage,
        handleAfterPage,
        handleMaterialTypePage,
        handleCommonBasicPageInit,
        handleAfterPageInit,
        handleMaterialTypePageInit,
    ]);

    useEffect(() => {
        if (searchResult.data) {
            setDataSource(searchResult.data.page.content);
            setPagination({
                current: searchResult.data.page.number,
                pageSize: searchResult.data.page.size,
                total: searchResult.data.page.totalElements,
            });
            setIsLoading(searchResult.isLoading);
        }
        if (afterSearchResult.data) {
            setDataSource(afterSearchResult.data.page.content);
            setPagination({
                current: afterSearchResult.data.page.number,
                pageSize: afterSearchResult.data.page.size,
                total: afterSearchResult.data.page.totalElements,
            });
            setIsLoading(afterSearchResult.isLoading);
        }
        if (materialTypeSearchResult.data) {
            setDataSource(materialTypeSearchResult.data.page.content);
            setPagination({
                current: materialTypeSearchResult.data.page.number,
                pageSize: materialTypeSearchResult.data.page.size,
                total: materialTypeSearchResult.data.page.totalElements,
            });
            setIsLoading(materialTypeSearchResult.isLoading);
        }
    }, [searchResult, afterSearchResult, materialTypeSearchResult]);

    useEffect(() => {
        if (saveResult.data !== null) {
            if (saveResult.data.success) {
                confirm.successConfirm();
                handleCommonBasicPage({
                    type: type,
                    pagination: { current: 1, pageSize: 15 },
                });
            }
        }
        return () => handleCommonBasicInit();
    }, [type, saveResult, handleCommonBasicPage, handleCommonBasicInit]);

    useEffect(() => {
        if (afterSaveResult.data !== null) {
            if (afterSaveResult.data.success) {
                confirm.successConfirm();
                handleAfterPage({ pagination: { current: 1, pageSize: 15 } });
            }
        }
        return () => handleAfterSaveInit();
    }, [afterSaveResult, handleAfterPage, handleAfterSaveInit]);

    useEffect(() => {
        if (materialTypeSaveResult.data !== null) {
            if (materialTypeSaveResult.data.success) {
                confirm.successConfirm();
                handleMaterialTypePage({
                    pagination: { current: 1, pageSize: 15 },
                });
            }
        }
        return () => handleMaterialTypeSaveInit();
    }, [
        materialTypeSaveResult,
        handleMaterialTypePage,
        handleMaterialTypeSaveInit,
    ]);

    return (
        <div style={{ padding: '2rem 1rem 1rem 1rem' }}>
            <div
                style={{
                    padding: '0.5rem',
                    border: '1px solid lightgray',
                    borderRadius: '3px',
                    boxShadow: '3px 3px gray',
                }}
            >
                <div style={{ float: 'left', paddingBottom: '0.5rem' }}>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        size="small"
                        placeholder="Select a Type"
                        optionFilterProp="children"
                        onChange={selectChange}
                        filterOption={(input, option) =>
                            option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        defaultValue={'company'}
                    >
                        {options &&
                            options.map((option) => (
                                <Option key={option.key}>{option.value}</Option>
                            ))}
                    </Select>
                </div>
                <div style={{ float: 'right', display: 'inline-block' }}>
                    <Space>
                        <Tooltip
                            placement="topRight"
                            title="Create Item"
                            arrowPointAtCenter
                        >
                            <Button
                                icon={
                                    <PlusCircleOutlined
                                        style={{
                                            fontSize: '16px',
                                            color: '#000000',
                                        }}
                                    />
                                }
                                size="small"
                                style={{
                                    borderColor: '#000000',
                                    paddingTop: '3px',
                                }}
                                onClick={() => {
                                    editTableRef.current.handleAdd();
                                }}
                            />
                        </Tooltip>
                        <Tooltip
                            placement="topLeft"
                            title="Save item"
                            arrowPointAtCenter
                        >
                            <Button
                                onClick={save}
                                icon={
                                    <CheckOutlined
                                        style={{
                                            fontSize: '16px',
                                            color: '#000000',
                                        }}
                                    />
                                }
                                size="small"
                                style={{
                                    borderColor: '#000000',
                                    paddingTop: '3px',
                                }}
                            />
                        </Tooltip>
                    </Space>
                </div>
                <CustomTable
                    ref={editTableRef}
                    rowKey={(record) => record.id}
                    initialColumns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    rowSelection={true}
                    loading={isLoading}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default General;
