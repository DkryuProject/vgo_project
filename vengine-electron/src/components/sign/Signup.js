import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import { signupPostAsyncAction } from 'store/sign/reducer';
import {
    commonBasicGetListsAsyncAction,
    commonBasicGetCountriesAsyncAction,
    commonBasicGetCitiesAsyncAction,
} from 'store/common/basic/reducer';

import {
    Card,
    Form,
    Input,
    Button,
    Row,
    Col,
    Checkbox,
    Modal,
    Space,
    Upload,
    Select,
} from 'antd';

import SignWrap from 'styles/SignWrap';
import { FilterSelect } from 'components/common/select';
import { PaperClipOutlined } from '@ant-design/icons';
import { Loading } from 'components/common/loading';
import { companyTerms, companyTermsFinal } from 'core/utils/termsUtil';

const Signup = (props) => {
    const { history, type } = props;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();
    const [termsChecked, setTermsChecked] = useState({
        companyTerms: false,
        companyTermsFinal: false,
    });
    const [termsContents, setTermsContents] = useState({
        companyTerms: companyTerms[0],
        companyTermsFinal: companyTermsFinal[0],
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [country, setCountry] = useState(null);

    const uploadProps = {
        name: 'file',
        action: `${process.env.REACT_APP_BASE_URL}/v1/company/file`,
        headers: {
            'X-Requested-With': null,
        },

        onChange(info) {
            if (info.file.status !== 'uploading') {
                form.setFieldsValue({
                    businessFileUrl: info?.file?.response?.data,
                });
            }
            if (info.file.status === 'done') {
                console.log(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                console.log(`${info.file.name} file upload failed.`);
            }
        },
    };

    const showModal = useCallback(() => {
        setIsModalVisible(true);
    }, [setIsModalVisible]);

    const handleOk = useCallback(() => {
        setIsModalVisible(false);
    }, [setIsModalVisible]);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
    }, [setIsModalVisible]);

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

    const commonBasicGetCities = useSelector(
        (state) => state.commonBasicReducer.get.cities
    );
    const handleCommonBasicGetCities = useCallback(
        (payload) => dispatch(commonBasicGetCitiesAsyncAction.request(payload)),
        [dispatch]
    );

    const signupPost = useSelector((state) => state.signReducer.post.signup);
    const handleSignupPost = useCallback(
        (payload) => dispatch(signupPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleSignupPostInit = useCallback(
        () => dispatch(signupPostAsyncAction.initial()),
        [dispatch]
    );

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const handleSubmit = useCallback(
        (values) => {
            const regExp =
                /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
            if (
                type === 'new' &&
                !(termsChecked?.companyTerms && termsChecked?.companyTermsFinal)
            ) {
                return handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'Terms Agree Required',
                });
            } else if (values['emails'].some((v) => v.match(regExp) === null)) {
                return handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'Please check your email format',
                });
            }

            values['termsAgree'] = termsChecked?.companyTerms ? 1 : 0;
            values['termsAgreeFinal'] = termsChecked?.companyTermsFinal ? 1 : 0;
            if (type === 'partner') {
                values['userID'] = userGetEmail.data?.data?.userId;
                values['relationType'] = commonBasicGetLists.data?.list?.find(
                    (v) => v?.id === form.getFieldValue('commonBizType')
                )?.name1;
            }
            return handleSignupPost({ type, data: values });
        },
        [
            termsChecked,
            type,
            form,
            commonBasicGetLists,
            userGetEmail,
            handleSignupPost,
            handleNotification,
        ]
    );

    useEffect(() => {
        if (signupPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: signupPost.error.message,
            });
        } else if (signupPost.data) {
            handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Membership registration was successful',
            });
            return type === 'partner'
                ? history.push('/vendor/system/partnermanagement/relation')
                : history.push('/');
        }
    }, [signupPost, history, type, handleNotification]);

    useEffect(() => {
        return () => handleSignupPostInit();
    }, [handleSignupPostInit]);

    // 테이블
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    return (
        <>
            {signupPost.isLoading && <Loading />}
            <SignWrap signup>
                <Card title="REGISTRATION FORM">
                    <Form
                        {...layout}
                        form={form}
                        onFinish={handleSubmit}
                        validateMessages={handleValidateMessage}
                    >
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    label={
                                        type === 'new'
                                            ? 'REQUESTER ID'
                                            : 'COMPANY PERSON IN CHARGE'
                                    }
                                    name="emails"
                                    rules={[{ required: true }]}
                                >
                                    {/* <Input
                                        placeholder="Insert Email"
                                        bordered={false}
                                    /> */}
                                    <Select
                                        mode="tags"
                                        open={false}
                                        style={{ width: '100%' }}
                                        bordered={false}
                                        placeholder="Please enter your email"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    name="commonBizType"
                                    label="DEFAULT BUSINESS TYPE"
                                    rules={[{ required: true }]}
                                >
                                    <FilterSelect
                                        _key="id"
                                        _value="id"
                                        text="name1"
                                        placeholder="Select Business type"
                                        data={
                                            type === 'new'
                                                ? {
                                                      data: {
                                                          ...commonBasicGetLists?.data,
                                                          list: commonBasicGetLists?.data?.list?.filter(
                                                              (v) =>
                                                                  v.id === 2 ||
                                                                  v.id === 4
                                                          ),
                                                      },
                                                  }
                                                : {
                                                      data: {
                                                          ...commonBasicGetLists?.data,
                                                          list: commonBasicGetLists?.data?.list?.filter(
                                                              (v) =>
                                                                  !(
                                                                      v.id ===
                                                                          2 ||
                                                                      v.id === 6
                                                                  )
                                                          ),
                                                      },
                                                  }
                                        }
                                        onData={() =>
                                            handleCommonBasicGetLists('company')
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="businessNumber"
                                    label="Business Number"
                                >
                                    <Input
                                        placeholder="Insert Business number"
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="COMPANY NAME"
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        placeholder="Insert Company name"
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="businessFileUrl"
                                    valuePropName="businessFileUrl"
                                    label="Business License"
                                    style={{ textAlign: 'left' }}
                                >
                                    <Upload {...uploadProps}>
                                        <Button icon={<PaperClipOutlined />} />
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    name="countryId"
                                    label="COUNTRY"
                                    rules={[{ required: true }]}
                                >
                                    <FilterSelect
                                        _key="name3"
                                        _value="id"
                                        text="name1"
                                        placeholder="Select Country"
                                        data={commonBasicGetCountries}
                                        onData={() =>
                                            handleCommonBasicGetCountries()
                                        }
                                        onChange={(_, record) => {
                                            setCountry(record.key);
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="cityId"
                                    label="CITY"
                                    // rules={[{ required: true }]}
                                >
                                    <FilterSelect
                                        _key="id"
                                        _value="id"
                                        text="name"
                                        placeholder="Select City"
                                        data={commonBasicGetCities}
                                        onData={() => {
                                            handleCommonBasicGetCities(country);
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            {/* <Col span={12}>
                                <Form.Item name="state" label="STATE">
                                    <Input
                                        placeholder="Insert State"
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col> */}
                            <Col span={12}>
                                <Form.Item
                                    name="etc"
                                    label="ADDRESS"
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        placeholder="Insert Address"
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="zipCode"
                                    label="POSTAL CODE"
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        placeholder="Insert Postal code"
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}></Col>
                        </Row>

                        <div className="buttonWrap">
                            <Space>
                                {type === 'new' && (
                                    <Space>
                                        <Checkbox
                                            checked={
                                                termsChecked?.companyTerms &&
                                                termsChecked?.companyTermsFinal
                                            }
                                        />
                                        <Button onClick={showModal}>
                                            TERMS AGREE
                                        </Button>
                                    </Space>
                                )}

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="formButton"
                                    disabled={signupPost.isLoading}
                                >
                                    REQUEST
                                </Button>
                                {type === 'partner' || (
                                    <Button
                                        type="primary"
                                        className="formButton"
                                        disabled={signupPost.isLoading}
                                        onClick={() => history.push('/')}
                                    >
                                        SIGN IN
                                    </Button>
                                )}
                            </Space>
                        </div>

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
                                        <Select.Option
                                            key={v.key}
                                            value={v.key}
                                        >
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
                                            companyTermsFinal:
                                                companyTermsFinal?.find(
                                                    (v) => v.key === key
                                                ),
                                        }))
                                    }
                                >
                                    {companyTermsFinal.map((v) => (
                                        <Select.Option
                                            key={v.key}
                                            value={v.key}
                                        >
                                            {v.key}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Space>
                            <div style={{ marginTop: '2rem' }}>
                                <Input.TextArea
                                    value={
                                        termsContents?.companyTerms?.contents
                                    }
                                    readOnly={true}
                                    autoSize={{ minRows: 3, maxRows: 10 }}
                                />
                                <Checkbox
                                    name="companyTerms"
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
                                    value={
                                        termsContents?.companyTermsFinal
                                            ?.contents
                                    }
                                    readOnly={true}
                                    autoSize={{ minRows: 3, maxRows: 10 }}
                                />
                                <Checkbox
                                    name="companyTermsFinal"
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
                </Card>
            </SignWrap>
        </>
    );
};

export default React.memo(Signup);
