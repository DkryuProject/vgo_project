import { Space } from 'antd';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mclOptionDocumentGetIdAsyncAction } from 'store/mcl/option/reducer';
import styled from 'styled-components';
import { CaretRightOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import CustomTable from 'components/common/CustomTable';
import ReactToPrint from 'react-to-print';
import TableButton from 'components/common/table/TableButton';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import dateFormat from 'core/utils/dateUtil';
import useGtag from 'core/hook/useGtag';
import { Fragment } from 'react';

const Document = (props) => {
    const {
        show,
        match: {
            params: { mclOptionId },
        },
        // cbdCoverGetId,
    } = props;
    const dispatch = useDispatch();
    const { trackPageView } = useGtag();
    const printRef = useRef();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const mclOptionDocumentGetId = useSelector(
        (state) => state.mclOptionReducer.get.documentId
    );
    const handleMclOptionDocumentGetId = useCallback(
        (payload) =>
            dispatch(mclOptionDocumentGetIdAsyncAction.request(payload)),
        [dispatch]
    );

    const mclPlanningGetLists = useSelector(
        (state) => state.mclPlanningReducer.get.lists
    );

    const calculateNumber = useCallback((item, dataArr) => {
        return dataArr.reduce((acc2, cur2) => {
            acc2 = acc2 + cur2[item];
            return acc2;
        }, 0);
    }, []);

    useEffect(() => {
        handleMclOptionDocumentGetId(mclOptionId);
    }, [mclOptionId, show, mclPlanningGetLists, handleMclOptionDocumentGetId]);

    useEffect(() => {
        setIsLoading(mclOptionDocumentGetId.isLoading);
        if (mclOptionDocumentGetId.data) {
            const { mclHeader, mclDetails } = mclOptionDocumentGetId.data.data;
            setDataSource({
                mclHeader: [mclHeader],
                mclDetails: mclDetails.reduce((acc, cur, idx, arr) => {
                    acc.push({ ...cur, id: idx + 1 });
                    // if (arr.length === idx + 1) {
                    //     acc.push({
                    //         ...cur,
                    //         grossYy: parseFloat(
                    //             calculateNumber('grossYy', arr)
                    //         ).toFixed(3),
                    //         garmentQty: calculateNumber('garmentQty', arr),
                    //         requiredQty: calculateNumber('requiredQty', arr),
                    //         usage: 'GRAND TOTAL',
                    //         id: idx + 2,
                    //     });
                    // }

                    return acc;
                }, []),
            });
        }
    }, [mclOptionDocumentGetId, setDataSource, setIsLoading, calculateNumber]);
    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `DOCUMENT | MCL OPTION DETAIL | DESIGN COVER | PLM`,
        });
    }, [trackPageView]);

    const summaryColumns = [
        {
            title: 'Order Qty',
            dataIndex: 'orderQuantity',
            render: (data) => {
                const _data = formatNumberUtil(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'CO',
            dataIndex: 'co',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Manufacturer',
            dataIndex: 'manufacture',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Initial PCD',
            dataIndex: 'pcdDate',
            render: (data) => {
                const _data = dateFormat(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Destination',
            dataIndex: 'destinations',
            render: (data) => (
                <Tooltip title={data?.join(' / ')}>{data?.join(' / ')}</Tooltip>
            ),
        },
    ];

    const detailsColumns = [
        {
            title: 'Usage / Supplier name',
            dataIndex: 'usage_supplier',
            align: 'left',
            render: (data) => {
                const { usage, supplier_name } = data || {};

                const output = (
                    <Fragment>
                        <div>*Usage: {usage || '-'}</div>
                        <div>*Supplier: {supplier_name || '-'}</div>
                    </Fragment>
                );
                return <Tooltip title={output}>{output}</Tooltip>;
            },
        },
        {
            title: 'Item name and Number',
            dataIndex: 'item_name',
            ellipsis: true,
            align: 'left',
            render: (data) => {
                const { category, item_name, material_no } = data || {};

                const output = (
                    <Fragment>
                        <div>
                            {' '}
                            *Category: {category?.typeA} /{' '}
                            {category?.typeC
                                ? `${category?.typeB} / ${category?.typeC}`
                                : category?.typeB}
                        </div>
                        <div>
                            *
                            {category?.typeA?.toLowerCase() === 'fabric'
                                ? 'Fabric name'
                                : 'Item name'}
                            : {item_name || '-'}
                        </div>
                        <div>*Material No.: {material_no || '-'}</div>
                    </Fragment>
                );
                return <Tooltip title={output}>{output}</Tooltip>;
            },
        },
        {
            title: 'Item Detail Information',
            dataIndex: 'item_name',
            ellipsis: true,
            align: 'left',
            render: (_, record) => {
                const { item_name, item_detail } = record || {};
                const {
                    item_detail: _item_detail,
                    contents,
                    construction,
                    cw,
                    weight,
                    finishing,
                    dyeing,
                    printing,
                    characteristic,
                    solid_pattern,
                    function: _function,
                    performance,
                    stretch,
                } = item_detail || {};
                const type = item_name?.category?.typeA?.toLowerCase();

                const output = (
                    <Fragment>
                        {type === 'fabric' && (
                            <Fragment>
                                <div>*Composition: {contents || '-'}</div>
                                <div>*Construction: {construction || '-'}</div>
                            </Fragment>
                        )}

                        <div>
                            * Width/Weight:
                            {cw ? (
                                <span>
                                    {cw} {cw?.name3 || 'inch'}
                                </span>
                            ) : (
                                '-'
                            )}{' '}
                            /{' '}
                            {weight ? (
                                <span>
                                    {' '}
                                    {weight} {weight?.name3 || 'GSM'}
                                </span>
                            ) : (
                                '-'
                            )}
                        </div>

                        {type !== 'accessories' && (
                            <div>*Post Processing: {finishing || '-'}</div>
                        )}
                        {type === 'fabric' && (
                            <Fragment>
                                <div>*Dyeing: {dyeing || '-'}</div>
                                <div>*Printing: {printing || '-'}</div>
                                <div>
                                    *Characteristic: {characteristic || '-'}
                                </div>
                                <div>
                                    *Solid/Pattern: {solid_pattern || '-'}
                                </div>
                                <div>*Function: {_function || '-'}</div>
                                <div>*Performance: {performance || '-'}</div>
                                <div>*Stretch: {stretch || '-'}</div>
                            </Fragment>
                        )}

                        {type !== 'fabric' && <div>{_item_detail || '-'}</div>}
                    </Fragment>
                );

                return <Tooltip title={output}>{output}</Tooltip>;
            },
        },

        {
            title: 'Item Color & Size',
            dataIndex: 'item_color_size',
            align: 'left',
            render: (data, record) => {
                const { item_size, item_size_uom, actual_color, item_color } =
                    data || {};
                const { item_name } = record || {};
                const type = item_name?.category?.typeA?.toLowerCase();
                const output = (
                    <Fragment>
                        {type === 'fabric' && (
                            <div>*Actual Color: {actual_color || '-'}</div>
                        )}
                        {type !== 'fabric' && (
                            <Fragment>
                                <div>*Item Color: {item_color || '-'}</div>
                                <div>*Item Size: {item_size || '-'}</div>
                                <div>
                                    *Item Size UOM: {item_size_uom || '-'}
                                </div>
                            </Fragment>
                        )}
                    </Fragment>
                );
                return <Tooltip title={output}>{output}</Tooltip>;
            },
        },

        {
            title: 'Yardage Yield (YY)',
            dataIndex: 'yardage_yield',
            align: 'right',
            render: (data) => {
                const { gross, loss, net } = data || {};
                const output = (
                    <Fragment>
                        <div>*Net: {formatNumberUtil(net) || '-'}</div>
                        <div>*Loss(%): {formatNumberUtil(loss) || '-'}</div>
                        <div>*Gross: {formatNumberUtil(gross) || '-'}</div>
                    </Fragment>
                );
                return <Tooltip title={output}>{output}</Tooltip>;
            },
        },

        {
            title: 'Quantity Info',
            dataIndex: 'quantity_info',
            align: 'right',
            render: (data) => {
                const { balance_qty, order_qty, require_qty } = data || {};
                const output = (
                    <Fragment>
                        <div>*Req Qty: {formatNumberUtil(require_qty)}</div>
                        <div>*Ord Qty: {formatNumberUtil(order_qty)}</div>
                        <div>*Bal Qty: {formatNumberUtil(balance_qty)}</div>
                    </Fragment>
                );

                return <Tooltip title={output}>{output}</Tooltip>;
            },
        },

        {
            title: 'UOM',
            dataIndex: 'uom',
            align: 'right',
            render: (data) => {
                return <Tooltip title={data || '-'}>{data || '-'}</Tooltip>;
            },
        },
        {
            title: 'Dependency',
            dataIndex: 'dependency',
            align: 'left',
            render: (data) => {
                const { color, market, size } = data || {};
                const output = (
                    <Fragment>
                        <div>*Color: {color || '-'}</div>
                        <div>*Size: {market || '-'}</div>
                        <div>*Market: {size || '-'}</div>
                    </Fragment>
                );
                return <Tooltip title={output}>{output}</Tooltip>;
            },
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
                    <ReactToPrint
                        trigger={() => {
                            return (
                                <TableButton
                                    toolTip={{
                                        placement: 'topLeft',
                                        title: 'ITEM print',
                                        arrowPointAtCenter: true,
                                    }}
                                    mode="save"
                                    size="small"
                                >
                                    PRINT
                                </TableButton>
                            );
                        }}
                        content={() => printRef.current}
                    />
                </Space>
            </div>
        </div>
    );
    return (
        <DocumentWrap>
            <div id="document" ref={printRef}>
                <div style={{ paddingBottom: '1rem' }}>
                    <CustomTable
                        title={() => title()}
                        rowKey="co"
                        initialColumns={summaryColumns}
                        dataSource={dataSource?.mclHeader}
                        rowSelection={false}
                        loading={isLoading}
                        pagination={false}
                    />
                </div>
                <div>
                    <CustomTable
                        rowKey="id"
                        initialColumns={detailsColumns}
                        dataSource={dataSource?.mclDetails}
                        rowSelection={false}
                        loading={isLoading}
                        pagination={false}
                    />
                </div>
            </div>
        </DocumentWrap>
    );
};

const DocumentWrap = styled.div`
    height: 100%;
    // border: 1px solid red;
    padding: 1rem 1rem 1rem 1rem;
    overflow: auto;

    #document {
        min-width: 500px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;

        @media print {
            @page {
                size: A4;
                // size: A4 landscape;
                margin: 3mm;
            }
        }

        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                ${({ theme }) => theme.fonts.h7};
            }
        }
    }
`;
export default Document;
