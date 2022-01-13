import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useGtag from 'core/hook/useGtag';
import {
    mclPrebookingGetListsAsyncAction,
    mclPrebookingDeleteAsyncAction,
} from 'store/mcl/prebooking/reducer';

import {
    mclAssignPoGetListsAsyncAction,
    mclAssignPoDeleteAsyncAction,
} from 'store/mcl/assignPo/reducer';

import * as confirm from 'components/common/confirm';
import { Tooltip } from 'components/common/tooltip';
import styled from 'styled-components';
import { Space, Row, Col } from 'antd';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { DeleteOutlined, PushpinOutlined } from '@ant-design/icons';
import dateFormat from 'core/utils/dateUtil';
import formatNumberUtil from 'core/utils/formatNumberUtil';

// const { Meta } = Card;

const MclPoAssign = (props) => {
    const { match, initialShow, onShow, onLeftSplit, onRightSplit } = props;
    const { mclOptionId } = match.params || '';
    // const { Panel } = Collapse;
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
    const [summary, setSummary] = useState({
        styleQty: 0,
        swDate: [],
        programType: [],
        cbdOptions: 0,
        totalPoQty: 0,
        totalOrderQty: 0,
        totalAmount: 0,
        manufacturer: [],
    });

    const mclPrebookingGetLists = useSelector(
        (state) => state.mclPrebookingReducer.get.lists
    );
    const handleMclPrebookingGetLists = useCallback(
        (payload) =>
            dispatch(mclPrebookingGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const mclPrebookingDelete = useSelector(
        (state) => state.mclPrebookingReducer.delete
    );
    const handleMclPrebookingDelete = useCallback(
        (payload) => dispatch(mclPrebookingDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPrebookingDeleteInit = useCallback(
        () => dispatch(mclPrebookingDeleteAsyncAction.initial()),
        [dispatch]
    );

    const mclAssignPoGetLists = useSelector(
        (state) => state.mclAssignPoReducer.get.lists
    );
    const handleMclAssignPoGetLists = useCallback(
        (payload) => dispatch(mclAssignPoGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const mclAssignPoDelete = useSelector(
        (state) => state.mclAssignPoReducer.delete
    );
    const handleMclAssignPoDelete = useCallback(
        (payload) => dispatch(mclAssignPoDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclAssignPoDeleteInit = useCallback(
        () => dispatch(mclAssignPoDeleteAsyncAction.initial()),
        [dispatch]
    );

    // 조회
    useEffect(() => {
        const fetch = () => {
            const promises = [
                Promise.resolve(handleMclPrebookingGetLists(mclOptionId)),
                Promise.resolve(handleMclAssignPoGetLists(mclOptionId)),
            ];
            return Promise.all(promises);
        };
        if (mclOptionId) {
            fetch();
        }
    }, [mclOptionId, handleMclPrebookingGetLists, handleMclAssignPoGetLists]);

    useEffect(() => {
        if (mclPrebookingGetLists.data && mclAssignPoGetLists.data) {
            const { list } = mclPrebookingGetLists.data;
            setSummary({
                styleQty: list.length,
                swDate: list.map((v) => ({
                    shipDateFrom: v.shipDateFrom,
                    shipDateTo: v.shipDateTo,
                })),
                programType: list.map((v) => v.program),
                cbdOptions: mclAssignPoGetLists.data.list.length,
                totalPoQty: list.filter((v) => v.cbdOptions),
                totalOrderQty: mclAssignPoGetLists.data.list.reduce(
                    (acc, cur) => {
                        acc = acc + cur.orderQty;
                        return acc;
                    },
                    0
                ),
                totalAmount: mclAssignPoGetLists.data.list.reduce(
                    (acc, cur) => {
                        acc = acc + cur.orderAmount;
                        return acc;
                    },
                    0
                ),
                manufacturer: mclAssignPoGetLists.data.list.map(
                    (v) => v.manufacture
                ),
            });
        }
    }, [mclPrebookingGetLists, mclAssignPoGetLists, setSummary]);

    // prebooking 삭제
    useEffect(() => {
        if (mclPrebookingDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPrebookingDelete.error.message,
            });
        } else if (mclPrebookingDelete.data) {
            handleMclPrebookingGetLists(mclOptionId);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful deletion of MCL style Assign',
            });
        }
        return () => handleMclPrebookingDeleteInit();
    }, [
        mclPrebookingDelete,
        mclOptionId,
        handleMclPrebookingGetLists,
        handleNotification,
        handleMclPrebookingDeleteInit,
    ]);

    // assign po 삭제
    useEffect(() => {
        if (mclAssignPoDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclAssignPoDelete.error.message,
            });
        } else if (mclAssignPoDelete.data) {
            handleMclAssignPoGetLists(mclOptionId);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful deletion of MCL Assign PO',
            });
        }
        return () => handleMclAssignPoDeleteInit();
    }, [
        mclAssignPoDelete,
        mclOptionId,
        handleMclAssignPoGetLists,
        handleNotification,
        handleMclAssignPoDeleteInit,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `PO ASSIGN | MCL OPTION DETAIL | DESIGN COVER | PLM  `,
        });
    }, [trackPageView]);

    // 테이블
    const prebookingColumns = [
        {
            title: 'Style#',
            dataIndex: 'styleNumber',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Shipping Window',
            dataIndex: 'shipDateTo',
            render: (_, record) => {
                const value = (
                    <div>
                        {dateFormat(record.shipDateFrom)} -{' '}
                        {dateFormat(record.shipDateTo)}
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Program',
            dataIndex: 'program',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: 'CBD',
            dataIndex: 'cbdOption',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: '',
            dataIndex: 'id',
            render: (data) => (
                <DeleteOutlined
                    onClick={(e) => {
                        e.stopPropagation();
                        confirm.deleteConfirm(() => {
                            onLeftSplit();
                            onShow({
                                ...initialShow,
                                styleAssign: {
                                    status: false,
                                },
                            });
                            handleMclPrebookingDelete(data);
                        });
                    }}
                />
            ),
        },
    ];

    const poAssignSummaryColumns = [
        {
            title: 'Style#',
            dataIndex: 'styleNo',
            ellipsis: true,
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Po#',
            dataIndex: 'poNo',
            ellipsis: true,
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Qty',
            dataIndex: 'orderQty',
            ellipsis: true,
            render: (data) => {
                const _data = formatNumberUtil(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Amount',
            dataIndex: 'orderAmount',
            ellipsis: true,
            render: (data) => {
                const _data = formatNumberUtil(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Market',
            dataIndex: 'market',
            ellipsis: true,
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Manufacture',
            dataIndex: 'manufacture',
            ellipsis: true,
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Start',
            dataIndex: 'shipStart',
            ellipsis: true,
            render: (data) => {
                const _data = dateFormat(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'End',
            dataIndex: 'shipEnd',
            ellipsis: true,
            render: (data) => {
                const _data = dateFormat(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: '',
            dataIndex: 'id',
            render: (data) => (
                <DeleteOutlined
                    onClick={(e) => {
                        e.stopPropagation();
                        confirm.deleteConfirm(() => {
                            onLeftSplit();
                            onShow({
                                ...initialShow,
                                poAssignSummary: {
                                    status: false,
                                },
                            });
                            handleMclAssignPoDelete(data);
                        });
                    }}
                />
            ),
        },
    ];

    const title = (title, type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <PushpinOutlined />
                    {title}
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => {
                            onRightSplit();
                            onShow({
                                ...initialShow,
                                [type]: {
                                    status: true,
                                },
                            });
                        }}
                    />
                </Space>
            </div>
        </div>
    );

    const onRow = (record, rowIndex) => {
        return {
            onClick: () => {
                onRightSplit();
                return onShow({
                    ...initialShow,
                    styleAssign: {
                        id: record.id,
                        status: true,
                    },
                });
            },
        };
    };

    return (
        <MclPoAssignOutterWrap>
            <div id="mclPoAssignWrap">
                <div className="mclPoStyle">
                    <Row gutter={[10, 10]}>
                        <Col span={16}>
                            <div className="buyerpoStyle">
                                <CustomTable
                                    title={() =>
                                        title(
                                            'CONDITIONS FOR SELECTING BUYER PO',
                                            'styleAssign'
                                        )
                                    }
                                    rowKey="id"
                                    initialColumns={prebookingColumns}
                                    dataSource={
                                        mclPrebookingGetLists.data &&
                                        mclPrebookingGetLists.data.list
                                    }
                                    loading={mclPrebookingGetLists.isLoading}
                                    pagination={false}
                                    onRow={onRow}
                                />
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="summaryWrap">
                                <div className="titleWrap">
                                    <div className="title">SUMMARY</div>
                                </div>
                                <div className="subtitleWrap">
                                    <div className="subtitle">Analytics</div>
                                    <dl>
                                        <dt>Mapped Information</dt>
                                        <dd>
                                            <ul>
                                                <li>
                                                    Style Qty :{' '}
                                                    {formatNumberUtil(
                                                        summary.styleQty
                                                    )}
                                                    Styles
                                                </li>
                                                {summary.swDate.map((v, i) => (
                                                    <li key={i}>
                                                        S/W date :{' '}
                                                        {dateFormat(
                                                            v.shipDateFrom
                                                        )}{' '}
                                                        -{' '}
                                                        {dateFormat(
                                                            v.shipDateTo
                                                        )}
                                                    </li>
                                                ))}
                                                {summary.programType.map(
                                                    (v, i) => (
                                                        <li key={i}>
                                                            Program Type :{' '}
                                                            {v.name}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </dd>
                                    </dl>

                                    <dl>
                                        <dt>Connected Information</dt>
                                        <dd>
                                            <ul>
                                                <li>
                                                    CBD options :{' '}
                                                    {formatNumberUtil(
                                                        summary.cbdOptions
                                                    )}{' '}
                                                    CBD (ALL CC)
                                                </li>
                                                <li>
                                                    {' '}
                                                    Total POs Qty :{' '}
                                                    {formatNumberUtil(
                                                        summary.totalPoQty
                                                            .length
                                                    )}{' '}
                                                    ea
                                                </li>
                                                <li>
                                                    Total Order Qty :{' '}
                                                    {formatNumberUtil(
                                                        summary.totalOrderQty
                                                    )}{' '}
                                                    pcs
                                                </li>
                                                <li>
                                                    Total Amount : ${' '}
                                                    {formatNumberUtil(
                                                        summary.totalAmount
                                                    )}
                                                </li>
                                                {summary.manufacturer
                                                    .reduce((acc, cur) => {
                                                        if (acc.includes(cur)) {
                                                            return acc;
                                                        }

                                                        acc.push(cur);
                                                        return acc;
                                                    }, [])
                                                    .map((v, i) => (
                                                        <li key={i}>
                                                            Manufacturer : {v}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div style={{ padding: '0.5rem' }} />
                <div className="mclPoBuyer">
                    <CustomTable
                        title={() =>
                            title('LIST OF CONNECTED POs', 'poAssignSummary')
                        }
                        rowKey="id"
                        initialColumns={poAssignSummaryColumns}
                        dataSource={
                            mclAssignPoGetLists.data &&
                            mclAssignPoGetLists.data.list
                        }
                        loading={mclAssignPoGetLists.isLoading}
                        pagination={false}
                    />
                </div>

                {/* <Collapse ghost defaultActiveKey={["1", "2"]}>
                    <Panel header="STYLE ASSIGN" key="1">
                        <CustomTable
                            title={() => title("styleAssign")}
                            rowKey="id"
                            initialColumns={prebookingColumns}
                            dataSource={
                                mclPrebookingGetLists.data &&
                                mclPrebookingGetLists.data.list
                            }
                            loading={mclPrebookingGetLists.isLoading}
                            pagination={false}
                            onRow={onRow}
                        />
                    </Panel>

                    <Panel header="ASSIGNED PO SUMMARY" key="2">
                        <CustomTable
                            title={() => title("poAssignSummary")}
                            rowKey="id"
                            initialColumns={poAssignSummaryColumns}
                            dataSource={
                                mclAssignPoGetLists.data &&
                                mclAssignPoGetLists.data.list
                            }
                            loading={mclAssignPoGetLists.isLoading}
                            pagination={false}
                        />
                    </Panel>
                </Collapse> */}
            </div>
        </MclPoAssignOutterWrap>
    );
};

const MclPoAssignOutterWrap = styled.div`
    height: 100%;
    overflow: auto;
    padding: 0 1rem 2rem 0;

    #table {
        border: 1px solid #000;
        th {
            border: 1px solid #000;
        }
        td {
            border: 1px solid #000;
        }
    }

    #mclPoAssignWrap {
        min-width: 1000px;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                ${({ theme }) => theme.fonts.h7};
            }
        }

        .mclPoStyle {
            padding: 0 0.5rem 2rem 0;
            max-height: 300px;
            overflow-y: auto;

            .summaryWrap {
                width: 100%;
                height: 100%;
                // padding: 1rem;
                padding: 0.5rem;
                border: 1px solid lightgray;
                border-radius: 3px;
                box-shadow: 3px 3px gray;

                .titleWrap {
                    .title {
                        ${(props) => props.theme.fonts.h7};
                    }
                }

                .subtitleWrap {
                    margin-top: 0.5rem;
                    .subtitle {
                        color: #7f7f7f;
                        ${(props) => props.theme.fonts.h5};
                    }
                    dl {
                        margin-top: 1rem;
                        dt {
                            ${(props) => props.theme.fonts.h5};
                        }
                    }
                    ul li {
                        ${(props) => props.theme.fonts.h5};
                    }
                }
            }

            .buyerpoStyle {
                padding: 0.5rem;
                border: 1px solid lightgray;
                border-radius: 3px;
                box-shadow: 3px 3px gray;
            }

            .cardStyle {
                // border: 1px solid lightgray;
                // border-radius: 5px;
                .title {
                    ${({ theme }) => theme.fonts.h7};
                }
                padding: 0.5rem;
                border: 1px solid lightgray;
                border-radius: 3px;
                box-shadow: 3px 3px gray;
            }
        }

        .mclPoBuyer {
            padding: 0.5rem 0.5rem 2rem 0.5rem;
            border: 1px solid lightgray;
            border-radius: 3px;
            box-shadow: 3px 3px gray;
        }
    }
`;

export default React.memo(MclPoAssign);
