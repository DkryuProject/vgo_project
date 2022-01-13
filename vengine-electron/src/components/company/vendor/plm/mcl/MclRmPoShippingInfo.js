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
    mclPoPostIdAsyncAction,
    mclPoGetIdAsyncAction,
    mclPoPutIdAsyncAction,
    mclPoGetPagesAsyncAction,
    mclPoPostReorderIdAsyncAction,
} from 'store/mcl/po/reducer';
import moment from 'moment';
import { Tooltip } from 'components/common/tooltip';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { Space, Form, Drawer } from 'antd';
import { Input, Select, DatePicker } from 'components/UI/atoms';
import { CaretRightOutlined } from '@ant-design/icons';
import {
    companyGetAddressApi,
    companyGetRelationTypeApi,
} from 'core/api/company/company';
import { commonBasicGetListsApi } from 'core/api/common/basic';
import { useQuery } from 'react-query';
import { commonPortGetSearchApi } from 'core/api/common/port';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const MclRmPoShippingInfo = (props) => {
    const {
        match,
        initialShow,
        show,
        onShow,
        onLeftSplit,
        onMoveStep,
        form,
        // 생성된 row id 수정에 필요
        rmPoId,
        onRmPoId,
        onCurrency,
    } = props;
    const { mclOptionId } = match.params || '';

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

    const mclPoGetId = useSelector((state) => state.mclPoReducer.get.id);
    const handleMclPoGetId = useCallback(
        (payload) => dispatch(mclPoGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPoGetIdInit = useCallback(
        () => dispatch(mclPoGetIdAsyncAction.initial()),
        [dispatch]
    );

    const mclPoPostId = useSelector((state) => state.mclPoReducer.post.id);
    const handleMclPoPostId = useCallback(
        (payload) => dispatch(mclPoPostIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPoPostIdInit = useCallback(
        () => dispatch(mclPoPostIdAsyncAction.initial()),
        [dispatch]
    );

    const mclPoPutId = useSelector((state) => state.mclPoReducer.put.id);
    const handleMclPoPutId = useCallback(
        (payload) => dispatch(mclPoPutIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPoPutIdInit = useCallback(
        () => dispatch(mclPoPutIdAsyncAction.initial()),
        [dispatch]
    );

    const mclPoPostReorderId = useSelector(
        (state) => state.mclPoReducer.post.reorderId
    );
    const handleMclPoPostReorderId = useCallback(
        (payload) => dispatch(mclPoPostReorderIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPoPostReorderIdInit = useCallback(
        () => dispatch(mclPoPostReorderIdAsyncAction.initial()),
        [dispatch]
    );

    const handleMclPoGetPages = useCallback(
        (payload) => dispatch(mclPoGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const mclOptionGetId = useSelector(
        (state) => state.mclOptionReducer.get.id
    );

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const handleSubmit = useCallback(
        (values) => {
            if (rmPoId) {
                // 수정
                const {
                    orderID,
                    estimatedDate,
                    infactoryDate,
                    exMill,
                    status,
                } = mclPoGetId.data.data;

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

                // 상태가 Published이면 저장하지 않고 next
                if (
                    status.toLowerCase() === 'published' ||
                    status.toLowerCase() === 'revert'
                ) {
                    // re-published로 오면 재발행 아니면 next
                    if (show.rmPo?.type?.toLowerCase() === 're-publish') {
                        return handleMclPoPostReorderId({
                            id: orderID,
                            data: values,
                        });
                    }
                    return onMoveStep('next');
                }
                return handleMclPoPutId({
                    id: orderID,
                    data: values,
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
                            'Estimate Time of Arrival (ETA) cannot be less than or equal to Ship Date (ETD)',
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

                return handleMclPoPostId({ id: mclOptionId, data: values });
            }
        },
        [
            rmPoId,
            port,
            mclOptionId,
            mclPoGetId,
            show,
            onMoveStep,
            // mclOptionGetId,
            handleMclPoPutId,
            handleMclPoPostId,
            handleMclPoPostReorderId,
            handleNotification,
        ]
    );

    // 조회
    useEffect(() => {
        if (rmPoId) {
            handleMclPoGetId(rmPoId);
        }
    }, [rmPoId, handleMclPoGetId]);

    // 조회 후 값 삽입
    useEffect(() => {
        if (rmPoId && mclPoGetId.data) {
            const {
                supplier,
                forwarder,
                shipTo,
                consignee,
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
            } = mclPoGetId.data.data;
            const _partialShipment = mclPoGetId.data.data.partialShipment;

            // 포트와 포트에 대한 하는 국가를 결합
            setPort({
                loading: { ...loadingPort, name3: loadingBasicCountry?.name1 },
                discharge: {
                    ...dischargePort,
                    name3: dischargeBasicCountry?.name1,
                },
            });

            onCurrency(currency);
            form.setFieldsValue({
                sellingCompanyID: supplier?.companyID,
                sellingCompanyAddressID: supplier?.address?.id,
                forwarderCompanyID: forwarder?.companyID,
                forwarderCompanyAddressID: forwarder?.address?.id,
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
            });
        }
    }, [mclPoGetId, form, rmPoId, partialShipment, setPort, onCurrency]);

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
            onSuccess: (data) => {
                return form.setFieldsValue({
                    shipToCompanyAddressID: data?.list?.find(
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
        if (mclPoPostId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPoPostId.error.message,
            });
        } else if (mclPoPostId.data) {
            onRmPoId(mclPoPostId.data.data);
            handleMclPoGetPages({ id: mclOptionId, data: pagination });
            onMoveStep('next');
            return handleNotification({
                type: 'success',
                message: 'Success',
                description:
                    'Successful creation of MCL PO Shipping information',
            });
        }

        // return () => handleMclPoPostIdInit();
    }, [
        mclPoPostId,
        mclOptionId,
        pagination,
        onMoveStep,
        onRmPoId,
        handleMclPoGetPages,
        // handleMclPoPostIdInit,
        handleNotification,
    ]);

    useEffect(() => {
        return () => handleMclPoPostIdInit();
    }, [handleMclPoPostIdInit]);

    // re-publish
    useEffect(() => {
        if (mclPoPostReorderId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPoPostReorderId.error.message,
            });
        } else if (mclPoPostReorderId.data) {
            // rmPoId를 reorder된 id로 변경 해야 publish 때 new rmPoId로 요청이 된다
            onRmPoId(mclPoPostReorderId.data.data);
            onMoveStep('next');
            handleMclPoGetPages({ id: mclOptionId, data: pagination });
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'MCL Po shipping information re-publish Success',
            });
        }

        // return () => handleMclPoPostReorderIdInit();
    }, [
        mclPoPostReorderId,
        mclOptionId,
        pagination,
        onMoveStep,
        onRmPoId,
        handleMclPoGetPages,
        // handleMclPoPostReorderIdInit,
        handleNotification,
    ]);

    useEffect(() => {
        return () => handleMclPoPostReorderIdInit();
    }, [handleMclPoPostReorderIdInit]);

    // 수정
    useEffect(() => {
        if (mclPoPutId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPoPutId.error.message,
            });
        } else if (mclPoPutId.data) {
            handleMclPoGetPages({ id: mclOptionId, data: pagination });
            onMoveStep('next');
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successfully modify MCL PO Shipping information',
            });
        }

        // return () => handleMclPoPutIdInit();
    }, [
        mclPoPutId,
        mclOptionId,
        pagination,
        onMoveStep,
        handleMclPoGetPages,
        handleMclPoPutIdInit,
        handleNotification,
    ]);

    // 초기화
    useEffect(() => {
        return () => {
            handleMclPoGetIdInit();
            handleMclPoPutIdInit();
        };
    }, [handleMclPoGetIdInit, handleMclPoPutIdInit]);

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
                dataIndex: 'name4',
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
        <MclRmPoShippingWrap>
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
                        style={{ fontSize: '0.6875rem', fontWeight: 'bold' }}
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
                        SHIPPING INFORMATION
                    </Space>
                </div>
                <div className="functionWrap">
                    <Space>
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
                                onShow({
                                    ...initialShow,
                                    rmPo: {
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
                            shipToCompanyID:
                                mclOptionGetId.data?.data?.factory?.companyID,
                            consigneeCompanyID:
                                userGetEmail.data?.data?.company?.companyID,
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
                                    show.rmPo?.type?.toLowerCase() ===
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
                                    show.rmPo?.type?.toLowerCase() ===
                                    're-publish'
                                        ? true
                                        : false
                                }
                                placeholder="Select Workplace name"
                                bordered={false}
                            />
                        </Form.Item>

                        <Form.Item name="forwarderCompanyID" label="Forwarder">
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
                                    show.rmPo?.type?.toLowerCase() ===
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
                                    show.rmPo?.type?.toLowerCase() ===
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
                                onChange={() => loadCompanyAddressByShipToId()}
                                isDisabled={
                                    show.rmPo?.type?.toLowerCase() ===
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
                                responseData={getCompanyAddressByShipToId?.list}
                                isDisabled={
                                    show.rmPo?.type?.toLowerCase() ===
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
                                onChange={() => loadCompanyAddressByBillToId()}
                                isDisabled={
                                    show.rmPo?.type?.toLowerCase() ===
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
                                responseData={getCompanyAddressByBillToId?.list}
                                isDisabled={
                                    show.rmPo?.type?.toLowerCase() ===
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
                                    commonBasicGetListsApi('shipping_method')
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
                                    parser={(value) => value.replace('%', '')}
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
                                    parser={(value) => value.replace('%', '')}
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
                    </Form>
                </div>
            </div>
        </MclRmPoShippingWrap>
    );
};

export default MclRmPoShippingInfo;

const MclRmPoShippingWrap = styled.div`
    // min-width: 700px;
    padding: 0.5rem 1rem 1rem 1rem;

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
        }
    }
`;
