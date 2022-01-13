import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import {
    companyGetRelationTypeAsyncAction,
    companyGetAddressAsyncAction,
} from 'store/company/reducer';
import {
    commonBasicGetListsAsyncAction,
    commonBasicGetCountriesAsyncAction,
    commonBasicGetPortAsyncAction,
} from 'store/common/basic/reducer';
import {
    mclPoPostIdAsyncAction,
    mclPoGetIdAsyncAction,
    mclPoPutIdAsyncAction,
    mclPoGetPagesAsyncAction,
    mclPoGetItemListsAsyncAction,
} from 'store/mcl/po/reducer';
import moment from 'moment';
import styled from 'styled-components';
import { Tooltip } from 'components/common/tooltip';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import {
    Space,
    Input,
    Form,
    Steps,
    message,
    Button,
    Select,
    DatePicker,
    InputNumber,
    Drawer,
} from 'antd';
import { FilterSelect } from 'components/common/select';
import { CaretRightOutlined } from '@ant-design/icons';

const { Step } = Steps;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const ShippingInfo = (props) => {
    const {
        match,
        initialShow,
        // show,
        onShow,
        onLeftSplit,
        onMoveStep,
        form,
        // onOrderId,
        rmPoId,
        onRmPoId,
    } = props;
    const { mclOptionId } = match.params || '';
    // 생성된 row id 수정에 필요
    const dispatch = useDispatch();

    const rowKey = 'id';
    const loadingTableRef = useRef();
    const dischargeTableRef = useRef();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();
    const [supplierCompanyId, setSupplierCompanyId] = useState(null);
    const [shipperCompanyId, setShipperCompanyId] = useState(null);
    const [visible, setVisible] = useState({
        type: null,
        status: false,
    });
    const [country, setCountry] = useState({
        loading: null,
        discharge: null,
    });
    const [port, setPort] = useState({
        loading: null,
        discharge: null,
    });
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRender, setIsRender] = useState(false);
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

    const companyGetRelationType = useSelector(
        (state) => state.companyReducer.get.relationType
    );
    const handleCompanyGetRelationType = useCallback(
        (payload) =>
            dispatch(companyGetRelationTypeAsyncAction.request(payload)),
        [dispatch]
    );

    const companyGetAddress = useSelector(
        (state) => state.companyReducer.get.address
    );
    const handleCompanyGetAddress = useCallback(
        (payload) => dispatch(companyGetAddressAsyncAction.request(payload)),
        [dispatch]
    );

    const commonBasicGetLists = useSelector(
        (state) => state.commonBasicReducer.get.lists
    );
    const handleCommonBasicGetLists = useCallback(
        (payload) => dispatch(commonBasicGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const commonBasicGetCountries = useSelector(
        (state) => state.commonBasicReducer.get.countries
    );
    const handleCommonBasicGetCountries = useCallback(
        (payload) =>
            dispatch(commonBasicGetCountriesAsyncAction.request(payload)),
        [dispatch]
    );

    const commonBasicGetPort = useSelector(
        (state) => state.commonBasicReducer.get.port
    );
    const handleCommonBasicGetPort = useCallback(
        (payload) => dispatch(commonBasicGetPortAsyncAction.request(payload)),
        [dispatch]
    );

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

    const handleMclPoGetPages = useCallback(
        (payload) => dispatch(mclPoGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const handleSubmit = useCallback(
        (values) => {
            if (rmPoId) {
                // 수정
                const {
                    orderID,
                    supplier,
                    shipper,
                    forwarder,
                    shippingMethod,
                    incoterms,
                    paymentTerm,
                    paymentPeriod,
                    paymentBase,
                    estimatedDate,
                    infactoryDate,
                    currency,
                } = mclPoGetId.data.data;
                const _partialShipment = mclPoGetId.data.data.partialShipment;

                values['sellingCompanyID'] =
                    typeof values['sellingCompanyID'] === 'string'
                        ? supplier.companyID
                        : values['sellingCompanyID'];
                values['sellingCompanyAddressID'] =
                    typeof values['sellingCompanyAddressID'] === 'string'
                        ? supplier.address.id
                        : values['sellingCompanyAddressID'];
                values['shipperCompanyID'] =
                    typeof values['shipperCompanyID'] === 'string'
                        ? shipper.companyID
                        : values['shipperCompanyID'];
                values['shipperCompanyAddressID'] =
                    typeof values['shipperCompanyAddressID'] === 'string'
                        ? shipper.address.id
                        : values['shipperCompanyAddressID'];
                values['forwarderCompanyID'] =
                    typeof values['forwarderCompanyID'] === 'string'
                        ? forwarder.companyID
                        : values['forwarderCompanyID'];
                values['shippingMethod'] =
                    typeof values['shippingMethod'] === 'string'
                        ? shippingMethod.id
                        : values['shippingMethod'];
                values['incoterms'] =
                    typeof values['incoterms'] === 'string'
                        ? incoterms.id
                        : values['incoterms'];
                values['paymentTerm'] =
                    typeof values['paymentTerm'] === 'string'
                        ? paymentTerm.id
                        : values['paymentTerm'];
                values['paymentPeriod'] =
                    typeof values['paymentPeriod'] === 'string'
                        ? paymentPeriod.id
                        : values['paymentPeriod'];
                values['paymentBase'] =
                    typeof values['paymentBase'] === 'string'
                        ? paymentBase.id
                        : values['paymentBase'];
                values['estimatedDate'] =
                    typeof values['estimatedDate'] === 'string'
                        ? estimatedDate
                        : moment(values['estimatedDate']).format('YYYY-MM-DD');
                values['infactoryDate'] =
                    typeof values['infactoryDate'] === 'string'
                        ? infactoryDate
                        : moment(values['infactoryDate']).format('YYYY-MM-DD');
                values['partialShipment'] =
                    typeof values['partialShipment'] === 'string'
                        ? _partialShipment
                        : values['partialShipment'];
                values['currency'] =
                    typeof values['currency'] === 'string'
                        ? currency.id
                        : values['currency'];

                values['dischargePort'] = port.discharge.id;
                values['dischargeBasicCountry'] = country.discharge.id;
                values['loadingPort'] = port.loading.id;
                values['loadingBasicCountry'] = country.loading.id;

                return handleMclPoPutId({
                    id: orderID,
                    data: values,
                });
            } else {
                // 등록
                values['estimatedDate'] = moment(
                    values['estimatedDate']
                ).format('YYYY-MM-DD');
                values['infactoryDate'] = moment(
                    values['infactoryDate']
                ).format('YYYY-MM-DD');
                values['dischargePort'] = port.discharge.id;
                values['dischargeBasicCountry'] = country.discharge.id;
                values['loadingPort'] = port.loading.id;
                values['loadingBasicCountry'] = country.loading.id;
                return handleMclPoPostId({ id: mclOptionId, data: values });
            }
        },
        [
            rmPoId,
            port,
            country,
            mclOptionId,
            mclPoGetId,
            handleMclPoPutId,
            handleMclPoPostId,
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
                shipper,
                forwarder,
                shippingMethod,
                incoterms,
                paymentTerm,
                paymentPeriod,
                paymentBase,
                estimatedDate,
                infactoryDate,
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

            setCountry({
                loading: loadingBasicCountry,
                discharge: dischargeBasicCountry,
            });
            setPort({
                loading: loadingPort,
                discharge: dischargePort,
            });
            setSupplierCompanyId(supplier.companyID);
            setShipperCompanyId(shipper.companyID);
            form.setFieldsValue({
                sellingCompanyID: supplier.companyName,
                sellingCompanyAddressID:
                    supplier.address && supplier.address.workPlace,
                shipperCompanyID: shipper.companyName,
                shipperCompanyAddressID:
                    shipper.address && shipper.address.workPlace,
                forwarderCompanyID: forwarder.companyName,
                shippingMethod: `${shippingMethod.name1} (${shippingMethod.name2})`,
                incoterms: incoterms.name2,
                paymentTerm: paymentTerm.name1,
                paymentPeriod: paymentPeriod.name1,
                paymentBase: paymentBase.name1,
                estimatedDate: moment(estimatedDate),
                infactoryDate: moment(infactoryDate),
                partialShipment: partialShipment.find(
                    (v) => v.id === _partialShipment
                ).name,
                plusTolerance: plusTolerance,
                minusTolerance: minusTolerance,
                currency: currency.name2,
                memo: memo,
            });
        }
    }, [mclPoGetId, form, rmPoId, partialShipment, setCountry, setPort]);

    // 국가에 따라 port 불러오기
    useEffect(() => {
        if (visible.status && country[visible.type]) {
            handleCommonBasicGetPort(country[visible.type].name3);
        }
    }, [visible, country, handleCommonBasicGetPort]);

    // port를 지정하고 다시 drawer를 열었을 때 해당 아이템 체크
    useEffect(() => {
        if (port[visible.type]) {
            const portData =
                port[visible.type] ||
                (mclPoGetId.data &&
                    (visible.type === 'loading'
                        ? mclPoGetId.data.data.loadingPort
                        : mclPoGetId.data.data.dischargePort));

            const table =
                visible.type === 'loading'
                    ? loadingTableRef
                    : dischargeTableRef;

            const { id, name1, name2, name5, name6 } = portData;
            setTimeout(
                () =>
                    table.current &&
                    table.current.handleSelectRows &&
                    table.current.handleSelectRows({
                        id: id,
                        name1: name1,
                        name2: name2,
                        name5: name5,
                        name6: name6,
                    }),
                100
            );
        }
    }, [
        mclPoGetId,
        isRender,
        visible,
        loadingTableRef,
        dischargeTableRef,
        port,
    ]);

    // port 조회 후 dataSource에 삽입
    // 최초 작성이랑 수정을 같은 컴포넌트에서 사용하므로 country로 최종 작성과 수정을 확인
    useEffect(() => {
        setIsLoading(commonBasicGetPort.isLoading);
        if (commonBasicGetPort.data && country[visible.type]) {
            setDataSource(commonBasicGetPort.data.list);
        } else {
            setDataSource([]);
        }
    }, [commonBasicGetPort, visible, country]);

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
                    'Successful registration of MCL PO Shipping information',
            });
        }

        return () => handleMclPoPostIdInit();
    }, [
        mclPoPostId,
        mclOptionId,
        pagination,
        onMoveStep,
        onRmPoId,
        handleMclPoGetPages,
        handleMclPoPostIdInit,
        handleNotification,
    ]);

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

        return () => handleMclPoPutIdInit();
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
        return () => handleMclPoGetIdInit();
    }, [handleMclPoGetIdInit]);

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
        ],
        []
    );

    const title = () => (
        <div className="titleWrap">
            <div className="title"></div>
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
                        onClick={() =>
                            confirm.saveConfirm(() => {
                                const table =
                                    visible.type === 'loading'
                                        ? loadingTableRef
                                        : dischargeTableRef;
                                setPort((port) => ({
                                    ...port,
                                    [visible.type]:
                                        table.current.selectedRows[0],
                                }));
                                setVisible({ status: false });
                            })
                        }
                    />
                </Space>
            </div>
        </div>
    );

    return (
        <div>
            <Drawer
                title="Basic"
                width="500px"
                placement="right"
                closable={false}
                onClose={() =>
                    setVisible((visible) => ({ ...visible, status: false }))
                }
                visible={visible.status}
            >
                <div className="titleWrap">
                    <div className="title">Port Select (LOCODE)</div>
                </div>
                <div className="contentsWrap" style={{ marginTop: '1rem' }}>
                    <div className="content">
                        <Space>
                            <div className="contentTitle">COUNTRY</div>
                            <Select
                                placeholder="Select Country"
                                showSearch
                                value={
                                    country[visible.type] &&
                                    country[visible.type].name1
                                }
                                onChange={(v) => {
                                    setCountry((country) => ({
                                        ...country,
                                        [visible.type]:
                                            commonBasicGetCountries.data.list.find(
                                                (v2) => v2.name3 === v
                                            ),
                                    }));
                                }}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                onDropdownVisibleChange={(e) => {
                                    if (e) {
                                        handleCommonBasicGetCountries();
                                    }
                                }}
                                loading={commonBasicGetCountries.isLoading}
                            >
                                {commonBasicGetCountries.data &&
                                    commonBasicGetCountries.data.list.map(
                                        (v) => {
                                            return (
                                                <Select.Option
                                                    key={v.id}
                                                    value={v.name3}
                                                >
                                                    {v.name1}
                                                </Select.Option>
                                            );
                                        }
                                    )}
                            </Select>
                        </Space>
                    </div>

                    {dataSource.length > 0 && visible.type === 'loading' && (
                        <CustomTable
                            ref={loadingTableRef}
                            title={title}
                            rowKey={rowKey}
                            initialColumns={columns}
                            dataSource={dataSource}
                            rowSelection={true}
                            rowSelectionType="radio"
                            loading={isLoading}
                            pagination={false}
                            onIsRender={setIsRender}
                        />
                    )}

                    {dataSource.length > 0 && visible.type === 'discharge' && (
                        <CustomTable
                            ref={dischargeTableRef}
                            title={title}
                            rowKey={rowKey}
                            initialColumns={columns}
                            dataSource={dataSource}
                            rowSelection={true}
                            rowSelectionType="radio"
                            loading={isLoading}
                            pagination={false}
                            onIsRender={setIsRender}
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
                        }}
                    >
                        <Form.Item label="Supplier">
                            <Form.Item
                                name="sellingCompanyID"
                                // rules={[{ required: true }]}
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 0.5rem)',
                                }}
                            >
                                {FilterSelect({
                                    _key: 'companyID',
                                    _value: 'companyID',
                                    text: 'companyName',
                                    placeholder: `Select Supplier name`,
                                    data: companyGetRelationType,
                                    onData: () =>
                                        handleCompanyGetRelationType(
                                            'SUPPLIER'
                                        ),
                                    onChange: (v) => setSupplierCompanyId(v),
                                })}
                            </Form.Item>
                            <Form.Item
                                name="sellingCompanyAddressID"
                                // rules={[{ required: true }]}
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 0.5rem)',
                                    margin: '0 0.5rem',
                                }}
                            >
                                {FilterSelect({
                                    _key: 'id',
                                    _value: 'id',
                                    text: 'workPlace',
                                    placeholder: `Select Workplace name`,
                                    data: companyGetAddress,
                                    onData: () =>
                                        handleCompanyGetAddress(
                                            supplierCompanyId
                                        ),
                                })}
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label="Shipper">
                            <Form.Item
                                name="shipperCompanyID"
                                // rules={[{ required: true }]}
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 0.5rem)',
                                }}
                            >
                                {FilterSelect({
                                    _key: 'companyID',
                                    _value: 'companyID',
                                    text: 'companyName',
                                    placeholder: `Select Shipper name`,
                                    data: companyGetRelationType,
                                    onData: () =>
                                        handleCompanyGetRelationType(
                                            'SUPPLIER'
                                        ),
                                    onChange: (v) => setShipperCompanyId(v),
                                })}
                            </Form.Item>
                            <Form.Item
                                name="shipperCompanyAddressID"
                                // rules={[{ required: true }]}
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 0.5rem)',
                                    margin: '0 0.5rem',
                                }}
                            >
                                {FilterSelect({
                                    _key: 'id',
                                    _value: 'id',
                                    text: 'workPlace',
                                    placeholder: `Select Workplace name`,
                                    data: companyGetAddress,
                                    onData: () =>
                                        handleCompanyGetAddress(
                                            shipperCompanyId
                                        ),
                                })}
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="Forwarder" name="forwarderCompanyID">
                            {FilterSelect({
                                _key: 'companyID',
                                _value: 'companyID',
                                text: 'companyName',
                                placeholder: `Select Forwarder name`,
                                data: companyGetRelationType,
                                onData: () =>
                                    handleCompanyGetRelationType('FORWARDER'),
                            })}
                        </Form.Item>
                        <Form.Item label="Ship Mode" name="shippingMethod">
                            <Select
                                placeholder="Select Ship mode"
                                showSearch
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                onDropdownVisibleChange={(e) => {
                                    if (e)
                                        handleCommonBasicGetLists(
                                            'shipping_method'
                                        );
                                }}
                            >
                                {commonBasicGetLists.data &&
                                    commonBasicGetLists.data.list.map((v) => {
                                        return (
                                            <Select.Option
                                                key={v.id}
                                                value={v.id}
                                            >
                                                {v.name1} ({v.name2})
                                            </Select.Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Incoterms" name="incoterms">
                            {FilterSelect({
                                _key: 'id',
                                _value: 'id',
                                text: 'name2',
                                placeholder: `Select Inco terms`,
                                data: commonBasicGetLists,
                                onData: () =>
                                    handleCommonBasicGetLists('incoterms'),
                            })}
                        </Form.Item>
                        <Form.Item label="Terms of Payment">
                            <Form.Item
                                name="paymentTerm"
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(33% - 0.5rem)',
                                }}
                            >
                                {FilterSelect({
                                    _key: 'id',
                                    _value: 'id',
                                    text: 'name1',
                                    placeholder: `Select Payment terms`,
                                    data: commonBasicGetLists,
                                    onData: () =>
                                        handleCommonBasicGetLists(
                                            'payment_terms'
                                        ),
                                })}
                            </Form.Item>
                            <Form.Item
                                name="paymentPeriod"
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(33% - 0.5rem)',
                                    margin: '0 0.5rem',
                                }}
                            >
                                {FilterSelect({
                                    _key: 'id',
                                    _value: 'id',
                                    text: 'name1',
                                    placeholder: `Select Payment period`,
                                    data: commonBasicGetLists,
                                    onData: () =>
                                        handleCommonBasicGetLists(
                                            'payment_period'
                                        ),
                                })}
                            </Form.Item>
                            <Form.Item
                                name="paymentBase"
                                style={{
                                    display: 'inline-block',
                                    width: '34%',
                                }}
                            >
                                {FilterSelect({
                                    _key: 'id',
                                    _value: 'id',
                                    text: 'name1',
                                    placeholder: `Select Payment base`,
                                    data: commonBasicGetLists,
                                    onData: () =>
                                        handleCommonBasicGetLists(
                                            'payment_base'
                                        ),
                                })}
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="Ship Date" name="estimatedDate">
                            <DatePicker />
                        </Form.Item>
                        <Form.Item label="In Factory Date" name="infactoryDate">
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            label="Partial Shipment"
                            name="partialShipment"
                        >
                            {FilterSelect({
                                _key: 'id',
                                _value: 'id',
                                text: 'name',
                                placeholder: `Select Partial shipment`,
                                data: { data: { list: partialShipment } },
                            })}
                        </Form.Item>
                        <Form.Item label="Ship Tolerance ( + / - )">
                            <Form.Item
                                name="plusTolerance"
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 0.5rem)',
                                }}
                            >
                                <InputNumber
                                    min={0}
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => value.replace('%', '')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="minusTolerance"
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 0.5rem)',
                                    margin: '0 0.5rem',
                                }}
                            >
                                <InputNumber
                                    max={0}
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => value.replace('%', '')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label="Currency" name="currency">
                            {FilterSelect({
                                _key: 'id',
                                _value: 'id',
                                text: 'name2',
                                placeholder: `Select Currency`,
                                data: commonBasicGetLists,
                                onData: () =>
                                    handleCommonBasicGetLists('currency'),
                            })}
                        </Form.Item>

                        <Form.Item label="Comment" name="memo">
                            <Input placeholder="Insert Comment" />
                        </Form.Item>

                        <Form.Item label="Port of Loading">
                            <div
                                className="fakeInput"
                                onClick={() =>
                                    setVisible({
                                        type: 'loading',
                                        status: true,
                                    })
                                }
                            >
                                {port.loading && port.loading.name1}
                            </div>
                        </Form.Item>

                        <Form.Item label="Port of Discharge">
                            <div
                                className="fakeInput"
                                onClick={() =>
                                    setVisible({
                                        type: 'discharge',
                                        status: true,
                                    })
                                }
                            >
                                {port.discharge && port.discharge.name1}
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

const ItemDetailInfo = (props) => {
    const { rmPoId } = props;
    const tableRef = useRef();
    const rowKey = 'id';
    const dispatch = useDispatch();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const mclPoGetItemLists = useSelector(
        (state) => state.mclPoReducer.get.itemLists
    );
    const handleMclPoGetItemLists = useCallback(
        (payload) => dispatch(mclPoGetItemListsAsyncAction.request(payload)),
        [dispatch]
    );
    // const handleMclPoGetItemListsInit = useCallback(
    //     () => dispatch(mclPoGetItemListsAsyncAction.initial()),
    //     [dispatch]
    // );

    useEffect(() => {
        if (rmPoId) {
            handleMclPoGetItemLists(rmPoId);
        }
    }, [rmPoId, handleMclPoGetItemLists]);

    useEffect(() => {
        setIsLoading(mclPoGetItemLists.isLoading);
        if (mclPoGetItemLists.data) {
            setDataSource(
                mclPoGetItemLists.data.list.map((v) => ({
                    ...v,
                    id: v.mclMaterialInfo.id,
                }))
            );
        }
    }, [mclPoGetItemLists]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Style#',
                dataIndex: 'styleNumbers',
                render: (data) => {
                    const value = <div>{data.map((v) => v)}</div>;
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Item Information',
                dataIndex: 'id',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'Uom',
                dataIndex: 'orderedUom',
                render: (data) => (
                    <Tooltip title={data?.name3}>{data?.name3}</Tooltip>
                ),
            },
            {
                title: 'Unit Price',
                dataIndex: 'unitPrice',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'Usd',
                dataIndex: 'unitPricce',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'Required Qty',
                dataIndex: 'requiredQty',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'Issued Qty',
                dataIndex: 'issuedQty',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'Balance Qty',
                dataIndex: 'balanceQty',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'Purchase Qty',
                dataIndex: 'balanceQty',
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
        ],
        []
    );

    const title = () => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    ITEM DETAIL INFORMATION
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
                        onClick={() => confirm.saveConfirm(() => {})}
                    />
                </Space>
            </div>
        </div>
    );
    return (
        <CustomTable
            ref={tableRef}
            title={title}
            rowKey={rowKey}
            initialColumns={columns}
            dataSource={dataSource}
            rowSelection={true}
            loading={isLoading}
            pagination={false}
        />
    );
};

const MclRmPoWrite = (props) => {
    const { show } = props;
    // const { match, initialShow, onShow, onLeftSplit } = props;
    // const dispatch = useDispatch();
    // Shipping information form
    const [form] = Form.useForm();

    // const [handleNotification] = useNotification();
    const [current, setCurrent] = useState(0);
    // const [orderId, setOrderId] = useState(null);

    // rmPoId는 item을 선택해서 detail로 들어가거나 item 생성후 orderId를 rmPoId에 삽입한다
    const [rmPoId, setRmPoId] = useState(show.rmPo.id || '');

    const handleMoveStep = useCallback(
        (type) => {
            if (type === 'next') {
                setCurrent(current + 1);
            } else if (type === 'prev') {
                setCurrent(current - 1);
            }
        },
        [current]
    );

    const steps = [
        {
            title: 'First',
            content: (
                <ShippingInfo
                    {...props}
                    form={form}
                    onMoveStep={handleMoveStep}
                    rmPoId={rmPoId}
                    onRmPoId={setRmPoId}
                />
            ),
        },
        {
            title: 'Second',
            content: <ItemDetailInfo {...props} rmPoId={rmPoId} />,
        },
    ];
    return (
        <MclRmPoWriteWrap>
            <div id="mclRmPoWriteWrap">
                <Steps current={current}>
                    {steps.map((v) => (
                        <Step key={v.title} />
                    ))}
                </Steps>
                <div>{steps[current].content}</div>
                <div>
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => form.submit()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button
                            type="primary"
                            onClick={() =>
                                message.success('Processing complete!')
                            }
                        >
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button
                            style={{ margin: '0 8px' }}
                            onClick={() => handleMoveStep('prev')}
                        >
                            Previous
                        </Button>
                    )}
                </div>
            </div>
        </MclRmPoWriteWrap>
    );
};

const MclRmPoWriteWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #mclRmPoWriteWrap {
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

                .fakeInput {
                    height: 100%;
                    padding: 4px 11px;
                    background-color: #fff;
                    // border: 1px solid #d9d9d9;
                    // border-radius: 2px;
                }
            }
        }
    }
`;

export default React.memo(MclRmPoWrite);
