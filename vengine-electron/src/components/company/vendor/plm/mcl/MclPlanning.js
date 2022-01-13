import React, {
    useState,
    useCallback,
    useEffect,
    Fragment,
    useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mclPlanningGetListsAsyncAction } from 'store/mcl/planning/reducer';
import styled from 'styled-components';
import { Tooltip } from 'components/common/tooltip';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { Space, Collapse, Tag, Row, Col } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import useGtag from 'core/hook/useGtag';
import { JcBetween } from 'styles/Layout';
import { Ellipsis } from 'components/UI/atoms';

const MclPlanning = (props) => {
    const { match, initialShow, onShow, onRightSplit } = props;
    const { mclOptionId } = match.params || '';
    const { Panel } = Collapse;
    const dispatch = useDispatch();
    const { trackPageView } = useGtag();
    const [dataSource, setDataSource] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const mclPlanningGetLists = useSelector(
        (state) => state.mclPlanningReducer.get.lists
    );
    const handleMclPlanningGetLists = useCallback(
        (payload) => dispatch(mclPlanningGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    // 조회
    useEffect(() => {
        handleMclPlanningGetLists(mclOptionId);
    }, [mclOptionId, handleMclPlanningGetLists]);

    useEffect(() => {
        setIsLoading(mclPlanningGetLists.isLoading);
        if (mclPlanningGetLists.data) {
            setDataSource(mclPlanningGetLists.data.data);
        }
    }, [mclPlanningGetLists]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `PLANNING LISTS | MCL OPTION DETAIL | DESIGN COVER | PLM  `,
        });
    }, [trackPageView]);

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
                            {record?.materialInfo?.type !== 'fabric' && (
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

                                    {record?.materialInfo?.type !==
                                        'fabric' && (
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
                title: 'UOM (Vendor)',
                dataIndex: 'mclMaterialUom',
                align: 'left',
                render: (data) => {
                    return (
                        <Tooltip title={data?.name3 || '-'}>
                            {data?.name3 || '-'}
                        </Tooltip>
                    );
                },
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
                title: 'Quantity Info',
                dataIndex: 'reqQty',
                align: 'left',
                render: (_, record) => {
                    const value = (
                        <div>
                            <JcBetween>
                                <div>* Req Qty :</div>{' '}
                                <div>
                                    {formatNumberUtil(record?.requireQty)}
                                </div>
                            </JcBetween>
                            <JcBetween>
                                <div>* Ord Qty :</div>{' '}
                                <div>{formatNumberUtil(record?.orderQty)}</div>
                            </JcBetween>
                            <JcBetween>
                                <div>* Bal Qty :</div>{' '}
                                <div>
                                    {formatNumberUtil(record?.balanceQty)}
                                </div>
                            </JcBetween>
                        </div>
                    );

                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },

            {
                title: 'UOM (Supplier)',
                dataIndex: 'material_offer_uom',
                align: 'left',
                render: (data) => {
                    return (
                        <Tooltip title={data?.name3 || '-'}>
                            {data?.name3 || '-'}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Dependency',
                dataIndex: 'dependency',
                align: 'left',
                render: (_, record) => {
                    const value = (
                        <div>
                            <JcBetween>
                                <div> * Color :</div>{' '}
                                <div>
                                    {record?.colorDependency?.type || '-'}
                                </div>
                            </JcBetween>
                            <JcBetween>
                                <div> * Size :</div>{' '}
                                <div>{record?.sizeDependency?.type || '-'}</div>
                            </JcBetween>
                            <JcBetween>
                                <div>* Market:</div>{' '}
                                <div>
                                    {record?.marketDependency?.type || '-'}
                                </div>
                            </JcBetween>
                        </div>
                    );

                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Status',
                dataIndex: 'status',
                align: 'left',
                render: (data) => {
                    const output =
                        data === 'OPEN' ? (
                            <Tag
                                color="blue"
                                key={'OPEN'}
                                style={{ fontSize: '0.625rem' }}
                            >
                                OPEN
                            </Tag>
                        ) : (
                            <Tag
                                color="red"
                                key={'CLOSE'}
                                style={{ fontSize: '0.625rem' }}
                            >
                                CLOSE
                            </Tag>
                        );
                    return <Tooltip title={output}>{output}</Tooltip>;
                },
            },
        ],
        []
    );

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                {/* <Space>
                    <CaretRightOutlined />
                    {type.toUpperCase() + ' COST'}
                </Space> */}
            </div>
            <div className="functionWrap">
                <Space>
                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Create ' + type.toUpperCase(),
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
                const { id } = record;
                const { type } = record.materialInfo;
                return onShow({
                    ...initialShow,
                    materialDetail: {
                        type: type,
                        status: true,
                        id: id,
                    },
                });
            },
        };
    };

    const expandable = {
        expandedRowRender: (v) => {
            const {
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
            const { type, item_name, usage_type, application, sus_eco } =
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
        <MclPlanningWrap>
            <div id="mclPlanningWrap">
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <CaretRightOutlined />
                            GARMENT PLANNING
                        </Space>
                    </div>

                    <div className="functionWrap">
                        <Space>
                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Copy Item',
                                    arrowPointAtCenter: true,
                                }}
                                mode="copy"
                                size="small"
                                onClick={() => {
                                    onRightSplit();
                                    onShow({
                                        ...initialShow,
                                        planningCopy: {
                                            status: true,
                                        },
                                    });
                                }}
                            />
                        </Space>
                    </div>
                </div>
                <div className="contentsWrap">
                    <div className="content">
                        <Collapse
                            bordered={false}
                            size="small"
                            defaultActiveKey={['1', '2', '3']}
                        >
                            <Panel header="FABRIC ITEM LIST" key="1">
                                <CustomTable
                                    title={() => title('fabric')}
                                    rowKey="id"
                                    initialColumns={columns}
                                    dataSource={
                                        dataSource &&
                                        dataSource.fabricMaterialInfos
                                    }
                                    rowSelection={false}
                                    loading={isLoading}
                                    pagination={false}
                                    onRow={onRow}
                                    expandable={expandable}
                                />
                            </Panel>

                            <Panel header="TRIM ITEM LIST" key="2">
                                <CustomTable
                                    title={() => title('trim')}
                                    rowKey="id"
                                    initialColumns={columns}
                                    dataSource={
                                        dataSource &&
                                        dataSource.trimsMaterialInfos
                                    }
                                    rowSelection={false}
                                    loading={isLoading}
                                    pagination={false}
                                    onRow={onRow}
                                    expandable={expandable}
                                />
                            </Panel>
                            <Panel header="ACCESSORIES ITEM LIST" key="3">
                                <CustomTable
                                    title={() => title('accessories')}
                                    rowKey="id"
                                    initialColumns={columns}
                                    dataSource={
                                        dataSource &&
                                        dataSource.accessoriesMaterialInfos
                                    }
                                    rowSelection={false}
                                    loading={isLoading}
                                    pagination={false}
                                    onRow={onRow}
                                    expandable={expandable}
                                />
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            </div>
        </MclPlanningWrap>
    );
};

const MclPlanningWrap = styled.div`
    height: 100%;
    // padding: 1rem;
    overflow: auto;
    padding: 0 1rem 2rem 0;
    #mclPlanningWrap {
        // min-width: 500px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;

        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // padding-left: 5px;
            .title {
                ${({ theme }) => theme.fonts.h7};
            }
        }

        .contentsWrap {
            margin-top: 1rem;
            .content {
                .ant-collapse-header {
                    ${({ theme }) => theme.fonts.h7};
                }
            }
        }
    }
`;

export default React.memo(MclPlanning);
