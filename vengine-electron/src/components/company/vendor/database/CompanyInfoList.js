import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Space, Modal, Input } from 'antd';
import 'antd/dist/antd.css';
import {
    PlusCircleOutlined,
    CheckOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';

import {
    companySearchPageAsyncAction,
    companyInfoSaveAsyncAction,
    companyInfoDeleteAsyncAction,
    companyGetTermsAsyncAction,
    companyDeleteTermsAsyncAction,
    companyPostTermsAsyncAction,
} from 'store/companyInfo/reducer';

import * as confirm from '../../../common/confirm';
import CustomTable from '../../../common/CustomTable';
import { Tooltip } from 'components/common/tooltip';

const CompanyInfoList = (props) => {
    const editTableRef = useRef();
    const dispatch = useDispatch();

    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [poTerms, setPoTerms] = useState(null);

    const searchResult = useSelector(
        (state) => state.companyInfoReducer.search
    );

    const saveResult = useSelector((state) => state.companyInfoReducer.save);

    const deleteResult = useSelector(
        (state) => state.companyInfoReducer.delete
    );

    const handleCompanyInfoPage = useCallback(
        (payload) => dispatch(companySearchPageAsyncAction.request(payload)),
        [dispatch]
    );

    const handleCompanyGetTerms = useCallback(
        (payload) => dispatch(companyGetTermsAsyncAction.request(payload)),
        [dispatch]
    );

    const handleCompanyPostTerms = useCallback(
        (payload) => dispatch(companyPostTermsAsyncAction.request(payload)),
        [dispatch]
    );

    const handleCompanyDeleteTerms = useCallback(
        (payload) => dispatch(companyDeleteTermsAsyncAction.request(payload)),
        [dispatch]
    );

    const handleCompanyInfoSave = useCallback(
        (payload) => dispatch(companyInfoSaveAsyncAction.request(payload)),
        [dispatch]
    );

    const handleCompanyInfoSaveInit = useCallback(
        () => dispatch(companyInfoSaveAsyncAction.initial()),
        [dispatch]
    );

    const handleCompanyInfoDelete = useCallback(
        (payload) => dispatch(companyInfoDeleteAsyncAction.request(payload)),
        [dispatch]
    );

    const handleCompanyInfoDeleteInit = useCallback(
        () => dispatch(companyInfoDeleteAsyncAction.initial()),
        [dispatch]
    );

    const [isModalVisible, setIsModalVisible] = useState({
        id: null,
        status: false,
    });

    const showModal = useCallback(
        (id) => {
            setIsModalVisible((isModalVisible) => ({
                ...isModalVisible,
                id,
                status: true,
            }));
        },
        [setIsModalVisible]
    );

    const handleOk = useCallback(() => {
        setIsModalVisible((isModalVisible) => ({
            ...isModalVisible,
            status: false,
        }));
    }, [setIsModalVisible]);

    const handleCancel = useCallback(() => {
        setIsModalVisible((isModalVisible) => ({
            ...isModalVisible,
            status: false,
        }));
    }, [setIsModalVisible]);

    const onChange = (pagination) => {
        setPagination(pagination);

        if (props.type === 'document') {
            handleCompanyGetTerms(pagination);
        } else {
            handleCompanyInfoPage({ type: props.type, pagination });
        }
    };

    const save = useCallback(
        (type) => {
            var selectItems = editTableRef.current.selectedRows;

            if (selectItems.length === 0) {
                confirm.warningConfirm('No item is selected');
                return;
            }
            if (type === 'save') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        const newSelectItems = selectItems.map((v) => ({
                            ...v,
                            contents: null,
                        }));
                        for (var z = 0; z < selectItems.length; z++) {
                            if (
                                props.type === 'document' &&
                                poTerms[newSelectItems[z].id]
                            ) {
                                newSelectItems[z].contents =
                                    poTerms[newSelectItems[z].id];
                            }

                            if (newSelectItems[z].rowStatus === 'new') {
                                newSelectItems[z].id = null;
                            }

                            if (newSelectItems[z]?.type) {
                                newSelectItems[z].type =
                                    newSelectItems[z]?.type.id;
                            }
                        }

                        if (props.type === 'document') {
                            handleCompanyPostTerms(
                                newSelectItems.map((v) => ({
                                    documentType: v?.documentType?.id,
                                    id: v?.id,
                                    materialType: v?.materialType?.id,
                                    terms: v?.contents,
                                }))
                            );
                        } else {
                            handleCompanyInfoSave({
                                type: props.type,
                                data: newSelectItems,
                            });
                        }
                    }
                });
            } else if (type === 'delete') {
                let deleteIds = [];
                confirm.deleteConfirm((e) => {
                    if (e) {
                        for (var z = 0; z < selectItems.length; z++) {
                            if (selectItems[z].rowStatus !== 'new') {
                                deleteIds.push(selectItems[z].id);
                            }
                        }
                        if (props.type === 'document') {
                            handleCompanyDeleteTerms(deleteIds);
                        } else {
                            handleCompanyInfoDelete({
                                type: props.type,
                                ids: deleteIds,
                            });
                        }
                    }
                });
            }
        },
        [
            poTerms,
            props.type,
            handleCompanyPostTerms,
            handleCompanyDeleteTerms,
            handleCompanyInfoSave,
            handleCompanyInfoDelete,
        ]
    );

    const handleColumns = () => {
        let checkedColumns = [];
        if (props.type !== 'after') {
            checkedColumns = ['type'];
        }

        if (props.type !== 'document') {
            checkedColumns = [
                ...checkedColumns,
                'documentType',
                'materialType',
                'notEditable',
            ];
        }

        if (props.type === 'document') {
            checkedColumns = [...checkedColumns, 'name'];
        }

        // if (props.type !== 'size') {
        //     checkedColumns = ['garmentCategory', 'sizeGroup', 'gender'];
        // }

        let filtered = initialColumns;
        for (let i = 0; i < checkedColumns.length; i++)
            filtered = filtered.filter((el) => {
                return el.dataIndex !== checkedColumns[i];
            });

        return filtered;
    };

    // useEffect(() => {
    //     if (props.type === 'document') {
    //         handleCompanyGetTerms({ current: 1, pageSize: 15 });
    //     } else {
    //         handleCompanyInfoPage({
    //             type: props.type,
    //             pagination: { current: 1, pageSize: 15 },
    //         });
    //     }
    // }, [props.type, handleCompanyInfoPage, handleCompanyGetTerms]);

    useEffect(() => {
        if (searchResult.error) {
            setDataSource([]);
        } else if (searchResult.data) {
            if (props.type === 'document') {
                setPoTerms(
                    searchResult.data.page.content.reduce((acc, cur) => {
                        acc[cur.id] = cur?.terms;

                        return acc;
                    }, {})
                );
            }
            setDataSource(searchResult.data.page.content);
            setPagination({
                current: searchResult.data.page.number + 1,
                pageSize: searchResult.data.page.size,
                total: searchResult.data.page.totalElements,
            });
            setIsLoading(searchResult.isLoading);
        }
    }, [
        props.type,
        searchResult,
        setIsLoading,
        setDataSource,
        setPagination,
        setPoTerms,
    ]);

    useEffect(() => {
        if (saveResult.data !== null) {
            handleCompanyInfoSaveInit();
            if (saveResult.data.success) {
                confirm.successConfirm();
            } else {
                confirm.warningConfirm('Save Fail!!');
                return;
            }
        }
        if (deleteResult.data !== null) {
            handleCompanyInfoDeleteInit();
            if (deleteResult.data.success) {
                confirm.successConfirm();
            } else {
                confirm.warningConfirm('Delete Fail!!');
            }
        }
        if (props.type === 'document') {
            handleCompanyGetTerms({ current: 1, pageSize: 15 });
        } else {
            handleCompanyInfoPage({
                type: props.type,
                pagination: { current: 1, pageSize: 15 },
            });
        }
    }, [
        props.type,
        saveResult,
        deleteResult,
        handleCompanyGetTerms,
        handleCompanyInfoPage,
        handleCompanyInfoSaveInit,
        handleCompanyInfoDeleteInit,
    ]);

    const initialColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            editable: true,
            ellipsis: true,
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            // width: "20%",
            editable: true,
            selectBox: true,
            selectType: { name: 'company', type: 'afterSelect' },
            ellipsis: true,
            render: (data) => {
                const _data =
                    data?.name ||
                    (Number(data) === 0 && 'dyeing') ||
                    (Number(data) === 1 && 'fashion') ||
                    (Number(data) === 2 && 'finishing');

                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Document Type',
            dataIndex: 'documentType',
            editable: true,
            selectBox: true,
            selectType: { name: 'common', type: 'list', path: 'document_type' },
            ellipsis: true,
            render: (data) => {
                const _data = data?.name1 || data?.name;
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Item Type',
            dataIndex: 'materialType',
            editable: true,
            selectBox: true,
            selectType: { name: 'common', type: 'list', path: 'material_type' },
            ellipsis: true,
            render: (data) => {
                const _data = data?.name1 || data?.name;
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'notEditable',
            ellipsis: true,
            render: (_, record) => {
                const _data = record?.terms && <CheckOutlined />;
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: '',
            dataIndex: 'notEditable',
            ellipsis: true,
            render: (data, record) => {
                const { id } = record;
                return <Button onClick={() => showModal(id)}>UPDATE</Button>;
            },
        },
        {
            title: 'Createdby',
            dataIndex: '',
            width: '10%',
            ellipsis: true,
            render: (_, record) => {
                const { createdInfo } = record;
                return (
                    <Tooltip title={createdInfo?.userName}>
                        {createdInfo?.userName}
                    </Tooltip>
                );
            },
        },
    ];

    return (
        <div style={{ padding: '0rem 1rem 1rem 1rem' }}>
            <Modal
                title="PO Terms"
                visible={isModalVisible?.status}
                closable={false}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input.TextArea
                    value={poTerms?.[isModalVisible?.id]}
                    onChange={(e) => {
                        e.persist();
                        return setPoTerms((poTerms) => ({
                            ...poTerms,
                            [isModalVisible?.id]: e.target.value,
                        }));
                    }}
                    autoSize={{ minRows: 5, maxRows: 10 }}
                />
            </Modal>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    paddingBottom: '0.5rem',
                }}
            >
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
                            onClick={() => save('save')}
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
                    <Tooltip
                        placement="topRight"
                        title="Delete Item"
                        arrowPointAtCenter
                    >
                        <Button
                            icon={
                                <MinusCircleOutlined
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
                            onClick={() => save('delete')}
                        />
                    </Tooltip>
                </Space>
            </div>
            <CustomTable
                ref={editTableRef}
                rowKey={(record) => record.id}
                initialColumns={handleColumns()}
                dataSource={dataSource}
                pagination={pagination}
                rowSelection={true}
                loading={isLoading}
                onChange={onChange}
            />
        </div>
    );
};

export default CompanyInfoList;
