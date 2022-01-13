import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import useNotification from 'core/hook/useNotification';
import { mclPoGetPublishIdAsyncAction } from 'store/mcl/po/reducer';
import {
    supplierOrderGetPagesAsyncAction,
    supplierOrderPostAsyncAction,
} from 'store/supplier/order/reducer';
import { mclAdhocGetIdAsyncAction } from 'store/mcl/adhoc/reducer';
import handleCalculationResult from 'core/utils/uomUtil';
import styled from 'styled-components';
import * as confirm from 'components/common/confirm';
import { Tooltip } from 'components/common/tooltip';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { PDFExport } from '@progress/kendo-react-pdf';
import { Space, Input, Modal, Button, Row, Col } from 'antd';
import {
    CaretRightOutlined,
    SearchOutlined,
    WechatOutlined,
} from '@ant-design/icons';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import dateFormat from 'core/utils/dateUtil';
import { Ellipsis } from 'components/UI/atoms';
import { Fragment } from 'react';

const PoDocumentation = (props) => {
    const dispatch = useDispatch();
    // const [handleNotification] = useNotification();
    const tableRef = useRef();
    const modalRef = useRef();
    const [dataSource, setDataSource] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        searchKeyword: '',
        status: null,
    });
    const [total, setTotal] = useState(0);
    const [visibleModal, setVisibleModal] = useState({
        id: null,
        status: false,
        poType: null,
    });
    const [visibleRevertModal, setVisibleRevertModal] = useState({
        id: null,
        status: false,
        poType: null,
        type: 'read',
    });
    const [poItemDataSource, setPoItemDataSource] = useState(null);
    const [revertMemo, setRevertMemo] = useState(null);

    const supplierOrderGetPages = useSelector(
        (state) => state.supplierOrderReducer.get.pages
    );
    const handleSupplierOrderGetPages = useCallback(
        (payload) =>
            dispatch(supplierOrderGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const supplierOrderPost = useSelector(
        (state) => state.supplierOrderReducer.post
    );
    const handleSupplierOrderPost = useCallback(
        (payload) => dispatch(supplierOrderPostAsyncAction.request(payload)),
        [dispatch]
    );

    const mclPoGetPublishId = useSelector(
        (state) => state.mclPoReducer.get.publishId
    );
    const handleMclPoGetPublishId = useCallback(
        (payload) => dispatch(mclPoGetPublishIdAsyncAction.request(payload)),
        [dispatch]
    );

    const mclAdhocGetId = useSelector((state) => state.mclAdhocReducer.get.id);
    const handleMclAdhocGetId = useCallback(
        (payload) => dispatch(mclAdhocGetIdAsyncAction.request(payload)),
        [dispatch]
    );

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows } = tableRef.current;

            if (selectedRows.length === 0) {
                return confirm.warningConfirm('No item is selected');
            }
            if (type === 'confirm') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        // poConfirm 1 === confirm, 2 === revert
                        const newValues = selectedRows.map((v) => ({
                            poConfirm: 1,
                            publishedOrderId: v.publishOrderId,
                            poType: v?.poType,
                        }));
                        return handleSupplierOrderPost(newValues);
                    }
                });
            } else if (type === 'revert') {
                confirm.warningConfirm('Are you revert', (e) => {
                    if (e) {
                        // Revert Modal open
                        // Revert시 poConfirm, publishedOrderId가 필요하여 data에 담아 보낸다.
                        return setVisibleRevertModal({
                            id: selectedRows[0]?.id,
                            status: true,
                            type: 'revert',

                            data: {
                                poConfirm: 2,
                                publishedOrderId:
                                    selectedRows[0].publishOrderId,
                                poType: selectedRows[0]?.poType,
                            },
                        });
                    }
                });
            }
        },
        [tableRef, handleSupplierOrderPost]
    );

    // 조회
    useEffect(() => {
        handleSupplierOrderGetPages(pagination);
    }, [pagination, handleSupplierOrderGetPages]);

    useEffect(() => {
        setIsLoading(supplierOrderGetPages.isLoading);
        if (supplierOrderGetPages.data) {
            const { content, totalElements } = supplierOrderGetPages.data.page;
            const newContent = content.map((v, i) => ({
                ...v,
                id: i + 1,
            }));

            setDataSource(newContent);
            setTotal(totalElements);
            setRevertMemo(
                newContent.reduce((acc, cur) => {
                    acc[cur.id] = cur.revertMemo || '';
                    return acc;
                }, {})
            );
        }
    }, [supplierOrderGetPages, setIsLoading, setDataSource, setRevertMemo]);

    // item 모달 조회
    useEffect(() => {
        if (visibleModal.id) {
            // 타입에 따라 adhoc or mcl 으로 조회 한다
            visibleModal.poType === 'mcl'
                ? handleMclPoGetPublishId(visibleModal.id)
                : handleMclAdhocGetId(visibleModal.id);
        }
        return () => setPoItemDataSource([]);
    }, [
        visibleModal,
        handleMclPoGetPublishId,
        handleMclAdhocGetId,
        setPoItemDataSource,
    ]);

    // mcl
    useEffect(() => {
        if (mclPoGetPublishId.data) {
            const {
                order,
                orderItem: { orderItemList },
            } = mclPoGetPublishId.data.data;
            let count = 0;
            const newOrderItemList = orderItemList.reduce((acc, cur) => {
                count += 1;
                acc.push({ ...cur, index: count });
                if (cur.sampleOrder) {
                    const {
                        advertisementOrderType,
                        advertisementQty,
                        advertisementUnitPrice,
                        advertisementUom,
                        preProductionOrderType,
                        preProductionQty,
                        preProductionUnitPrice,
                        preProductionUom,
                    } = cur.sampleOrder;
                    if (advertisementQty && advertisementUnitPrice) {
                        count += 1;
                        acc.push({
                            ...cur,
                            index: count,
                            orderType: {
                                ...advertisementOrderType,
                                name: advertisementOrderType.name1,
                            },
                            purchaseQty: advertisementQty,
                            unitPrice: advertisementUnitPrice,
                            orderedAdjUom: advertisementUom,
                        });
                    }
                    if (preProductionQty && preProductionUnitPrice) {
                        count += 1;
                        acc.push({
                            ...cur,
                            index: count,
                            orderType: {
                                ...preProductionOrderType,
                                name: preProductionOrderType.name1,
                            },
                            purchaseQty: preProductionQty,
                            unitPrice: preProductionUnitPrice,
                            orderedAdjUom: preProductionUom,
                        });
                    }
                }
                return acc;
            }, []);
            setPoItemDataSource({ order: order, itemDetail: newOrderItemList });
            return () => (count = 0);
        }
    }, [mclPoGetPublishId, setPoItemDataSource]);

    // adhoc
    useEffect(() => {
        if (mclAdhocGetId.data) {
            const { adhocOrder, adhocOrderItems } = mclAdhocGetId.data.data;

            setPoItemDataSource({
                order: adhocOrder,
                itemDetail: adhocOrderItems.map((v, i) => ({
                    ...v,
                    index: i + 1,
                })),
            });
        }
    }, [mclAdhocGetId]);

    useEffect(() => {
        if (supplierOrderPost.error) {
        } else if (supplierOrderPost.data) {
            handleSupplierOrderGetPages(pagination);
            // 성공시 초기화
            setVisibleRevertModal({
                id: null,
                status: false,
                poType: null,
                type: 'read',
            });
        }
    }, [
        pagination,
        supplierOrderPost,
        handleSupplierOrderGetPages,
        setVisibleRevertModal,
    ]);

    // 테이블
    const columns = [
        {
            title: 'Purchase Order#',
            dataIndex: 'poNumber',
            align: 'left',
            render: (data, record) => {
                const status =
                    record?.status?.toLowerCase() === 'revised' ||
                    record?.status?.toLowerCase() === 'canceled';
                return (
                    <Tooltip title={data} status={status}>
                        {data}
                    </Tooltip>
                );
            },
        },
        // {
        //     title: 'Shipper & Consignee',
        //     render: (_, record) => {
        //         const value = (
        //             <div>
        //                 <div>Purchase: {record?.purchaser}</div>
        //                 <div>Ship to: {record?.shipper}</div>
        //             </div>
        //         );
        //         return <Tooltip title={value}>{value}</Tooltip>;
        //     },
        // },
        {
            title: 'Supplier / Ship to Company',
            align: 'left',
            render: (_, record) => {
                const status =
                    record?.status?.toLowerCase() === 'revised' ||
                    record?.status?.toLowerCase() === 'canceled';
                const value = (
                    <div>
                        <div>Supplier: {record?.purchaser}</div>
                        {/* <div>Ship to: {record?.shipper?.companyName}</div> */}
                    </div>
                );
                return (
                    <Tooltip title={value} status={status}>
                        {value}
                    </Tooltip>
                );
            },
        },

        // {
        //     title: 'Shipping Info',
        //     render: (_, record) => {
        //         const {
        //             loadingPort,
        //             loadingPortCountry,
        //             dischargePort,
        //             dischargePortCountry,
        //             shippingMode,
        //             // incoterms,
        //         } = record;
        //         const value = (
        //             <div>
        //                 <div>
        //                     POL: {loadingPort}, {loadingPortCountry}
        //                 </div>
        //                 <div>
        //                     POD: {dischargePort}, {dischargePortCountry}
        //                 </div>
        //                 <div>Ship Mode: {shippingMode}</div>
        //                 {/* <div>incoterms: {incoterms}</div> */}
        //             </div>
        //         );
        //         return <Tooltip title={value}>{value}</Tooltip>;
        //     },
        // },
        {
            title: 'Shipping Information',
            align: 'left',
            render: (_, record) => {
                const {
                    loadingPort,
                    loadingPortCountry,
                    dischargePort,
                    dischargePortCountry,
                    shippingMode,
                } = record;
                const status =
                    record?.status?.toLowerCase() === 'revised' ||
                    record?.status?.toLowerCase() === 'canceled';

                const value = (
                    <div>
                        <div>
                            POL: {loadingPort}, {loadingPortCountry}(
                            {loadingPortCountry}){' '}
                        </div>
                        <div>
                            POD: {dischargePort}, {dischargePortCountry}(
                            {dischargePortCountry})
                        </div>
                        <div>Ship Mode: {shippingMode}</div>
                    </div>
                );
                return (
                    <Tooltip title={value} status={status}>
                        {value}
                    </Tooltip>
                );
            },
        },

        // {
        //     title: 'QTY / AMOUNT',
        //     render: (_, record) => {
        //         const { itemQty, totalAmount, currency } = record;
        //         const value = (
        //             <div>
        //                 <div>Item Qty: {formatNumberUtil(itemQty)} ea</div>
        //                 <div>
        //                     Total Amount: {formatNumberUtil(totalAmount)}{' '}
        //                     {currency}
        //                 </div>
        //             </div>
        //         );

        //         return <Tooltip title={value}>{value}</Tooltip>;
        //     },
        // },

        {
            title: 'Order Qty / Amount',
            align: 'left',
            render: (_, record) => {
                const { itemQty, totalAmount, currency } = record;
                const status =
                    record?.status?.toLowerCase() === 'revised' ||
                    record?.status?.toLowerCase() === 'canceled';
                const value = (
                    <div>
                        <div>Item Qty: {formatNumberUtil(itemQty)} ea</div>
                        {/* <div>Total Order Qty: {totalPoQty}</div> */}
                        <div>
                            Total Amount: {formatNumberUtil(totalAmount)}{' '}
                            {currency.name3}
                        </div>
                    </div>
                );
                return (
                    <Tooltip title={value} status={status}>
                        {value}
                    </Tooltip>
                );
            },
        },

        // {
        //     title: 'Buyer Info',
        //     render: (_, record) => {
        //         const { buyer, brand, designNumber, styleNumbers } = record;
        //         const value = (
        //             <div>
        //                 <div>Buyer: {buyer}</div>
        //                 <div>Brand: {brand}</div>
        //                 <div>Design#: {designNumber}</div>
        //                 <div>Style#: {styleNumbers?.join(',')}</div>
        //             </div>
        //         );
        //         return <Tooltip title={value}>{value}</Tooltip>;
        //     },
        // },
        // {
        //     title: 'Date Info',
        //     render: (_, record) => {
        //         const { estimatedDate, infactoryDate } = record;
        //         const value = (
        //             <div>
        //                 <div>Ship Date: {dateFormat(estimatedDate)}</div>
        //                 <div>In House: {dateFormat(infactoryDate)}</div>
        //             </div>
        //         );

        //         return <Tooltip title={value}>{value}</Tooltip>;
        //     },
        // },

        {
            title: 'Date Information',
            align: 'left',
            render: (_, record) => {
                const { estimatedDate, infactoryDate } = record;
                const status =
                    record?.status?.toLowerCase() === 'revised' ||
                    record?.status?.toLowerCase() === 'canceled';
                const value = (
                    <div>
                        <div>Ship Date: {dateFormat(estimatedDate)}</div>
                        <div>In House: {dateFormat(infactoryDate)}</div>
                    </div>
                );
                return (
                    <Tooltip title={value} status={status}>
                        {value}
                    </Tooltip>
                );
            },
        },

        // {
        //     title: 'Modified Date / Time',
        //     dataIndex: 'updatedAt',
        //     render: (data) => {
        //         const _data = dateFormat(data);
        //         return <Tooltip title={_data}>{_data}</Tooltip>;
        //     },
        // },

        {
            title: 'Modified',
            dataIndex: 'updatedAt',
            align: 'left',
            render: (data, record) => {
                const _data = dateFormat(data);
                const status =
                    record?.status?.toLowerCase() === 'revised' ||
                    record?.status?.toLowerCase() === 'canceled';
                return (
                    <Tooltip title={_data} status={status}>
                        {_data}
                    </Tooltip>
                );
            },
        },
        {
            title: 'Status',
            render: (_, record) => {
                return (
                    <span>
                        {
                            <Tooltip title={record?.status}>
                                {record?.status}
                            </Tooltip>
                        }
                        {record?.status?.toLowerCase() === 'revert' && (
                            <WechatOutlined
                                style={{
                                    marginLeft: '.5rem',
                                    fontSize: '1rem',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const { id } = record;
                                    return setVisibleRevertModal({
                                        id: id,
                                        status: true,
                                        type: 'read',
                                    });
                                }}
                            />
                        )}
                    </span>
                );
            },
        },
    ];

    const mclPurchaseOrderColumns = [
        {
            title: 'No.',
            dataIndex: 'index',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Buyer Information',
            dataIndex: 'mclMaterialInfo',
            align: 'left',
            render: (_, record) => {
                const {
                    mclMaterialInfo,
                    styleNumbers,
                    brand,
                    season,
                    seasonYear,
                } = record;
                const value = (
                    <div>
                        <div>
                            *Buyer: {mclMaterialInfo?.buyer?.companyName} /{' '}
                            {brand?.companyName}
                        </div>
                        <div>
                            *Season: {season?.name} {seasonYear}
                        </div>
                        <div>*Style No.: {styleNumbers?.join?.(',')}</div>
                    </div>
                );

                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Item name and Number',
            align: 'left',
            render: (_, record) => {
                const { mclMaterialInfo } = record;
                const { materialInfo, supplierMaterial } = mclMaterialInfo;
                const { category, type, item_name } = materialInfo;

                const value = (
                    <div>
                        <div>
                            *Category: {category?.typeA} /{' '}
                            {category?.typeC
                                ? `${category?.typeB} / ${category?.typeC}`
                                : category?.typeB}
                        </div>
                        <div>
                            *
                            {type?.toLowerCase() === 'fabric'
                                ? 'Fabric name'
                                : 'Item name'}
                            : {item_name || '-'}
                        </div>
                        <div>*Material No.: {supplierMaterial || '-'}</div>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Item Detail Information',
            dataIndex: 'mclMaterialInfo',
            align: 'left',
            render: (data) => {
                const {
                    materialInfo,
                    fabricCw,
                    fabricCwUom,
                    fabricWeight,
                    fabricWeightUom,
                    materialAfterManufacturingFashion,
                    materialAfterManufacturingFinishing,
                    materialAfterManufacturingDyeing,
                    characteristic,
                    solid_pattern,
                    function: _function,
                    performance,
                    stretch,
                } = data;
                const {
                    type,
                    fabricContents,
                    structure,
                    yarnSizeWrap,
                    yarnSizeWeft,
                    constructionEpi,
                    constructionPpi,
                    shrinkagePlus,
                    shrinkageMinus,
                    usage_type,
                    sus_eco,
                    application,
                } = materialInfo;

                const output = (
                    <Fragment>
                        {type === 'fabric' && (
                            <Fragment>
                                <Ellipsis>
                                    *Composition (%):{' '}
                                    {fabricContents?.map((v) => (
                                        <span key={v.id}>
                                            {v?.contents?.name} {v?.rate}%
                                        </span>
                                    )) || '-'}
                                </Ellipsis>

                                <Ellipsis>
                                    *Construction: {structure || '-'} &{' '}
                                    {yarnSizeWrap || '-'} x{' '}
                                    {yarnSizeWeft || '-'} &{' '}
                                    {constructionEpi || '-'} x{' '}
                                    {constructionPpi || '-'} &{' '}
                                    {shrinkagePlus > 0 && '+'}
                                    {shrinkagePlus || '-'}{' '}
                                    {shrinkageMinus || '-'} &{' '}
                                    {usage_type || '-'} & {sus_eco || '-'} &{' '}
                                    {application || '-'}
                                </Ellipsis>
                            </Fragment>
                        )}
                        <Ellipsis>
                            * Width/Weight:
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
                        {type !== 'accessories' && (
                            <Ellipsis>
                                * Post Processing:{' '}
                                {materialAfterManufacturingFinishing || '-'}
                            </Ellipsis>
                        )}

                        {type === 'fabric' && (
                            <Fragment>
                                <Ellipsis>
                                    *Dyeing:{' '}
                                    {materialAfterManufacturingDyeing || '-'}
                                </Ellipsis>
                                <Ellipsis>
                                    *Printing:{' '}
                                    {materialAfterManufacturingFashion || '-'}
                                </Ellipsis>
                                <Ellipsis>
                                    *Characteristic: {characteristic || '-'}
                                </Ellipsis>
                                <Ellipsis>
                                    *Solid/Pattern: {solid_pattern || '-'}
                                </Ellipsis>
                                <Ellipsis>
                                    *Function: {_function || '-'}
                                </Ellipsis>
                                <Ellipsis>
                                    *Performance: {performance || '-'}
                                </Ellipsis>
                                <Ellipsis>*Stretch: {stretch || '-'}</Ellipsis>
                            </Fragment>
                        )}
                    </Fragment>
                );

                return <Tooltip title={output}>{output}</Tooltip>;
            },
        },
        {
            title: 'Item Color / Size',
            dataIndex: 'mclMaterialInfo',
            align: 'left',
            render: (data, record) => {
                const {
                    fabricColorName,
                    commonActualColor,
                    subsidiarySize,
                    subsidiarySizeUom,
                } = data || {};
                // const { subsidiarySize, subsidiarySizeUom } = record || {};
                const output = (
                    <Fragment>
                        <Ellipsis>
                            *Item Color: {fabricColorName || '-'}
                        </Ellipsis>
                        <Ellipsis>
                            *Actual Color: {commonActualColor?.name1 || '-'}
                        </Ellipsis>
                        <Ellipsis>*Item Size: {subsidiarySize || '-'}</Ellipsis>
                        <Ellipsis>
                            *Item Size UOM: {subsidiarySizeUom?.name3 || '-'}
                        </Ellipsis>
                    </Fragment>
                );

                return <Tooltip title={output}>{output}</Tooltip>;
            },
        },
        {
            title: 'Order Qty',
            dataIndex: 'purchaseQty',
            align: 'right',
            render: (_, record) => {
                const { purchaseQty, orderedAdjUom } = record;
                const value = (
                    <div>
                        {formatNumberUtil(purchaseQty)} {orderedAdjUom?.name3}
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            align: 'right',
            render: (data, record) => {
                const value = (
                    <div>
                        <div>
                            {formatNumberUtil(data)} {record?.currency?.name3}
                        </div>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Amount',
            align: 'right',
            render: (_, record) => {
                const value = (
                    <div>
                        <div>
                            {formatNumberUtil(
                                parseFloat(
                                    record?.purchaseQty * record?.unitPrice
                                )?.toFixed(2) || 0
                            )}{' '}
                            {record?.currency?.name3}
                        </div>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
    ];

    const adhocPurchaseOrderColumns = [
        {
            title: 'No.',
            dataIndex: 'index',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item name and Number',
            align: 'left',
            render: (_, record) => {
                const { materialInfo, materialOffer } = record;
                const { category, type, item_name } = materialInfo || {};
                const { materialNo } = materialOffer || {};

                const value = (
                    <div>
                        <div>
                            *Category: {category?.typeA} /{' '}
                            {category?.typeC
                                ? `${category?.typeB} / ${category?.typeC}`
                                : category?.typeB}
                        </div>
                        <div>
                            *
                            {type?.toLowerCase() === 'fabric'
                                ? 'Fabric name'
                                : 'Item name'}
                            : {item_name || '-'}
                        </div>
                        <div>*Material No.: {materialNo || '-'}</div>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Item Detail Information',
            dataIndex: 'materialInfo',
            align: 'left',
            render: (data, record) => {
                const { materialInfo, materialOffer } = record || {};

                const {
                    type,
                    fabricContents,
                    structure,
                    yarnSizeWrap,
                    yarnSizeWeft,
                    constructionEpi,
                    constructionPpi,
                    shrinkagePlus,
                    shrinkageMinus,
                    usage_type,
                    sus_eco,
                    application,
                } = materialInfo || {};

                const {
                    itemOption,

                    characteristic,
                    solid_pattern,
                    function: _function,
                    performance,
                    stretch,
                } = materialOffer || {};
                const { cw, weight, weightUom, printing, finishing, dyeing } =
                    itemOption || {};

                const output = (
                    <Fragment>
                        {type === 'fabric' && (
                            <Fragment>
                                <Ellipsis>
                                    *Composition (%):{' '}
                                    {fabricContents?.map((v) => (
                                        <span key={v.id}>
                                            {v?.contents?.name} {v?.rate}%
                                        </span>
                                    )) || '-'}
                                </Ellipsis>

                                <Ellipsis>
                                    *Construction: {structure || '-'} &{' '}
                                    {yarnSizeWrap || '-'} x{' '}
                                    {yarnSizeWeft || '-'} &{' '}
                                    {constructionEpi || '-'} x{' '}
                                    {constructionPpi || '-'} &{' '}
                                    {shrinkagePlus > 0 && '+'}
                                    {shrinkagePlus || '-'}{' '}
                                    {shrinkageMinus || '-'} &{' '}
                                    {usage_type || '-'} & {sus_eco || '-'} &{' '}
                                    {application || '-'}
                                </Ellipsis>
                            </Fragment>
                        )}
                        <Ellipsis>
                            * Width/Weight:
                            {cw ? <span>{cw} inch</span> : '-'} /{' '}
                            {weight ? (
                                <span>
                                    {' '}
                                    {weight} {weightUom?.name3 || 'GSM'}
                                </span>
                            ) : (
                                '-'
                            )}
                        </Ellipsis>
                        {type !== 'accessories' && (
                            <Ellipsis>
                                * Post Processing: {finishing || '-'}
                            </Ellipsis>
                        )}

                        {type === 'fabric' && (
                            <Fragment>
                                <Ellipsis>*Dyeing: {dyeing || '-'}</Ellipsis>
                                <Ellipsis>
                                    *Printing: {printing || '-'}
                                </Ellipsis>
                                <Ellipsis>
                                    *Characteristic: {characteristic || '-'}
                                </Ellipsis>
                                <Ellipsis>
                                    *Solid/Pattern: {solid_pattern || '-'}
                                </Ellipsis>
                                <Ellipsis>
                                    *Function: {_function || '-'}
                                </Ellipsis>
                                <Ellipsis>
                                    *Performance: {performance || '-'}
                                </Ellipsis>
                                <Ellipsis>*Stretch: {stretch || '-'}</Ellipsis>
                            </Fragment>
                        )}
                    </Fragment>
                );

                return <Tooltip title={output}>{output}</Tooltip>;
            },
        },
        {
            title: 'Item Color / Size',
            dataIndex: 'materialInfo',
            align: 'left',
            render: (data, record) => {
                const { materialOffer, color, actualColor } = record || {};
                const { itemSizeOption } = materialOffer || {};
                const output = (
                    <Fragment>
                        <Ellipsis>*Item Color: {color || '-'}</Ellipsis>
                        <Ellipsis>
                            *Actual Color: {actualColor?.name1 || '-'}
                        </Ellipsis>
                        <Ellipsis>
                            *Item Size: {itemSizeOption?.size || '-'}
                        </Ellipsis>
                        <Ellipsis>
                            *Item Size UOM:{' '}
                            {itemSizeOption?.sizeUom?.name3 || '-'}
                        </Ellipsis>
                    </Fragment>
                );

                return <Tooltip title={output}>{output}</Tooltip>;
            },
        },
        {
            title: 'Order Qty',
            align: 'right',
            render: (record) => {
                const { orderedQty, orderedUom, orderedAdjUom } = record;
                const value = (
                    <div>
                        {parseInt(
                            handleCalculationResult(
                                orderedQty,
                                orderedUom?.name3,
                                orderedAdjUom?.name3
                            )
                        )}{' '}
                        {orderedAdjUom?.name3}
                    </div>
                );

                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Unit Price',
            align: 'right',
            render: (_, record) => {
                const value = (
                    <div>
                        {formatNumberUtil(record?.unitPrice)}{' '}
                        {poItemDataSource.order?.currency?.name3}
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Amount',
            align: 'right',
            render: (_, record) => {
                const value = (
                    <div>
                        <div>
                            {formatNumberUtil(
                                parseFloat(
                                    record?.orderedQty * record?.unitPrice
                                )?.toFixed(2) || 0
                            )}{' '}
                            {poItemDataSource.order?.currency?.name3}
                        </div>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
    ];

    const mclFooter = (record) => {
        const result = record.reduce((acc, cur) => {
            acc['currency'] = cur.currency;
            acc['orderedAdjUom'] = cur.orderedAdjUom;
            acc['purchaseQty'] = (acc['purchaseQty'] || 0) + cur.purchaseQty;

            acc['amount'] =
                (acc['amount'] || 0) + cur.purchaseQty * cur.unitPrice;
            return acc;
        }, {});
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <div>
                    <div className="title">
                        Order Qty: {formatNumberUtil(result.purchaseQty)}{' '}
                        {result?.orderedAdjUom?.name3}
                    </div>
                    <div className="title">
                        Amount: {formatNumberUtil(result.amount)}{' '}
                        {result?.currency?.name3}
                    </div>
                </div>
            </div>
        );
    };

    const adhocFooter = (record) => {
        const result = record.reduce((acc, cur) => {
            acc['currency'] = poItemDataSource?.order?.currency;
            acc['orderedUom'] = cur.orderedUom;
            acc['orderedQty'] = (acc['orderedQty'] || 0) + cur.orderedQty;

            acc['amount'] =
                (acc['amount'] || 0) + cur.orderedQty * cur.unitPrice;
            return acc;
        }, {});
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <div>
                    <div className="title">
                        Order Qty: {formatNumberUtil(result.orderedQty)}{' '}
                        {result?.orderedUom?.name3}
                    </div>
                    <div className="title">
                        Amount: {formatNumberUtil(result.amount)}{' '}
                        {result?.currency?.name3}
                    </div>
                </div>
            </div>
        );
    };

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    MATERIAL PURCHASE ORDER LIST
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
                    />
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Selected confirm',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => handleExcute('confirm')}
                    >
                        CONFIRM
                    </TableButton>

                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Delete selected item',
                            arrowPointAtCenter: true,
                        }}
                        mode="cancel"
                        size="small"
                        onClick={() => handleExcute('revert')}
                    >
                        REVERT
                    </TableButton>
                </Space>
            </div>
        </div>
    );

    const onRow = (record, rowIndex) => {
        return {
            onClick: () => {
                const { publishOrderId, poType } = record;
                return setVisibleModal({
                    id: publishOrderId,
                    status: true,
                    poType: poType,
                });
            },
        };
    };

    return (
        <PoDocumentationWrap>
            <div id="poDocumentationWrap">
                <Modal
                    title={
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button
                                type="primary"
                                onClick={() => modalRef.current.save()}
                            >
                                Generate Pdf
                            </Button>
                        </div>
                    }
                    centered
                    closable={false}
                    wrapClassName="modalWrap"
                    visible={visibleModal.status}
                    onOk={() =>
                        setVisibleModal((visibleModal) => ({
                            // ...visibleModal,
                            status: false,
                        }))
                    }
                    onCancel={() =>
                        setVisibleModal((visibleModal) => ({
                            // ...visibleModal,
                            status: false,
                        }))
                    }
                    width="90%"
                >
                    <PDFExport
                        landscape={true}
                        paperSize="A4"
                        scale={0.6}
                        margin="1cm"
                        ref={modalRef}
                        fileName={poItemDataSource?.order?.poNumber}
                    >
                        <ModalBodyWrap ref={modalRef}>
                            <div
                                className="titleWrap"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '.5rem',
                                }}
                            >
                                <div className="title">PURCHASE ORDER</div>

                                <div>
                                    <div className="title">
                                        Purchase Order No.:{' '}
                                        <span className="text">
                                            {poItemDataSource?.order?.poNumber}
                                        </span>
                                    </div>
                                    <div className="title">
                                        Purchase Order Issued Date:{' '}
                                        <span className="text">
                                            {poItemDataSource?.order?.updated}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <Row gutter={[10, 10]}>
                                    <Col span={8}>
                                        <div className="box">
                                            <div className="title">
                                                PO Issued Company
                                            </div>
                                            <div className="title">
                                                {
                                                    poItemDataSource?.order
                                                        ?.purchaser?.companyName
                                                }
                                            </div>
                                            <div className="text">
                                                {
                                                    poItemDataSource?.order
                                                        ?.purchaser?.address
                                                        ?.etc
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className="box">
                                            <div className="title">
                                                Supplier Company
                                            </div>
                                            <div className="title">
                                                {
                                                    poItemDataSource?.order
                                                        ?.supplier?.companyName
                                                }
                                            </div>
                                            <div className="text">
                                                {
                                                    poItemDataSource?.order
                                                        ?.supplier?.address?.etc
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className="box">
                                            <div className="title">
                                                Shipper Company
                                            </div>
                                            <div className="title">
                                                {
                                                    poItemDataSource?.order
                                                        ?.shipper?.companyName
                                                }
                                            </div>
                                            <div className="text">
                                                {
                                                    poItemDataSource?.order
                                                        ?.shipper?.address?.etc
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <Row gutter={[10, 10]}>
                                    <Col span={8}>
                                        <Row>
                                            <Col span={12}>
                                                <div className="title">
                                                    Country of Origin
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="text">
                                                    {
                                                        poItemDataSource?.order
                                                            ?.loadingBasicCountry
                                                            ?.name1
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <div className="title">
                                                    Port of Loading(POL)
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="text">
                                                    {
                                                        poItemDataSource?.order
                                                            ?.loadingPort?.name1
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={8}>
                                        <Row>
                                            <Col span={12}>
                                                <div className="title">
                                                    Country of Destination
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="text">
                                                    {
                                                        poItemDataSource?.order
                                                            ?.dischargeBasicCountry
                                                            ?.name1
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <div className="title">
                                                    Port of Discharge(POD)
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="text">
                                                    {
                                                        poItemDataSource?.order
                                                            ?.dischargePort
                                                            ?.name1
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={8}>
                                        <Row>
                                            <Col span={12}>
                                                <div className="title">
                                                    Ship Date(YYYY-MM-DD)
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="text">
                                                    {dateFormat(
                                                        poItemDataSource?.order
                                                            ?.estimatedDate
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <div className="title">
                                                    In House Date(YYYY-MM-DD)
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="text">
                                                    {dateFormat(
                                                        poItemDataSource?.order
                                                            ?.infactoryDate
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row gutter={[10, 10]}>
                                    <Col span={8}>
                                        <Row>
                                            <Col span={12}>
                                                <div className="title">
                                                    Terms of Delivery
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="text">
                                                    {
                                                        poItemDataSource?.order
                                                            ?.incoterms?.name3
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <div className="title">
                                                    Mode if Shipment
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="text">
                                                    {
                                                        poItemDataSource?.order
                                                            ?.shippingMethod
                                                            ?.name1
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={8}>
                                        <Row>
                                            <Col span={12}>
                                                <div className="title">
                                                    Terms of Payment
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="text">
                                                    {
                                                        poItemDataSource?.order
                                                            ?.paymentTerm?.name1
                                                    }
                                                    {
                                                        poItemDataSource?.order
                                                            ?.paymentPeriod
                                                            ?.name1
                                                    }
                                                    days
                                                    {
                                                        poItemDataSource?.order
                                                            ?.paymentBase?.name1
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <div className="title">
                                                    Currency
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="text">
                                                    {
                                                        poItemDataSource?.order
                                                            ?.currency?.name2
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>

                            {visibleModal?.poType === 'mcl' && (
                                <CustomTable
                                    title={() => (
                                        <div className="titleWrap">
                                            <div className="title">
                                                <Space>
                                                    <CaretRightOutlined />
                                                    Item Details
                                                </Space>
                                            </div>
                                        </div>
                                    )}
                                    footer={(record) => mclFooter(record)}
                                    rowKey="index"
                                    initialColumns={mclPurchaseOrderColumns}
                                    dataSource={poItemDataSource?.itemDetail}
                                    rowSelection={false}
                                    pagination={false}
                                    // loading={mclPoGetItemId.isLoading}
                                />
                            )}
                            {visibleModal?.poType === 'adhoc' && (
                                <CustomTable
                                    title={() => (
                                        <div className="titleWrap">
                                            <div className="title">
                                                <Space>
                                                    <CaretRightOutlined />
                                                    Item Details
                                                </Space>
                                            </div>
                                        </div>
                                    )}
                                    footer={(record) => adhocFooter(record)}
                                    rowKey="index"
                                    initialColumns={adhocPurchaseOrderColumns}
                                    dataSource={poItemDataSource?.itemDetail}
                                    rowSelection={false}
                                    pagination={false}
                                    // loading={mclPoGetItemId.isLoading}
                                />
                            )}
                        </ModalBodyWrap>
                    </PDFExport>
                </Modal>
                <Modal
                    title={<div>MEMO</div>}
                    centered
                    closable={false}
                    visible={visibleRevertModal.status}
                    onOk={() => {
                        if (visibleRevertModal.type === 'revert') {
                            // visibleRevertModal.data안에  poConfirm, publishedOrderId가 존재하고
                            // 추가로 revertMemo를 넣어서 요청한다
                            handleSupplierOrderPost([
                                {
                                    ...visibleRevertModal.data,
                                    revertMemo:
                                        revertMemo?.[visibleRevertModal?.id],
                                },
                            ]);
                        }
                        return setVisibleRevertModal(() => ({
                            status: false,
                        }));
                    }}
                    onCancel={() =>
                        setVisibleRevertModal(() => ({
                            status: false,
                        }))
                    }
                >
                    {visibleRevertModal.type === 'read' ? (
                        revertMemo?.[visibleRevertModal?.id]
                    ) : (
                        <Input.TextArea
                            value={revertMemo?.[visibleRevertModal?.id]}
                            onChange={(e) => {
                                e.persist();
                                return setRevertMemo((revertMemo) => ({
                                    ...revertMemo,
                                    [visibleRevertModal?.id]: e.target.value,
                                }));
                            }}
                        />
                    )}
                </Modal>
                <CustomTable
                    ref={tableRef}
                    title={() => title('rmPo')}
                    rowKey="id"
                    initialColumns={columns}
                    dataSource={dataSource}
                    rowSelection={true}
                    rowSelectionType="radio"
                    loading={isLoading}
                    onRow={onRow}
                    pagination={{ ...pagination, total }}
                    onChange={setPagination}
                    onGetCheckboxProps={(record) => {
                        // const { status } = record.order;
                        // return {
                        //     disabled:
                        //         status.toLowerCase() === 'revised' ||
                        //         status.toLowerCase() === 'canceled',
                        // };
                    }}
                />
            </div>
        </PoDocumentationWrap>
    );
};

const PoDocumentationWrap = styled.div`
    height: 100%;
    overflow: auto;
    padding: 1rem;

    #poDocumentationWrap {
        min-width: 500px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;

        .titleWrap {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            .title {
                ${(props) => props.theme.fonts.h7};
            }
        }

        .ant-space-item
            .ant-select.ant-select-borderless.ant-select-single.ant-select-show-arrow.ant-select-show-search {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            height: 24px;
            ${(props) => props.theme.fonts.h5};
        }

        .ant-space-item
            .ant-input-affix-wrapper.ant-input-affix-wrapper-sm.ant-input-affix-wrapper-borderless {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
        }

        .ant-space-item
            .ant-input-affix-wrapper.ant-input-affix-wrapper-sm.ant-input-affix-wrapper-borderless
            input {
            ${(props) => props.theme.fonts.h5};
        }
    }
`;

const ModalBodyWrap = styled.div`
    table=layout: fixed;
    border-collapse: collapse;
    margin-bottom: 1rem;
    .title {
        margin-top: 0;
        ${({ theme }) => theme.fonts.h6};
    }
    .text {
        ${({ theme }) => theme.fonts.display_1};
    }
    .box {
        height: 100%;
        padding: 1rem;
        border: 1px solid rgba(0, 0, 0, 0.5);
    }

    // table.dependencyTable {
    //     width: 100%;
    //     tr th {
    //         padding: 6px;
    //         color: #000000;
    //         text-align: center;
    //         background-color: #b3d5d6;
    //         border-top: 1px solid #000000;
    //         border-bottom: 1px solid #000000;
    //     }
    //     tr {
    //         background-color: #ffffff;
    //     }
    //     tr td {
    //         padding: 6px;
    //         text-align: center;
    //         border: 1px dotted lightgray;
    //         ${(props) => props.theme.fonts.h5};
    //         &.market {
    //             color: #000000;
    //             background-color: #b3d5d6;
    //         }
    //     }
    //     tr.total,
    //     tr.total {
    //         ${(props) => props.theme.fonts.h6};
    //         background-color: #d0dbf0;
    //         border-top: 1px solid #000000;
    //         border-bottom: 1px solid #000000;
    //     }

    //     .ant-input {
    //         border-bottom: 1px solid lightgray;
    //         border-radius: 0px;
    //         ${(props) => props.theme.fonts.h5};
    //     }
    // }
`;

export default PoDocumentation;
