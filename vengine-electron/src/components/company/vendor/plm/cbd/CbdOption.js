import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useGtag from 'core/hook/useGtag';
import { cbdInfoGetListsAsyncAction } from 'store/cbd/info/reducer';
import { cbdCostingGetListsAsyncAction } from 'store/cbd/costing/reducer';
import styled from 'styled-components';
import { CbdSummary } from './';
import CustomTable from 'components/common/CustomTable';
import { Col, Row, Space, Steps, Tabs, Tag } from 'antd';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import { JcBetween } from 'styles/Layout';
import { Fragment } from 'react';
import { Ellipsis } from 'components/UI/atoms';

const { TabPane } = Tabs;

const CbdOption = (props) => {
    const {
        match,
        cbdCoverGetId,
        initialShow,
        onShow,
        onRightSplit,
        onLeftSplit,
        status,
        onStatus,
    } = props;
    const { Step } = Steps;
    const { cbdId } = match.params || null;

    const dispatch = useDispatch();
    const { trackPageView } = useGtag();
    const [tabType, setTabType] = useState('fabric');

    const cbdInfoGetListsFabric = useSelector(
        (state) => state.cbdInfoReducer.get.lists.fabric
    );
    const cbdInfoGetListsTrim = useSelector(
        (state) => state.cbdInfoReducer.get.lists.trim
    );
    const cbdInfoGetListsAccessories = useSelector(
        (state) => state.cbdInfoReducer.get.lists.accessories
    );
    const handleCbdInfoGetLists = useCallback(
        (payload) => dispatch(cbdInfoGetListsAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdInfoGetListsInit = useCallback(
        () => dispatch(cbdInfoGetListsAsyncAction.initial()),
        [dispatch]
    );

    const cbdCostingGetListsDirect = useSelector(
        (state) => state.cbdCostingReducer.get.lists.direct
    );
    const cbdCostingGetListsIndirect = useSelector(
        (state) => state.cbdCostingReducer.get.lists.indirect
    );
    const handleCbdCostingGetLists = useCallback(
        (payload) => dispatch(cbdCostingGetListsAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdCostingGetListsInit = useCallback(
        () => dispatch(cbdCostingGetListsAsyncAction.initial()),
        [dispatch]
    );

    useEffect(() => {
        const fetch = () => {
            const promises = [
                Promise.resolve(
                    handleCbdInfoGetLists({ type: 'fabric', id: cbdId })
                ),
                Promise.resolve(
                    handleCbdInfoGetLists({ type: 'trim', id: cbdId })
                ),
                Promise.resolve(
                    handleCbdInfoGetLists({ type: 'accessories', id: cbdId })
                ),
                Promise.resolve(
                    handleCbdCostingGetLists({ type: 'direct', id: cbdId })
                ),
                Promise.resolve(
                    handleCbdCostingGetLists({ type: 'indirect', id: cbdId })
                ),
            ];
            return Promise.all(promises);
        };

        if (cbdId) {
            fetch();
        }

        return () => {
            handleCbdInfoGetListsInit();
            handleCbdCostingGetListsInit();
        };
    }, [
        cbdId,
        handleCbdInfoGetLists,
        handleCbdCostingGetLists,
        handleCbdInfoGetListsInit,
        handleCbdCostingGetListsInit,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `${
                cbdId
                    ? `${tabType?.toUpperCase()} | CBD OPTION DETAIL`
                    : 'CBD OPTION WRITE'
            } | DESIGN COVER | PLM `,
        });
    }, [tabType, cbdId, trackPageView]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Usage',
                dataIndex: 'usagePlace',
                align: 'left',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'Supplier Name',
                dataIndex: 'materialInfo',
                align: 'left',
                render: (data) => (
                    <Tooltip title={data?.supplier?.name}>
                        {data?.supplier?.name}
                    </Tooltip>
                ),
            },
            {
                title: 'Item name and Number',
                dataIndex: 'materialInfo',
                align: 'left',
                render: (data, record) => {
                    const output = (
                        <Fragment>
                            <Ellipsis>
                                * Category : {data?.category?.typeA}{' '}
                                {data?.category?.typeB && '/'}{' '}
                                {data?.category?.typeB}{' '}
                                {data?.category?.typeC && '/'}{' '}
                                {data?.category?.typeC}
                            </Ellipsis>

                            <Ellipsis>
                                * Material No. :{' '}
                                {record?.supplierMaterial || '-'}
                            </Ellipsis>
                            {record.type !== 'fabric' && (
                                <Ellipsis>
                                    * Size Description. :{' '}
                                    {record?.sizeMemo || '-'}
                                </Ellipsis>
                            )}
                        </Fragment>
                    );

                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    <div>
                                        * Category : {data?.category?.typeA}{' '}
                                        {data?.category?.typeB && '/'}{' '}
                                        {data?.category?.typeB}{' '}
                                        {data?.category?.typeC && '/'}{' '}
                                        {data?.category?.typeC}
                                    </div>

                                    <div>
                                        * Material No. :{' '}
                                        {record?.supplierMaterial || '-'}
                                    </div>

                                    {record.type !== 'fabric' && (
                                        <div>
                                            * Size Description. :{' '}
                                            {record?.sizeMemo || '-'}
                                        </div>
                                    )}
                                </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Item Detail Information',
                dataIndex: 'materialInfo',
                align: 'left',
                render: (data, record) => {
                    const output = (
                        <Fragment>
                            {data?.type === 'fabric' ? (
                                <Fragment>
                                    <Ellipsis>
                                        * Composition (%):{' '}
                                        {data?.fabricContents?.map((v) => (
                                            <span key={v.id}>
                                                {v?.contents?.name} {v?.rate}%
                                            </span>
                                        )) || '-'}
                                    </Ellipsis>

                                    <Ellipsis>
                                        * Construction: {data?.structure || '-'}{' '}
                                        & {data?.yarnSizeWrap || '-'} x{' '}
                                        {data?.yarnSizeWeft || '-'} &{' '}
                                        {data?.constructionEpi || '-'} x{' '}
                                        {data?.constructionPpi || '-'} &{' '}
                                        {data?.shrinkagePlus > 0 && '+'}
                                        {data?.shrinkagePlus || '-'}{' '}
                                        {data?.shrinkageMinus || '-'} &{' '}
                                        {data?.usage_type || '-'} &{' '}
                                        {data?.sus_eco || '-'} &{' '}
                                        {data?.application || '-'}
                                    </Ellipsis>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Ellipsis>
                                        * Item Size :{' '}
                                        {record?.subsidiarySize ? (
                                            <span>
                                                {record?.subsidiarySize}{' '}
                                                {
                                                    record?.subsidiarySizeUom
                                                        ?.name3
                                                }
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </Ellipsis>

                                    <Ellipsis>
                                        * Item Detail :{' '}
                                        {record?.subsidiaryDetail || '-'}
                                    </Ellipsis>
                                </Fragment>
                            )}
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    {data?.type === 'fabric' ? (
                                        <Fragment>
                                            <div>
                                                * Composition (%):{' '}
                                                {data?.fabricContents?.map(
                                                    (v) => (
                                                        <span key={v.id}>
                                                            {v?.contents?.name}{' '}
                                                            {v?.rate}%
                                                        </span>
                                                    )
                                                ) || '-'}
                                            </div>

                                            <div>
                                                * Construction:{' '}
                                                {data?.structure || '-'} &{' '}
                                                {data?.yarnSizeWrap || '-'} x{' '}
                                                {data?.yarnSizeWeft || '-'} &{' '}
                                                {data?.constructionEpi || '-'} x{' '}
                                                {data?.constructionPpi || '-'} &{' '}
                                                {data?.shrinkagePlus > 0 && '+'}
                                                {data?.shrinkagePlus ||
                                                    '-'}{' '}
                                                {data?.shrinkageMinus || '-'} &{' '}
                                                {data?.usage_type || '-'} &{' '}
                                                {data?.sus_eco || '-'} &{' '}
                                                {data?.application || '-'}
                                            </div>
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            <div>
                                                * Item Size :{' '}
                                                {record?.subsidiarySize ? (
                                                    <span>
                                                        {record?.subsidiarySize}{' '}
                                                        {
                                                            record
                                                                ?.subsidiarySizeUom
                                                                ?.name3
                                                        }
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </div>

                                            <div>
                                                * Item Detail :{' '}
                                                {record?.subsidiaryDetail ||
                                                    '-'}
                                            </div>
                                        </Fragment>
                                    )}
                                </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'UOM(Supplier)',
                dataIndex: 'material_offer_uom',
                align: 'left',
                render: (data) => (
                    <Tooltip title={data?.name3}>{data?.name3}</Tooltip>
                ),
            },
            {
                title: 'Yardage Yield (YY)',
                align: 'left',
                render: (_, record) => {
                    const value = (
                        <div>
                            <JcBetween>
                                <div>* Net :</div> <div>{record?.netYy}</div>
                            </JcBetween>
                            <JcBetween>
                                <div>* Loss :</div>{' '}
                                <div>{record?.tolerance}%</div>
                            </JcBetween>
                            <JcBetween>
                                <div>* Gross :</div>
                                <div>
                                    {parseFloat(
                                        record?.netYy *
                                            (record?.tolerance / 100 + 1)
                                    ).toFixed(3)}
                                </div>
                            </JcBetween>
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'UOM(Vendor)',
                dataIndex: 'cbdMaterialUom',
                align: 'left',
                render: (data) => (
                    <Tooltip title={data?.name3}>{data?.name3}</Tooltip>
                ),
            },
            {
                title: 'Unit Price',
                dataIndex: 'unitPrice',
                align: 'left',
                render: (data) => {
                    const { commonCurrency } = cbdCoverGetId?.data?.data || {};

                    const value = (
                        <div>
                            {commonCurrency?.name3} {formatNumberUtil(data)}
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                align: 'left',
                render: (data) => {
                    const { commonCurrency } = cbdCoverGetId?.data?.data || {};

                    const value = (
                        <div>
                            {commonCurrency?.name3} {formatNumberUtil(data)}
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Status',
                align: 'left',
                render: (_, record) => {
                    const { usagePlace, netYy, cbdMaterialUom, unitPrice } =
                        record;
                    const isResult =
                        usagePlace === null ||
                        netYy === 0 ||
                        unitPrice === 0 ||
                        Object.keys(cbdMaterialUom).length === 0;
                    return isResult ? (
                        <Tag
                            color="red"
                            key={'INCOMPLETE'}
                            style={{ fontSize: '0.625rem' }}
                        >
                            INCOMPLETE
                        </Tag>
                    ) : (
                        <Tag
                            color="blue"
                            key={'COMPLETE'}
                            style={{ fontSize: '0.625rem' }}
                        >
                            COMPLETE
                        </Tag>
                    );
                },
            },
        ],
        [cbdCoverGetId]
    );

    const costColumns = useMemo(
        () => [
            {
                title: 'Name',
                dataIndex: 'companyCost',
                align: 'left',
                render: (data) => (
                    <Tooltip title={data?.name}>{data?.name}</Tooltip>
                ),
            },
            {
                title: 'Type',
                align: 'left',
                render: (_, record) => {
                    const { valueKind } = record;
                    const value = <div>{valueKind}</div>;
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Unit Price',
                dataIndex: 'costValue',
                align: 'left',
                render: (data) => {
                    const _data = formatNumberUtil(data);
                    return <Tooltip title={_data}>{_data}</Tooltip>;
                },
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                align: 'left',
                render: (data) => {
                    const _data = formatNumberUtil(data);
                    return <Tooltip title={_data}>{_data}</Tooltip>;
                },
            },
        ],
        [
            // cbdOptionGetId.data
        ]
    );

    const title = useCallback(
        (type) => {
            return (
                <div className="titleWrap">
                    <div className="title">
                        {/* {type === "direct" || type === "indirect" ? (
                    <Space>
                        <CaretRightOutlined />
                        {type.toUpperCase() + " COST"}
                    </Space>
                ) : null} */}
                    </div>
                    <div className="functionWrap">
                        <Space>
                            {status && (
                                <TableButton
                                    toolTip={{
                                        placement: 'topRight',
                                        title: 'Create ' + type?.toUpperCase(),
                                        arrowPointAtCenter: true,
                                    }}
                                    mode="add"
                                    size="small"
                                    onClick={() => {
                                        if (cbdId) {
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
                            )}
                        </Space>
                    </div>
                </div>
            );
        },
        [cbdId, initialShow, onRightSplit, onShow, status]
    );

    const onCostRow = (record, rowIndex) => {
        return {
            onClick: () => {
                onRightSplit();
                const type = record.type;
                return onShow({
                    ...initialShow,
                    [type]: {
                        status: true,
                        id: record.cbdCostingId,
                    },
                });
            },
        };
    };

    const onMaterialRow = (record, rowIndex) => {
        return {
            onClick: () => {
                onRightSplit();
                const type = record.type;
                return onShow({
                    ...initialShow,
                    materialDetail: {
                        type: type,
                        status: true,
                        id: record.cbdMaterialInfoId,
                    },
                });
            },
        };
    };

    const expandable = {
        expandedRowRender: (v) => {
            const {
                type,
                materialInfo,
                fabricCw,
                fabricCwUom,
                fabricWeight,
                fabricWeightUom,
                performance,
                characteristic,
                solid_pattern,
                function: _function,
                stretch,
                materialAfterManufacturingFinishing,
                materialAfterManufacturingFashion,
                materialAfterManufacturingDyeing,
            } = v || {};
            const { item_name, usage_type, application, sus_eco } =
                materialInfo || {};
            return (
                <Row>
                    <Col
                        span={6}
                        style={{
                            textAlign: 'left',
                        }}
                    >
                        <Ellipsis>
                            -{type === 'fabric' ? 'Fabric name' : 'Item name'}:{' '}
                            {item_name || '-'}
                        </Ellipsis>
                        {type === 'fabric' && (
                            <Ellipsis>
                                -Usage Type: {usage_type || '-'}
                            </Ellipsis>
                        )}

                        <Ellipsis>
                            -Width/Weight:
                            {fabricCw ? (
                                <span>
                                    {fabricCw} {fabricCwUom?.name3 || 'inch'}
                                </span>
                            ) : (
                                '-'
                            )}{' '}
                            /{' '}
                            {fabricWeight ? (
                                <span>
                                    {' '}
                                    {fabricWeight}{' '}
                                    {fabricWeightUom?.name3 || 'GSM'}
                                </span>
                            ) : (
                                '-'
                            )}
                        </Ellipsis>
                        {type === 'fabric' && (
                            <Ellipsis>
                                -Application: {application || '-'}
                            </Ellipsis>
                        )}
                    </Col>
                    {type === 'fabric' && (
                        <Col
                            span={6}
                            style={{
                                textAlign: 'left',
                            }}
                        >
                            <Ellipsis>-Sus/Eco: {sus_eco || '-'}</Ellipsis>
                            <Ellipsis>
                                -Performance: {performance || '-'}
                            </Ellipsis>
                            <Ellipsis>
                                -Characteristic: {characteristic || '-'}
                            </Ellipsis>
                        </Col>
                    )}
                    {type === 'fabric' && (
                        <Col
                            span={6}
                            style={{
                                textAlign: 'left',
                            }}
                        >
                            <Ellipsis>
                                -Solid/Pattern: {solid_pattern || '-'}
                            </Ellipsis>
                            <Ellipsis>-Function: {_function || '-'}</Ellipsis>
                            <Ellipsis>-Stretch: {stretch || '-'}</Ellipsis>
                        </Col>
                    )}

                    <Col
                        span={6}
                        style={{
                            textAlign: 'left',
                        }}
                    >
                        {type !== 'accessories' && (
                            <Ellipsis>
                                -Post Processing:{' '}
                                {materialAfterManufacturingFinishing || '-'}
                            </Ellipsis>
                        )}
                        {type === 'fabric' && (
                            <Ellipsis>
                                -Dyeing:{' '}
                                {materialAfterManufacturingDyeing || '-'}
                            </Ellipsis>
                        )}
                        {type === 'fabric' && (
                            <Ellipsis>
                                -Printing:{' '}
                                {materialAfterManufacturingFashion || '-'}
                            </Ellipsis>
                        )}
                    </Col>
                </Row>
            );
        },
    };

    return (
        <CbdOptionOutterWrap>
            <div id="cbdOptionWrap">
                <CbdSummary {...props} status={status} onStatus={onStatus} />
                <div style={{ paddingBottom: '1rem' }} />
                <div className="cbdMaterialWrap">
                    {props.match.params.cbdId ? (
                        <Tabs
                            defaultActiveKey="fabric"
                            size="small"
                            type="card"
                            onTabClick={(t) => {
                                setTabType(t);
                                onLeftSplit();
                                onShow(initialShow);
                            }}
                        >
                            <TabPane tab="FABRIC" key="fabric">
                                <CustomTable
                                    title={() => title('fabric')}
                                    rowKey="cbdMaterialInfoId"
                                    initialColumns={columns}
                                    dataSource={
                                        cbdInfoGetListsFabric.data &&
                                        cbdInfoGetListsFabric.data.list
                                    }
                                    rowSelection={false}
                                    loading={cbdInfoGetListsFabric.isLoading}
                                    pagination={false}
                                    onRow={onMaterialRow}
                                    expandable={expandable}
                                />
                            </TabPane>

                            <TabPane tab="TRIM" key="trim">
                                <CustomTable
                                    title={() => title('trim')}
                                    rowKey="cbdMaterialInfoId"
                                    initialColumns={columns}
                                    dataSource={
                                        cbdInfoGetListsTrim.data &&
                                        cbdInfoGetListsTrim.data.list
                                    }
                                    rowSelection={false}
                                    loading={cbdInfoGetListsTrim.isLoading}
                                    pagination={false}
                                    onRow={onMaterialRow}
                                    expandable={expandable}
                                />
                            </TabPane>

                            <TabPane tab="ACCESSORY" key="accessories">
                                <CustomTable
                                    title={() => title('accessories')}
                                    rowKey="cbdMaterialInfoId"
                                    initialColumns={columns}
                                    dataSource={
                                        cbdInfoGetListsAccessories.data &&
                                        cbdInfoGetListsAccessories.data.list
                                    }
                                    rowSelection={false}
                                    loading={
                                        cbdInfoGetListsAccessories.isLoading
                                    }
                                    pagination={false}
                                    onRow={onMaterialRow}
                                    expandable={expandable}
                                />
                            </TabPane>

                            <TabPane tab="DIRECT" key="direct">
                                <CustomTable
                                    title={() => title('direct')}
                                    rowKey="cbdCostingId"
                                    initialColumns={costColumns}
                                    dataSource={
                                        cbdCostingGetListsDirect.data &&
                                        cbdCostingGetListsDirect.data.list
                                    }
                                    rowSelection={false}
                                    loading={cbdCostingGetListsDirect.isLoading}
                                    pagination={false}
                                    onRow={onCostRow}
                                />
                            </TabPane>
                            <TabPane tab="INDIRECT" key="indirect">
                                <CustomTable
                                    title={() => title('indirect')}
                                    rowKey="cbdCostingId"
                                    initialColumns={costColumns}
                                    dataSource={
                                        cbdCostingGetListsIndirect.data &&
                                        cbdCostingGetListsIndirect.data.list
                                    }
                                    rowSelection={false}
                                    loading={
                                        cbdCostingGetListsIndirect.isLoading
                                    }
                                    pagination={false}
                                    onRow={onCostRow}
                                />
                            </TabPane>
                        </Tabs>
                    ) : (
                        // <Collapse
                        //     bordered={false}
                        //     size="small"
                        //     defaultActiveKey={[
                        //         'cost',
                        //         'fabric',
                        //         'trim',
                        //         'accessories',
                        //     ]}
                        // >
                        //     <Panel header="COST LIST" key="cost">
                        //         <Row gutter={8}>
                        //             <Col span={12}>
                        //                 <CustomTable
                        //                     title={() => title('direct')}
                        //                     rowKey="cbdCostingId"
                        //                     initialColumns={costColumns}
                        //                     dataSource={
                        //                         cbdCostingGetListsDirect.data &&
                        //                         cbdCostingGetListsDirect.data.list
                        //                     }
                        //                     rowSelection={false}
                        //                     loading={
                        //                         cbdCostingGetListsDirect.isLoading
                        //                     }
                        //                     pagination={false}
                        //                     onRow={onCostRow}
                        //                 />
                        //             </Col>
                        //             <Col span={12}>
                        //                 <CustomTable
                        //                     title={() => title('indirect')}
                        //                     rowKey="cbdCostingId"
                        //                     initialColumns={costColumns}
                        //                     dataSource={
                        //                         cbdCostingGetListsIndirect.data &&
                        //                         cbdCostingGetListsIndirect.data.list
                        //                     }
                        //                     rowSelection={false}
                        //                     loading={
                        //                         cbdCostingGetListsIndirect.isLoading
                        //                     }
                        //                     pagination={false}
                        //                     onRow={onCostRow}
                        //                 />
                        //             </Col>
                        //         </Row>
                        //     </Panel>
                        //     {/* <Panel header="INDIRECT COST LIST">
                        //         <DefaultTable
                        //             title={() => title("indirect")}
                        //             tableKey="cbdCostingId"
                        //             columns={costColumns}
                        //             dataSource={
                        //                 cbdCostingGetListsIndirect.data &&
                        //                 cbdCostingGetListsIndirect
                        //             }
                        //             onRow={onCostRow}
                        //         />
                        //     </Panel> */}
                        //     <Panel header="FABRIC ITEM LIST">
                        //         <CustomTable
                        //             title={() => title('fabric')}
                        //             rowKey="cbdMaterialInfoId"
                        //             initialColumns={fabricColumns}
                        //             dataSource={
                        //                 cbdInfoGetListsFabric.data &&
                        //                 cbdInfoGetListsFabric.data.list
                        //             }
                        //             rowSelection={false}
                        //             loading={cbdInfoGetListsFabric.isLoading}
                        //             pagination={false}
                        //             onRow={onMaterialRow}
                        //         />
                        //     </Panel>

                        //     <Panel header="TRIM ITEM LIST">
                        //         <CustomTable
                        //             title={() => title('trim')}
                        //             rowKey="cbdMaterialInfoId"
                        //             initialColumns={columns}
                        //             dataSource={
                        //                 cbdInfoGetListsTrim.data &&
                        //                 cbdInfoGetListsTrim.data.list
                        //             }
                        //             rowSelection={false}
                        //             loading={cbdInfoGetListsTrim.isLoading}
                        //             pagination={false}
                        //             onRow={onMaterialRow}
                        //         />
                        //     </Panel>
                        //     <Panel header="ACCESSORIES ITEM LIST">
                        //         <CustomTable
                        //             title={() => title('accessories')}
                        //             rowKey="cbdMaterialInfoId"
                        //             initialColumns={columns}
                        //             dataSource={
                        //                 cbdInfoGetListsAccessories.data &&
                        //                 cbdInfoGetListsAccessories.data.list
                        //             }
                        //             rowSelection={false}
                        //             loading={cbdInfoGetListsAccessories.isLoading}
                        //             pagination={false}
                        //             onRow={onMaterialRow}
                        //         />
                        //     </Panel>
                        // </Collapse>
                        <div className="cbdProcess">
                            <Steps progressDot size="small" current={6}>
                                <Step title="CBD" description="Step1 CBD" />
                                <Step
                                    title="MCL"
                                    description="Step2 Material CheckList"
                                />
                                <Step
                                    title="Material Purchasing"
                                    description="Issue PO when requesting material order to the company."
                                />
                                <Step
                                    title="Import Customs"
                                    description="After inspection of raw materials, register with CHA."
                                />
                                <Step
                                    title="Export Customs"
                                    description="After the finished product is shipped, register with CHA."
                                />
                                <Step
                                    title="F/G AR"
                                    description="It is automatically registered with AR at the same time as the finished product is shipped, and even ETD is recorded."
                                />
                                <Step
                                    title="AR DUE"
                                    description="Please accept payment to Buyer for the export of finished goods."
                                />
                            </Steps>
                            ,
                        </div>
                    )}
                </div>
            </div>
        </CbdOptionOutterWrap>
    );
};

const CbdOptionOutterWrap = styled.div`
    height: 100%;
    // border: 1px solid red;
    padding: 1rem 0.5rem 1rem 0;
    overflow: auto;

    #cbdOptionWrap {
        // border: 1px solid red;
        // width: 100%;
        min-width: 1000px;
        // color: #000000;
    }
    .cbdMaterialWrap {
        // position: relative;
        // padding: 1rem 0 2rem 0;
        padding: 1rem;
        // padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
    }
    .cbdProcess {
        padding-top: 1rem;
    }

    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
        font-weight: 600;
        color: #000000;
    }

    .ant-tabs-tab > div {
        // font-weight: bold;
        color: gray;
    }
`;

export default React.memo(CbdOption);
