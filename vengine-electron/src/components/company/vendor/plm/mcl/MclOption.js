import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mclGarmentColorGetListsAsyncAction } from 'store/mcl/garmentColor/reducer';
import { mclGarmentSizeGetListsAsyncAction } from 'store/mcl/garmentSize/reducer';
import { mclGarmentMarketGetListsAsyncAction } from 'store/mcl/garmentMarket/reducer';

import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { Tooltip } from 'components/common/tooltip';
import styled from 'styled-components';
import { Row, Col, Tabs, Tag } from 'antd';
import { MclOrderQty, MclSummary } from '.';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import useGtag from 'core/hook/useGtag';

const { TabPane } = Tabs;

const MclOption = (props) => {
    const { match, initialShow, onShow, onRightSplit } = props;
    const { mclOptionId } = match.params || '';
    // const { Panel } = Collapse;
    const dispatch = useDispatch();
    const { trackPageView } = useGtag();
    const [tabKey, setTabKey] = useState('color');

    const tabCallback = useCallback(
        (key) => {
            return setTabKey(key);
        },
        [setTabKey]
    );

    // GARMENT COLOR
    const mclGarmentColorGetLists = useSelector(
        (state) => state.mclGarmentColorReducer.get.lists
    );
    const handleMclGarmentColorGetLists = useCallback(
        (payload) =>
            dispatch(mclGarmentColorGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    // GARMENT SIZE
    const mclGarmentSizeGetLists = useSelector(
        (state) => state.mclGarmentSizeReducer.get.lists
    );
    const handleMclGarmentSizeGetLists = useCallback(
        (payload) =>
            dispatch(mclGarmentSizeGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    // GARMENT MARKET
    const mclGarmentMarketGetLists = useSelector(
        (state) => state.mclGarmentMarketReducer.get.lists
    );
    const handleMclGarmentMarketGetLists = useCallback(
        (payload) =>
            dispatch(mclGarmentMarketGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const mclOrderQtyGetId = useSelector(
        (state) => state.mclOrderQtyReducer.get.id
    );

    const [analyticsOrderQty, setAnalyticsOrderQty] = useState({
        color: null,
        size: null,
        market: null,
        qty: 0,
        orderQty: 0,
    });

    // 조회
    useEffect(() => {
        const fetch = () => {
            const promises = [
                Promise.resolve(handleMclGarmentColorGetLists(mclOptionId)),
                Promise.resolve(handleMclGarmentSizeGetLists(mclOptionId)),
                Promise.resolve(handleMclGarmentMarketGetLists(mclOptionId)),
            ];
            return Promise.all(promises);
        };
        if (mclOptionId) {
            fetch();
        }
    }, [
        mclOptionId,
        handleMclGarmentColorGetLists,
        handleMclGarmentSizeGetLists,
        handleMclGarmentMarketGetLists,
    ]);

    // analytics 계산
    useEffect(() => {
        if (mclOrderQtyGetId.data) {
            const deduplicateMarket =
                mclOrderQtyGetId.data?.data?.mclOrders.reduce((acc, cur) => {
                    if (
                        acc.findIndex(
                            ({ market }) =>
                                market?.garmentMarket?.id ===
                                cur?.market?.garmentMarket?.id
                        ) === -1
                    ) {
                        acc.push(cur);
                    }
                    return acc;
                }, []);

            const calculateQty = (target, arr) => {
                return arr.reduce((acc, cur) => {
                    acc =
                        acc +
                        cur.colors.reduce((acc2, cur2) => {
                            acc2 = acc2 + (cur2[target] || 0);
                            return acc2;
                        }, 0);
                    return acc;
                }, 0);
            };

            setAnalyticsOrderQty({
                color: mclOrderQtyGetId.data.data.mclOrders[0].colors.length, // 0번방의 컬러 수
                size:
                    mclOrderQtyGetId.data.data.mclOrders.length /
                    deduplicateMarket.length, // 총 길이 나누기 마켓 수
                market: deduplicateMarket.length, // id 확인 후 수 입력
                qty: calculateQty('qty', mclOrderQtyGetId.data.data.mclOrders), // 총 수량
                orderQty: calculateQty(
                    'orderQty',
                    mclOrderQtyGetId.data.data.mclOrders
                ), // 총 주문 수량
            });
        }
    }, [mclOrderQtyGetId, setAnalyticsOrderQty]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `${
                mclOptionId
                    ? `${tabKey?.toUpperCase()} | BASIC INFO | MCL OPTION DETAIL`
                    : 'MCL OPTION WRITE'
            } | DESIGN COVER | PLM `,
        });
    }, [tabKey, mclOptionId, trackPageView]);

    // 테이블
    const garmentColorColumns = [
        {
            title: 'Input Color',
            dataIndex: 'garmentColor',
            ellipsis: true,
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Actual Name',
            dataIndex: 'poGarmentColor',
            ellipsis: true,
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Status',
            dataIndex: 'poGarmentColor',
            align: 'left',
            render: (data) =>
                data ? (
                    <Tag
                        color="blue"
                        key={'MATCHED'}
                        style={{ fontSize: '0.625rem' }}
                    >
                        MATCHED
                    </Tag>
                ) : (
                    <Tag
                        color="red"
                        key={'UNMATCHED'}
                        style={{ fontSize: '0.625rem' }}
                    >
                        UNMATCHED
                    </Tag>
                ),
        },
        // {
        //     title: 'Use',
        //     dataIndex: 'colorUse',
        //     width: 50,
        //     render: (data) =>
        //         data ? <LinkOutlined style={{ fontSize: '14px' }} /> : '',
        // },
    ];

    const garmentSizeColumns = [
        {
            title: 'Name',
            dataIndex: 'garmentSize',
            align: 'left',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'poGarmentSize',
            align: 'left',
            render: (data) =>
                data ? (
                    <Tag
                        color="blue"
                        key={'MATCHED'}
                        style={{ fontSize: '0.625rem' }}
                    >
                        MATCHED
                    </Tag>
                ) : (
                    <Tag
                        color="red"
                        key={'UNMATCHED'}
                        style={{ fontSize: '0.625rem' }}
                    >
                        UNMATCHED
                    </Tag>
                ),
        },
        // {
        //     title: 'Use',
        //     dataIndex: 'sizeUse',
        //     width: 50,
        //     render: (data) =>
        //         data ? <LinkOutlined style={{ fontSize: '14px' }} /> : '',
        // },
    ];

    const garmentMarketColumns = [
        {
            title: 'Name',
            dataIndex: 'garmentMarket',
            align: 'left',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: 'Garment Market',
            dataIndex: 'poGarmentMarket',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Status',
            dataIndex: 'poGarmentMarket',
            align: 'left',
            render: (data) =>
                data ? (
                    <Tag
                        color="blue"
                        key={'MATCHED'}
                        style={{ fontSize: '0.625rem' }}
                    >
                        MATCHED
                    </Tag>
                ) : (
                    <Tag
                        color="red"
                        key={'UNMATCHED'}
                        style={{ fontSize: '0.625rem' }}
                    >
                        UNMATCHED
                    </Tag>
                ),
        },
        // {
        //     title: 'Use',
        //     dataIndex: 'marketUse',
        //     width: 50,
        //     render: (data) =>
        //         data ? <LinkOutlined style={{ fontSize: '14px' }} /> : '',
        // },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title"></div>
            <div className="functionWrap">
                <TableButton
                    toolTip={{
                        placement: 'topLeft',
                        arrowPointAtCenter: true,
                    }}
                    mode="add"
                    size="small"
                    onClick={() => {
                        if (mclOptionId) {
                            onRightSplit();
                            onShow({
                                ...initialShow,
                                [type]: {
                                    status: true,
                                },
                            });
                        }
                    }}
                />
            </div>
        </div>
    );

    return (
        <MclOptionOutterWrap>
            <div id="mclOptionWrap">
                <MclSummary
                    {...props}
                    mclGarmentColorGetLists={mclGarmentColorGetLists}
                    mclGarmentSizeGetLists={mclGarmentSizeGetLists}
                    mclGarmentMarketGetLists={mclGarmentMarketGetLists}
                />

                <div style={{ padding: '0.5rem' }} />
                {mclOptionId && (
                    <div id="componentWrap">
                        <Row gutter={[10, 10]}>
                            <Col span={12}>
                                <Tabs
                                    defaultActiveKey="color"
                                    onChange={tabCallback}
                                    // className="customTabs"
                                    size="small"
                                    // tabPosition="left"
                                >
                                    <TabPane tab="GARMENT COLOR" key="color">
                                        {tabKey === 'color' && (
                                            <div className="garmentWrap">
                                                {mclOptionId && (
                                                    <CustomTable
                                                        title={() =>
                                                            title(
                                                                'garmentColor'
                                                            )
                                                        }
                                                        rowKey="id"
                                                        initialColumns={
                                                            garmentColorColumns
                                                        }
                                                        dataSource={
                                                            mclGarmentColorGetLists
                                                                ?.data?.list
                                                        }
                                                        loading={
                                                            mclGarmentColorGetLists.isLoading
                                                        }
                                                        pagination={false}
                                                        onRow={() => {
                                                            return {
                                                                onClick: () => {
                                                                    onRightSplit();
                                                                    onShow({
                                                                        ...initialShow,
                                                                        garmentColor:
                                                                            {
                                                                                status: true,
                                                                            },
                                                                    });
                                                                },
                                                            };
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </TabPane>
                                    <TabPane tab="GARMENT SIZE" key="size">
                                        {tabKey === 'size' && (
                                            <div className="garmentWrap">
                                                {mclOptionId && (
                                                    <CustomTable
                                                        title={() =>
                                                            title('garmentSize')
                                                        }
                                                        rowKey="id"
                                                        initialColumns={
                                                            garmentSizeColumns
                                                        }
                                                        dataSource={
                                                            mclGarmentSizeGetLists.data &&
                                                            mclGarmentSizeGetLists
                                                                .data.list
                                                        }
                                                        loading={
                                                            mclGarmentSizeGetLists.isLoading
                                                        }
                                                        pagination={false}
                                                        onRow={(record) => {
                                                            return {
                                                                onClick: () => {
                                                                    onRightSplit();
                                                                    onShow({
                                                                        ...initialShow,
                                                                        garmentSize:
                                                                            {
                                                                                status: true,
                                                                                groupName:
                                                                                    record
                                                                                        .garmentSize
                                                                                        .sizeGroup,
                                                                            },
                                                                    });
                                                                },
                                                            };
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </TabPane>
                                    <TabPane tab="GARMENT MARKET" key="market">
                                        {tabKey === 'market' && (
                                            <div className="garmentWrap">
                                                {mclOptionId && (
                                                    <CustomTable
                                                        title={() =>
                                                            title(
                                                                'garmentMarket'
                                                            )
                                                        }
                                                        rowKey="id"
                                                        initialColumns={
                                                            garmentMarketColumns
                                                        }
                                                        dataSource={
                                                            mclGarmentMarketGetLists.data &&
                                                            mclGarmentMarketGetLists
                                                                .data.list
                                                        }
                                                        loading={
                                                            mclGarmentMarketGetLists.isLoading
                                                        }
                                                        pagination={false}
                                                        onRow={() => {
                                                            return {
                                                                onClick: () => {
                                                                    onRightSplit();
                                                                    onShow({
                                                                        ...initialShow,
                                                                        garmentMarket:
                                                                            {
                                                                                status: true,
                                                                            },
                                                                    });
                                                                },
                                                            };
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </TabPane>
                                </Tabs>
                            </Col>
                            <Col span={12}>
                                <div className="mclOrderQtyWrap">
                                    <div className="titleWrap">
                                        <div className="title">
                                            ORDER QUANTITY TABLE
                                        </div>
                                    </div>
                                    <div className="subtitleWrap">
                                        <div className="subtitle">
                                            Analytics
                                        </div>
                                        <ul>
                                            <li>
                                                Color (
                                                {formatNumberUtil(
                                                    analyticsOrderQty.color
                                                )}
                                                ) x Size (
                                                {formatNumberUtil(
                                                    analyticsOrderQty.size
                                                )}
                                                ) x Market (
                                                {formatNumberUtil(
                                                    analyticsOrderQty.market
                                                )}
                                                ) ={' '}
                                                {formatNumberUtil(
                                                    analyticsOrderQty.color *
                                                        analyticsOrderQty.size *
                                                        analyticsOrderQty.market
                                                )}{' '}
                                                Items
                                            </li>
                                            <li>
                                                {formatNumberUtil(
                                                    analyticsOrderQty.orderQty
                                                )}{' '}
                                                of{' '}
                                                {formatNumberUtil(
                                                    analyticsOrderQty.qty
                                                )}{' '}
                                                Order Qty updated (Balance :{' '}
                                                {formatNumberUtil(
                                                    analyticsOrderQty.qty -
                                                        analyticsOrderQty.orderQty
                                                )}{' '}
                                                Qty)
                                            </li>
                                        </ul>
                                    </div>
                                    <MclOrderQty {...props} readOnly />
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </div>
        </MclOptionOutterWrap>
    );
};

const MclOptionOutterWrap = styled.div`
    height: 100%;
    overflow: auto;

    #mclOptionWrap {
        min-width: 1000px;
        padding: 0rem 1rem 1rem 0rem;

        #componentWrap {
            position: relative;
            flex-grow: 1;
            // border: 1px solid red;
            padding: 0.5rem;
            border: 1px solid lightgray;
            border-radius: 3px;
            box-shadow: 3px 3px gray;
            .garmentWrap {
                padding-right: 1rem;
                // min-width: 500px;
                max-width: 600px;
                // min-height: 100px;
                // max-height: 300px;
                overflow: auto;
            }

            // .customTabs {
            //     height: 100%;
            //     // border: 1px solid orange;
            //     .ant-tabs-nav {
            //         margin: 0 0rem;
            //     }

            //     .ant-tabs-content {
            //         height: 100%;
            //         padding-right: 0;

            //         .ant-tabs-tabpane {
            //             position: relative;
            //         }
            //     }
            // }
        }

        .mclOrderQtyWrap {
            width: 100%;
            height: 100%;
            padding: 1rem;
            border: 1px solid lightgray;

            .titleWrap {
                .title {
                    ${(props) => props.theme.fonts.h7};
                }
            }

            .subtitleWrap {
                margin-top: 1rem;
                .subtitle {
                    color: #7f7f7f;
                    ${(props) => props.theme.fonts.h5};
                }

                ul li {
                    ${(props) => props.theme.fonts.h5};
                }
            }

            // MclOrderQty 컴포넌트 안에 적용된 css 취소
            #mclOrderQtyWrap {
                padding: 0;
            }
        }

        // #contentsWrap {
        //     position: relative;
        //     height: 100%;
        //     overflow-y: auto;
        //     flex-grow: 1;

        //     .customTabs {
        //         height: 100%;

        //         .ant-tabs-nav {
        //             margin: 0 1rem;
        //         }

        //         .ant-tabs-content {
        //             height: 100%;
        //             // padding: 1rem;
        //             padding-right: 0;

        //             .ant-tabs-tabpane {
        //                 position: relative;
        //                 // border: 1px solid orange;
        //             }
        //         }
        //     }
        // }
    }
`;

export default React.memo(MclOption);
