import { Space } from 'antd';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cbdOptionDocumentGetIdAsyncAction } from 'store/cbd/option/reducer';
import styled from 'styled-components';
import { CaretRightOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import CustomTable from 'components/common/CustomTable';
import ReactToPrint from 'react-to-print';
import TableButton from 'components/common/table/TableButton';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import useGtag from 'core/hook/useGtag';

const Document = (props) => {
    const {
        show,
        match: {
            params: { cbdId },
        },
        cbdCoverGetId,
    } = props;
    const dispatch = useDispatch();
    const { trackPageView } = useGtag();
    const printRef = useRef();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryTotal, setCategoryTotal] = useState({
        fabricTotal: 0,
        trimTotal: 0,
        accessoriesTotal: 0,
        directTotal: 0,
        indirectTotal: 0,
    });

    const cbdOptionDocumentGetId = useSelector(
        (state) => state.cbdOptionReducer.get.documentId
    );
    const handleCbdOptionDocumentGetId = useCallback(
        (payload) =>
            dispatch(cbdOptionDocumentGetIdAsyncAction.request(payload)),
        [dispatch]
    );

    const cbdOptionPost = useSelector((state) => state.cbdOptionReducer.post);

    const calculateNumber = useCallback((item, dataArr) => {
        return dataArr.reduce((acc2, cur2) => {
            if (cur2.usage?.indexOf('TOTAL') > 0) acc2 = acc2 + cur2[item];
            return acc2;
        }, 0);
    }, []);

    // const handlePrint = useReactToPrint({
    //     content: () => printRef.current,
    // });

    useEffect(() => {
        handleCbdOptionDocumentGetId(cbdId);
    }, [cbdId, show, cbdOptionPost, handleCbdOptionDocumentGetId]);

    useEffect(() => {
        setIsLoading(cbdOptionDocumentGetId.isLoading);
        if (cbdOptionDocumentGetId.data) {
            const { cbdHeader, cbdDetails } = cbdOptionDocumentGetId.data.data;
            setDataSource({
                cbdHeader: [cbdHeader],
                cbdDetails: cbdDetails.reduce((acc, cur, idx, arr) => {
                    acc.push({ ...cur, id: idx + 1 });
                    if (arr.length === idx + 1) {
                        acc.push({
                            ...cur,
                            amount: parseFloat(
                                calculateNumber('amount', arr)
                            ).toFixed(2),
                            portion: parseFloat(
                                calculateNumber('portion', arr)
                            ).toFixed(2),
                            usage: 'GRAND TOTAL',
                            id: idx + 2,
                        });
                    }

                    return acc;
                }, []),
            });
        }
    }, [cbdOptionDocumentGetId, setDataSource, setIsLoading, calculateNumber]);

    useEffect(() => {
        setCategoryTotal({
            fabricTotal:
                dataSource.cbdDetails?.findIndex(
                    (v) => v.usage === 'FABRIC TOTAL'
                ) + 1 || 0,
            trimTotal:
                dataSource.cbdDetails?.findIndex(
                    (v) => v.usage === 'TRIM TOTAL'
                ) + 1 || 0,
            accessoriesTotal:
                dataSource.cbdDetails?.findIndex(
                    (v) => v.usage === 'ACCESSORIES TOTAL'
                ) + 1 || 0,
            directTotal:
                dataSource.cbdDetails?.findIndex(
                    (v) => v.usage === 'DIRECT TOTAL'
                ) + 1 || 0,
            indirectTotal:
                dataSource.cbdDetails?.findIndex(
                    (v) => v.usage === 'INDIRECT TOTAL'
                ) + 1 || 0,
        });
    }, [dataSource, setCategoryTotal]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `DOCUMENT | CBD OPTION DETAIL | DESIGN COVER | PLM `,
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
            title: 'Final cost',
            dataIndex: 'finalCost',
            render: (data) => {
                const _data = formatNumberUtil(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Profit (%)',
            dataIndex: 'profit',
            render: (data) => {
                const _data = formatNumberUtil(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            render: (data) => {
                const _data = formatNumberUtil(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
    ];

    const detailsColumns = [
        {
            title: 'Usage',
            dataIndex: 'usage',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'MILL#',
            dataIndex: 'millNo',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Size',
            dataIndex: 'size',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'UOM',
            dataIndex: 'uom',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Net YY',
            dataIndex: 'netYy',
            align: 'right',
            render: (data) => {
                const _data = formatNumberUtil(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Loss (%)',
            dataIndex: 'loss',
            align: 'right',
            render: (data) => {
                const _data = formatNumberUtil(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Gross YY',
            dataIndex: 'grossYy',
            align: 'right',
            render: (data) => {
                const _data = formatNumberUtil(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            align: 'right',
            render: (data) => {
                const { commonCurrency } = cbdCoverGetId?.data?.data;
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
            align: 'right',
            render: (data) => {
                const { commonCurrency } = cbdCoverGetId?.data?.data;
                const value = (
                    <div>
                        {commonCurrency?.name3} {formatNumberUtil(data)}
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Portion (%)',
            dataIndex: 'portion',
            align: 'right',
            render: (data) => {
                const _data = formatNumberUtil(data);
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'Supplier name',
            dataIndex: 'supplierName',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    COST BREAKDOWN (CBD) DOCUMENT
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
        <DocumentWrap categoryTotal={categoryTotal}>
            <div id="document" ref={printRef}>
                <div style={{ paddingBottom: '1rem' }}>
                    <CustomTable
                        title={() => title()}
                        rowKey="profit"
                        initialColumns={summaryColumns}
                        dataSource={dataSource?.cbdHeader}
                        rowSelection={false}
                        loading={isLoading}
                        pagination={false}
                    />
                </div>

                <div>
                    <CustomTable
                        rowKey="id"
                        initialColumns={detailsColumns}
                        dataSource={dataSource?.cbdDetails}
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
    padding: 1rem;

    overflow: auto;

    .ant-table-tbody {
        tr[data-row-key='${(props) => props.categoryTotal.fabricTotal}'],
        tr[data-row-key='${(props) => props.categoryTotal.trimTotal}'],
        tr[data-row-key='${(props) => props.categoryTotal.accessoriesTotal}'],
        tr[data-row-key='${(props) => props.categoryTotal.directTotal}'],
        tr[data-row-key='${(props) => props.categoryTotal.indirectTotal}'] {
            background: #cad2f4;
            font-weight: 800;
        }
    }

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
