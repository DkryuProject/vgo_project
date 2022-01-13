import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Space } from 'antd';
import 'antd/dist/antd.css';
import {
    PlusCircleOutlined,
    CheckOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';
import {
    companySearchPageAsyncAction,
    companyBuyerSaveAsyncAction,
    companyInfoDeleteAsyncAction,
} from 'store/companyInfo/reducer';

import * as confirm from '../../../common/confirm';
import CustomTable from '../../../common/CustomTable';
import { Tooltip } from 'components/common/tooltip';

const initialColumns = [
    {
        title: 'Brand',
        dataIndex: 'brandCompany',
        width: 150,
        editable: true,
        selectBox: true,
        selectType: { name: 'company', type: '' },
        ellipsis: true,
        render: (data) => <Tooltip title={data?.name}>{data?.name}</Tooltip>,
    },
    {
        title: 'Incoterms',
        dataIndex: 'cmIncoterms',
        width: 150,
        editable: true,
        selectBox: true,
        selectType: { name: 'common', type: 'incoterms' },
        ellipsis: true,
        render: (data) => <Tooltip title={data?.name}>{data?.name}</Tooltip>,
    },
    {
        title: 'Payment',
        dataIndex: 'cmPayment',
        width: 150,
        editable: true,
        selectBox: true,
        selectType: { name: 'common', type: 'payment_terms' },
        ellipsis: true,
        render: (data) => <Tooltip title={data?.name}>{data?.name}</Tooltip>,
    },
    {
        title: 'Accountee',
        dataIndex: 'accounteeCompany',
        width: 150,
        editable: true,
        selectBox: true,
        selectType: { name: 'company', type: '' },
        ellipsis: true,
        render: (data) => <Tooltip title={data?.name}>{data?.name}</Tooltip>,
    },
    {
        title: 'Market',
        dataIndex: 'companyGarmentMarket',
        width: 150,
        editable: true,
        selectBox: true,
        selectType: { name: 'market', type: '' },
        ellipsis: true,
        render: (data) => <Tooltip title={data?.name}>{data?.name}</Tooltip>,
    },
    {
        title: 'Forwarder',
        dataIndex: 'forwarderCompany',
        width: 150,
        editable: true,
        selectBox: true,
        selectType: { name: 'company', type: '' },
        ellipsis: true,
        render: (data) => <Tooltip title={data?.name}>{data?.name}</Tooltip>,
    },
    {
        title: 'Tolerance(+)',
        dataIndex: 'buyerPlusTolerance',
        width: 150,
        editable: true,
        ellipsis: true,
        render: (data) => <Tooltip title={data?.name}>{data?.name}</Tooltip>,
    },
    {
        title: 'Tolerance(-)',
        dataIndex: 'buyerMinusTolerance',
        width: 150,
        editable: true,
        ellipsis: true,
        render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    },
    {
        title: 'Createdby',
        dataIndex: 'createdInfo',
        width: 150,
        ellipsis: true,
        render: (data) => (
            <Tooltip title={data?.userName}>{data?.userName}</Tooltip>
        ),
    },
];

const BuyerManagement = () => {
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [type] = useState('buyer');
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const buyerSearchResult = useSelector(
        (state) => state.companyInfoReducer.search
    );

    const buyerSaveResult = useSelector(
        (state) => state.companyInfoReducer.save
    );

    const buyerDeleteResult = useSelector(
        (state) => state.companyInfoReducer.delete
    );

    const handleCompanyInfoPage = useCallback(
        (payload) => dispatch(companySearchPageAsyncAction.request(payload)),
        [dispatch]
    );

    const handleCompanyInfoSave = useCallback(
        (payload) => dispatch(companyBuyerSaveAsyncAction.request(payload)),
        [dispatch]
    );

    const handleCompanyInfoSaveInit = useCallback(
        () => dispatch(companyBuyerSaveAsyncAction.initial()),
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

    const onChange = (pagination) => {
        setPagination(pagination);
        handleCompanyInfoPage({ type: type, pagination });
    };

    const save = (type) => {
        var selectItems = editTableRef.current.selectedRows;

        if (selectItems.length === 0) {
            confirm.warningConfirm('No item is selected');
            return;
        }
        if (type === 'save') {
            confirm.saveConfirm((e) => {
                if (e) {
                    for (var z = 0; z < selectItems.length; z++) {
                        if (selectItems[z].rowStatus === 'new') {
                            selectItems[z].id = null;
                        }
                    }
                    handleCompanyInfoSave({ data: selectItems });
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
                    handleCompanyInfoDelete({ type: type, ids: deleteIds });
                }
            });
        }
    };

    useEffect(() => {
        handleCompanyInfoPage({
            type: type,
            pagination: { current: 1, pageSize: 15 },
        });
    }, [type, handleCompanyInfoPage]);

    useEffect(() => {
        if (buyerSearchResult.data !== null) {
            setDataSource(buyerSearchResult.data.page.content);
            setPagination({
                current: buyerSearchResult.data.page.number + 1,
                pageSize: buyerSearchResult.data.page.size,
                total: buyerSearchResult.data.page.totalElements,
            });
            setIsLoading(buyerSearchResult.isLoading);
        }
    }, [buyerSearchResult]);

    useEffect(() => {
        if (buyerSaveResult.data) {
            handleCompanyInfoSaveInit();
            if (buyerSaveResult.data.success) {
                confirm.successConfirm();
            } else {
                confirm.warningConfirm('Save Fail!!');
                return;
            }
        }
        if (buyerDeleteResult.data) {
            handleCompanyInfoDeleteInit();
            if (buyerDeleteResult.data.success) {
                confirm.successConfirm();
            } else {
                confirm.warningConfirm('Delete Fail!!');
            }
        }
    }, [
        buyerSaveResult,
        buyerDeleteResult,
        handleCompanyInfoSaveInit,
        handleCompanyInfoDeleteInit,
    ]);
    // console.log("--------> ", handleCompanyInfoPage);
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
                    initialColumns={initialColumns}
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

export default BuyerManagement;
