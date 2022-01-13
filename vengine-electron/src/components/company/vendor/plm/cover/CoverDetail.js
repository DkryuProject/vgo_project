import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useGtag from 'core/hook/useGtag';
import {
    cbdCoverGetIdAsyncAction,
    cbdCoverPutStatusAsyncAction,
    cbdCoverDeleteAsyncAction,
} from 'store/cbd/cover/reducer';
import { cbdOptionGetListsAsyncAction } from 'store/cbd/option/reducer';
import { mclOptionGetListsAsyncAction } from 'store/mcl/option/reducer';

import styled from 'styled-components';
import CustomTable from 'components/common/CustomTable';
import { Loading } from 'components/common/loading';
import { Row, Col, Space, Switch } from 'antd';
import { PushpinOutlined, CaretRightOutlined } from '@ant-design/icons';
import { CbdSummary } from 'components/company/vendor/plm/cbd';
import * as confirm from 'components/common/confirm';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import dateFormat from 'core/utils/dateUtil';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import noImage from 'asserts/images/no_image.png';

const CBD = React.memo((props) => {
    const { history, cbdCoverGetId } = props;
    const rowKey = 'optionId';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [dataSource, setDataSource] = useState([]);
    // console.log("datasource : ", dataSource);
    const [isLoading, setIsLoading] = useState(false);

    const cbdOptionGetLists = useSelector(
        (state) => state.cbdOptionReducer.get.lists
    );
    const handleCbdOptionGetLists = useCallback(
        (payload) => dispatch(cbdOptionGetListsAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdOptionGetListsInit = useCallback(
        () => dispatch(cbdOptionGetListsAsyncAction.initial()),
        [dispatch]
    );

    // 조회
    useEffect(() => {
        if (cbdCoverGetId.data) {
            handleCbdOptionGetLists(cbdCoverGetId.data.data.coverId);
        }
        return () => handleCbdOptionGetListsInit();
    }, [cbdCoverGetId, handleCbdOptionGetLists, handleCbdOptionGetListsInit]);

    useEffect(() => {
        setIsLoading(cbdOptionGetLists.isLoading);
        if (cbdOptionGetLists.data) {
            const { list } = cbdOptionGetLists.data;
            setDataSource(list);
            // console.log('list: ', list);
        }
    }, [cbdOptionGetLists]);

    // const caculateAmount = (finalCost, items) => {
    //     return Object.keys(items).reduce((acc, cur) => {
    //         // indirect, direct는 amount 계산 값이 다르다
    //         if (cur === 'direct' || cur === 'indirect') {
    //             acc += items[cur].reduce((amount, cur2) => {
    //                 // indirect || direct는 valueKind에 따라 amount 값이 달라진다
    //                 // valueKind === PERCENT는 finalCost * costValue
    //                 // valueKind === NUM는 costValue
    //                 if (cur2.valueKind === 'PERCENT') {
    //                     return (amount += finalCost * cur2.costValue);
    //                 }
    //                 return (amount += cur2.costValue);
    //             }, 0);
    //             return acc;
    //         }

    //         acc += items[cur].reduce((amount, cur2) => {
    //             // fabric, acc, trim의 amount 계산법은 grossYy * unitPrice
    //             // grossYy = netYy * tolerance(loss)
    //             return (amount +=
    //                 cur2.unitPrice *
    //                 parseFloat(cur2.netYy * (cur2.tolerance / 100 + 1)));
    //         }, 0);
    //         return acc;
    //     }, 0);
    // };

    // const caculateProfit = (finalCost, amount) => {
    //     // ( Final cost - CBD상의 모든 (원부자재 / 직간접비용) Amount의 총합 ) / Final cost = Profit %
    //     return (finalCost - amount) / finalCost;
    // };

    // 테이블
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            width: 100,
        },
        {
            title: 'Final Cost / Profit',
            dataIndex: 'profitCost',
            ellipsis: true,
            align: 'left',
            render: (_, record) => {
                const { profit, finalCost } = record;

                const value = (
                    <div>
                        <div>*Final Cost: ${formatNumberUtil(finalCost)}</div>
                        <div>Profit (%): {formatNumberUtil(profit)}%</div>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
            width: 150,
        },
        {
            title: 'Portion (%) of Costing',
            dataIndex: 'itemPortion',
            ellipsis: true,
            align: 'left',
            render: (data) => {
                const { fabric, trim, accessories, direct, indirect } = data;
                const value = (
                    <div>
                        <div>*Fabric: {formatNumberUtil(fabric)}%</div>
                        <div>*Trim: {formatNumberUtil(trim)}%</div>
                        <div>*Accessory: {formatNumberUtil(accessories)}%</div>
                        <div>*Direct: {formatNumberUtil(direct)}%</div>
                        <div>*Indirect: {formatNumberUtil(indirect)}%</div>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
            width: 150,
        },
        {
            title: 'Modified',
            dataIndex: 'finalCost',
            ellipsis: true,
            align: 'left',
            render: (_, record) => {
                const value = (
                    <div>
                        <div>{dateFormat(record.updated)}</div>
                        <div>{record.createdBy.userName}</div>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
            width: 100,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            ellipsis: true,
            align: 'left',
            render: (data) => {
                const value = (
                    <div
                        style={{
                            color:
                                data === 'OPEN' ? 'rgb(24, 144, 255)' : 'red',
                        }}
                    >
                        {data}
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
            width: 50,
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    COST BREAKDOWN (CBD)
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Create CBD Checklist',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => {
                            history.push('/vendor/plm/designcover/cbd/write');
                        }}
                    />
                </Space>
            </div>
        </div>
    );

    const onRow = (record, rowIndex) => {
        return {
            onClick: () => {
                const locationState = {
                    pathname: `/vendor/plm/designcover/cbd/update/${record.optionId}`,
                    state: {
                        cbdCoverGetId: cbdCoverGetId,
                    },
                };

                history.push(locationState);
            },
        };
    };

    return (
        <CustomTable
            ref={editTableRef}
            title={title}
            rowKey={rowKey}
            initialColumns={columns}
            dataSource={dataSource}
            rowSelection={false}
            loading={isLoading}
            onRow={onRow}
        />
    );
});

const MCL = React.memo((props) => {
    const { history, cbdCoverGetId } = props;
    const rowKey = 'id';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const mclOptionGetLists = useSelector(
        (state) => state.mclOptionReducer.get.lists
    );
    const handleMclOptionGetLists = useCallback(
        (payload) => dispatch(mclOptionGetListsAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclOptionGetListsInit = useCallback(
        () => dispatch(mclOptionGetListsAsyncAction.initial()),
        [dispatch]
    );

    // 조회
    useEffect(() => {
        if (cbdCoverGetId.data) {
            handleMclOptionGetLists(cbdCoverGetId.data.data.coverId);
        }
        return () => handleMclOptionGetListsInit();
    }, [cbdCoverGetId, handleMclOptionGetLists, handleMclOptionGetListsInit]);

    useEffect(() => {
        setIsLoading(mclOptionGetLists.isLoading);
        if (mclOptionGetLists.data) {
            const { list } = mclOptionGetLists.data;
            setDataSource(list);
            // console.log('list: ', list);
        }
    }, [mclOptionGetLists]);

    // 테이블
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            width: 100,
        },
        {
            title: 'Manufacturer',
            dataIndex: 'factory',
            ellipsis: true,
            render: (data) => (
                <Tooltip title={data.companyName}>{data.companyName}</Tooltip>
            ),
            width: 150,
        },
        {
            title: 'Total Amount of',
            dataIndex: 'mclAmount',
            ellipsis: true,
            align: 'left',
            render: (data) => {
                const value = (
                    <div>
                        <div>
                            *Required:{' '}
                            {formatNumberUtil(data?.requiredTotalAmount)}
                        </div>
                        <div>
                            *Issued: {formatNumberUtil(data?.issuedTotalAmount)}
                        </div>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
            width: 150,
        },
        {
            title: 'Modified',
            ellipsis: true,
            align: 'left',
            render: (_, record) => {
                const value = (
                    <div>
                        <div>{dateFormat(record.updated)}</div>
                        <div>{record.createdBy.userName}</div>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
            width: 100,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            ellipsis: true,
            align: 'left',
            render: (data) => {
                const value = (
                    <div
                        style={{
                            color:
                                data === 'OPEN' ? 'rgb(24, 144, 255)' : 'red',
                        }}
                    >
                        {data}
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
            width: 50,
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    MATERIAL CHECKLIST (MCL)
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Create MCL Checklist',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => {
                            history.push('/vendor/plm/designcover/mcl/write');
                        }}
                    />
                </Space>
            </div>
        </div>
    );

    const onRow = (record, rowIndex) => {
        return {
            onClick: () => {
                history.push(`/vendor/plm/designcover/mcl/update/${record.id}`);
            },
        };
    };

    return (
        <CustomTable
            ref={editTableRef}
            title={title}
            rowKey={rowKey}
            initialColumns={columns}
            dataSource={dataSource}
            rowSelection={false}
            loading={isLoading}
            onRow={onRow}
        />
    );
});

const CoverDetail = (props) => {
    const { match, history } = props;
    const cbdCoverId = match.params.id || '';
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState(false);
    const leftSplit = useRef();
    const rightSplit = useRef();
    const cbdCoverGetId = useSelector((state) => state.cbdCoverReducer.get.id);
    const handleCbdCoverGetId = useCallback(
        (payload) => dispatch(cbdCoverGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdCoverGetIdInit = useCallback(
        () => dispatch(cbdCoverGetIdAsyncAction.initial()),
        [dispatch]
    );

    const cbdCoverPutStatus = useSelector(
        (state) => state.cbdCoverReducer.put.status
    );
    const handleCbdCoverPutStatus = useCallback(
        (payload) => dispatch(cbdCoverPutStatusAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdCoverPutStatusInit = useCallback(
        () => dispatch(cbdCoverPutStatusAsyncAction.initial()),
        [dispatch]
    );

    const cbdCoverDelete = useSelector((state) => state.cbdCoverReducer.delete);
    const handleCbdCoverDelete = useCallback(
        (payload) => dispatch(cbdCoverDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdCoverDeleteInit = useCallback(
        () => dispatch(cbdCoverDeleteAsyncAction.initial()),
        [dispatch]
    );

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const handleLeftSplit = () => {
        setShow(false);
        if (leftSplit.current) {
            leftSplit.current.click();
        }
    };

    const handleRightSplit = () => {
        setShow(true);
        if (rightSplit.current) {
            rightSplit.current.click();
        }
    };

    const handleChangeStatus = useCallback(
        (isChecked) => {
            if (isChecked) {
                if (userGetEmail.data?.data?.level?.userLevelId > 1) {
                    setStatus(isChecked);
                    return handleCbdCoverPutStatus({
                        id: cbdCoverId,
                        data: isChecked ? 'OPEN' : 'CLOSE',
                    });
                } else {
                    return handleNotification({
                        type: 'error',
                        message: 'Error',
                        description: 'You do not have permission',
                    });
                }
            } else {
                setStatus(isChecked);
                return handleCbdCoverPutStatus({
                    id: cbdCoverId,
                    data: isChecked ? 'OPEN' : 'CLOSE',
                });
            }
        },
        [cbdCoverId, userGetEmail, handleCbdCoverPutStatus, handleNotification]
    );

    // 조회
    useEffect(() => {
        // CoverId
        if (cbdCoverId) {
            handleCbdCoverGetId(cbdCoverId);
        }
        // return () => {
        //     handleCbdCoverGetIdInit();
        // };
    }, [cbdCoverId, handleCbdCoverGetId, handleCbdCoverGetIdInit]);

    useEffect(() => {
        if (cbdCoverGetId.error) {
        } else if (cbdCoverGetId.data) {
            const { status } = cbdCoverGetId.data.data;
            setStatus(status === 'OPEN' ? true : false);
        }
    }, [cbdCoverGetId]);

    // 수정
    useEffect(() => {
        if (cbdCoverPutStatus.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdCoverPutStatus.error.message,
            });
        } else if (cbdCoverPutStatus.data) {
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Success COVER Status is changed',
            });
        }

        return () => handleCbdCoverPutStatusInit();
    }, [cbdCoverPutStatus, handleCbdCoverPutStatusInit, handleNotification]);

    useEffect(() => {
        if (cbdCoverDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: 'Failed to delete cover list',
            });
        } else if (cbdCoverDelete.data) {
            handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Cover list deletion success',
            });

            return history.goBack();
        }
        return () => handleCbdCoverDeleteInit();
    }, [cbdCoverDelete, history, handleNotification, handleCbdCoverDeleteInit]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `DETAIL | DESIGN COVER | PLM `,
        });
    }, [trackPageView]);

    if (cbdCoverGetId.isLoading) {
        return <Loading />;
    }

    return (
        <CoverDetailWrap>
            <div id="splitPaneWrap">
                <div id="infoOutterWrap">
                    <div id="infoWrap">
                        <div className="titleWrap">
                            <div
                                className="title"
                                style={{ paddingLeft: '0.5rem' }}
                            >
                                <Space>
                                    <PushpinOutlined />
                                    DESIGN SUMMARY
                                </Space>
                            </div>
                            <div
                                className="functionWrap"
                                style={{ paddingRight: '0.5rem' }}
                            >
                                <Space>
                                    <TableButton
                                        toolTip={{
                                            placement: 'topLeft',
                                            title: 'Cover cannot be modified if cbd and mcl are written.',
                                            arrowPointAtCenter: true,
                                        }}
                                        mode="modify"
                                        size="small"
                                        onClick={() =>
                                            history.push(
                                                `/vendor/plm/designcover/update/${cbdCoverId}`
                                            )
                                        }
                                        disabled={
                                            cbdCoverGetId.data?.data?.useYN ===
                                            'Y'
                                                ? true
                                                : false
                                        }
                                    />
                                    <TableButton
                                        toolTip={{
                                            placement: 'bottomLeft',
                                            title: 'Cover cannot be deleted if cbd and mcl are written.',
                                            arrowPointAtCenter: true,
                                        }}
                                        mode="delete"
                                        size="small"
                                        onClick={() => {
                                            confirm.deleteConfirm(() =>
                                                handleCbdCoverDelete([
                                                    cbdCoverGetId.data?.data
                                                        .coverId,
                                                ])
                                            );
                                        }}
                                        disabled={
                                            cbdCoverGetId.data?.data?.useYN ===
                                            'Y'
                                                ? true
                                                : false
                                        }
                                    />
                                </Space>
                            </div>
                        </div>
                        <div className="contentsWrap">
                            <div className="imageWrap">
                                <div className="ratioBox">
                                    <div
                                        className="ratioContent"
                                        style={
                                            cbdCoverGetId.data && {
                                                backgroundImage: `url(${
                                                    cbdCoverGetId.data?.data
                                                        .imagPath || noImage
                                                })`,
                                                backgroundSize: 'cover',
                                                resize: 'both',
                                            }
                                        }
                                    ></div>
                                </div>
                            </div>

                            <div className="content">
                                <Row gutter={[16, 4]}>
                                    <Col span={8}>
                                        <div className="label">Status</div>
                                        <div className="textValue">
                                            <Switch
                                                size="small"
                                                checked={status}
                                                onChange={(isChecked) =>
                                                    handleChangeStatus(
                                                        isChecked
                                                    )
                                                }
                                            />
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">Cover Name</div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .cbdName
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .cbdName
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">
                                            Design Number
                                        </div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .designNumber
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .designNumber
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">Gender</div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .gender.name1
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .gender.name1
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">Buyer</div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .buyer.name
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .buyer.name
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">
                                            Garment Type
                                        </div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .garmentCategory.name1
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .garmentCategory.name1
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">Brand</div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .brand.name
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .brand.name
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">Fabric Type</div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .materialCategory.typeB
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .materialCategory.typeB
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">Year</div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .seasonYear
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .seasonYear
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className="label">Order Type</div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .orderType.name
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .orderType.name
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">Season</div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .season.name
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .season.name
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">Currency</div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .commonCurrency.name1
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .commonCurrency.name1
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">Created By</div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={
                                                    cbdCoverGetId.data?.data
                                                        .createdBy.userName
                                                }
                                            >
                                                {
                                                    cbdCoverGetId.data?.data
                                                        .createdBy.userName
                                                }
                                            </Tooltip>
                                        </div>
                                    </Col>

                                    <Col span={8}>
                                        <div className="label">
                                            Created Date
                                        </div>
                                        <div className="textValue">
                                            <Tooltip
                                                title={dateFormat(
                                                    cbdCoverGetId.data?.data
                                                        .updated
                                                )}
                                            >
                                                {dateFormat(
                                                    cbdCoverGetId.data?.data
                                                        .updated
                                                )}
                                            </Tooltip>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '0.3rem' }}></div>
                    <div id="infoCMWrap">
                        <div className="componentWrap">
                            <Row gutter={[10, 10]}>
                                <Col span={12}>
                                    <div className="shadow">
                                        <CBD
                                            {...props}
                                            cbdCoverGetId={cbdCoverGetId}
                                            // onShowCbdOption={setShow}
                                            onRightSplit={handleRightSplit}
                                            className="cbdWrap"
                                        />
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="shadow">
                                        <MCL
                                            {...props}
                                            cbdCoverGetId={cbdCoverGetId}
                                            className="mclWrap"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                {/* 추후 삭제 */}
                {show && (
                    <div id="writeOutterWrap">
                        <div id="writeWrap">
                            <CbdSummary
                                {...props}
                                cbdCoverGetId={cbdCoverGetId}
                                // onShowCbdOption={setShow}
                                onLeftSplit={handleLeftSplit}
                            />
                        </div>
                    </div>
                )}
            </div>
        </CoverDetailWrap>
    );
};

const CoverDetailWrap = styled.div`
    height: 100%;
    // overflow-y: auto;
    padding: 1rem;
    #splitPaneWrap {
        // border: 1px solid red;
        position: relative;
        height: 100%;
        // margin-top: -0.5rem;
    }
    #infoOutterWrap {
        // overflow-x: auto;
        // border: 1px solid lightgray;
        padding-right: 0.5rem;
        #infoWrap {
            min-width: 1000px;
            // padding: 0rem 1rem 0 1rem;
            // border: 1px solid red;
            border: 1px solid lightgray;
            border-radius: 3px;
            box-shadow: 3px 3px gray;
            .titleWrap {
                // border: 1px solid orange;
                padding: 1rem 0rem 0 0;
                // border: 1px solid red;
                display: flex;
                justify-content: space-between;
                align-items: center;
                // margin: 1rem 0;
                .title {
                    ${({ theme }) => theme.fonts.h7}
                }
            }

            .contentsWrap {
                // border: 1px solid lightgray;
                display: flex;
                padding-top: 0.5rem;
                .imageWrap {
                    // border: 1px solid lightgray;
                    padding: 0.5rem;
                    min-width: 13rem;
                    .ratioBox {
                        ${({ theme }) => theme.controls.ratioBox};
                    }
                    .ratioContent {
                        ${({ theme }) => theme.controls.ratioContent};
                    }
                }
                .content {
                    // border: 1px solid lightgray;
                    flex-grow: 1;
                    padding: 0 1rem 0 3rem;
                    // color: black;
                }
            }

            .label {
                padding-right: 0.1rem;
                ${({ theme }) => theme.fonts.h5};
                color: #7f7f7f;
            }

            .textValue {
                // border-bottom: 1px solid lightgray;
                padding: 0 0 0.2rem;
                ${({ theme }) => theme.fonts.display_1};
            }

            .textOpenValue {
                color: #0070c0;
                // border-bottom: 1px solid lightgray;
                padding: 0 0 0.2rem;
                ${({ theme }) => theme.fonts.h6};
            }
            .textCloseValue {
                color: #c00000;
                // border-bottom: 1px solid lightgray;
                padding: 0 0 0.2rem;
                ${({ theme }) => theme.fonts.h6};
            }
        }

        #infoCMWrap {
            min-width: 1000px;
            // padding: 0rem 1rem 0 1rem;
            // border: 1px solid red;
            // padding: 0 0.3rem 0.5rem 0rem;
            padding: 0.5rem 0;
            .titleWrap {
                // border: 1px solid orange;
                // padding: 1rem 0rem 0 0;
                // border: 1px solid red;
                display: flex;
                justify-content: space-between;
                align-items: center;
                // margin: 1rem 0;
                .title {
                    ${({ theme }) => theme.fonts.h7}
                }
            }

            .componentWrap {
                // padding: 0 0.3rem 0.3rem 0rem;
                .shadow {
                    padding: 0.5rem;
                    border: 1px solid lightgray;
                    border-radius: 3px;
                    box-shadow: 3px 3px gray;

                    .cbdWrap {
                        min-width: 500px;
                        max-width: 600px;
                        overflow: auto;
                    }
                    .mclWrap {
                        min-width: 500px;
                        max-width: 600px;
                        overflow: auto;
                    }
                }
            }
        }
    }
    #writeOutterWrap {
        overflow-x: auto;
        #writeWrap {
            min-width: 500px;
            padding: 1rem;
        }
    }
`;

export default CoverDetail;
