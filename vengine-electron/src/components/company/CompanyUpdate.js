import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useGtag from 'core/hook/useGtag';
import {
    companyPutAsyncAction,
    companyGetIdAsyncAction,
} from 'store/company/reducer';
import { userGetEmailAsyncAction } from 'store/user/reducer';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import SignWrap from 'styles/SignWrap';
import {
    Button,
    Space,
    Radio,
    Form,
    Row,
    Col,
    Upload,
    Input,
    Card,
    Checkbox,
    Select,
} from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import Modal from 'antd/lib/modal/Modal';
import { companyTerms, companyTermsFinal } from 'core/utils/termsUtil';

const CompanyUpdate = (props) => {
    const rowKey = 'id';
    const editTableRef = useRef();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [representitive, setRepresentitive] = useState(0);
    const [termsChecked, setTermsChecked] = useState({
        companyTerms: false,
        companyTermsFinal: false,
    });
    const [termsContents, setTermsContents] = useState({
        companyTerms: companyTerms[0],
        companyTermsFinal: companyTermsFinal[0],
    });
    const [isModalVisible, setIsModalVisible] = useState(false);

    const uploadProps = {
        name: 'file',
        action: `${process.env.REACT_APP_BASE_URL}/v1/company/file`,
        headers: {
            'X-AUTH-TOKEN': localStorage.getItem('authToken'),
            'X-Requested-With': null,
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                form.setFieldsValue({
                    businessFileUrl: info.file.response.data,
                });
            }
            if (info.file.status === 'done') {
                console.log(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                console.log(`${info.file.name} file upload failed.`);
            }
        },
    };

    const userGetEmail = useSelector((state) => state.userReducer.get.email);
    const handleUserGetEmail = useCallback(
        (payload) => dispatch(userGetEmailAsyncAction.request(payload)),
        [dispatch]
    );

    const companyPut = useSelector((state) => state.companyReducer.put);
    const handleCompanyPut = useCallback(
        (payload) => dispatch(companyPutAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCompanyPutInit = useCallback(
        () => dispatch(companyPutAsyncAction.initial()),
        [dispatch]
    );

    const companyGetId = useSelector((state) => state.companyReducer.get.id);
    const handleCompanyGetId = useCallback(
        (payload) => dispatch(companyGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCompanyGetIdInit = useCallback(
        () => dispatch(companyGetIdAsyncAction.initial()),
        [dispatch]
    );

    const showModal = useCallback(() => {
        setIsModalVisible(true);
    }, [setIsModalVisible]);

    const handleOk = useCallback(() => {
        setIsModalVisible(false);
    }, [setIsModalVisible]);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
    }, [setIsModalVisible]);

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows } = editTableRef.current;

            if (selectedRows.length === 0) {
                return confirm.warningConfirm('No item is selected');
            }
            if (type === 'save') {
                confirm.saveConfirm(async (e) => {
                    if (e) {
                        const values = await form.validateFields();
                        if (
                            !(
                                termsChecked?.companyTerms &&
                                termsChecked?.companyTermsFinal
                            )
                        ) {
                            return handleNotification({
                                type: 'error',
                                message: 'Error',
                                description: 'Terms Agree Required',
                            });
                        }
                        values['termsAgree'] = termsChecked?.companyTerms
                            ? 1
                            : 0;
                        values['termsAgreeFinal'] =
                            termsChecked?.companyTermsFinal ? 1 : 0;

                        // validation === false / representitive status === null
                        values['companyAddressList'] = selectedRows.map(
                            (v, i) => {
                                if (
                                    v.city === null ||
                                    v.country === null ||
                                    v.etc === null ||
                                    v.status === null ||
                                    v.workPlace === null ||
                                    v.zipCode === null
                                ) {
                                    return false;
                                }
                                if (
                                    representitive[v.id] &&
                                    (v.status === 'D' ||
                                        v.status?.name === 'Deactive')
                                ) {
                                    return null;
                                }

                                return {
                                    cityId: v.city.id,
                                    countryId: v.country.id,
                                    etc: v.etc,
                                    // API에서 신규 일때 id를 null로 보내줘야함
                                    // id: typeof v.id === 'string' ? null : v.id,
                                    id:
                                        v.rowStatus === 'new'
                                            ? null
                                            : v[rowKey],
                                    representitive: representitive[v.id]
                                        ? 1
                                        : 0,
                                    state: v.state,
                                    status:
                                        typeof v.status === 'string'
                                            ? v.status
                                            : v.status.id,
                                    workPlace: v.workPlace,
                                    zipCode: v.zipCode,
                                };
                            }
                        );

                        // undefined가 될수 있기 때문에 false로 비교
                        if (
                            values['companyAddressList'].find(
                                (v) => v === false
                            ) === false
                        ) {
                            return handleNotification({
                                type: 'error',
                                message: 'Error',
                                description: 'Please check the required value',
                            });
                        } else if (
                            values['companyAddressList'].find(
                                (v) => v === null
                            ) === null
                        ) {
                            return handleNotification({
                                type: 'error',
                                message: 'Error',
                                description:
                                    'Status cannot be deactive when representative',
                            });
                        }

                        return handleCompanyPut(values);
                    }
                });
            } else if (type === 'delete') {
                confirm.deleteConfirm((e) => {
                    if (e) {
                        let result = [];
                        // 기존 정보를 삭제 못한다는 에러 띄우기

                        for (let v1 of dataSource) {
                            if (
                                !selectedRows.find(
                                    (v2) =>
                                        v2[rowKey] === v1[rowKey] &&
                                        v2.rowStatus
                                )
                            ) {
                                result.push(v1);
                            }
                        }
                        setDataSource(result);
                    }
                });
            }
        },
        [
            dataSource,
            representitive,
            termsChecked,
            form,
            handleCompanyPut,
            handleNotification,
        ]
    );

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    // 조회
    useEffect(() => {
        setIsLoading(userGetEmail.isLoading);
        if (userGetEmail.data) {
            handleCompanyGetId(userGetEmail.data.data.company.companyID);
            setDataSource(userGetEmail.data.data.company.addresses);
        }

        return () => handleCompanyGetIdInit();
    }, [userGetEmail, handleCompanyGetId, handleCompanyGetIdInit]);

    useEffect(() => {
        if (companyGetId.data) {
            // representitive 초기 세팅

            companyGetId.data.data.addresses.map((v) => {
                if (v.representitive === 1)
                    setRepresentitive({
                        [v.id]: true,
                    });

                return true;
            });

            // 개인정보 동의 초기 세팅
            // setChecked(companyGetId.data.data.termsAgree === 1 ? true : false);
            setTermsChecked({
                companyTerms: companyGetId.data.data.termsAgree === 1,
                companyTermsFinal: companyGetId.data.data.termsAgreeFinal === 1,
            });
            form.setFieldsValue({
                id: companyGetId.data.data.companyID,
                businessNumber: companyGetId.data.data.businessNumber,
                // nickName: companyGetId.data.data.nickName,
                lcode: companyGetId.data.data.lcode,
                // lorNo: companyGetId.data.data.lorNo,
                // lorMemo: companyGetId.data.data.lorMemo,
                // midNo: companyGetId.data.data.midNo,
                // midMemo: companyGetId.data.data.midMemo,
            });
        }
    }, [
        companyGetId,
        form,
        // , setChecked
        setTermsChecked,
    ]);

    // useEffect(() => {
    //     if (termsChecked?.companyTerms && termsChecked?.companyTermsFinal) {
    //         setChecked(true);
    //     } else {
    //         setChecked(false);
    //     }
    // }, [termsChecked, setChecked]);

    // 수정
    useEffect(() => {
        if (companyPut.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: companyPut.error.message,
            });
        } else if (companyPut.data) {
            const email = localStorage.getItem('email');
            const lang = 'ko';
            handleUserGetEmail({ email, lang });
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Company update Success',
            });
        }

        return () => handleCompanyPutInit();
    }, [
        companyPut,
        handleNotification,
        handleCompanyPutInit,
        handleUserGetEmail,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `COMPANY INFO`,
        });
    }, [trackPageView]);

    // 테이블
    const columns = [
        {
            title: '*Workplace Name',
            dataIndex: 'workPlace',
            editable: true,
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: '*Country',
            dataIndex: 'country',
            editable: true,
            selectBox: true,
            selectType: { name: 'common', type: 'countries' },
            align: 'left',
            render: (data) => {
                const _data = data?.name1 || data?.name;

                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: '*City',
            dataIndex: 'city',
            editable: true,
            selectBox: true,
            selectType: {
                name: 'common',
                type: 'cities',
            },
            align: 'left',
            render: (data) => {
                const _data = data?.name4 || data?.name;
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        // {
        //     title: 'State',
        //     dataIndex: 'state',
        //     editable: true,
        //     align: 'left',
        //     render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        // },
        {
            title: '*Address',
            dataIndex: 'etc',
            editable: true,
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: '*Postal Code',
            dataIndex: 'zipCode',
            editable: true,
            align: 'left',

            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Representitive',
            dataIndex: 'notEditable',
            width: '5%',
            render: (_, record) => {
                const { handleSelectRows, onSelectChange } =
                    editTableRef.current;
                return (
                    <Radio
                        checked={representitive[record.id]}
                        onChange={(e) => {
                            onSelectChange([], []);
                            handleSelectRows(record);
                            setRepresentitive({
                                [record.id]: e.target.checked,
                            });
                        }}
                    />
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            editable: true,
            selectBox: true,
            selectType: { name: 'common', type: 'enums', path: 'userStatus' },
            align: 'left',
            width: '100px',

            render: (data) => {
                const _data = data?.name || data;
                let value = '';
                if (_data === 'A' || _data === 'Active') {
                    value = 'Active';
                } else if (_data === 'D' || _data === 'Deactive') {
                    value = 'Deactive';
                } else if (_data === 'W' || _data === 'Waiting') {
                    value = 'Waiting';
                }

                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                {/* <Space>
                    <CaretRightOutlined />
                    PARTNER RELATIONSHIP
                </Space> */}
            </div>
            <div className="functionWrap">
                <Space>
                    {/* <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Save item',
                            arrowPointAtCenter: true,
                        }}
                        mode="save"
                        size="small"
                        onClick={() => handleExcute('save')}
                    /> */}

                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Add item',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => editTableRef.current.handleAdd()}
                    />

                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Delete selected item',
                            arrowPointAtCenter: true,
                        }}
                        mode="remove"
                        size="small"
                        onClick={() => handleExcute('delete')}
                    />
                </Space>
            </div>
        </div>
    );

    return (
        <SignWrap>
            <Form
                {...layout}
                labelAlign="left"
                form={form}
                // onFinish={handleSubmit}
            >
                <Card
                    title={
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>COMPANY INFORMATION</div>
                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Save item',
                                    arrowPointAtCenter: true,
                                }}
                                mode="save"
                                size="small"
                                disabled={companyPut.isLoading}
                                onClick={() => handleExcute('save')}
                            />
                        </div>
                    }
                    className="shadow"
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Row gutter={10}>
                        <Col span={8}>
                            <Form.Item label="Default Type">
                                <Input
                                    value={
                                        userGetEmail.data &&
                                        userGetEmail.data.data.company.bizType
                                            .name1
                                    }
                                    disabled
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Company Name">
                                <Input
                                    value={
                                        userGetEmail.data &&
                                        userGetEmail.data.data.company
                                            .companyName
                                    }
                                    disabled
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="businessNumber"
                                label="Business Number #"
                            >
                                <Input
                                    placeholder="Insert Business number"
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={8}>
                            <Form.Item label="Company code no.">
                                <Input
                                    value={
                                        userGetEmail.data &&
                                        userGetEmail.data.data.company.companyID
                                    }
                                    bordered={false}
                                    disabled
                                />
                            </Form.Item>
                        </Col>

                        {/* <Col span={8}>
                            <Form.Item
                                name="nickName"
                                label="Company Short Name"
                            >
                                <Input
                                    placeholder="Insert Company short name"
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col> */}
                        <Col span={8}>
                            <Form.Item name="lcode" label="Company 3 Code">
                                <Input
                                    maxLength="3"
                                    placeholder="Insert Company 3 code"
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="businessFileUrl"
                                valuePropName="businessFileUrl"
                                label="Business License #"
                            >
                                <Upload {...uploadProps}>
                                    <Button icon={<PaperClipOutlined />} />
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginBottom: '1rem',
                        }}
                    >
                        <Space>
                            <Checkbox
                                checked={
                                    termsChecked?.companyTerms &&
                                    termsChecked?.companyTermsFinal
                                }
                            />
                            <Button onClick={showModal}>TERMS AGREE</Button>
                        </Space>
                    </div>

                    <CustomTable
                        ref={editTableRef}
                        title={title}
                        rowKey={rowKey}
                        initialColumns={columns}
                        dataSource={dataSource}
                        rowSelection={true}
                        loading={isLoading}
                        pagination={false}
                        scroll={{ y: 200 }}
                    />
                </Card>
                {/* <Card title="OTHER INFORMATION" className="shadow">
                    <Row gutter={10}>
                        <Col span={8}>
                            <Form.Item
                                label="IOR #"
                                style={{ marginBottom: 0 }}
                            >
                                <Space>
                                    <Form.Item name="lorNo">
                                        <Input
                                            placeholder="Insert Ior number"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item name="lorMemo">
                                        <Input
                                            placeholder="Insert Ior memo"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={8}>
                            <Form.Item
                                label="MID #"
                                style={{ marginBottom: 0 }}
                            >
                                <Space>
                                    <Form.Item name="midNo">
                                        <Input
                                            placeholder="Insert Mid number"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item name="midMemo">
                                        <Input
                                            placeholder="Insert Mid memo"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="buttonWrap">
                        <Space>
                            <Space>
                                <Checkbox checked={checked} />
                                <Button onClick={showModal}>TERMS AGREE</Button>
                            </Space>
                            <Button onClick={() => handleExcute('save')}>
                                SAVE
                            </Button>
                        </Space>
                    </div>
                </Card> */}
                <Modal
                    title="Service Agreement"
                    visible={isModalVisible}
                    closable={false}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Space>
                        <Select
                            defaultValue={companyTerms[0]?.key}
                            style={{ width: '200px' }}
                            onChange={(key) =>
                                setTermsContents((termsContents) => ({
                                    ...termsContents,
                                    companyTerms: companyTerms?.find(
                                        (v) => v.key === key
                                    ),
                                }))
                            }
                        >
                            {companyTerms.map((v) => (
                                <Select.Option key={v.key} value={v.key}>
                                    {v.key}
                                </Select.Option>
                            ))}
                        </Select>
                        <Select
                            defaultValue={companyTermsFinal[0]?.key}
                            style={{ width: '200px' }}
                            onChange={(key) =>
                                setTermsContents((termsContents) => ({
                                    ...termsContents,
                                    companyTermsFinal: companyTermsFinal?.find(
                                        (v) => v.key === key
                                    ),
                                }))
                            }
                        >
                            {companyTermsFinal.map((v) => (
                                <Select.Option key={v.key} value={v.key}>
                                    {v.key}
                                </Select.Option>
                            ))}
                        </Select>
                    </Space>
                    <div style={{ marginTop: '2rem' }}>
                        <Input.TextArea
                            value={termsContents?.companyTerms?.contents}
                            readOnly={true}
                            autoSize={{ minRows: 3, maxRows: 10 }}
                        />
                        <Checkbox
                            name="companyTerms"
                            checked={termsChecked?.companyTerms}
                            style={{ marginTop: '1rem' }}
                            onChange={(e) =>
                                setTermsChecked((termsChecked) => ({
                                    ...termsChecked,
                                    [e.target.name]: e.target.checked,
                                }))
                            }
                        >
                            Do you agree to the above terms?
                        </Checkbox>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <Input.TextArea
                            value={termsContents?.companyTermsFinal?.contents}
                            readOnly={true}
                            autoSize={{ minRows: 3, maxRows: 10 }}
                        />
                        {/* <div
                            dangerouslySetInnerHTML={{
                                __html: termsContents?.companyTermsFinal
                                    ?.contents,
                            }}
                        ></div> */}
                        <Checkbox
                            name="companyTermsFinal"
                            checked={termsChecked?.companyTermsFinal}
                            style={{ marginTop: '1rem' }}
                            onChange={(e) =>
                                setTermsChecked((termsChecked) => ({
                                    ...termsChecked,
                                    [e.target.name]: e.target.checked,
                                }))
                            }
                        >
                            Do you agree to the above terms?
                        </Checkbox>
                    </div>
                </Modal>
            </Form>
        </SignWrap>
    );
};

export default CompanyUpdate;

// workplace status 값이 객체로 넘어오다가 갑자기 0으로 넘어온다
