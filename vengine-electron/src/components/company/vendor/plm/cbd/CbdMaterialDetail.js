import React, {
    useState,
    useMemo,
    useCallback,
    useEffect,
    useRef,
    useContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import useGtag from 'core/hook/useGtag';

import { companySearchListsAsyncAction } from 'store/companyInfo/reducer';

import {
    cbdInfoGetIdAsyncAction,
    cbdInfoPutAsyncAction,
    cbdInfoDeleteAsyncAction,
    cbdInfoGetListsAsyncAction,
} from 'store/cbd/info/reducer';

import styled from 'styled-components';
import { Form, Space, Drawer, InputNumber, Input } from 'antd';
import * as confirm from 'components/common/confirm';
import TableButton from 'components/common/table/TableButton';
import { PushpinOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import CustomTable from 'components/common/CustomTable';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import {
    materialOfferGetListApi,
    materialOfferPostApi,
} from 'core/api/material/offer';
import { useMutation, useQuery } from 'react-query';
import { Ellipsis, Select } from 'components/UI/atoms';
import { MaterialOfferedPrice } from 'components/UI/organisms';
import { handleNotification } from 'core/utils/notificationUtil';
import { DrawerContext } from 'components/context/drawerContext';
import { Fragment } from 'react';
import { commonBasicGetListsApi } from 'core/api/common/basic';

const MaterialOption = React.memo((props) => {
    const {
        visible,
        onVisible,
        // cbdInfoGetId,
        onOption,
    } = props;
    const editTableRef = useRef();
    const rowKey = 'id';
    const [dataSource, setDataSource] = useState([]);
    const [materialOfferForm] = Form.useForm();
    const { openDrawer, closeDrawer } = useContext(DrawerContext);

    // Detail Offer Fetch
    const materialOfferGetList = useQuery(
        ['materialOfferGetList', visible.id],
        () => materialOfferGetListApi(visible.id),
        {
            onSuccess: (res) => {
                const { list } = res;
                setDataSource(list);
            },
            enabled: !!visible.id,
            cacheTime: 0,
        }
    );
    const { mutate: materialOfferPostMutate } = useMutation(
        (payload) => materialOfferPostApi(payload),
        {
            onSuccess: () => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Material Offered price creation success',
                });
                closeDrawer('materialOfferPrice');
                return materialOfferGetList?.refetch();
            },
        }
    );

    // Detail Offer Function
    const handleMaterialOfferSubmit = useCallback(
        (values) => {
            // recipientId ALL 처리
            if (values['recipientId'] < 0) {
                values['recipientId'] = null;
            }
            return materialOfferPostMutate({
                id: values['materialId'],
                data: values,
            });
        },
        [materialOfferPostMutate]
    );

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Material No.',
                dataIndex: 'materialNo',
                render: (data) => (
                    <Tooltip title={data || '-'}>{data || '-'}</Tooltip>
                ),
            },
            {
                title: 'Buying Company',
                dataIndex: 'recipient',
                align: 'left',
                ellipsis: true,
                render: (data) => (
                    <Tooltip title={data?.name || 'ALL'}>
                        {data?.name || 'ALL'}
                    </Tooltip>
                ),
            },
            {
                title: 'Item Size Options',
                dataIndex: 'itemSizeOption',
                align: 'left',
                ellipsis: true,
                width: visible.type === 'fabric' ? '0' : '10%',
                render: (data) => {
                    const { size, sizeUom } = data;
                    const output = (
                        <Ellipsis>
                            * Item Size :{' '}
                            {size ? (
                                <span>
                                    {size} {sizeUom?.name3}
                                </span>
                            ) : (
                                '-'
                            )}
                        </Ellipsis>
                    );

                    return <Tooltip title={output}>{output}</Tooltip>;
                },
            },
            {
                title: 'Item Options',
                dataIndex: 'itemOption',
                align: 'left',
                ellipsis: true,
                render: (data, record) => {
                    const {
                        cw,
                        cwUom,
                        weight,
                        weightUom,
                        finishing,
                        dyeing,
                        printing,
                    } = data || {};
                    const {
                        function: _function,
                        performance,
                        characteristic,
                        solid_pattern,
                        stretch,
                    } = record || {};
                    const output = (
                        <Fragment>
                            <Ellipsis>
                                * Width/Weight:{' '}
                                {cw ? (
                                    <span>
                                        {cw} {cwUom?.name3 || 'inch'}
                                    </span>
                                ) : (
                                    '-'
                                )}{' '}
                                /{' '}
                                {weight ? (
                                    <span>
                                        {' '}
                                        {weight} {weightUom?.name3 || 'GSM'}
                                    </span>
                                ) : (
                                    '-'
                                )}
                                * Dyeing: {dyeing || '-'}
                                {visible?.type === 'fabric' && (
                                    <Fragment>
                                        * Function: {_function || '-'}
                                    </Fragment>
                                )}
                            </Ellipsis>
                            <Ellipsis>
                                * Post Processing: {finishing || '-'}
                                {visible?.type === 'fabric' && (
                                    <Fragment>
                                        * Performance: {performance || '-'} *
                                        Stretch: {stretch || '-'}
                                    </Fragment>
                                )}
                            </Ellipsis>
                            <Ellipsis>
                                * Printing: {printing || '-'}
                                {visible?.type === 'fabric' && (
                                    <Fragment>
                                        * Characteristic:{' '}
                                        {characteristic || '-'} * Soild/Pattern:{' '}
                                        {solid_pattern || '-'}
                                    </Fragment>
                                )}
                            </Ellipsis>
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                output
                                // <Fragment>
                                //     <div>
                                //         * Width/Weight:{' '}
                                //         {cw ? (
                                //             <span>
                                //                 {cw} {cwUom?.name3 || 'inch'}
                                //             </span>
                                //         ) : (
                                //             '-'
                                //         )}{' '}
                                //         /{' '}
                                //         {weight ? (
                                //             <span>
                                //                 {' '}
                                //                 {weight}{' '}
                                //                 {weightUom?.name3 || 'GSM'}
                                //             </span>
                                //         ) : (
                                //             '-'
                                //         )}
                                //         * Dyeing: {dyeing || '-'}
                                //         {visible?.type === 'fabric' && (
                                //             <Fragment>
                                //                 * Function: {_function || '-'}
                                //             </Fragment>
                                //         )}
                                //     </div>
                                //     <div>
                                //         * Post Processing: {finishing || '-'}{' '}
                                //         {visible?.type === 'fabric' && (
                                //             <Fragment>
                                //                 * Performance:{' '}
                                //                 {performance || '-'} *
                                //                 Stretch: {stretch || '-'}
                                //             </Fragment>
                                //         )}
                                //     </div>
                                //     <div>
                                //         * Printing: {printing || '-'}
                                //         {visible?.type === 'fabric' && (
                                //             <Fragment>
                                //                 * Characteristic:{' '}
                                //                 {characteristic || '-'} *
                                //                 Soild/Pattern:{' '}
                                //                 {solid_pattern || '-'}
                                //             </Fragment>
                                //         )}
                                //     </div>
                                // </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Unit Price & UOM',
                align: 'left',
                ellipsis: true,
                render: (_, record) => {
                    const { unitPrice, currency, uom } = record || {};
                    const output = (
                        <Fragment>
                            <Ellipsis>
                                * Currency: {currency?.name2 || '-'}
                            </Ellipsis>
                            <Ellipsis>
                                * Unit Price: {currency?.name3 || '-'}{' '}
                                {unitPrice || '-'}
                            </Ellipsis>
                            <Ellipsis>* UOM: {uom?.name3 || '-'}</Ellipsis>
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                output
                                // <Fragment>
                                //     <div>
                                //         * Currency: {currency?.name2 || '-'}
                                //     </div>
                                //     <div>
                                //         * Unit Price: {currency?.name3 || '-'}{' '}
                                //         {unitPrice || '-'}
                                //     </div>
                                //     <div>* UOM: {uom?.name3 || '-'}</div>
                                // </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Minimum Order',
                align: 'left',
                ellipsis: true,
                render: (_, record) => {
                    const { mcq, moq, lead_time } = record || {};
                    const output = (
                        <Fragment>
                            <Ellipsis>* MCQ: {mcq ?? '-'}</Ellipsis>
                            <Ellipsis>* MOQ: {moq ?? '-'}</Ellipsis>
                            <Ellipsis>* Lead Time: {lead_time || '-'}</Ellipsis>
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                output
                                // <Fragment>
                                //     <div>* MCQ: {mcq ?? '-'}</div>
                                //     <div>* MOQ: {moq ?? '-'}</div>
                                //     <div>* Lead Time: {lead_time || '-'}</div>
                                // </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Modified Date/Time/By',
                dataIndex: 'updated',
                align: 'left',
                ellipsis: true,
                render: (data, record) => {
                    const output = (
                        <Fragment>
                            <Ellipsis>* Modified Data/Time: {data}</Ellipsis>
                            <Ellipsis>
                                * By: {record?.createdBy?.userName}
                            </Ellipsis>
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                output
                                // <Fragment>
                                //     <div>* Modified Data/Time: {data}</div>
                                //     <div>
                                //         * By: {record?.createdBy?.userName}
                                //     </div>
                                // </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
        ],
        [visible.type]
    );

    const title = () => (
        <div className="titleWrap">
            <div className="title">
                <Space
                // style={{
                //     fontSize: '0.6875rem',
                //     color: '#000000',
                //     fontWeight: 'bold',
                // }}
                >
                    <PushpinOutlined />
                    OFFERED PRICE
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Assign',
                            arrowPointAtCenter: true,
                        }}
                        mode="save"
                        size="small"
                        onClick={() => {
                            onOption(editTableRef.current.selectedRows[0]);
                            return onVisible({ status: false });
                        }}
                    >
                        Assign
                    </TableButton>
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Create',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() =>
                            openDrawer(
                                'materialOfferPrice',
                                <MaterialOfferedPrice
                                    initialValues={{
                                        cwUomId: 31,
                                        fullWidthUomId: 31,
                                        currencyId: 314,
                                        uomId:
                                            visible?.type === 'fabric'
                                                ? 33
                                                : 54,
                                    }}
                                    type={visible?.type}
                                    materialOfferForm={materialOfferForm}
                                    onMaterialOfferSubmit={(values) =>
                                        handleMaterialOfferSubmit({
                                            ...values,
                                            materialId: visible?.id,
                                        })
                                    }
                                    onMaterialOfferCloseDrawer={() =>
                                        closeDrawer('materialOfferPrice')
                                    }
                                />
                            )
                        }
                    />
                </Space>
            </div>
        </div>
    );

    return (
        <div
            style={{
                padding: '0.5rem',
                border: '1px solid lightgray',
                borderRadius: '3px',
                boxShadow: '3px 3px gray',
            }}
        >
            <CustomTable
                ref={editTableRef}
                title={title}
                rowKey={rowKey}
                initialColumns={columns}
                dataSource={dataSource}
                rowSelection={true}
                rowSelectionType="radio"
                loading={materialOfferGetList?.isLoading}
            />
        </div>
    );
});

const CbdMaterialDetail = (props) => {
    const { match, initialShow, show, onShow, onLeftSplit, isDisabled } = props;
    const type = show.materialDetail.type;
    const id = show.materialDetail.id;
    const cbdId = (match && match.params.cbdId) || '';
    const [form] = Form.useForm();
    const cbdMaterialDetailForm = useRef();
    const dispatch = useDispatch();
    const [handleValidateMessage] = useValidateMessage();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const [netYy, setNetYy] = useState(0);
    const [loss, setLoss] = useState(0);

    const [option, setOption] = useState(null);
    const [visible, setVisible] = useState({
        id: null,
        type: null,
        status: false,
    });
    const [uom, setUom] = useState(null);
    const [unitPrice, setUnitPrice] = useState(0);
    const grossYy = useMemo(() => {
        return parseFloat(netYy * (loss / 100 + 1)).toFixed(3);
    }, [netYy, loss]);

    const handleCompanySearchLists = useCallback(
        (payload) => dispatch(companySearchListsAsyncAction.request(payload)),
        [dispatch]
    );

    const companyInfoSave = useSelector(
        (state) => state.companyInfoReducer.save
    );

    const cbdInfoGetId = useSelector((state) => state.cbdInfoReducer.get.id);
    const handleCbdInfoGetId = useCallback(
        (payload) => dispatch(cbdInfoGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdInfoGetIdInit = useCallback(
        () => dispatch(cbdInfoGetIdAsyncAction.initial()),
        [dispatch]
    );

    const cbdInfoPut = useSelector((state) => state.cbdInfoReducer.put);
    const handleCbdInfoPut = useCallback(
        (payload) => dispatch(cbdInfoPutAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdInfoPutInit = useCallback(
        () => dispatch(cbdInfoPutAsyncAction.initial()),
        [dispatch]
    );

    const cbdInfoDelete = useSelector((state) => state.cbdInfoReducer.delete);
    const handleCbdInfoDelete = useCallback(
        (payload) => dispatch(cbdInfoDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdInfoDeleteInit = useCallback(
        () => dispatch(cbdInfoDeleteAsyncAction.initial()),
        [dispatch]
    );
    const handleCbdInfoGetLists = useCallback(
        (payload) => dispatch(cbdInfoGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    // 수정
    const handleSubmit = useCallback(
        (values) => {
            if (cbdInfoGetId.data) {
                const data = {
                    materialOfferId: option?.id || null,
                    netYy: values.netYy,
                    tolerance: values.tolerance,
                    uomId:
                        typeof values.cbdMaterialUomId === 'string'
                            ? uom?.id
                            : values.cbdMaterialUomId,
                    usagePlace: values.usagePlace,
                    unitPrice: unitPrice,
                    sizeMemo: values.sizeMemo,
                };

                return handleCbdInfoPut({ id, data });
            }
        },
        [id, cbdInfoGetId, option, uom, unitPrice, handleCbdInfoPut]
    );
    const handleDelete = () => {
        return handleCbdInfoDelete(id);
    };

    useEffect(() => {
        if (companyInfoSave.data) {
            handleCompanySearchLists('usage');
        }
    }, [companyInfoSave, handleCompanySearchLists]);

    // 조회
    useEffect(() => {
        if (id) {
            handleCbdInfoGetId(id);
        }

        return () => handleCbdInfoGetIdInit();
    }, [id, handleCbdInfoGetId, handleCbdInfoGetIdInit]);

    useEffect(() => {
        if (cbdInfoGetId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdInfoGetId.error.message,
            });
        } else if (cbdInfoGetId.data) {
            const {
                usagePlace,
                netYy,
                tolerance,
                cbdMaterialUom,
                material_offer_uom,
                unitPrice,
                materialAfterManufacturingFinishing,
                materialAfterManufacturingDyeing,
                materialAfterManufacturingFashion,
                fabricCw,
                fabricWeight,
                fabricWeightUom,
                subsidiarySize,
                subsidiarySizeUom,
                sizeMemo,
            } = cbdInfoGetId.data.data;

            setNetYy(netYy);
            setLoss(tolerance);
            setOption((option) => ({
                ...option,
                unitPrice: unitPrice,
                uom: material_offer_uom,
                itemOption: {
                    finishing: materialAfterManufacturingFinishing,
                    dyeing: materialAfterManufacturingDyeing,
                    printing: materialAfterManufacturingFashion,
                    cw: fabricCw,
                    weight: fabricWeight,
                    weightUom: fabricWeightUom,
                },
                itemSizeOption: {
                    size: subsidiarySize,
                    sizeUom: subsidiarySizeUom,
                },
            }));
            setUnitPrice(unitPrice);
            setUom(cbdMaterialUom);

            form.setFieldsValue({
                usagePlace: usagePlace,
                netYy: netYy,
                tolerance: tolerance,
                cbdMaterialUomId: cbdMaterialUom ? cbdMaterialUom.name3 : null, // id
                // unitPrice: unitPrice,
                sizeMemo: sizeMemo,
            });
        }
    }, [
        cbdInfoGetId,
        form,
        setNetYy,
        setLoss,
        setOption,
        setUnitPrice,
        setUom,
        handleNotification,
    ]);

    // 대표님 지시 변환 없음
    // useEffect(() => {
    //     if ((type === 'fabric', cbdInfoGetId.data && uom)) {
    //         setUnitPrice(
    //             parseFloat(
    //                 handleCalculationResult(
    //                     option?.unitPrice,
    //                     option?.uom?.name3,
    //                     'yard',
    //                     {
    //                         cw: option?.itemOption?.fabricCw,
    //                         weight: option?.itemOption?.fabricWeight,
    //                     }
    //                 )
    //             ).toFixed(2)
    //         );
    //     }
    // }, [
    //     type,
    //     uom,
    //     cbdInfoGetId.data,
    //     option,
    //     setUnitPrice,
    //     // handleCalculationResult,
    // ]);

    // 수정
    useEffect(() => {
        if (cbdInfoPut.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdInfoPut.error.message,
            });
        } else if (cbdInfoPut.data) {
            handleCbdInfoGetId(id);
            handleCbdInfoGetLists({ type: type, id: cbdId });

            if (!visible.status) {
                onShow(initialShow);
                onLeftSplit();
                return handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'CBD Material Information Correction Success',
                });
            }
        }
        return () => handleCbdInfoPutInit();
    }, [
        type,
        cbdId,
        cbdInfoPut,
        visible,
        id,
        initialShow,
        onShow,
        onLeftSplit,
        handleCbdInfoPutInit,
        handleNotification,
        handleCbdInfoGetLists,
        handleCbdInfoGetId,
    ]);

    // 삭제
    useEffect(() => {
        if (cbdInfoDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdInfoDelete.error.message,
            });
        } else if (cbdInfoDelete.data) {
            handleCbdInfoGetLists({ type: type, id: cbdId });
            onShow(initialShow);
            onLeftSplit();
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful deletion of CBD Material information',
            });
        }

        return () => handleCbdInfoDeleteInit();
    }, [
        cbdInfoDelete,
        type,
        cbdId,
        id,
        onShow,
        initialShow,
        onLeftSplit,
        handleCbdInfoGetLists,
        handleCbdInfoGetId,
        handleNotification,
        handleCbdInfoDeleteInit,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `${type?.toUpperCase()} | MATERIAL DETAIL | CBD OPTION DETAIL | DESIGN COVER | PLM `,
        });
    }, [type, trackPageView]);

    return (
        <CbdMaterialDetailOutterWrap>
            <Drawer
                title=""
                width="900px"
                placement="right"
                closable={false}
                onClose={() =>
                    setVisible({
                        status: false,
                    })
                }
                visible={visible.status}
            >
                {visible.id && (
                    <MaterialOption
                        {...props}
                        visible={visible}
                        onVisible={setVisible}
                        cbdInfoGetId={cbdInfoGetId}
                        onOption={setOption}
                    />
                )}
            </Drawer>

            <div id="CbdMaterialDetailWrap">
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <PushpinOutlined />
                            ITEM DETAIL INFORMATION
                        </Space>
                    </div>
                    <div className="functionWrap">
                        <Space>
                            {!isDisabled && (
                                <TableButton
                                    toolTip={{
                                        placement: 'topLeft',
                                        title: 'Create Item',
                                        arrowPointAtCenter: true,
                                    }}
                                    mode="save"
                                    size="small"
                                    onClick={() =>
                                        confirm.saveConfirm(() => {
                                            return cbdMaterialDetailForm.current.submit();
                                        })
                                    }
                                />
                            )}

                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Close',
                                    arrowPointAtCenter: true,
                                }}
                                mode="cancel"
                                size="small"
                                onClick={() => {
                                    onLeftSplit();
                                    return onShow(initialShow);
                                }}
                            />

                            {!isDisabled && (
                                <TableButton
                                    toolTip={{
                                        placement: 'topLeft',
                                        title: 'Delete Item',
                                        arrowPointAtCenter: true,
                                    }}
                                    mode="delete"
                                    size="small"
                                    onClick={() =>
                                        confirm.deleteConfirm(() =>
                                            handleDelete()
                                        )
                                    }
                                />
                            )}
                        </Space>
                    </div>
                </div>
                <div className="contentsWrap">
                    <div className="content">
                        <Form
                            {...layout}
                            ref={cbdMaterialDetailForm}
                            form={form}
                            onFinish={handleSubmit}
                            validateMessages={handleValidateMessage}
                            initialValues={{
                                netYy: 0,
                                tolerance: 0,
                                // unitPrice: 0,
                            }}
                        >
                            <Form.Item name="usagePlace" label="Usage">
                                <Input
                                    placeholder="Insert Usage name"
                                    disabled={isDisabled}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item name="netYy" label="Net yy">
                                <InputNumber
                                    placeholder="Insert Net yy"
                                    onChange={(e) => {
                                        const value = e
                                            ? parseFloat(e).toFixed(3)
                                            : 0;
                                        form.setFieldsValue({
                                            netYy: value,
                                        });

                                        setNetYy(value);
                                    }}
                                    formatter={(value) =>
                                        value.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ','
                                        )
                                    }
                                    parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, '')
                                    }
                                    step="0.001"
                                    disabled={isDisabled}
                                    style={{ width: '100%' }}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item name="tolerance" label="Loss">
                                <InputNumber
                                    placeholder="Insert Loss"
                                    onChange={(e) => {
                                        const value = e
                                            ? parseFloat(e).toFixed(2)
                                            : 0;
                                        form.setFieldsValue({
                                            tolerance: value,
                                        });

                                        setLoss(value);
                                    }}
                                    formatter={(value) =>
                                        value.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ','
                                        )
                                    }
                                    parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, '')
                                    }
                                    disabled={isDisabled}
                                    style={{ width: '100%' }}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item name="grossYy" label="Gross yy">
                                <div
                                    className="fakeInput"
                                    data-disabled={isDisabled}
                                >
                                    {parseFloat(
                                        formatNumberUtil(grossYy)
                                    ).toFixed(3)}
                                </div>
                            </Form.Item>
                            <Form.Item
                                name="cbdMaterialUomId"
                                label="UOM (Vendor)"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name3"
                                    onFilter={(v) =>
                                        type === 'fabric'
                                            ? v.name2 === 'length' &&
                                              v.name3 === 'yard'
                                            : v.name2 === 'counting' ||
                                              v.name2 === 'length' ||
                                              v.name2 === 'mass'
                                    }
                                    requestKey="materialOfferdPriceRegistrationUom"
                                    onRequestApi={() =>
                                        commonBasicGetListsApi('uom')
                                    }
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item label="Unit Price">
                                <InputNumber
                                    value={unitPrice}
                                    placeholder="Insert Unit price"
                                    onChange={(e) => {
                                        const value = e
                                            ? parseFloat(e).toFixed(
                                                  type === 'fabric' ? 2 : 5
                                              )
                                            : 0;

                                        setUnitPrice(value);
                                    }}
                                    formatter={(value) =>
                                        value.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ','
                                        )
                                    }
                                    parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, '')
                                    }
                                    disabled={isDisabled}
                                    style={{ width: '100%' }}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item name="amount" label="Amount">
                                <div
                                    className="fakeInput"
                                    data-disabled={isDisabled}
                                >
                                    {formatNumberUtil(
                                        parseFloat(
                                            grossYy * unitPrice
                                        )?.toFixed(type === 'fabric' ? 2 : 5)
                                    )}
                                </div>
                            </Form.Item>

                            <Form.Item
                                name="fabricType"
                                label={
                                    type === 'fabric'
                                        ? 'Fabric Type'
                                        : 'Category'
                                }
                            >
                                <div className="textValue">
                                    {cbdInfoGetId.data?.data?.materialInfo
                                        ?.category?.typeC
                                        ? `${cbdInfoGetId.data?.data?.materialInfo?.category?.typeC} / ${cbdInfoGetId.data?.data?.materialInfo?.category?.typeB}`
                                        : cbdInfoGetId.data?.data?.materialInfo
                                              ?.category?.typeB}
                                </div>
                            </Form.Item>
                            <Form.Item name="supplier" label="Supplier">
                                <div className="textValue">
                                    {cbdInfoGetId.data?.data?.materialInfo
                                        ?.supplier?.name || '-'}
                                </div>
                            </Form.Item>
                            {type === 'fabric' ? (
                                <>
                                    <Form.Item
                                        name="fabricContents"
                                        label="Contents"
                                    >
                                        <div className="textValue">
                                            {cbdInfoGetId.data?.data.materialInfo.fabricContents?.map(
                                                (v) =>
                                                    `${v.rate}% ${v.contents.name} `
                                            ) || '-'}
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        name="fabricConstruction"
                                        label="Construction"
                                    >
                                        <div className="textValue">
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo
                                                ?.constructionType || '-'}{' '}
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo
                                                ?.constructionEpi || '-'}{' '}
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo
                                                ?.constructionPpi || '-'}{' '}
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo?.yarnSizeWrap ||
                                                '-'}{' '}
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo?.yarnSizeWeft ||
                                                '-'}{' '}
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo?.shrinkagePlus >
                                                0 && '+'}
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo?.shrinkagePlus ||
                                                '-'}{' '}
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo?.shrinkageMinus >
                                                0 && '-'}
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo
                                                ?.shrinkageMinus || '-'}{' '}
                                        </div>
                                    </Form.Item>
                                </>
                            ) : (
                                <>
                                    {/* 대표님 지시로 삭제 */}
                                    {/* <Form.Item label="Item Size">
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                            }}
                                        >
                                            <TableButton
                                                toolTip={{
                                                    placement: 'topLeft',
                                                    title: 'Option Modify',
                                                    arrowPointAtCenter: true,
                                                }}
                                                size="small"
                                                // title="Modify"
                                                disabled={isDisabled}
                                                onClick={() =>
                                                    setVisible({
                                                        id: cbdInfoGetId.data
                                                            ?.data.materialInfo
                                                            .id,
                                                        type: type,
                                                        status: true,
                                                    })
                                                }
                                                mode="modify"
                                            />

                                            <div className="textValue">
                                                {option?.itemSizeOption?.size ||
                                                    '-'}{' '}
                                                {option?.itemSizeOption?.size &&
                                                    option?.itemSizeOption
                                                        ?.sizeUom?.name3}
                                            </div>
                                        </div>
                                    </Form.Item> */}

                                    <Form.Item
                                        name="subsidiaryDetail"
                                        label="Item Detail"
                                    >
                                        <div className="textValue">
                                            {cbdInfoGetId.data?.data
                                                ?.subsidiaryDetail || '-'}
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        name="sizeMemo"
                                        label="Size Description"
                                    >
                                        <Input
                                            placeholder="Insert Size description"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </>
                            )}

                            <Form.Item
                                name="supplierMaterial"
                                label="Mill Article#"
                            >
                                <div className="textValue">
                                    {cbdInfoGetId.data?.data
                                        ?.supplierMaterial || '-'}
                                </div>
                            </Form.Item>
                            {type === 'fabric' && (
                                <Fragment>
                                    <Form.Item label="Usage type">
                                        <div className="textValue">
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo?.usage_type ||
                                                '-'}
                                        </div>
                                    </Form.Item>

                                    <Form.Item label="Sus/Eco">
                                        <div className="textValue">
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo?.sus_eco || '-'}
                                        </div>
                                    </Form.Item>

                                    <Form.Item label="Application">
                                        <div className="textValue">
                                            {cbdInfoGetId.data?.data
                                                ?.materialInfo?.application ||
                                                '-'}
                                        </div>
                                    </Form.Item>
                                </Fragment>
                            )}

                            {type !== 'accessories' && (
                                <Form.Item name="materialOption" label="Option">
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <TableButton
                                            toolTip={{
                                                placement: 'topLeft',
                                                title: 'Option Modify',
                                                arrowPointAtCenter: true,
                                            }}
                                            size="small"
                                            // title="Modify"
                                            disabled={isDisabled}
                                            onClick={() =>
                                                setVisible({
                                                    id: cbdInfoGetId.data?.data
                                                        .materialInfo.id,
                                                    type: type,
                                                    status: true,
                                                })
                                            }
                                            mode="modify"
                                        />

                                        <div className="textValue">
                                            {option?.itemOption?.finishing ||
                                                '-'}{' '}
                                            {type === 'fabric' &&
                                                (option?.itemOption?.dyeing ||
                                                    '-')}{' '}
                                            {type === 'fabric' &&
                                                (option?.itemOption?.printing ||
                                                    '-')}{' '}
                                            {option?.itemOption?.cw || '-'}
                                            {option?.itemOption?.cw &&
                                                'inch'}{' '}
                                            {option?.itemOption?.weight || '-'}
                                            {(option?.itemOption?.weight &&
                                                option?.itemOption?.weightUom
                                                    ?.name3) ||
                                                'GSM'}{' '}
                                            {option?.itemSizeOption?.size ||
                                                '-'}{' '}
                                            {option?.itemSizeOption?.size &&
                                                option?.itemSizeOption?.sizeUom
                                                    ?.name3}{' '}
                                            {option?.itemSizeOption?.size ||
                                                '-'}{' '}
                                            {option?.itemSizeOption?.size &&
                                                option?.itemSizeOption?.sizeUom
                                                    ?.name3}
                                        </div>
                                    </div>
                                </Form.Item>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </CbdMaterialDetailOutterWrap>
    );
};

const CbdMaterialDetailOutterWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #CbdMaterialDetailWrap {
        min-width: 500px;

        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            .title {
                ${(props) => props.theme.fonts.h7};
            }
        }
        .ant-form-item-control-input-content {
            height: 100%;
        }
        .contentsWrap {
            .content {
                .fakeInput {
                    height: 100%;
                    padding: 4px 11px;
                    background-color: #fff;
                    // border: 1px solid #d9d9d9;
                    border-bottom: 1px solid lightgray;
                    // border-radius: 2px;
                    &[data-disabled='true'] {
                        color: rgba(0, 0, 0, 0.25);
                        cursor: no-drop;
                    }
                }

                .textValue {
                    height: 100%;
                    padding: 4px 11px;
                }
                .ant-form-item-label {
                    label {
                        color: #7f7f7f;
                        ${(props) => props.theme.fonts.h5};
                    }
                }
            }
        }

        .ant-select-selector {
            background-color: white;
        }

        .ant-form-item-control-input-content input {
            background-color: white;
        }

        .ant-select-selection-placeholder {
            ${(props) => props.theme.fonts.h5};
        }

        .ant-form-item-control-input-content > input {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }

        .ant-form-item-control-input-content > div {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }
    }
`;

export default CbdMaterialDetail;
