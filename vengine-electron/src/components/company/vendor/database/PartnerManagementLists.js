import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useGtag from 'core/hook/useGtag';
import useNotification from 'core/hook/useNotification';
import {
    companyBizGetRelationAsyncAction,
    companyBizGetRequestAsyncAction,
    companyBizPutRelationStatusAsyncAction,
    companyBizPutRequestStatusAsyncAction,
    companyBizPutStatusAsyncAction,
} from 'store/companyInfo/reducer';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import { Space, Input } from 'antd';
import { CaretRightOutlined, SearchOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import styled from 'styled-components';

const PartnerManagementLists = (props) => {
    const { match, history } = props;
    const rowKey = 'id';
    const editTableRef = useRef();
    const requestTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
    const [dataSource, setDataSource] = useState([]);
    const [requestDataSource, setRequestDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [requestIsLoading, setrequestIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        searchKeyword: '',
    });
    const [requestPagination, setRequestPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [total, setTotal] = useState(0);
    const [requestTotal, setRequestTotal] = useState(0);

    const companyBizGetRelation = useSelector(
        (state) => state.companyInfoReducer.get.bizRelation
    );
    const handleCompanyBizGetRelation = useCallback(
        (payload) =>
            dispatch(companyBizGetRelationAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCompanyBizGetRelationInit = useCallback(
        () => dispatch(companyBizGetRelationAsyncAction.initial()),
        [dispatch]
    );

    const companyBizPutStatus = useSelector(
        (state) => state.companyInfoReducer.put.bizStatus
    );
    const handleCompanyBizPutStatus = useCallback(
        (payload) => dispatch(companyBizPutStatusAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCompanyBizPutStatusInit = useCallback(
        () => dispatch(companyBizPutStatusAsyncAction.initial()),
        [dispatch]
    );

    // 관계 신청 조회
    const companyBizGetRequest = useSelector(
        (state) => state.companyInfoReducer.get.bizRequest
    );
    const handleCompanyBizGetRequest = useCallback(
        (payload) => dispatch(companyBizGetRequestAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCompanyBizGetRequestInit = useCallback(
        () => dispatch(companyBizGetRequestAsyncAction.initial()),
        [dispatch]
    );

    // 관계 신청
    const companyBizPutRequestStatus = useSelector(
        (state) => state.companyInfoReducer.put.bizRequestStatus
    );
    const handleCompanyBizPutRequestStatus = useCallback(
        (payload) =>
            dispatch(companyBizPutRequestStatusAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCompanyBizPutRequestStatusInit = useCallback(
        () => dispatch(companyBizPutRequestStatusAsyncAction.initial()),
        [dispatch]
    );

    // 관계 재신청 & 해지
    const companyBizPutRelationStatus = useSelector(
        (state) => state.companyInfoReducer.put.bizRelationStatus
    );
    const handleCompanyBizPutRelationStatus = useCallback(
        (payload) =>
            dispatch(companyBizPutRelationStatusAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCompanyBizPutRelationStatusInit = useCallback(
        () => dispatch(companyBizPutRelationStatusAsyncAction.initial()),
        [dispatch]
    );

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows, selectedRowKeys } = editTableRef.current;
            const {
                selectedRows: selectRequestRows,
                selectedRowKeys: selectRequestRowKeys,
            } = requestTableRef.current;

            if (type === 'active' || type === 'deactive') {
                if (selectedRows.length === 0) {
                    return confirm.warningConfirm('No item is selected');
                }

                // items안에 status가 waiting인 item이 존재 할때 에러
                if (selectedRows.some((v) => v.status?.toLowerCase() === 'w')) {
                    return confirm.warningConfirm(
                        'Among the items, there is an item whose status is waiting'
                    );
                }
            }

            if (type === 'approved' || type === 'returned') {
                if (selectRequestRowKeys.length === 0) {
                    return confirm.warningConfirm('No item is selected');
                }

                // items안에 approveStatus가 waiting이 아닌 item이 존재 할때 에러
                if (selectRequestRows.some((v) => v.approveStatus !== 2)) {
                    return confirm.warningConfirm(
                        'There is an item that is not waiting'
                    );
                }
            }

            if (type === 'save') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        const newValues = selectedRows.map((v) => {
                            return {
                                relationType:
                                    v.relationType?.id || v.relationType,
                                bizRelationId: v.id,
                                status: v.status.id || v.status,
                            };
                        });
                        return handleCompanyBizPutStatus(newValues);
                    }
                });
            } else if (type === 'active') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        return handleCompanyBizPutRelationStatus({
                            status: type,
                            data: selectedRowKeys,
                        });
                    }
                });
            } else if (type === 'deactive') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        return handleCompanyBizPutRelationStatus({
                            status: type,
                            data: selectedRowKeys,
                        });
                    }
                });
            } else if (type === 'approved') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        return handleCompanyBizPutRequestStatus({
                            status: type,
                            data: selectRequestRowKeys,
                        });
                    }
                });
            } else if (type === 'returned') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        return handleCompanyBizPutRequestStatus({
                            status: type,
                            data: selectRequestRowKeys,
                        });
                    }
                });
            }
        },
        [
            editTableRef,
            requestTableRef,
            handleCompanyBizPutStatus,
            handleCompanyBizPutRequestStatus,
            handleCompanyBizPutRelationStatus,
        ]
    );

    // 조회
    useEffect(() => {
        handleCompanyBizGetRelation(pagination);
        return () => {
            handleCompanyBizGetRelationInit();
        };
    }, [
        pagination,
        companyBizPutRequestStatus,
        companyBizPutRelationStatus,
        handleCompanyBizGetRelation,
        handleCompanyBizGetRelationInit,
    ]);

    useEffect(() => {
        setIsLoading(companyBizGetRelation.isLoading);
        if (companyBizGetRelation.data) {
            const { content, totalElements } = companyBizGetRelation.data.page;

            setDataSource(content);
            setTotal(totalElements);
        }
    }, [companyBizGetRelation]);

    useEffect(() => {
        handleCompanyBizGetRequest(requestPagination);
        return () => {
            handleCompanyBizGetRequestInit();
        };
    }, [
        requestPagination,
        companyBizPutRequestStatus,
        handleCompanyBizGetRequest,
        handleCompanyBizGetRequestInit,
    ]);

    useEffect(() => {
        setrequestIsLoading(companyBizGetRequest.isLoading);
        if (companyBizGetRequest.data) {
            const { content, totalElements } = companyBizGetRequest.data.page;
            setRequestDataSource(content);
            setRequestTotal(totalElements);
        }
    }, [companyBizGetRequest]);

    // 상태 수정
    useEffect(() => {
        if (companyBizPutStatus.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: companyBizPutStatus.error.message,
            });
        } else if (companyBizPutStatus.data) {
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Company business status modification successful',
            });
        }

        return () => handleCompanyBizPutStatusInit();
    }, [
        companyBizPutStatus,
        handleNotification,
        handleCompanyBizPutStatusInit,
    ]);

    // 요청에 대한 승인 및 반려
    useEffect(() => {
        if (companyBizPutRequestStatus.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: companyBizPutRequestStatus.error.message,
            });
        } else if (companyBizPutRequestStatus.data) {
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Company business request success',
            });
        }

        return () => handleCompanyBizPutRelationStatusInit();
    }, [
        companyBizPutRequestStatus,
        handleNotification,
        handleCompanyBizPutRelationStatusInit,
    ]);

    // 관계 재요청 / 해지
    useEffect(() => {
        if (companyBizPutRelationStatus.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: companyBizPutRelationStatus.error.message,
            });
        } else if (companyBizPutRelationStatus.data) {
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Company business request success',
            });
        }

        return () => handleCompanyBizPutRequestStatusInit();
    }, [
        companyBizPutRelationStatus,
        handleNotification,
        handleCompanyBizPutRequestStatusInit,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `LISTS | PARTNER MANAGEMENT | SYSTEM `,
        });
    }, [trackPageView]);

    // 테이블
    const columns = [
        {
            title: 'Company Code',
            dataIndex: 'companyID',
            key: 'companyID',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Company Name',
            dataIndex: 'companyName',
            key: 'companyName',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },

        {
            title: 'Postal Code',
            dataIndex: 'postalCode',
            key: 'postalCode',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'RelationShip',
            dataIndex: 'relationType',
            key: 'relationType',
            // editable: true,
            // selectBox: true,
            // selectType: { name: 'common', type: 'enums', path: 'relationType' },
            align: 'left',
            render: (data) => (
                <Tooltip title={data?.name || data}>
                    {data?.name || data}
                </Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            // editable: true,
            // selectBox: true,
            // selectType: { name: 'common', type: 'enums', path: 'userStatus' },
            align: 'left',
            render: (data) => {
                const _data = data?.name || data;
                let value = '';
                if (_data === 'A' || _data === 'Active') {
                    value = 'Active';
                } else if (_data === 'D' || _data === 'Deactive') {
                    value = 'Deactive';
                } else if (_data === 'W' || _data === 'Waiting') {
                    value = 'Waiting';
                }

                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
    ];

    const requestColumns = [
        {
            title: 'Request Company Code',
            dataIndex: 'requestCompany',
            align: 'left',
            render: (data) => <Tooltip title={data?.id}>{data?.id}</Tooltip>,
        },
        {
            title: 'Request Company Name',
            dataIndex: 'requestCompany',
            align: 'left',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: 'Response Company Code',
            dataIndex: 'responseCompany',
            align: 'left',
            render: (data) => <Tooltip title={data?.id}>{data?.id}</Tooltip>,
        },
        {
            title: 'Response Company Name',
            dataIndex: 'responseCompany',
            align: 'left',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'approveStatus',
            align: 'left',
            render: (data) => {
                const _data =
                    data === 0 ? 'Accept' : data === 1 ? 'Reject' : 'Wating';
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    PARTNER COMPANY LIST
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <Input
                        size="small"
                        value={pagination.searchKeyword}
                        onChange={(e) =>
                            setPagination({
                                ...pagination,
                                searchKeyword: e.target.value,
                            })
                        }
                        placeholder="Search"
                        suffix={<SearchOutlined />}
                        bordered={false}
                    />

                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Activate Partner Relation',
                            arrowPointAtCenter: true,
                        }}
                        size="small"
                        onClick={() => handleExcute('active')}
                    >
                        Activate
                    </TableButton>

                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Deactivate Partner Relation',
                            arrowPointAtCenter: true,
                        }}
                        size="small"
                        onClick={() => handleExcute('deactive')}
                    >
                        Deactivate
                    </TableButton>

                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Partner Create',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => history.push(`${match.url}/relation`)}
                    />

                    {/* <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Save item',
                            arrowPointAtCenter: true,
                        }}
                        mode="save"
                        size="small"
                        onClick={() => handleExcute('save')}
                    /> */}
                </Space>
            </div>
        </div>
    );

    const requestTitle = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    PARTNER RESPONSE LIST
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Approved',
                            arrowPointAtCenter: true,
                        }}
                        size="small"
                        onClick={() => handleExcute('approved')}
                    >
                        Accept
                    </TableButton>

                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Returned',
                            arrowPointAtCenter: true,
                        }}
                        size="small"
                        onClick={() => handleExcute('returned')}
                    >
                        Reject
                    </TableButton>
                </Space>
            </div>
        </div>
    );

    return (
        <PartnerWrap>
            <div className="partnerStyle">
                <CustomTable
                    ref={requestTableRef}
                    title={requestTitle}
                    rowKey={rowKey}
                    initialColumns={requestColumns}
                    dataSource={requestDataSource}
                    rowSelection={true}
                    loading={requestIsLoading}
                    pagination={{ ...requestPagination, requestTotal }}
                    onChange={setRequestPagination}
                />
                <div style={{ paddingTop: '1rem' }}></div>
                <CustomTable
                    ref={editTableRef}
                    title={title}
                    rowKey={rowKey}
                    initialColumns={columns}
                    dataSource={dataSource}
                    rowSelection={true}
                    loading={isLoading}
                    pagination={{ ...pagination, total }}
                    onChange={setPagination}
                />
            </div>
        </PartnerWrap>
    );
};

export default PartnerManagementLists;

const PartnerWrap = styled.div`
    padding: 2rem 1rem 1rem 1rem;
    height: 100%;
    min-width: 500px;
    .partnerStyle {
        padding: 0.5rem 1rem 1rem 1rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;

        .titleWrap {
            display: flex;
            // padding: 2rem 1.5rem 1rem 1rem;
            justify-content: space-between;
            align-items: center;
            .title {
                ${({ theme }) => theme.fonts.h7}
            }
        }
    }
    .ant-input-affix-wrapper {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
    }
    .ant-input-affix-wrapper input {
        ${(props) => props.theme.fonts.h5};
    }
`;
