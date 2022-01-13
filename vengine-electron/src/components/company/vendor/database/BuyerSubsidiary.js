import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useGtag from 'core/hook/useGtag';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import {
    PlusCircleOutlined,
    CheckOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';
import {
    companySearchPageAsyncAction,
    companyRelationSaveAsyncAction,
    companyInfoDeleteAsyncAction,
} from 'store/companyInfo/reducer';

import * as confirm from '../../../common/confirm';
import CustomTable from '../../../common/CustomTable';
import { Tooltip } from 'components/common/tooltip';
import { TitleWrap } from 'components/UI/molecules';

const initialColumns = [
    {
        title: 'Buyer Company Code',
        dataIndex: 'notEditable',
        ellipsis: true,
        render: (_, record) => (
            <Tooltip title={record?.buyerCompany?.id}>
                {record?.buyerCompany?.id}
            </Tooltip>
        ),
    },
    {
        title: 'Buyer',
        dataIndex: 'buyerCompany',
        // width: '15%',
        editable: true,
        selectBox: true,
        selectType: { name: 'company', type: 'relation', path: 'BUYER' },
        ellipsis: true,
        render: (data) => <Tooltip title={data?.name}>{data?.name}</Tooltip>,
    },
    // {
    //     title: 'Buyer Nickname',
    //     dataIndex: 'buyerNickname',
    //     width: '15%',
    //     editable: true,
    //     ellipsis: true,
    //     render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    // },
    // {
    //     title: 'Buyer Code',
    //     dataIndex: 'buyerCode',
    //     width: '15%',
    //     editable: true,
    //     ellipsis: true,
    //     render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    // },
    {
        title: 'Brand  Company Code',
        dataIndex: 'notEditable',
        ellipsis: true,
        render: (_, record) => (
            <Tooltip title={record?.subsidiaryCompany?.id}>
                {record?.subsidiaryCompany?.id}
            </Tooltip>
        ),
    },
    {
        title: 'Brand',
        dataIndex: 'subsidiaryCompany',
        // width: '15%',
        editable: true,
        selectBox: true,
        selectType: { name: 'company', type: 'relation', path: 'BUYER' },
        ellipsis: true,
        render: (data) => <Tooltip title={data?.name}>{data?.name}</Tooltip>,
    },
    // {
    //     title: 'brand Nickname',
    //     dataIndex: 'subsidiaryNickname',
    //     width: '15%',
    //     editable: true,
    //     ellipsis: true,
    //     render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    // },
    // {
    //     title: 'brand Code',
    //     dataIndex: 'subsidiaryCode',
    //     width: '15%',
    //     editable: true,
    //     ellipsis: true,
    //     render: (data) => <Tooltip title={data}>{data}</Tooltip>,
    // },
    // {
    //     title: 'Createdby',
    //     dataIndex: 'notEditable',
    //     width: '10%',
    //     ellipsis: true,
    //     render: (_, record) => {
    //         const {} = record;
    //         return (
    //             <Tooltip title={data?.userName}>{data?.userName}</Tooltip>
    //         )
    //     },
    // },
];

const BuyerSubsidiary = () => {
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const { trackPageView } = useGtag();
    const [type] = useState('relation');
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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

    const handleCompanyInfoSave = useCallback(
        (payload) => dispatch(companyRelationSaveAsyncAction.request(payload)),
        [dispatch]
    );

    const handleCompanyInfoSaveInit = useCallback(
        () => dispatch(companyRelationSaveAsyncAction.initial()),
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

    const save = (_type) => {
        var selectItems = editTableRef.current.selectedRows;
        if (selectItems.length === 0) {
            confirm.warningConfirm('No item is selected');
            return;
        }
        if (_type === 'save') {
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
        } else if (_type === 'delete') {
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
    }, [type, deleteResult, saveResult, handleCompanyInfoPage]);

    useEffect(() => {
        if (searchResult.data !== null) {
            setDataSource(searchResult.data.page.content);
            setPagination({
                current: searchResult.data.page.number + 1,
                pageSize: searchResult.data.page.size,
                total: searchResult.data.page.totalElements,
            });
            setIsLoading(searchResult.isLoading);
        }
    }, [searchResult]);

    useEffect(() => {
        if (saveResult.data) {
            handleCompanyInfoSaveInit();
            if (saveResult.data.success) {
                confirm.successConfirm();
            } else {
                confirm.warningConfirm('Save Fail!!');
                return;
            }
        }
        if (deleteResult.data) {
            handleCompanyInfoDeleteInit();
            if (deleteResult.data.success) {
                confirm.successConfirm();
            } else {
                confirm.warningConfirm('Delete Fail!!');
            }
        }
    }, [
        saveResult,
        deleteResult,
        handleCompanyInfoSaveInit,
        handleCompanyInfoDeleteInit,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `BUYER SUBSIDIARYIES | SYSTEM `,
        });
    }, [trackPageView]);

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
                <CustomTable
                    title={() => (
                        <TitleWrap>
                            <TitleWrap.Title suffix>
                                BUYER-SUBSIDIARYIES
                            </TitleWrap.Title>
                            <TitleWrap.Function>
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
                            </TitleWrap.Function>
                        </TitleWrap>
                    )}
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

export default BuyerSubsidiary;
