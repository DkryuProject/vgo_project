import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';

import {
    mclAdhocPostIdAsyncAction,
    mclAdhocGetPagesAsyncAction,
    mclAdhocPostReorderIdAsyncAction,
    mclAdhocGetIdAsyncAction,
} from 'store/mcl/adhoc/reducer';
import moment from 'moment';
import { Tooltip } from 'components/common/tooltip';
// import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { Space, Form, Drawer } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import AdhocAssign from './AdhocAssign';
import AdhocMaterialWrite from './AdhocMaterialWrite';
import { Ellipsis, Select, DatePicker, Input } from 'components/UI/atoms';
import {
    companyGetAddressApi,
    companyGetRelationTypeApi,
} from 'core/api/company/company';
import { useQuery } from 'react-query';
import { commonPortGetSearchApi } from 'core/api/common/port';
import {
    commonBasicGetListsApi,
    commonBasicGetUomApi,
} from 'core/api/common/basic';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AdhocWrite = (props) => {
    const { initialShow, show, onShow, onLeftSplit } = props;
    const adhocId = show?.adhocWrite?.id;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const rowKey = 'id';
    const loadingTableRef = useRef();
    const dischargeTableRef = useRef();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();

    const [visible, setVisible] = useState({
        type: null,
        status: false,
    });

    const [port, setPort] = useState({
        loading: null,
        discharge: null,
    });
    const [dataSource, setDataSource] = useState([]);
    const pagination = {
        current: 1,
        pageSize: 15,
        searchKeyword: '',
    };

    const partialShipment = useMemo(
        () => [
            { id: 0, name: 'NOT ALLOWED' },
            { id: 1, name: 'ALLOWED' },
        ],
        []
    );

    const [portSearchKeyword, setPortSearchKeyword] = useState('');
    const [materialItems, setMaterialItems] = useState({});
    const [adhocAssign, setAdhocAssign] = useState({
        status: false,
    });

    const mclAdhocPostId = useSelector(
        (state) => state.mclAdhocReducer.post.id
    );
    const handleMclAdhocPostId = useCallback(
        (payload) => dispatch(mclAdhocPostIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclAdhocPostIdInit = useCallback(
        () => dispatch(mclAdhocPostIdAsyncAction.initial()),
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

    const mclAdhocPostReorderId = useSelector(
        (state) => state.mclAdhocReducer.post.reorderId
    );
    const handleMclAdhocPostReorderId = useCallback(
        (payload) =>
            dispatch(mclAdhocPostReorderIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclAdhocPostReorderIdInit = useCallback(
        () => dispatch(mclAdhocPostReorderIdAsyncAction.initial()),
        [dispatch]
    );

    const handleMclAdhocGetPages = useCallback(
        (payload) => dispatch(mclAdhocGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const handleSubmit = useCallback(
        (values) => {
            if (adhocId) {
                // re-publish
                // color 확인해보기
                const { orderID, estimatedDate, infactoryDate, exMill } =
                    mclAdhocGetId.data?.data?.adhocOrder || {};

                values['estimatedDate'] =
                    typeof values['estimatedDate'] === 'string'
                        ? estimatedDate
                        : moment(values['estimatedDate']).format('YYYY-MM-DD');
                values['infactoryDate'] =
                    typeof values['infactoryDate'] === 'string'
                        ? infactoryDate
                        : moment(values['infactoryDate']).format('YYYY-MM-DD');
                values['exMill'] =
                    typeof values['exMill'] === 'string'
                        ? exMill
                        : moment(values['exMill']).format('YYYY-MM-DD');

                if (values['estimatedDate'] >= values['infactoryDate']) {
                    return handleNotification({
                        type: 'error',
                        message: 'Error',
                        description:
                            'Estimate Time of Arrival (ETA) cannot be less than or equal to Ship Date (ETD)',
                    });
                }

                values['dischargePort'] = port.discharge.id;
                values['dischargeBasicCountry'] = port.discharge.name6; // 국가 ID
                values['loadingPort'] = port.loading.id;
                values['loadingBasicCountry'] = port.loading.name6; // 국가 ID
                return handleMclAdhocPostReorderId({
                    id: orderID,
                    data: {
                        orderInfo: Object.keys(values).reduce((acc, cur) => {
                            if (
                                [
                                    'actualColor',
                                    'orderUomId',
                                    'orderedQty',
                                    'unitPrice',
                                    'usagePlaceID',
                                    'color',
                                ].includes(cur)
                            ) {
                                return acc;
                            }
                            acc[cur] = values[cur];
                            return acc;
                        }, {}),
                        orderItemInfos: [
                            {
                                categoryID: materialItems.categoryID,
                                materialInfoID: materialItems.materialInfoID,
                                materialOfferID: materialItems?.materialOfferID,
                                orderUomId: values?.orderUomId,
                                orderedQty: values?.orderedQty,
                                // unitPrice: materialItems?.unitPrice,
                                unitPrice: values?.unitPrice,
                                actualColor: values?.actualColor || null,
                                color: values.color,
                            },
                        ],
                    },
                });
            } else {
                // 등록

                if (
                    moment(values['estimatedDate']).format('YYYY-MM-DD') >=
                    moment(values['infactoryDate']).format('YYYY-MM-DD')
                ) {
                    return handleNotification({
                        type: 'error',
                        message: 'Error',
                        description:
                            'Infactory Date cannot be less than or equal to Ship Date',
                    });
                }

                values['estimatedDate'] = moment(
                    values['estimatedDate']
                ).format('YYYY-MM-DD');
                values['infactoryDate'] = moment(
                    values['infactoryDate']
                ).format('YYYY-MM-DD');
                values['exMill'] = moment(values['exMill']).format(
                    'YYYY-MM-DD'
                );

                if (!port.discharge || !port.loading) {
                    return handleNotification({
                        type: 'error',
                        message: 'Error',
                        description:
                            'Port of Loading, Port of Discharge required',
                    });
                }

                values['dischargePort'] = port.discharge.id;
                values['dischargeBasicCountry'] = port.discharge.name6; // 국가 ID
                values['loadingPort'] = port.loading.id;
                values['loadingBasicCountry'] = port.loading.name6; // 국가 ID
                return handleMclAdhocPostId({
                    orderInfo: Object.keys(values).reduce((acc, cur) => {
                        // 제거
                        if (
                            [
                                'actualColor',
                                'orderUomId',
                                'orderedQty',
                                'unitPrice',
                                'usagePlaceID',
                                'color',
                            ].includes(cur)
                        ) {
                            return acc;
                        }
                        acc[cur] = values[cur];
                        return acc;
                    }, {}),

                    orderItemInfos: [
                        {
                            categoryID: materialItems?.categoryID,
                            materialInfoID: materialItems?.materialInfoID,
                            materialOfferID: materialItems?.materialOfferID,
                            orderUomId: values?.orderUomId,
                            orderedQty: values?.orderedQty,
                            // type: materialItems.type,
                            // unitPrice: materialItems?.unitPrice,
                            unitPrice: values?.unitPrice,
                            actualColor: values?.actualColor || null,
                            // usagePlaceID: values.usagePlaceID,
                            color: values.color,
                        },
                    ],
                });
            }
        },
        [
            adhocId,
            port,
            materialItems,
            mclAdhocGetId,
            handleMclAdhocPostId,
            handleMclAdhocPostReorderId,
            handleNotification,
        ]
    );

    // 조회
    useEffect(() => {
        if (adhocId) {
            handleMclAdhocGetId(adhocId);
        }

        return () => handleMclAdhocGetIdInit();
    }, [adhocId, handleMclAdhocGetId, handleMclAdhocGetIdInit]);

    // 조회 후 값 삽입
    useEffect(() => {
        if (adhocId && mclAdhocGetId.data) {
            const {
                supplier,
                shipTo,
                consignee,
                forwarder,
                shippingMethod,
                incoterms,
                paymentTerm,
                paymentPeriod,
                paymentBase,
                estimatedDate,
                infactoryDate,
                exMill,
                plusTolerance,
                minusTolerance,
                currency,
                memo,
                dischargePort,
                dischargeBasicCountry,
                loadingPort,
                loadingBasicCountry,
            } = mclAdhocGetId.data?.data?.adhocOrder || {};
            const _partialShipment =
                mclAdhocGetId.data?.data?.adhocOrder?.partialShipment;

            const {
                materialInfo,
                materialOffer,
                color,
                orderedUom,
                orderedQty,
                unitPrice,
            } = mclAdhocGetId.data?.data?.adhocOrderItems[0] || {};
            const { category, id, type } = materialInfo || {};

            // 포트와 포트에 대한 하는 국가를 결합
            setPort({
                loading: { ...loadingPort, name3: loadingBasicCountry?.name1 },
                discharge: {
                    ...dischargePort,
                    name3: dischargeBasicCountry?.name1,
                },
            });

            const data = {
                item: [
                    {
                        id: materialInfo?.id,
                        materialInfo: materialInfo,
                        materialOffers: [materialOffer],
                    },
                ],
                categoryID: category?.id,
                materialInfoID: Number(id),
                materialOfferID: materialOffer?.id,
                type: type,
                unitPrice: materialOffer?.unitPrice,
            };
            setMaterialItems(data);

            form.setFieldsValue({
                sellingCompanyID: supplier.companyID,
                sellingCompanyAddressID: supplier?.address?.id,
                forwarderCompanyID: forwarder?.companyID,
                forwardCompanyAddressID: forwarder?.address?.id,
                shipToCompanyID: shipTo?.companyID,
                shipToCompanyAddressID: shipTo?.address?.id,
                consigneeCompanyID: consignee?.companyID,
                consigneeCompanyAddressID: consignee?.address?.id,
                shippingMethod: shippingMethod?.id,

                incoterms: incoterms?.id,
                paymentTerm: paymentTerm?.id,
                paymentPeriod: paymentPeriod?.id,
                paymentBase: paymentBase?.id,

                estimatedDate: estimatedDate && moment(estimatedDate),
                infactoryDate: infactoryDate && moment(infactoryDate),
                exMill: exMill && moment(exMill),

                partialShipment: _partialShipment,
                plusTolerance: plusTolerance,
                minusTolerance: minusTolerance,
                currency: currency?.id,
                memo: memo,
                portOfLoading: `${loadingPort.name1}${
                    loadingBasicCountry.name1 && ', '
                }${loadingBasicCountry.name1}`,
                portOfDischarge: `${dischargePort.name1}${
                    dischargeBasicCountry.name1 && ', '
                }${dischargeBasicCountry.name1}`,

                color: color,
                orderUomId: orderedUom?.id,
                orderedQty: orderedQty,
                unitPrice: unitPrice,
                // usagePlaceID: usagePlace?.name,
            });
        }
    }, [
        mclAdhocGetId,
        form,
        adhocId,
        partialShipment,
        setPort,
        setMaterialItems,
    ]);

    // WorkPlace 조회
    const {
        data: getCompanyAddressBySupplierId,
        refetch: loadCompanyAddressBySupplierId,
    } = useQuery(
        `companyGetAddressApiSupplier${form.getFieldValue('sellingCompanyID')}`,
        () => companyGetAddressApi(form.getFieldValue('sellingCompanyID')),
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    sellingCompanyAddressID: data?.list?.find(
                        (v) => v.representitive === 1
                    )?.id,
                });
            },
            enabled: true,
            cacheTime: 0,
            retry: 0,
        }
    );

    const {
        data: getCompanyAddressByForwarderId,
        refetch: loadCompanyAddressByForwarderId,
    } = useQuery(
        `companyGetAddressApiForwarder${form.getFieldValue(
            'forwarderCompanyID'
        )}`,
        () => companyGetAddressApi(form.getFieldValue('forwarderCompanyID')),
        {
            onSuccess: (data) =>
                form.setFieldsValue({
                    forwarderCompanyAddressID: data?.list?.find(
                        (v) => v.representitive === 1
                    )?.id,
                }),
            enabled: true,
            cacheTime: 0,
            retry: 0,
        }
    );

    const {
        data: getCompanyAddressByShipToId,
        refetch: loadCompanyAddressByShipToId,
    } = useQuery(
        `companyGetAddressApiShipTo${form.getFieldValue('shipToCompanyID')}`,
        () => companyGetAddressApi(form.getFieldValue('shipToCompanyID')),
        {
            onSuccess: (data) =>
                form.setFieldsValue({
                    shipToCompanyAddressID: data?.list?.find(
                        (v) => v.representitive === 1
                    )?.id,
                }),
            enabled: true,
            cacheTime: 0,
            retry: 0,
        }
    );

    const {
        data: getCompanyAddressByBillToId,
        refetch: loadCompanyAddressByBillToId,
    } = useQuery(
        `companyGetAddressApiBillTo${form.getFieldValue('consigneeCompanyID')}`,
        () => companyGetAddressApi(form.getFieldValue('consigneeCompanyID')),
        {
            onSuccess: (data) =>
                form.setFieldsValue({
                    consigneeCompanyAddressID: data?.list?.find(
                        (v) => v.representitive === 1
                    )?.id,
                }),
            enabled: true,
            cacheTime: 0,
            retry: 0,
        }
    );

    // Port 조회 및 검색
    const { isFetching: isLoadingGetPortBySearchKeyword } = useQuery(
        `commonPortGetSearchApi${portSearchKeyword}`,
        () => commonPortGetSearchApi(portSearchKeyword),
        {
            onSuccess: (data) => {
                setDataSource(data?.list);
            },
            onError: () => {
                setDataSource([]);
            },
            enabled: true,
            cacheTime: 0,
            retry: 0,
        }
    );

    // 등록
    useEffect(() => {
        if (mclAdhocPostId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclAdhocPostId.error.message,
            });
        } else if (mclAdhocPostId.data) {
            handleMclAdhocGetPages(pagination);
            onLeftSplit();
            onShow(initialShow);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'AD HOC generation success',
            });
        }

        return () => handleMclAdhocPostIdInit();
    }, [
        mclAdhocPostId,
        pagination,
        initialShow,
        onLeftSplit,
        onShow,
        handleMclAdhocGetPages,
        handleMclAdhocPostIdInit,
        handleNotification,
    ]);

    useEffect(() => {
        if (mclAdhocPostReorderId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclAdhocPostReorderId.error.message,
            });
        } else if (mclAdhocPostReorderId.data) {
            handleMclAdhocGetPages(pagination);
            onLeftSplit();
            onShow(initialShow);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'AD HOC Re-publish Success',
            });
        }

        return () => handleMclAdhocPostReorderIdInit();
    }, [
        mclAdhocPostReorderId,
        pagination,
        initialShow,
        onLeftSplit,
        onShow,
        handleMclAdhocGetPages,
        handleMclAdhocPostReorderIdInit,
        handleNotification,
    ]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Port Name',
                dataIndex: 'name1',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: '3Code',
                dataIndex: 'name2',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'Locode',
                dataIndex: 'name5',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'Country',
                dataIndex: 'name3',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
        ],
        []
    );

    const title = () => (
        <div className="titleWrap">
            <div className="title"></div>
            <div className="functionWrap">
                <Space>
                    <Input
                        type="text"
                        value={portSearchKeyword}
                        onChange={(e) => setPortSearchKeyword(e.target.value)}
                        placeholder="Insert Port name"
                        bordered={false}
                    />

                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Save item',
                            arrowPointAtCenter: true,
                        }}
                        mode="save"
                        size="small"
                        onClick={() => {
                            const table =
                                visible.type === 'loading'
                                    ? loadingTableRef
                                    : dischargeTableRef;
                            const type =
                                visible.type === 'loading'
                                    ? 'portOfLoading'
                                    : 'portOfDischarge';

                            // 보여주는 셋팅
                            form.setFieldsValue({
                                [type]: `${
                                    table.current.selectedRows[0].name1
                                }${
                                    table.current.selectedRows[0].name3 && ', '
                                } ${table.current.selectedRows[0].name3}`,
                            });

                            // 실제 서버에 가는 데이터 셋팅
                            setPort((port) => ({
                                ...port,
                                [visible.type]: table.current.selectedRows[0],
                            }));
                            setVisible({ status: false });
                        }}
                    />
                </Space>
            </div>
        </div>
    );

    return (
        <AdhocWriteWrap>
            <div id="adhocWriteWrap">
                <Drawer
                    title=""
                    width="1000px"
                    placement="right"
                    closable={false}
                    onClose={() =>
                        setAdhocAssign((adhocAssign) => ({
                            ...adhocAssign,
                            status: false,
                        }))
                    }
                    visible={adhocAssign.status}
                >
                    {adhocAssign?.type === 'write' ? (
                        <AdhocMaterialWrite onAdhocAssign={setAdhocAssign} />
                    ) : (
                        <AdhocAssign
                            // type="fabric"
                            adhocAssign={adhocAssign}
                            onAdhocAssign={setAdhocAssign}
                            onMaterialItems={setMaterialItems}
                        />
                    )}
                </Drawer>
                <Drawer
                    title=""
                    width="500px"
                    placement="right"
                    closable={false}
                    onClose={() =>
                        setVisible((visible) => ({ ...visible, status: false }))
                    }
                    visible={visible.status}
                    style={{ fontSize: '0.6875rem' }}
                >
                    <div className="titleWrap">
                        <div
                            className="title"
                            style={{
                                fontSize: '0.6875rem',
                                fontWeight: 'bold',
                            }}
                        >
                            Port Select (Locode)
                        </div>
                    </div>
                    <div className="contentsWrap" style={{ marginTop: '1rem' }}>
                        {visible.type === 'loading' && (
                            <CustomTable
                                ref={loadingTableRef}
                                title={title}
                                rowKey={rowKey}
                                initialColumns={columns}
                                dataSource={dataSource}
                                rowSelection={true}
                                rowSelectionType="radio"
                                loading={isLoadingGetPortBySearchKeyword}
                                pagination={false}
                            />
                        )}

                        {visible.type === 'discharge' && (
                            <CustomTable
                                ref={dischargeTableRef}
                                title={title}
                                rowKey={rowKey}
                                initialColumns={columns}
                                dataSource={dataSource}
                                rowSelection={true}
                                rowSelectionType="radio"
                                loading={isLoadingGetPortBySearchKeyword}
                                pagination={false}
                            />
                        )}
                    </div>
                </Drawer>

                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <CaretRightOutlined />
                            Adhoc Write
                        </Space>
                    </div>
                    <div className="functionWrap">
                        <Space>
                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Save item',
                                    arrowPointAtCenter: true,
                                }}
                                mode="save"
                                size="small"
                                disabled={mclAdhocPostId.isLoading}
                                onClick={() => form?.submit()}
                            />

                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Close',
                                    arrowPointAtCenter: true,
                                }}
                                mode="cancel"
                                size="small"
                                disabled={mclAdhocPostId.isLoading}
                                onClick={() => {
                                    onLeftSplit();
                                    onShow({
                                        ...initialShow,
                                        AdhocWrite: {
                                            status: false,
                                        },
                                    });
                                }}
                            />
                        </Space>
                    </div>
                </div>
                <div className="contentsWrap">
                    <div className="content">
                        <Form
                            {...layout}
                            form={form}
                            onFinish={handleSubmit}
                            validateMessages={handleValidateMessage}
                            initialValues={{
                                plusTolerance: 0,
                                minusTolerance: 0,
                                shippingMethod: 446, // Sea / FCL 고정
                                incoterms: 443, // FOB 고정
                                partialShipment: 1, // 1 -> ALLOWED 고정
                                currency: 314, // USD 고정
                            }}
                        >
                            <Form.Item
                                name="sellingCompanyID"
                                label="Supplier"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Supplier is required',
                                    },
                                ]}
                            >
                                <Select
                                    _key="companyID"
                                    _value="companyID"
                                    _text="companyName"
                                    requestKey="companyGetRelationTypeApiSupplier"
                                    onRequestApi={() =>
                                        companyGetRelationTypeApi('SUPPLIER')
                                    }
                                    onChange={() =>
                                        loadCompanyAddressBySupplierId()
                                    }
                                    isDisabled={
                                        show.adhocWrite?.type?.toLowerCase() ===
                                        're-publish'
                                            ? true
                                            : false
                                    }
                                    placeholder="Select Supplier name"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="sellingCompanyAddressID"
                                label="Supplier Workplace"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Supplier address is required',
                                    },
                                ]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="workPlace"
                                    responseData={
                                        getCompanyAddressBySupplierId?.list
                                    }
                                    isDisabled={
                                        show.adhocWrite?.type?.toLowerCase() ===
                                        're-publish'
                                            ? true
                                            : false
                                    }
                                    placeholder="Select Workplace name"
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item
                                name="forwarderCompanyID"
                                label="Forwarder"
                            >
                                <Select
                                    _key="companyID"
                                    _value="companyID"
                                    _text="companyName"
                                    requestKey="companyGetRelationTypeApiForwarder"
                                    onRequestApi={() =>
                                        companyGetRelationTypeApi('FORWARDER')
                                    }
                                    onChange={() =>
                                        loadCompanyAddressByForwarderId()
                                    }
                                    isDisabled={
                                        show.adhocWrite?.type?.toLowerCase() ===
                                        're-publish'
                                            ? true
                                            : false
                                    }
                                    placeholder="Select Forwarder name"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="forwarderCompanyAddressID"
                                label="Forwarder Workplace"
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="workPlace"
                                    responseData={
                                        getCompanyAddressByForwarderId?.list
                                    }
                                    isDisabled={
                                        show.adhocWrite?.type?.toLowerCase() ===
                                        're-publish'
                                            ? true
                                            : false
                                    }
                                    placeholder="Select Workplace name"
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item
                                name="shipToCompanyID"
                                label="Ship To (Consignee)"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Ship To is required',
                                    },
                                ]}
                            >
                                <Select
                                    _key="companyID"
                                    _value="companyID"
                                    _text="companyName"
                                    requestKey="companyGetRelationTypeApiShipTo"
                                    onRequestApi={() =>
                                        companyGetRelationTypeApi('ALL')
                                    }
                                    onChange={() =>
                                        loadCompanyAddressByShipToId()
                                    }
                                    isDisabled={
                                        show.adhocWrite?.type?.toLowerCase() ===
                                        're-publish'
                                            ? true
                                            : false
                                    }
                                    placeholder="Select Ship to name"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="shipToCompanyAddressID"
                                label="Ship To (Consignee) Workplace"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Ship To address is required',
                                    },
                                ]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="workPlace"
                                    responseData={
                                        getCompanyAddressByShipToId?.list
                                    }
                                    isDisabled={
                                        show.adhocWrite?.type?.toLowerCase() ===
                                        're-publish'
                                            ? true
                                            : false
                                    }
                                    placeholder="Select Workplace name"
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item
                                name="consigneeCompanyID"
                                label="Bill To"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Bill To is required',
                                    },
                                ]}
                            >
                                <Select
                                    _key="companyID"
                                    _value="companyID"
                                    _text="companyName"
                                    requestKey="companyGetRelationTypeApiBillTo"
                                    onRequestApi={() =>
                                        companyGetRelationTypeApi('ALL')
                                    }
                                    onChange={() =>
                                        loadCompanyAddressByBillToId()
                                    }
                                    isDisabled={
                                        show.adhocWrite?.type?.toLowerCase() ===
                                        're-publish'
                                            ? true
                                            : false
                                    }
                                    placeholder="Select Bill to name"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="consigneeCompanyAddressID"
                                label="Bill To Workplace"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Bill To address is required',
                                    },
                                ]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="workPlace"
                                    responseData={
                                        getCompanyAddressByBillToId?.list
                                    }
                                    isDisabled={
                                        show.adhocWrite?.type?.toLowerCase() ===
                                        're-publish'
                                            ? true
                                            : false
                                    }
                                    placeholder="Select Workplace name"
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Ship Mode"
                                name="shippingMethod"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text={(v) => {
                                        return `${v.name1} / ${v.name2}`;
                                    }}
                                    requestKey="commonBasicGetListsApiShippingMethod"
                                    onRequestApi={() =>
                                        commonBasicGetListsApi(
                                            'shipping_method'
                                        )
                                    }
                                    placeholder="Select Ship mode"
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Incoterms"
                                name="incoterms"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name2"
                                    requestKey="commonBasicGetListsApiIncoterms"
                                    onRequestApi={() =>
                                        commonBasicGetListsApi('incoterms')
                                    }
                                    placeholder="Select Inco terms"
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item
                                name="paymentTerm"
                                label="Terms of Payment"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Term is required',
                                    },
                                ]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name1"
                                    requestKey="commonBasicGetListsApiPaymentTerms"
                                    onRequestApi={() =>
                                        commonBasicGetListsApi('payment_terms')
                                    }
                                    placeholder="Select Payment terms"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="paymentPeriod"
                                label="Period of Payment"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Period is required',
                                    },
                                ]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name1"
                                    requestKey="commonBasicGetListsApiPaymentPeriod"
                                    onRequestApi={() =>
                                        commonBasicGetListsApi('payment_period')
                                    }
                                    placeholder="Select Payment period"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="paymentBase"
                                label="Base of Payment"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Base is required',
                                    },
                                ]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name1"
                                    requestKey="commonBasicGetListsApiPaymentBase"
                                    onRequestApi={() =>
                                        commonBasicGetListsApi('payment_base')
                                    }
                                    placeholder="Select Payment period"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Ex-Mill Date"
                                name="exMill"
                                rules={[{ required: true }]}
                            >
                                <DatePicker bordered={false} />
                            </Form.Item>
                            <Form.Item
                                label="Ship Date (ETD)"
                                name="estimatedDate"
                                rules={[{ required: true }]}
                            >
                                <DatePicker bordered={false} />
                            </Form.Item>
                            <Form.Item
                                label="Estimate Time of Arrival (ETA)"
                                name="infactoryDate"
                                rules={[{ required: true }]}
                            >
                                <DatePicker bordered={false} />
                            </Form.Item>

                            <Form.Item
                                label="Partial Shipment"
                                name="partialShipment"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name"
                                    responseData={partialShipment}
                                    placeholder="Select Partial shipment"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item label="Ship Tolerance ( + / - )">
                                <Form.Item
                                    name="plusTolerance"
                                    style={{
                                        display: 'inline-block',
                                        width: 'calc(30% - 0.5rem)',
                                    }}
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        type="number"
                                        min={0}
                                        formatter={(value) => `${value}%`}
                                        parser={(value) =>
                                            value.replace('%', '')
                                        }
                                        bordered={false}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="minusTolerance"
                                    style={{
                                        display: 'inline-block',
                                        width: 'calc(30% - 0.5rem)',
                                        margin: '0 0.5rem',
                                    }}
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        type="number"
                                        max={0}
                                        formatter={(value) => `${value}%`}
                                        parser={(value) =>
                                            value.replace('%', '')
                                        }
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Form.Item>

                            <Form.Item
                                label="Currency"
                                name="currency"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name2"
                                    requestKey="commonBasicGetListsApiCurrency"
                                    onRequestApi={() =>
                                        commonBasicGetListsApi('currency')
                                    }
                                    placeholder="Select Currency"
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item label="Handing Information" name="memo">
                                <Input
                                    type="text"
                                    placeholder="Insert Handing Information"
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item
                                name="portOfLoading"
                                label="Port of Loading"
                                // rules={[{ required: true }]}
                            >
                                {/* <Input
                                    type="text"
                                    value={
                                        port?.loading &&
                                        `${port.loading?.name1}${
                                            port.loading?.name3 && ','
                                        } ${port.loading?.name3}`
                                    }
                                    onClick={() =>
                                        setVisible({
                                            type: 'loading',
                                            status: true,
                                        })
                                    }
                                    isReadOnly
                                    placeholder="Select Port of Loading"
                                    bordered={false}
                                /> */}

                                <Input
                                    type="text"
                                    onClick={() =>
                                        setVisible({
                                            type: 'loading',
                                            status: true,
                                        })
                                    }
                                    isReadOnly
                                    placeholder="Select Port of Loading"
                                    // isDisabled={isCheckedDisabled}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="portOfDischarge"
                                label="Port of Discharge"
                                rules={[{ required: true }]}
                            >
                                {/* <Input
                                    type="text"
                                    value={
                                        port?.discharge &&
                                        `${port.discharge?.name1}${
                                            port.discharge?.name3 && ','
                                        } ${port.discharge?.name3}`
                                    }
                                    onClick={() =>
                                        setVisible({
                                            type: 'discharge',
                                            status: true,
                                        })
                                    }
                                    isReadOnly
                                    placeholder="Select Port of Discharge"
                                    bordered={false}
                                /> */}
                                <Input
                                    type="text"
                                    onClick={() =>
                                        setVisible({
                                            type: 'discharge',
                                            status: true,
                                        })
                                    }
                                    isReadOnly
                                    placeholder="Select Port of Discharge"
                                    // isDisabled={isCheckedDisabled}
                                    bordered={false}
                                />
                            </Form.Item>

                            {!!Object.keys(materialItems).length ? (
                                <>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <TableButton
                                            toolTip={{
                                                placement: 'topLeft',
                                                title: 'Delete Item',
                                                arrowPointAtCenter: true,
                                            }}
                                            mode="delete"
                                            size="small"
                                            onClick={() => {
                                                return setMaterialItems({});
                                            }}
                                        />
                                    </div>
                                    <CustomTable
                                        title={() => (
                                            <Space>
                                                <CaretRightOutlined />
                                                ITEM INFORMATION
                                            </Space>
                                        )}
                                        rowKey="id"
                                        initialColumns={[
                                            {
                                                title: 'Supplier',
                                                dataIndex: 'materialInfo',
                                                align: 'left',
                                                render: (data) => {
                                                    const { supplier } =
                                                        data || {};
                                                    return (
                                                        <Tooltip
                                                            title={
                                                                supplier?.name
                                                            }
                                                        >
                                                            {supplier?.name ||
                                                                '-'}
                                                        </Tooltip>
                                                    );
                                                },
                                            },
                                            {
                                                title: 'Item name and Number',
                                                dataIndex: 'materialInfo',
                                                align: 'left',
                                                render: (data, record) => {
                                                    const {
                                                        category,
                                                        item_name,
                                                    } = data || {};
                                                    const { materialOffers } =
                                                        record || [];
                                                    const outputTooltip = (
                                                        <div>
                                                            <div>
                                                                * Category :{' '}
                                                                {
                                                                    category?.typeA
                                                                }
                                                                {category?.typeB &&
                                                                    ' / '}
                                                                {
                                                                    category?.typeB
                                                                }
                                                                {category?.typeC &&
                                                                    ' / '}
                                                                {
                                                                    category?.typeC
                                                                }
                                                            </div>
                                                            <div>
                                                                * Item name :{' '}
                                                                {item_name ||
                                                                    '-'}
                                                            </div>

                                                            <div>
                                                                * Material No. :{' '}
                                                                {materialOffers
                                                                    ?.filter(
                                                                        (v) =>
                                                                            v?.materialNo
                                                                    )
                                                                    ?.map(
                                                                        (
                                                                            v,
                                                                            i,
                                                                            arr
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    v.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    v?.materialNo
                                                                                }
                                                                                {arr?.length >
                                                                                    i +
                                                                                        1 &&
                                                                                    ','}
                                                                            </span>
                                                                        )
                                                                    ) || '-'}
                                                            </div>
                                                        </div>
                                                    );
                                                    const value = (
                                                        <div>
                                                            <Ellipsis>
                                                                * Category :{' '}
                                                                {
                                                                    category?.typeA
                                                                }
                                                                {category?.typeB &&
                                                                    ' / '}
                                                                {
                                                                    category?.typeB
                                                                }
                                                                {category?.typeC &&
                                                                    ' / '}
                                                                {
                                                                    category?.typeC
                                                                }
                                                            </Ellipsis>
                                                            <Ellipsis>
                                                                * Item name :{' '}
                                                                {item_name ||
                                                                    '-'}
                                                            </Ellipsis>
                                                            <Ellipsis>
                                                                * Material No. :{' '}
                                                                {materialOffers
                                                                    ?.filter(
                                                                        (v) =>
                                                                            v?.materialNo
                                                                    )
                                                                    ?.map(
                                                                        (
                                                                            v,
                                                                            i,
                                                                            arr
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    v.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    v?.materialNo
                                                                                }
                                                                                {arr?.length >
                                                                                    i +
                                                                                        1 &&
                                                                                    ','}
                                                                            </span>
                                                                        )
                                                                    ) || '-'}
                                                            </Ellipsis>
                                                        </div>
                                                    );
                                                    return (
                                                        <Tooltip
                                                            title={
                                                                outputTooltip
                                                            }
                                                        >
                                                            {value}
                                                        </Tooltip>
                                                    );
                                                },
                                            },
                                            {
                                                title: 'Item Detail Information',
                                                dataIndex: 'materialInfo',
                                                align: 'left',
                                                render: (data, record) => {
                                                    const {
                                                        type,
                                                        fabricContents,
                                                        constructionType,
                                                        constructionEpi,
                                                        constructionPpi,
                                                        shrinkagePlus,
                                                        shrinkageMinus,
                                                        yarnSizeWrap,
                                                        yarnSizeWeft,
                                                        subsidiaryDetail,
                                                    } = data || {};
                                                    const outputTooltip = (
                                                        <div>
                                                            {type ===
                                                            'fabric' ? (
                                                                <>
                                                                    <div>
                                                                        *
                                                                        Contents
                                                                        :{' '}
                                                                        {fabricContents?.map(
                                                                            (
                                                                                v
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        v.id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        v
                                                                                            .contents
                                                                                            .name
                                                                                    }{' '}
                                                                                    {
                                                                                        v.rate
                                                                                    }

                                                                                    %{' '}
                                                                                </span>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        *
                                                                        Construction:{' '}
                                                                        {constructionType ||
                                                                            '-'}{' '}
                                                                        {constructionEpi ||
                                                                            '-'}{' '}
                                                                        {constructionPpi ||
                                                                            '-'}{' '}
                                                                        {yarnSizeWrap ||
                                                                            '-'}{' '}
                                                                        {yarnSizeWeft ||
                                                                            '-'}{' '}
                                                                        {shrinkagePlus &&
                                                                            '+'}
                                                                        {shrinkagePlus ||
                                                                            '-'}{' '}
                                                                        {shrinkageMinus ||
                                                                            '-'}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div>
                                                                    * Item
                                                                    Detail :{' '}
                                                                    {subsidiaryDetail ||
                                                                        '-'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                    const output = (
                                                        <div>
                                                            {type ===
                                                            'fabric' ? (
                                                                <>
                                                                    <Ellipsis>
                                                                        *
                                                                        Contents
                                                                        :{' '}
                                                                        {fabricContents?.map(
                                                                            (
                                                                                v
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        v.id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        v
                                                                                            .contents
                                                                                            .name
                                                                                    }{' '}
                                                                                    {
                                                                                        v.rate
                                                                                    }

                                                                                    %{' '}
                                                                                </span>
                                                                            )
                                                                        )}
                                                                    </Ellipsis>
                                                                    <Ellipsis>
                                                                        *
                                                                        Construction:{' '}
                                                                        {constructionType ||
                                                                            '-'}{' '}
                                                                        {constructionEpi ||
                                                                            '-'}{' '}
                                                                        {constructionPpi ||
                                                                            '-'}{' '}
                                                                        {yarnSizeWrap ||
                                                                            '-'}{' '}
                                                                        {yarnSizeWeft ||
                                                                            '-'}{' '}
                                                                        {shrinkagePlus &&
                                                                            '+'}
                                                                        {shrinkagePlus ||
                                                                            '-'}{' '}
                                                                        {shrinkageMinus ||
                                                                            '-'}
                                                                    </Ellipsis>
                                                                </>
                                                            ) : (
                                                                <Ellipsis>
                                                                    * Item
                                                                    Detail :{' '}
                                                                    {subsidiaryDetail ||
                                                                        '-'}
                                                                </Ellipsis>
                                                            )}
                                                        </div>
                                                    );
                                                    return (
                                                        <Tooltip
                                                            title={
                                                                outputTooltip
                                                            }
                                                        >
                                                            {output}
                                                        </Tooltip>
                                                    );
                                                },
                                            },
                                        ]}
                                        dataSource={materialItems?.item}
                                        rowSelection={false}
                                        pagination={false}
                                    />

                                    <div style={{ marginTop: '1rem' }}>
                                        <Form.Item
                                            label="Item Color"
                                            name="color"
                                            rules={[{ required: true }]}
                                        >
                                            <Input
                                                placeholder="Insert color"
                                                bordered={false}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="actualColor"
                                            label="Actual Color"
                                        >
                                            <Select
                                                _key="id"
                                                _value="id"
                                                _text="name1"
                                                requestKey="commonBasicGetListsApiColor"
                                                onRequestApi={() =>
                                                    commonBasicGetListsApi(
                                                        'color'
                                                    )
                                                }
                                                placeholder="Select Color"
                                                bordered={false}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="orderUomId"
                                            label="UOM (Vendor)"
                                            rules={[{ required: true }]}
                                        >
                                            {materialItems?.type ===
                                            'fabric' ? (
                                                <Select
                                                    _key="id"
                                                    _value="id"
                                                    _text="name"
                                                    requestKey="commonBasicGetUomApiLength"
                                                    onRequestApi={() =>
                                                        commonBasicGetUomApi(
                                                            'length'
                                                        )
                                                    }
                                                    onFilter={(v) =>
                                                        v.name === 'yard'
                                                    }
                                                    placeholder="Select UOM"
                                                    bordered={false}
                                                />
                                            ) : (
                                                <Select
                                                    _key="id"
                                                    _value="id"
                                                    _text="name3"
                                                    requestKey="commonBasicGetListsApiUom"
                                                    onRequestApi={() =>
                                                        commonBasicGetListsApi(
                                                            'uom'
                                                        )
                                                    }
                                                    onFilter={(v) =>
                                                        v.name2 ===
                                                            'counting' ||
                                                        v.name2 === 'mass' ||
                                                        v.name2 === 'length'
                                                    }
                                                    placeholder="Select UOM"
                                                    bordered={false}
                                                />
                                            )}
                                        </Form.Item>

                                        <Form.Item
                                            name="unitPrice"
                                            label="Unit Price"
                                            rules={[{ required: true }]}
                                        >
                                            <Input
                                                type="text"
                                                bordered={false}
                                            />

                                            {/* <div className="fakeInput">
                                                {materialItems?.unitPrice}
                                            </div>` */}
                                        </Form.Item>
                                        <Form.Item
                                            name="orderedQty"
                                            label="QTY"
                                            rules={[{ required: true }]}
                                        >
                                            <Input
                                                type="number"
                                                placeholder="insert Qty"
                                                step="1"
                                                bordered={false}
                                            />
                                        </Form.Item>
                                    </div>
                                </>
                            ) : (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <TableButton
                                        toolTip={{
                                            placement: 'topLeft',
                                            title: 'Add item',
                                            arrowPointAtCenter: true,
                                        }}
                                        mode="save"
                                        size="small"
                                        onClick={() => {
                                            return setAdhocAssign({
                                                status: true,
                                            });
                                        }}
                                    >
                                        ITEM SELECT
                                    </TableButton>
                                </div>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </AdhocWriteWrap>
    );
};

const AdhocWriteWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #adhocWriteWrap {
        min-width: 500px;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
            .title {
                ${({ theme }) => theme.fonts.h7};
            }
        }
        .ant-form-item-control-input-content {
            height: 26px;
        }
        .contentsWrap {
            margin-top: 1rem;
            .content {
                .contentTitle {
                    ${({ theme }) => theme.fonts.h5};
                }

                .ant-form-item-label {
                    label {
                        ${(props) => props.theme.fonts.h5};
                    }
                }

                .fakeInput {
                    height: 100%;
                    padding: 4px 11px;
                    background-color: #fff;
                    border-bottom: 1px solid lightgray;
                    border-radius: 0px;
                    ${(props) => props.theme.fonts.h5};
                }
            }
        }
    }
`;

export default React.memo(AdhocWrite);
