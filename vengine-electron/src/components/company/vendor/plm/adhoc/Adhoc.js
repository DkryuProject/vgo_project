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
import handleCalculationResult from 'core/utils/uomUtil';
import useGtag from 'core/hook/useGtag';

import {
    mclAdhocGetPagesAsyncAction,
    mclAdhocGetIdAsyncAction,
    mclAdhocPutCanceledAsyncAction,
    mclAdhocPostEmailAsyncAction,
} from 'store/mcl/adhoc/reducer';

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
import { Fragment } from 'react';
import { Ellipsis } from 'components/UI/atoms';

// 테이블
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const Adhoc = (props) => {
    const { initialShow, onShow, onRightSplit, onLeftSplit } = props;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();
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

    const mclAdhocGetPages = useSelector(
        (state) => state.mclAdhocReducer.get.pages
    );
    const handleMclAdhocGetPages = useCallback(
        (payload) => dispatch(mclAdhocGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const mclAdhocGetId = useSelector((state) => state.mclAdhocReducer.get.id);
    const handleMclAdhocGetId = useCallback(
        (payload) => dispatch(mclAdhocGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclAdhocGetIdInit = useCallback(
        () => dispatch(mclAdhocGetIdAsyncAction.initial()),
        [dispatch]
    );

    const mclAdhocPutCanceled = useSelector(
        (state) => state.mclAdhocReducer.put.canceled
    );
    const handleMclAdhocPutCanceled = useCallback(
        (payload) => dispatch(mclAdhocPutCanceledAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclAdhocPutCanceledInit = useCallback(
        () => dispatch(mclAdhocPutCanceledAsyncAction.initial()),
        [dispatch]
    );

    const mclAdhocPostEmail = useSelector(
        (state) => state.mclAdhocReducer.post.email
    );
    const handleMclAdhocPostEmail = useCallback(
        (payload) => dispatch(mclAdhocPostEmailAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclAdhocPostEmailInit = useCallback(
        () => dispatch(mclAdhocPostEmailAsyncAction.initial()),
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
                    selectedRows[0]?.status.toLowerCase() !== 'published' &&
                    selectedRows[0]?.status.toLowerCase() !== 'confirm'
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

                // status가 Published 상태에서만 가능한 조건
                if (
                    selectedRows[0]?.status.toLowerCase() !== 'published' &&
                    selectedRows[0]?.status.toLowerCase() !== 'revert'
                ) {
                    return handleNotification({
                        type: 'error',
                        message: 'Error',
                        description: 'Only available in published state',
                    });
                }

                confirm.warningConfirm('Do you want to re-publish?', (e) => {
                    if (e) {
                        onRightSplit();
                        return onShow({
                            ...initialShow,
                            adhocWrite: {
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
                        return handleMclAdhocPutCanceled(selectedRowKeys);
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
            handleMclAdhocPutCanceled,
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

            return handleMclAdhocPostEmail({
                id: emailModal?.id,
                data: values?.emails,
            });
        },
        [emailModal, handleNotification, handleMclAdhocPostEmail]
    );

    // 조회
    useEffect(() => {
        handleMclAdhocGetPages(pagination);
    }, [pagination, handleMclAdhocGetPages]);

    useEffect(() => {
        setIsLoading(mclAdhocGetPages.isLoading);
        if (mclAdhocGetPages.data) {
            const { content, totalElements } = mclAdhocGetPages.data.page;
            const newContent = content.map((v, i) => ({
                ...v,
                id: v.orderID,
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
    }, [mclAdhocGetPages, setIsLoading, setDataSource]);

    // item 모달 조회
    useEffect(() => {
        if (visibleModal.id && visibleModal.status) {
            handleMclAdhocGetId(visibleModal.id);
            trackPageView({
                page_title: `AD HOC DETAIL | AD HOC `,
            });
        }
        return () => handleMclAdhocGetIdInit();
    }, [
        visibleModal,
        handleMclAdhocGetId,
        handleMclAdhocGetIdInit,
        trackPageView,
    ]);

    // 취소
    useEffect(() => {
        if (mclAdhocPutCanceled.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclAdhocPutCanceled.error.message,
            });
        } else if (mclAdhocPutCanceled.data) {
            handleMclAdhocGetPages(pagination);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'AD HOC Cancellation Success',
            });
        }
        return () => handleMclAdhocPutCanceledInit();
    }, [
        mclAdhocPutCanceled,
        pagination,
        handleMclAdhocPutCanceledInit,
        handleNotification,
        handleMclAdhocGetPages,
    ]);

    useEffect(() => {
        if (mclAdhocPostEmail.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclAdhocPostEmail.error.message,
            });
        } else if (mclAdhocPostEmail.data) {
            setEmailModal((emailModal) => ({ ...emailModal, status: false }));
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Email Send Success',
            });
        }
        return () => handleMclAdhocPostEmailInit();
    }, [
        mclAdhocPostEmail,
        setEmailModal,
        handleNotification,
        handleMclAdhocPostEmailInit,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `AD HOC LISTS | AD HOC `,
        });
    }, [trackPageView]);

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
        {
            title: 'Supplier / Ship to Company',
            align: 'left',
            render: (_, record) => {
                const status =
                    record?.status?.toLowerCase() === 'revised' ||
                    record?.status?.toLowerCase() === 'canceled';
                const value = (
                    <div>
                        <div>Supplier: {record?.supplier?.companyName}</div>
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
        {
            title: 'Shipping Information',
            align: 'left',
            render: (_, record) => {
                const {
                    loadingPort,
                    loadingBasicCountry,
                    dischargePort,
                    dischargeBasicCountry,
                    shippingMethod,
                    incoterms,
                } = record;
                const status =
                    record?.status?.toLowerCase() === 'revised' ||
                    record?.status?.toLowerCase() === 'canceled';

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
                const { itemQty, totalPoAmt, currency } = record;
                const status =
                    record?.status?.toLowerCase() === 'revised' ||
                    record?.status?.toLowerCase() === 'canceled';
                const value = (
                    <div>
                        <div>Item Qty: {formatNumberUtil(itemQty)} ea</div>
                        {/* <div>Total Order Qty: {totalPoQty}</div> */}
                        <div>
                            Total Amount: {currency.name3}{' '}
                            {formatNumberUtil(totalPoAmt)}{' '}
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
        {
            title: 'Modified',
            dataIndex: 'updated',
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
            dataIndex: 'status',
            align: 'left',
            render: (data, record) => {
                const status =
                    record?.status?.toLowerCase() === 'revised' ||
                    record?.status?.toLowerCase() === 'canceled';
                return (
                    <span>
                        {
                            <Tooltip title={data} status={status}>
                                {data}
                            </Tooltip>
                        }
                        {data?.toLowerCase() === 'revert' && (
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
    ];

    const purchaseOrderColumns = [
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
                        {mclAdhocGetId.data?.data.adhocOrder?.currency?.name3}{' '}
                        {formatNumberUtil(record?.unitPrice)}
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
                            {
                                mclAdhocGetId.data?.data.adhocOrder?.currency
                                    ?.name3
                            }{' '}
                            {formatNumberUtil(
                                parseFloat(
                                    record?.orderedQty * record?.unitPrice
                                )?.toFixed(2) || 0
                            )}
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
                        // style={{ fontSize: '0.625rem' }}
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
                    record?.status.toLowerCase() === 'published' ||
                    record?.status.toLowerCase() === 'confirm'
                ) {
                    return setVisibleModal({
                        id: id,
                        status: true,
                    });
                } else {
                    onLeftSplit();
                    return onShow({
                        ...initialShow,
                        adhocWrite: {
                            status: false,
                        },
                    });
                }
            },
        };
    };

    return (
        <AdhocWrap>
            <div id="adhocWrap">
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
                        fileName={
                            mclAdhocGetId.data?.data?.adhocOrder?.poNumber
                        }
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
                                <div
                                    className="title"
                                    style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                    }}
                                >
                                    PURCHASE ORDER
                                </div>

                                <div>
                                    <div className="title">
                                        PO No.:{' '}
                                        <span className="text">
                                            {
                                                mclAdhocGetId.data?.data
                                                    ?.adhocOrder?.poNumber
                                            }
                                        </span>
                                    </div>
                                    <div className="title">
                                        PO Issued Date:{' '}
                                        <span className="text">
                                            {
                                                mclAdhocGetId.data?.data
                                                    ?.adhocOrder?.updated
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <Row gutter={[10, 10]}>
                                    <Col span={12}>
                                        <div className="box">
                                            <div className="title">
                                                PO Issued Company
                                            </div>
                                            <div className="title">
                                                {
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.purchaser
                                                        ?.companyName
                                                }
                                            </div>
                                            <div className="text">
                                                {
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.purchaser
                                                        ?.address?.etc
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
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.supplier
                                                        ?.companyName
                                                }
                                            </div>
                                            <div className="text">
                                                {
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.supplier
                                                        ?.address?.etc
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
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
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
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
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
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
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
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
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
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
                                                            ?.estimatedDate,
                                                        'dateOfBirth'
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
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
                                                            ?.infactoryDate,
                                                        'dateOfBirth'
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <div className="title">
                                                    Ex-Mill Date(YYYY-MM-DD)
                                                </div>
                                            </Col>

                                            <Col span={12}>
                                                <div className="text">
                                                    {mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.exMill
                                                        ? dateFormat(
                                                              mclAdhocGetId.data
                                                                  ?.data
                                                                  ?.adhocOrder
                                                                  ?.exMill,
                                                              'dateOfBirth'
                                                          )
                                                        : '-'}
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
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
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
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
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
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
                                                            ?.paymentTerm?.name1
                                                    }
                                                    {
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
                                                            ?.paymentPeriod
                                                            ?.name1
                                                    }
                                                    days{' '}
                                                    {
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
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
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
                                                            ?.currency?.name2
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>

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
                                    const result = record?.reduce(
                                        (acc, cur) => {
                                            acc['orderedAdjUom'] =
                                                cur.orderedAdjUom;
                                            acc['orderedQty'] =
                                                (acc['orderedQty'] || 0) +
                                                cur.orderedQty;

                                            acc['amount'] =
                                                (acc['amount'] || 0) +
                                                cur.orderedQty * cur.unitPrice;
                                            return acc;
                                        },
                                        {}
                                    );
                                    return (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <div>
                                                <div className="title">
                                                    Order Qty:{' '}
                                                    {formatNumberUtil(
                                                        result?.orderedQty
                                                    )}{' '}
                                                    {
                                                        result?.orderedAdjUom
                                                            ?.name3
                                                    }
                                                </div>
                                                <div className="title">
                                                    Amount:{' '}
                                                    {
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
                                                            ?.currency?.name3
                                                    }{' '}
                                                    {formatNumberUtil(
                                                        result?.amount
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                                rowKey="itemID"
                                initialColumns={purchaseOrderColumns}
                                dataSource={mclAdhocGetId.data?.data?.adhocOrderItems.map(
                                    (v, i) => ({ ...v, index: i + 1 })
                                )}
                                rowSelection={false}
                                pagination={false}
                                loading={mclAdhocGetId.isLoading}
                            />

                            <div style={{ marginBottom: '1rem' }}>
                                <Row gutter={[10, 10]}>
                                    {/* <Col span={8}>
                                        <div className="box">
                                            <div className="title">
                                                Consignee
                                            </div>
                                            <div className="title">
                                                {
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.consignee
                                                        ?.companyName
                                                }
                                            </div>
                                            <div className="text">
                                                {
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.consignee
                                                        ?.address?.etc
                                                }
                                            </div>
                                        </div>
                                    </Col> */}
                                    <Col span={12}>
                                        <div className="box">
                                            <div className="title">Ship to</div>
                                            <div className="title">
                                                {
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.shipTo
                                                        ?.companyName
                                                }
                                            </div>
                                            <div className="text">
                                                {
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.shipTo
                                                        ?.address?.etc
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="box">
                                            <div className="title">
                                                Nominated Forwarder Information
                                            </div>
                                            <div className="title">
                                                {
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.forwarder
                                                        ?.companyName
                                                }
                                            </div>
                                            <div className="text">
                                                {
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.forwarder
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
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.userInfo
                                                        ?.userName
                                                }
                                                (
                                                {
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder?.userInfo
                                                        ?.email
                                                }
                                                )
                                            </div>
                                            <div className="text">
                                                <div>
                                                    Office Phone No.:{' '}
                                                    {
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
                                                            ?.userInfo
                                                            ?.officePhone
                                                    }
                                                </div>
                                                <div>
                                                    Mobile Phone No.:{' '}
                                                    {
                                                        mclAdhocGetId.data?.data
                                                            ?.adhocOrder
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
                                                    mclAdhocGetId.data?.data
                                                        ?.adhocOrder.supplier
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
                                        {
                                            mclAdhocGetId.data?.data?.adhocOrder
                                                ?.memo
                                        }
                                    </div>
                                </div>

                                {mclAdhocGetId.data?.data?.adhocOrder
                                    ?.poTerms &&
                                    JSON.parse(
                                        mclAdhocGetId.data?.data?.adhocOrder
                                            ?.poTerms
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
                    title={() => title('adhocWrite')}
                    rowKey="id"
                    initialColumns={columns}
                    dataSource={dataSource}
                    rowSelection={true}
                    loading={isLoading}
                    onRow={onRow}
                    pagination={{ ...pagination, total }}
                    onChange={setPagination}
                    onGetCheckboxProps={(record) => {
                        const { status } = record;
                        return {
                            disabled:
                                status.toLowerCase() === 'revised' ||
                                status.toLowerCase() === 'canceled',
                        };
                    }}
                />
            </div>
        </AdhocWrap>
    );
};

const AdhocWrap = styled.div`
    height: 100%;
    overflow: auto;
    padding: 0 1rem 0 0;

    #adhocWrap {
        min-width: 500px;
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
    table-layout: fixed;
    border-collapse: collapse;
    margin-bottom: 1rem;
    .title {
        margin-top: 0;
        ${({ theme }) => theme.fonts.h7};
    }
    .text {
        ${({ theme }) => theme.fonts.display_1};
    }
    .box {
        padding: 1rem;
        border: 1px solid rgba(0, 0, 0, 0.5);
    }
`;

export default Adhoc;
