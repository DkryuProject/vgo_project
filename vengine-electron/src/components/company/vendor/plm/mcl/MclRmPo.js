import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import useGtag from 'core/hook/useGtag';
import {
    mclPoGetPagesAsyncAction,
    mclPoPutCanceledAsyncAction,
    mclPoGetIdAsyncAction,
    mclPoGetItemIdAsyncAction,
    mclPoPostEmailAsyncAction,
} from 'store/mcl/po/reducer';
import styled from 'styled-components';
import * as confirm from 'components/common/confirm';
import { Tooltip } from 'components/common/tooltip';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { FilterSelect } from 'components/common/select';
import { PDFExport } from '@progress/kendo-react-pdf';
import { Space, Input, Modal, Button, Row, Col, Form, Select } from 'antd';
import {
    CaretRightOutlined,
    SearchOutlined,
    WechatOutlined,
} from '@ant-design/icons';
import dateFormat from 'core/utils/dateUtil';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import { regExpTestUtil } from 'core/utils/regExpUtil';
import { Fragment } from 'react';
import { Ellipsis } from 'components/UI/atoms';

// 테이블
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const MclRmPo = (props) => {
    const { match, initialShow, onShow, onRightSplit, onLeftSplit } = props;
    const { mclOptionId } = match.params || '';
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [handleValidateMessage] = useValidateMessage();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
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
    const [visibleModal, setVisibleModal] = useState({
        type: null,
        id: null,
        status: false,
    });
    const [visibleRevertModal, setVisibleRevertModal] = useState({
        id: null,
        status: false,
        type: 'read',
    });
    const [emailModal, setEmailModal] = useState({
        id: null,
        status: false,
    });
    const [poItemDataSource, setPoItemDataSource] = useState(null);
    const [revertMemo, setRevertMemo] = useState(null);
    const status = useMemo(
        () => [
            { id: '', name: 'All' },
            { id: 'Published', name: 'Published' },
            { id: 'Draft', name: 'Draft' },
            { id: 'Revised', name: 'Revised' },
            { id: 'Canceled', name: 'Canceled' },
        ],
        []
    );

    const [total, setTotal] = useState(0);

    const mclPoGetPages = useSelector((state) => state.mclPoReducer.get.pages);
    const handleMclPoGetPages = useCallback(
        (payload) => dispatch(mclPoGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const mclPoPutCanceled = useSelector(
        (state) => state.mclPoReducer.put.canceled
    );
    const handleMclPoPutCanceled = useCallback(
        (payload) => dispatch(mclPoPutCanceledAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPoPutCanceledInit = useCallback(
        () => dispatch(mclPoPutCanceledAsyncAction.initial()),
        [dispatch]
    );

    const mclPoGetId = useSelector((state) => state.mclPoReducer.get.id);
    const handleMclPoGetId = useCallback(
        (payload) => dispatch(mclPoGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    // const handleMclPoGetIdInit = useCallback(
    //     () => dispatch(mclPoGetIdAsyncAction.initial()),
    //     [dispatch]
    // );

    const mclPoGetItemId = useSelector(
        (state) => state.mclPoReducer.get.itemId
    );
    const handleMclPoGetItemId = useCallback(
        (payload) => dispatch(mclPoGetItemIdAsyncAction.request(payload)),
        [dispatch]
    );
    // const handleMclPoGetItemIdInit = useCallback(
    //     () => dispatch(mclPoGetItemIdAsyncAction.initial()),
    //     [dispatch]
    // );

    const mclPoPostEmail = useSelector(
        (state) => state.mclPoReducer.post.email
    );
    const handleMclPoPostEmail = useCallback(
        (payload) => dispatch(mclPoPostEmailAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPoPostEmailInit = useCallback(
        () => dispatch(mclPoPostEmailAsyncAction.initial()),
        [dispatch]
    );

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows, selectedRowKeys } = tableRef.current;

            if (selectedRows.length === 0) {
                return confirm.warningConfirm('No item is selected');
            }
            if (type === 'email') {
                if (
                    selectedRowKeys.length === 0 ||
                    selectedRowKeys.length >= 2
                ) {
                    return handleNotification({
                        type: 'error',
                        message: 'Error',
                        description: 'Please select only one',
                    });
                } else if (
                    selectedRows[0].order.status.toLowerCase() !==
                        'published' &&
                    selectedRows[0].order.status.toLowerCase() !== 'confirm'
                ) {
                    return handleNotification({
                        type: 'error',
                        message: 'Error',
                        description:
                            'Only available in published state & confirm state',
                    });
                }
                return setEmailModal((emailModal) => ({
                    ...emailModal,
                    id: Number(selectedRowKeys),
                    status: true,
                }));
            } else if (type === 're-publish') {
                if (
                    selectedRowKeys.length === 0 ||
                    selectedRowKeys.length >= 2
                ) {
                    return handleNotification({
                        type: 'error',
                        message: 'Error',
                        description: 'Please select only one',
                    });
                }

                // status가 Published & revert 상태에서만 가능한 조건
                if (
                    selectedRows[0].order.status.toLowerCase() !==
                        'published' &&
                    selectedRows[0].order.status.toLowerCase() !== 'revert'
                ) {
                    return handleNotification({
                        type: 'error',
                        message: 'Error',
                        description:
                            'Only available in published state & revert state',
                    });
                }

                confirm.warningConfirm('Do you want to re-publish?', (e) => {
                    if (e) {
                        onRightSplit();
                        return onShow({
                            ...initialShow,
                            rmPo: {
                                type: 're-publish',
                                status: true,
                                id: selectedRowKeys[0],
                            },
                        });
                    }
                });
            } else if (type === 'delete') {
                confirm.deleteConfirm((e) => {
                    if (e) {
                        return handleMclPoPutCanceled(selectedRowKeys);
                    }
                });
            }
        },
        [
            tableRef,
            initialShow,
            onShow,
            onRightSplit,
            handleNotification,
            handleMclPoPutCanceled,
        ]
    );

    const handleSubmit = useCallback(
        (values) => {
            const regExp =
                /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
            if (values['emails'].some((v) => v.match(regExp) === null)) {
                return handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'Please check your email format',
                });
            }
            return handleMclPoPostEmail({
                id: emailModal?.id,
                data: values?.emails,
            });
        },
        [emailModal, handleNotification, handleMclPoPostEmail]
    );

    // 조회
    useEffect(() => {
        handleMclPoGetPages({ id: mclOptionId, data: pagination });
    }, [pagination, mclOptionId, handleMclPoGetPages]);

    useEffect(() => {
        setIsLoading(mclPoGetPages.isLoading);
        if (mclPoGetPages.data) {
            const { content, totalElements } = mclPoGetPages.data.page;
            const newContent = content.map((v) => ({
                ...v,
                id: v.order.orderID,
            }));
            setDataSource(newContent);
            setTotal(totalElements);
            setRevertMemo(
                newContent.reduce((acc, cur) => {
                    acc[cur.id] = cur.order.revertMemo || '';
                    return acc;
                }, {})
            );
        }
    }, [mclPoGetPages, setIsLoading, setDataSource]);

    // 취소
    useEffect(() => {
        if (mclPoPutCanceled.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPoPutCanceled.error.message,
            });
        } else if (mclPoPutCanceled.data) {
            handleMclPoGetPages({ id: mclOptionId, data: pagination });
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'MCL RM PO Cancellation Success',
            });
        }
        return () => handleMclPoPutCanceledInit();
    }, [
        mclPoPutCanceled,
        mclOptionId,
        pagination,
        handleMclPoPutCanceledInit,
        handleNotification,
        handleMclPoGetPages,
    ]);

    // item 모달 조회
    useEffect(() => {
        if (visibleModal.id && visibleModal.status) {
            handleMclPoGetId(visibleModal.id);
            handleMclPoGetItemId(visibleModal.id);
            trackPageView({
                page_title: `${visibleModal?.type?.toUpperCase()} | RM PO DETAIL | MCL OPTION DETAIL | DESIGN COVER | PLM   `,
            });
        }
    }, [visibleModal, handleMclPoGetId, handleMclPoGetItemId, trackPageView]);

    useEffect(() => {
        if (mclPoGetId.data && mclPoGetItemId.data) {
            const { orderItemList } = mclPoGetItemId.data.data;

            // rm po publish 작업에서 sample order가 있어서 아이템 재배열
            let count = 0;
            const newOrderItemList = orderItemList.reduce((acc, cur) => {
                count += 1;
                acc.push({ ...cur, index: count });
                if (visibleModal?.type === 'po' && cur.sampleOrder) {
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
            setPoItemDataSource(newOrderItemList);
            return () => {
                count = 0;
                setPoItemDataSource(null);
            };
        }
    }, [mclPoGetId, mclPoGetItemId, setPoItemDataSource, visibleModal]);

    useEffect(() => {
        if (mclPoPostEmail.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPoPostEmail.error.message,
            });
        } else if (mclPoPostEmail.data) {
            setEmailModal((emailModal) => ({ ...emailModal, status: false }));
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Email Send Success',
            });
        }
    }, [mclPoPostEmail, setEmailModal, handleNotification]);

    useEffect(() => {
        if (emailModal?.status === false) {
            handleMclPoPostEmailInit();
        }
    }, [emailModal, handleMclPoPostEmailInit]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `RM PO LISTS | MCL OPTION DETAIL | DESIGN COVER | PLM  `,
        });
    }, [trackPageView]);

    // 테이블
    const columns = [
        {
            title: 'Purchase Order#',
            dataIndex: 'order',
            align: 'left',
            render: (data) => {
                const status =
                    data?.status?.toLowerCase() === 'revised' ||
                    data?.status?.toLowerCase() === 'canceled';

                return (
                    <Tooltip title={data?.poNumber} status={status}>
                        {data?.poNumber}
                    </Tooltip>
                );
            },
        },
        {
            title: 'Supplier / Ship to Company',
            align: 'left',
            render: (_, record) => {
                const status =
                    record?.order?.status?.toLowerCase() === 'revised' ||
                    record?.order?.status?.toLowerCase() === 'canceled';
                const value = (
                    <div>
                        <div>
                            Supplier: {record?.order?.supplier?.companyName}
                        </div>
                        {/* <div>
                            Ship to: {record?.order?.shipper?.companyName}{' '}
                        </div> */}
                    </div>
                );
                return (
                    <Tooltip title={value} status={status}>
                        {value}
                    </Tooltip>
                );
            },
        },
        {
            title: 'Shipping Information',
            dataIndex: 'order',
            align: 'left',
            render: (data) => {
                const status =
                    data?.status?.toLowerCase() === 'revised' ||
                    data?.status?.toLowerCase() === 'canceled';

                const {
                    loadingPort,
                    loadingBasicCountry,
                    dischargePort,
                    dischargeBasicCountry,
                    shippingMethod,
                    incoterms,
                } = data;

                const value = (
                    <div>
                        <div>
                            POL: {loadingPort?.name1},{' '}
                            {loadingBasicCountry?.name1}(
                            {loadingBasicCountry?.name3}){' '}
                        </div>
                        <div>
                            POD: {dischargePort?.name1},{' '}
                            {dischargeBasicCountry?.name1}(
                            {dischargeBasicCountry?.name3})
                        </div>
                        <div>Ship Mode: {shippingMethod?.name1}</div>
                        <div>incoterms: {incoterms?.name2}</div>
                    </div>
                );
                return (
                    <Tooltip title={value} status={status}>
                        {value}
                    </Tooltip>
                );
            },
        },
        {
            title: 'Order Qty / Amount',
            align: 'left',
            render: (_, record) => {
                const { itemQty, totalPoAmt, order } = record;
                const status =
                    order?.status?.toLowerCase() === 'revised' ||
                    order?.status?.toLowerCase() === 'canceled';
                const value = (
                    <div>
                        <div>Item Qty: {formatNumberUtil(itemQty)} ea</div>
                        {/* <div>Total Order Qty: {totalPoQty}</div> */}
                        <div>
                            Total Amount: {order.currency.name3}{' '}
                            {formatNumberUtil(totalPoAmt)}
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
        {
            title: 'Buyer Information',
            align: 'left',
            render: (_, record) => {
                const { styleNumbers, order } = record;
                const { buyer, brand, designNumber } = order;
                const status =
                    order?.status?.toLowerCase() === 'revised' ||
                    order?.status?.toLowerCase() === 'canceled';
                const value = (
                    <div>
                        <div>Buyer: {buyer?.companyName}</div>
                        <div>Brand: {brand?.companyName}</div>
                        <div>Design#: {designNumber}</div>
                        <div>Style#: {styleNumbers.join(',')}</div>
                    </div>
                );
                return (
                    <Tooltip title={value} status={status}>
                        {value}
                    </Tooltip>
                );
            },
        },
        {
            title: 'Date Information',
            align: 'left',
            render: (_, record) => {
                const { estimatedDate, infactoryDate } = record.order;
                const status =
                    record?.order?.status?.toLowerCase() === 'revised' ||
                    record?.order?.status?.toLowerCase() === 'canceled';
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
        {
            title: 'Modified',
            dataIndex: 'order',
            align: 'left',
            render: (data, record) => {
                const { emailSendDate } = record;
                const value = (
                    <div>
                        <div>Last Modified: {dateFormat(data?.updated)}</div>
                        <div>
                            Email sent:{' '}
                            {emailSendDate && dateFormat(emailSendDate)}
                        </div>
                    </div>
                );
                const status =
                    data?.status?.toLowerCase() === 'revised' ||
                    data?.status?.toLowerCase() === 'canceled';
                return (
                    <Tooltip title={value} status={status}>
                        {value}
                    </Tooltip>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'order',
            align: 'left',
            render: (data, record) => {
                const status =
                    data?.status?.toLowerCase() === 'revised' ||
                    data?.status?.toLowerCase() === 'canceled';
                return (
                    <span>
                        {
                            <Tooltip title={data?.status} status={status}>
                                {data?.status}
                            </Tooltip>
                        }
                        {data?.status?.toLowerCase() === 'revert' && (
                            <WechatOutlined
                                style={{
                                    marginLeft: '.5rem',
                                    fontSize: '2rem',
                                    color: '#068475',
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
        {
            title: '',
            dataIndex: 'order',
            render: (data, record) => {
                return (
                    <span>
                        {(data?.status?.toLowerCase() === 'confirm' ||
                            data?.status?.toLowerCase() === 'published') && (
                            <TableButton
                                toolTip={{
                                    placement: 'topRight',
                                    title: 'Dependency',
                                    arrowPointAtCenter: true,
                                }}
                                mode="search"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const { id } = record;

                                    return setVisibleModal({
                                        type: 'dependency',
                                        id: id,
                                        status: true,
                                    });
                                }}
                            >
                                Dependency
                            </TableButton>
                        )}
                    </span>
                );
            },
        },
    ];

    const purchaseOrderColumns = [
        {
            title: 'No.',
            dataIndex: 'index',
            width: '3%',
            render: (data) => {
                return <Tooltip title={data}>{data}</Tooltip>;
            },
        },
        {
            title: 'Buyer Information',
            dataIndex: 'mclMaterialInfo',
            align: 'left',
            width: '10%',
            render: (_, record) => {
                const {
                    mclMaterialInfo,
                    styleNumbers,
                    brand,
                    season,
                    seasonYear,
                    designNumber,
                } = record || {};
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
                        <div>*Design No.: {designNumber || '-'}</div>
                    </div>
                );

                return value;
            },
        },
        {
            title: 'Item name and Number',
            align: 'left',
            width: '10%',
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
                return value;
            },
        },
        {
            title: 'Item Detail Information',
            dataIndex: 'mclMaterialInfo',
            align: 'left',
            width: '35%',

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
                                <div>
                                    *Composition (%):{' '}
                                    {fabricContents?.map((v) => (
                                        <span key={v.id}>
                                            {v?.contents?.name} {v?.rate}%
                                        </span>
                                    )) || '-'}
                                </div>

                                <div>
                                    *Construction:
                                    <div>
                                        {structure || '-'} &{' '}
                                        {yarnSizeWrap || '-'} x{' '}
                                        {yarnSizeWeft || '-'} &{' '}
                                        {constructionEpi || '-'} x{' '}
                                        {constructionPpi || '-'} &{' '}
                                    </div>
                                    <div>
                                        {shrinkagePlus > 0 && '+'}
                                        {shrinkagePlus || '-'}{' '}
                                        {shrinkageMinus || '-'} &{' '}
                                        {usage_type || '-'} & {sus_eco || '-'} &{' '}
                                        {application || '-'}
                                    </div>
                                </div>
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

                return output;
            },
        },
        {
            title: 'Item Color / Size',
            dataIndex: 'mclMaterialInfo',
            align: 'left',
            width: '10%',
            render: (data, record) => {
                const { fabricColorName, commonActualColor } = data || {};
                const { subsidiarySize, subsidiarySizeUom } = record || {};
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

                return output;
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
                return value;
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
                            {record?.currency?.name3} {formatNumberUtil(data)}
                        </div>
                    </div>
                );
                return value;
            },
        },
        {
            title: 'Amount',
            align: 'right',
            render: (_, record) => {
                const value = (
                    <div>
                        <div>
                            {record?.currency?.name3}{' '}
                            {formatNumberUtil(
                                parseFloat(
                                    record?.purchaseQty * record?.unitPrice
                                )?.toFixed(2) || 0
                            )}
                        </div>
                    </div>
                );
                return value;
            },
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            render: (data) => <div>{data?.name}</div>,
        },
    ];

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
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Selected Email Notice',
                            arrowPointAtCenter: true,
                        }}
                        size="small"
                        onClick={() => handleExcute('email')}
                    >
                        EMAIL NOTICE
                    </TableButton>

                    {FilterSelect({
                        _key: 'id',
                        _value: 'id',
                        text: 'name',
                        placeholder: `Select Status`,
                        data: { data: { list: status } },
                        onChange: (v) =>
                            setPagination({
                                ...pagination,
                                status: v,
                            }),
                        size: 'small',
                    })}
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
                            placement: 'topLeft',
                            title: 'Selected re-publish',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => handleExcute('re-publish')}
                    >
                        RE-PUBLISH
                    </TableButton>

                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Delete selected item',
                            arrowPointAtCenter: true,
                        }}
                        mode="cancel"
                        size="small"
                        onClick={() => handleExcute('delete')}
                    >
                        CANCEL
                    </TableButton>
                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: ' Create',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => {
                            onRightSplit();
                            onShow({
                                ...initialShow,
                                [type]: {
                                    id: null,
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
                const { id } = record;
                if (
                    record.order?.status.toLowerCase() === 'published' ||
                    record.order?.status.toLowerCase() === 'confirm'
                ) {
                    return setVisibleModal({
                        type: 'po',
                        id: id,
                        status: true,
                    });
                } else if (record.order?.status.toLowerCase() === 'draft') {
                    onRightSplit();
                    return onShow({
                        ...initialShow,
                        rmPo: {
                            status: true,
                            id: id,
                        },
                    });
                } else {
                    onLeftSplit();
                    return onShow({
                        ...initialShow,
                        rmPo: {
                            status: false,
                        },
                    });
                }
            },
        };
    };

    const expandable = {
        expandedRowRender: (record) => {
            const { dependencyItemList } = record;
            let totalQty = 0;
            const colorGroup = dependencyItemList.reduce((acc, cur) => {
                const _garmentColor = regExpTestUtil(cur?.color?.garmentColor);
                if (_garmentColor in acc) {
                    acc[_garmentColor] = {
                        length: acc[_garmentColor].length + 1,
                        orderQty:
                            acc[_garmentColor].orderQty + cur?.purchaseQty,
                    };
                } else {
                    acc[_garmentColor] = {
                        length: 1,
                        orderQty: cur?.purchaseQty,
                    };
                }

                return acc;
            }, {});

            return (
                <table className="dependencyTable">
                    <thead>
                        <tr>
                            <th>Market</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Order Qty</th>
                        </tr>
                    </thead>
                    {dependencyItemList.map((v, i) => {
                        totalQty += v?.purchaseQty;
                        return (
                            <tbody key={i}>
                                <tr>
                                    <td>{v?.market?.garmentMarket?.name}</td>
                                    <td>{v?.color?.garmentColor}</td>
                                    <td>{v?.size?.garmentSize?.name}</td>
                                    <td>
                                        {formatNumberUtil(v?.purchaseQty)}{' '}
                                        {v?.orderedUom?.name3}
                                    </td>
                                </tr>

                                {!(
                                    (i + 1) %
                                    colorGroup[
                                        regExpTestUtil(v?.color?.garmentColor)
                                    ]?.length
                                ) && (
                                    <tr className="total">
                                        <td>Sub Total</td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            {formatNumberUtil(
                                                colorGroup[
                                                    regExpTestUtil(
                                                        v?.color?.garmentColor
                                                    )
                                                ]?.orderQty
                                            )}{' '}
                                            {v?.orderedUom?.name3}
                                        </td>
                                    </tr>
                                )}
                                {i + 1 === dependencyItemList?.length && (
                                    <tr className="total">
                                        <td>Grand Total</td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            {formatNumberUtil(totalQty)}{' '}
                                            {v?.orderedUom?.name3}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        );
                    })}
                </table>
            );
        },
    };

    return (
        <MclRmPoWrap>
            <div id="mclRmPoWrap">
                <Modal
                    title={<div>EMAIL NOTICE</div>}
                    centered
                    closable={false}
                    wrapClassName="modalWrap"
                    visible={emailModal.status}
                    onOk={
                        () => form.submit()
                        // setEmailModal((emailModal) => ({
                        //     ...emailModal,
                        //     status: false,
                        // }))
                    }
                    onCancel={() =>
                        setEmailModal((emailModal) => ({
                            ...emailModal,
                            status: false,
                        }))
                    }
                    width="50%"
                >
                    <Form
                        {...layout}
                        form={form}
                        onFinish={handleSubmit}
                        validateMessages={handleValidateMessage}
                    >
                        <Form.Item
                            label="Receiver Email"
                            name="emails"
                            rules={[{ required: true }]}
                        >
                            <Select
                                mode="tags"
                                open={false}
                                style={{ width: '100%' }}
                                bordered={false}
                                placeholder="Please enter your email"
                            />
                        </Form.Item>
                        {/* 
                        <Form.Item
                            label="Remark"
                            name="remark"
                        >
                            <Input.TextArea></Input.TextArea>
                        </Form.Item> */}
                    </Form>
                </Modal>
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
                            ...visibleModal,
                            status: false,
                        }))
                    }
                    onCancel={() =>
                        setVisibleModal((visibleModal) => ({
                            ...visibleModal,
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
                        fileName={mclPoGetId.data?.data?.poNumber}
                    >
                        <ModalBodyWrap>
                            <div
                                className="titleWrap"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '.5rem',
                                }}
                            >
                                <div
                                    className="title"
                                    style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                    }}
                                >
                                    {visibleModal?.type === 'po'
                                        ? 'PURCHASE ORDER'
                                        : 'Dependency Item Detail'}
                                </div>

                                {visibleModal?.type === 'po' && (
                                    <div>
                                        <div className="title">
                                            PO No.:{' '}
                                            <span className="text">
                                                {mclPoGetId.data?.data.poNumber}
                                            </span>
                                        </div>
                                        <div className="title">
                                            PO Issued Date:{' '}
                                            <span className="text">
                                                {dateFormat(
                                                    mclPoGetId.data?.data
                                                        .updated,
                                                    'dateOfBirth'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {visibleModal?.type === 'po' && (
                                <>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <Row gutter={[10, 10]}>
                                            <Col span={12}>
                                                <div className="box">
                                                    <div className="title">
                                                        PO Issued Company
                                                    </div>
                                                    <div className="title">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.purchaser
                                                                .companyName
                                                        }
                                                    </div>

                                                    <div
                                                        className="text "
                                                        id="jungda"
                                                        // style={{
                                                        //     fontFamily:
                                                        //         'Verdana',
                                                        // }}
                                                    >
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.purchaser
                                                                .address?.etc
                                                        }
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="box">
                                                    <div className="title">
                                                        Supplier Company
                                                    </div>
                                                    <div className="title">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.supplier
                                                                .companyName
                                                        }
                                                    </div>
                                                    <div className="text">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.supplier
                                                                .address?.etc
                                                        }
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <Row gutter={10}>
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
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    .loadingBasicCountry
                                                                    .name1
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
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    .loadingPort
                                                                    .name1
                                                            }
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col span={8}>
                                                <Row>
                                                    <Col span={12}>
                                                        <div className="title">
                                                            Country of
                                                            Destination
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="text">
                                                            {
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    .dischargeBasicCountry
                                                                    .name1
                                                            }
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12}>
                                                        <div className="title">
                                                            Port of
                                                            Discharge(POD)
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="text">
                                                            {
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    .dischargePort
                                                                    .name1
                                                            }
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col span={8}>
                                                <Row>
                                                    <Col span={12}>
                                                        <div className="title">
                                                            Ship
                                                            Date(YYYY-MM-DD)
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="text">
                                                            {dateFormat(
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    .estimatedDate,
                                                                'dateOfBirth'
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12}>
                                                        <div className="title">
                                                            In House
                                                            Date(YYYY-MM-DD)
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="text">
                                                            {dateFormat(
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    .infactoryDate,
                                                                'dateOfBirth'
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12}>
                                                        <div className="title">
                                                            Ex-Mill
                                                            Date(YYYY-MM-DD)
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="text">
                                                            {mclPoGetId.data
                                                                ?.data?.exMill
                                                                ? dateFormat(
                                                                      mclPoGetId
                                                                          .data
                                                                          ?.data
                                                                          ?.exMill,
                                                                      'dateOfBirth'
                                                                  )
                                                                : '-'}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>

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
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    .incoterms
                                                                    .name3
                                                            }
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12}>
                                                        <div className="title">
                                                            Ship Mode
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="text">
                                                            {
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    .shippingMethod
                                                                    .name1
                                                            }
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12}>
                                                        <div className="title">
                                                            Partial shipment
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="text">
                                                            {mclPoGetId.data
                                                                ?.data
                                                                ?.partialShipment ===
                                                            1
                                                                ? 'Allowed'
                                                                : 'Not Allowed'}
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
                                                            {`${mclPoGetId.data?.data.paymentTerm.name1} ${mclPoGetId.data?.data.paymentPeriod.name1} days ${mclPoGetId.data?.data.paymentBase.name1}`}
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
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    .currency
                                                                    .name2
                                                            }
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12}>
                                                        <div className="title">
                                                            Ship Tolerance (%)
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="text">
                                                            +
                                                            {
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    .plusTolerance
                                                            }
                                                            % -
                                                            {
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    .minusTolerance
                                                            }
                                                            %
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </>
                            )}
                            <CustomTable
                                title={() => (
                                    <div className="titleWrap">
                                        <div className="title">
                                            <Space>
                                                <CaretRightOutlined />
                                                ITEM DETAILS
                                            </Space>
                                        </div>
                                    </div>
                                )}
                                footer={(record) => {
                                    const result = record.reduce((acc, cur) => {
                                        // 대표남 요구사항 Sample도 다 포함
                                        // if (
                                        //     cur?.orderType?.name?.toLowerCase() !==
                                        //     'bulk'
                                        // ) {
                                        //     return acc;
                                        // }
                                        acc['currency'] = cur.currency;
                                        // acc['orderedAdjUom'] =
                                        //     cur.orderedAdjUom;
                                        // acc['purchaseQty'] =
                                        //     (acc['purchaseQty'] || 0) +
                                        //     cur.purchaseQty;

                                        acc['purchaseQty'] = {
                                            ...acc['purchaseQty'],
                                            [cur?.orderedAdjUom?.name3]:
                                                (acc?.['purchaseQty']?.[
                                                    cur?.orderedAdjUom?.name3
                                                ] || 0) + cur?.purchaseQty,
                                        };
                                        acc['amount'] =
                                            (acc['amount'] || 0) +
                                            cur.purchaseQty * cur.unitPrice;
                                        return acc;
                                    }, {});

                                    return (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            {/* <div className="title">TOTAL</div> */}
                                            <div>
                                                <div className="title">
                                                    Order Qty:{' '}
                                                    {result?.purchaseQty &&
                                                        Object.keys(
                                                            result.purchaseQty
                                                        )?.map?.((v, i) => {
                                                            return (
                                                                <span key={i}>
                                                                    {formatNumberUtil(
                                                                        result
                                                                            .purchaseQty?.[
                                                                            v
                                                                        ]
                                                                    )}{' '}
                                                                    {v}
                                                                    {i + 1 <
                                                                        Object.keys(
                                                                            result.purchaseQty
                                                                        )
                                                                            .length &&
                                                                        ' & '}
                                                                </span>
                                                            );
                                                        })}
                                                </div>
                                                <div className="title">
                                                    Amount:{' '}
                                                    {result?.currency?.name3}{' '}
                                                    {formatNumberUtil(
                                                        parseFloat(
                                                            result.amount
                                                        ).toFixed(2)
                                                    )}
                                                </div>
                                                {mclPoGetItemId.data?.data?.option?.map(
                                                    (v, i) => (
                                                        <div
                                                            key={i}
                                                            className="title"
                                                        >
                                                            {v?.name}:{' '}
                                                            {v?.value}
                                                            {v?.type ===
                                                                'Percentage' &&
                                                                '%'}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    );
                                }}
                                rowKey="index"
                                initialColumns={purchaseOrderColumns}
                                dataSource={poItemDataSource}
                                rowSelection={false}
                                pagination={false}
                                loading={mclPoGetItemId.isLoading}
                                // defaultExpandAllRows={true}
                                expandable={expandable}
                                defaultExpandAllRows={
                                    visibleModal?.type === 'dependency'
                                        ? true
                                        : false
                                }
                            />

                            {visibleModal?.type === 'po' && (
                                <>
                                    <div style={{ marginTop: '1rem' }}>
                                        <Row gutter={[10, 10]}>
                                            {/* <Col span={8}>
                                                <div className="box">
                                                    <div className="title">
                                                        Shipper
                                                    </div>

                                                    <div className="title">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.shipper
                                                                .companyName
                                                        }
                                                    </div>
                                                    <div className="text">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.shipper
                                                                .address?.etc
                                                        }
                                                    </div>
                                                </div>
                                            </Col> */}
                                            {/* <Col span={8}>
                                                <div className="box">
                                                    <div className="title">
                                                        Consignee
                                                    </div>
                                                    <div className="title">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.consignee
                                                                ?.companyName
                                                        }
                                                    </div>
                                                    <div className="text">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.consignee
                                                                ?.address?.etc
                                                        }
                                                    </div>
                                                </div>
                                            </Col> */}
                                            <Col span={12}>
                                                <div className="box">
                                                    <div className="title">
                                                        Ship to
                                                    </div>
                                                    <div className="title">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.shipTo
                                                                ?.companyName
                                                        }
                                                    </div>
                                                    <div className="text">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.shipTo
                                                                ?.address?.etc
                                                        }
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="box">
                                                    <div className="title">
                                                        Nominated Forwarder
                                                        Information
                                                    </div>
                                                    <div className="title">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.forwarder
                                                                ?.companyName
                                                        }
                                                    </div>
                                                    <div className="text">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.forwarder
                                                                ?.address?.etc
                                                        }
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={[10, 10]}>
                                            <Col span={8}>
                                                <div
                                                    className="box"
                                                    style={{ border: 0 }}
                                                >
                                                    <div className="title">
                                                        Prepared By
                                                    </div>
                                                    <div className="title">
                                                        {
                                                            mclPoGetId.data
                                                                ?.data?.userInfo
                                                                ?.userName
                                                        }
                                                        (
                                                        {
                                                            mclPoGetId.data
                                                                ?.data?.userInfo
                                                                ?.email
                                                        }
                                                        )
                                                    </div>
                                                    <div className="text">
                                                        <div>
                                                            Office Phone No.:{' '}
                                                            {
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    ?.userInfo
                                                                    ?.officePhone
                                                            }
                                                        </div>
                                                        <div>
                                                            Mobile Phone No.:{' '}
                                                            {
                                                                mclPoGetId.data
                                                                    ?.data
                                                                    ?.userInfo
                                                                    ?.mobilePhone
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col span={8} offset={8}>
                                                <div
                                                    className="box"
                                                    style={{ border: 0 }}
                                                >
                                                    <div className="text">
                                                        Company:{' '}
                                                        {
                                                            mclPoGetId.data
                                                                ?.data.supplier
                                                                .companyName
                                                        }
                                                    </div>
                                                    <div
                                                        className="title"
                                                        style={{
                                                            marginTop: '1rem',
                                                        }}
                                                    >
                                                        Authorized Signature
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div
                                        style={{
                                            padding: '1rem',
                                        }}
                                    >
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div className="title">
                                                Handling Information
                                            </div>
                                            <div className="text">
                                                {mclPoGetId.data?.data?.memo}
                                            </div>
                                        </div>

                                        {mclPoGetId.data?.data?.poTerms &&
                                            JSON.parse(
                                                mclPoGetId.data?.data.poTerms
                                            )?.map((v, i) => {
                                                return (
                                                    <div key={i}>
                                                        <div className="title">
                                                            Remarks ({v?.type})
                                                        </div>
                                                        <pre className="text">
                                                            {v?.terms}
                                                        </pre>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </>
                            )}
                        </ModalBodyWrap>
                    </PDFExport>
                </Modal>
                <Modal
                    title={
                        <div
                            style={{
                                fontSize: '0.6875rem',
                                fontWeight: 'bold',
                            }}
                        >
                            PO MEMO
                        </div>
                    }
                    centered
                    closable={false}
                    visible={visibleRevertModal.status}
                    onOk={() => {
                        return setVisibleRevertModal((visibleRevertModal) => ({
                            ...visibleRevertModal,
                            status: false,
                        }));
                    }}
                    onCancel={() =>
                        setVisibleRevertModal((visibleRevertModal) => ({
                            ...visibleRevertModal,
                            status: false,
                        }))
                    }
                >
                    <div style={{ fontSize: '0.625rem' }}>
                        {revertMemo?.[visibleRevertModal?.id]}
                    </div>
                </Modal>
                <CustomTable
                    ref={tableRef}
                    title={() => title('rmPo')}
                    rowKey="id"
                    initialColumns={columns}
                    dataSource={dataSource}
                    rowSelection={true}
                    loading={isLoading}
                    onRow={onRow}
                    pagination={{ ...pagination, total }}
                    onChange={setPagination}
                    onGetCheckboxProps={(record) => {
                        const { status } = record.order;
                        return {
                            disabled:
                                status.toLowerCase() === 'revised' ||
                                status.toLowerCase() === 'canceled',
                        };
                    }}
                />
            </div>
        </MclRmPoWrap>
    );
};

const MclRmPoWrap = styled.div`
    height: 100%;
    overflow: auto;
    padding: 0 1rem 0 0;

    #mclRmPoWrap {
        min-width: 1000px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                ${({ theme }) => theme.fonts.h7};
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
    // font-family: 'Arial', sans-serif;
    // font-family: 'Verdana';
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

    table.dependencyTable {
        width: 100%;
        tr th {
            padding: 6px;
            color: #000000;
            text-align: center;
            background-color: #b3d5d6;
            border-top: 1px solid #000000;
            border-bottom: 1px solid #000000;
        }
        tr {
            background-color: #ffffff;
        }
        tr td {
            padding: 6px;
            text-align: center;
            border: 1px dotted lightgray;
            ${(props) => props.theme.fonts.h5};
            &.market {
                color: #000000;
                background-color: #b3d5d6;
            }
        }
        tr.total,
        tr.total {
            ${(props) => props.theme.fonts.h6};
            background-color: #d0dbf0;
            border-top: 1px solid #000000;
            border-bottom: 1px solid #000000;
        }

        .ant-input {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }
    }
`;

export default React.memo(MclRmPo);
