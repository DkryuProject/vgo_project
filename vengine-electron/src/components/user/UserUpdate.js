import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import useGtag from 'core/hook/useGtag';
import { userPutAsyncAction } from 'store/user/reducer';
import {
    userGetIdAsyncAction,
    userGetEmailAsyncAction,
} from 'store/user/reducer';

import { Card, Select } from 'antd';
import { Form, Input, Button, Row, Col, Checkbox, Space, Modal } from 'antd';
import SignWrap from 'styles/SignWrap';
import { userTerms } from 'core/utils/termsUtil';

const UserUpdate = (props) => {
    const { history } = props;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();
    const { trackPageView } = useGtag();
    const [passwordRepeat, setPasswordRepeat] = useState(null);
    const [checked, setChecked] = useState(false);
    const [termsChecked, setTermsChecked] = useState({
        userTerms: false,
    });
    const [termsContents, setTermsContents] = useState({
        userTerms: userTerms[0],
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const lang = 'ko';

    const showModal = useCallback(() => {
        setIsModalVisible(true);
    }, [setIsModalVisible]);

    const handleOk = useCallback(() => {
        setIsModalVisible(false);
    }, [setIsModalVisible]);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
    }, [setIsModalVisible]);

    const userGetEmail = useSelector((state) => state.userReducer.get.email);
    const handleUserGetEmail = useCallback(
        (payload) => dispatch(userGetEmailAsyncAction.request(payload)),
        [dispatch]
    );

    const userGetId = useSelector((state) => state.userReducer.get.id);
    const handleUserGetId = useCallback(
        (payload) => dispatch(userGetIdAsyncAction.request(payload)),
        [dispatch]
    );

    const userPut = useSelector((state) => state.userReducer.put);
    const handleUserPut = useCallback(
        (payload) => dispatch(userPutAsyncAction.request(payload)),
        [dispatch]
    );
    const handleUserPutInit = useCallback(
        () => dispatch(userPutAsyncAction.initial()),
        [dispatch]
    );

    const handleSubmit = (values) => {
        const regExp =
            // /^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/;
            /^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/;

        if (!checked) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: 'Terms Agree Required',
            });
        } else if (!values['password']?.match(regExp)) {
            // 숫자, 소문자, 대문자를 모두 포함한  8자리 이상의 패스워드를 등록해 주세요
            return handleNotification({
                type: 'error',
                message: 'Error',
                description:
                    'Please register a password of at least 8 characters including numbers, lowercase letters, and uppercase letters.',
            });
        } else if (
            values['password'] &&
            values['password'] !== passwordRepeat
        ) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: 'Please Check your password',
            });
        }

        values['userID'] = userGetId.data?.data.userId;
        values['termsAgree'] = checked ? 1 : 0;

        return handleUserPut(
            Object.keys(values).reduce((acc, cur) => {
                if (cur === 'password' && !values[cur]) {
                    return acc;
                }

                acc[cur] = values[cur];

                return acc;
            }, {})
        );
    };

    // 조회
    useEffect(() => {
        if (userGetEmail.data) {
            handleUserGetId({ id: userGetEmail.data.data.userId, lang });
        }
    }, [userGetEmail, handleUserGetId]);

    // user Id로 조회
    // userGetEmail로 작업시 수정하고 userGetEmail이 렌더링이 되면 메뉴가 같이 렌더링 되는 문제로 인해 userGetId로 조회
    useEffect(() => {
        if (userGetId.data) {
            // setChecked(userGetId.data.data.termsAgree === 1 ? true : false);
            if (userGetId.data.data.termsAgree === 1) {
                setTermsChecked({
                    userTerms: true,
                });
            }
            form.setFieldsValue({
                userID: userGetId.data.data.email,
                userName: userGetId.data.data.userName,
                officePhone: userGetId.data.data.officePhone,
                mobilePhone: userGetId.data.data.mobilePhone,
            });
        }
    }, [userGetId, form, setTermsChecked]);

    useEffect(() => {
        if (termsChecked?.userTerms) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }, [termsChecked, setChecked]);

    // 수정
    useEffect(() => {
        if (userPut.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: userPut.error.message,
            });
        } else if (userPut.data) {
            handleNotification({
                type: 'success',
                message: 'Success',
                description: 'User information modification successful',
            });
            const email = localStorage.getItem('email');
            const lang = 'ko';
            handleUserGetEmail({ email, lang });
            // return history.push('/');
        }

        return () => handleUserPutInit();
    }, [
        userPut,
        history,
        handleNotification,
        handleUserPutInit,
        handleUserGetEmail,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `USER INFO`,
        });
    }, [trackPageView]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    return (
        <SignWrap>
            {userGetEmail.data?.data?.user_type?.toLowerCase() === 'p' || (
                <Card title="COMPANY INFORMATION">
                    <Form {...layout}>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="Default Business Type">
                                    <Input
                                        className="formInput"
                                        value={
                                            userGetId.data &&
                                            userGetId.data.data.company.bizType
                                                .name1
                                        }
                                        disabled
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="Company Name">
                                    <Input
                                        value={
                                            userGetId.data &&
                                            userGetId.data.data.company
                                                .companyName
                                        }
                                        disabled
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Business License">
                                    <Input
                                        value={
                                            userGetId.data &&
                                            userGetId.data.data.company
                                                .businessNumber
                                        }
                                        disabled
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="Country">
                                    <Input
                                        value={
                                            userGetId.data &&
                                            (userGetId.data.data.company.addresses.find(
                                                (v) => v.representitive === 1
                                            )
                                                ? userGetId.data.data.company.addresses.find(
                                                      (v) =>
                                                          v.representitive === 1
                                                  ).country.name1
                                                : userGetId.data.data.company
                                                      .addresses?.[0]?.country
                                                      .name1)
                                        }
                                        disabled
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="City">
                                    <Input
                                        value={
                                            userGetId.data &&
                                            (userGetId.data.data.company.addresses.find(
                                                (v) => v.representitive === 1
                                            )
                                                ? userGetId.data.data.company.addresses.find(
                                                      (v) =>
                                                          v.representitive === 1
                                                  ).city.name4
                                                : userGetId.data.data.company
                                                      .addresses?.[0]?.city
                                                      .name4)
                                        }
                                        disabled
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                            {/* <Col span={12}>
                            <Form.Item label="State">
                                <Input
                                    value={
                                        userGetId.data &&
                                        (userGetId.data.data.company.addresses.find(
                                            (v) => v.representitive === 1
                                        )
                                            ? userGetId.data.data.company.addresses.find(
                                                  (v) => v.representitive === 1
                                              ).state
                                            : userGetId.data.data.company
                                                  .addresses[0].state)
                                    }
                                    disabled
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col> */}
                            <Col span={12}>
                                <Form.Item label="Address">
                                    <Input
                                        value={
                                            userGetId.data &&
                                            (userGetId.data.data.company.addresses.find(
                                                (v) => v.representitive === 1
                                            )
                                                ? userGetId.data.data.company.addresses.find(
                                                      (v) =>
                                                          v.representitive === 1
                                                  ).etc
                                                : userGetId.data.data.company
                                                      .addresses?.[0]?.etc)
                                        }
                                        disabled
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Postal Code">
                                    <Input
                                        value={
                                            userGetId.data &&
                                            (userGetId.data.data.company.addresses.find(
                                                (v) => v.representitive === 1
                                            )
                                                ? userGetId.data.data.company.addresses.find(
                                                      (v) =>
                                                          v.representitive === 1
                                                  ).zipCode
                                                : userGetId.data.data.company
                                                      .addresses?.[0]?.zipCode)
                                        }
                                        disabled
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            )}

            <Card title="PERSONAL INFORMATION">
                <Form
                    {...layout}
                    form={form}
                    onFinish={handleSubmit}
                    validateMessages={handleValidateMessage}
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="userName"
                                label="User Name"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="Insert User name"
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="userID"
                                label="User ID (EMAIL)"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="Insert User Id"
                                    disabled
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="officePhone"
                                label="Office Phone #"
                            >
                                <Input
                                    placeholder="Insert Office phone"
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="mobilePhone"
                                label="Mobile Phone #"
                            >
                                <Input
                                    placeholder="Insert Mobile phone"
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="password" label="Password">
                                <Input.Password
                                    placeholder="Insert Password"
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="Repeat Password">
                                <Input.Password
                                    placeholder="Insert Repeat password"
                                    value={passwordRepeat}
                                    onChange={(e) =>
                                        setPasswordRepeat(e.target.value)
                                    }
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="buttonWrap">
                        <Space>
                            <Space>
                                <Checkbox checked={checked} />
                                <Button onClick={showModal}>TERMS AGREE</Button>
                            </Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="formButton"
                                disabled={userPut.isLoading}
                            >
                                MODIFY
                            </Button>
                        </Space>
                    </div>

                    <Modal
                        title="Consent to personal information"
                        visible={isModalVisible}
                        closable={false}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <Select
                            defaultValue={userTerms[0]?.key}
                            style={{ width: '200px' }}
                            onChange={(key) =>
                                setTermsContents((termsContents) => ({
                                    ...termsContents,
                                    userTerms: userTerms?.find(
                                        (v) => v.key === key
                                    ),
                                }))
                            }
                        >
                            {userTerms.map((v) => (
                                <Select.Option key={v.key} value={v.key}>
                                    {v.key}
                                </Select.Option>
                            ))}
                        </Select>
                        <div style={{ marginTop: '2rem' }}>
                            <Input.TextArea
                                value={termsContents?.userTerms?.contents}
                                readOnly={true}
                                autoSize={{ minRows: 3, maxRows: 10 }}
                            />
                            <Checkbox
                                name="userTerms"
                                checked={termsChecked?.userTerms}
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
    );
};

export default UserUpdate;
