import React, { useState, useCallback, useEffect } from 'react';
import { useMutation } from 'react-query';
import useValidateMessage from 'core/hook/useValidateMessage';
import { userTerms } from 'core/utils/termsUtil';
import { signupPostUserApi } from 'core/api/sign/sign';
import { handleNotification } from 'core/utils/notificationUtil';

import {
    Card,
    Form,
    Input,
    Row,
    Col,
    Space,
    Checkbox,
    Button,
    Modal,
    Select,
} from 'antd';
import SignWrap from 'styles/SignWrap';

const MemberSignup = (props) => {
    const { history } = props || {};
    const [form] = Form.useForm();
    const [handleValidateMessage] = useValidateMessage();
    const [passwordRepeat, setPasswordRepeat] = useState(null);
    const [checked, setChecked] = useState(false);
    const [termsChecked, setTermsChecked] = useState({
        userTerms: false,
    });
    const [termsContents, setTermsContents] = useState({
        userTerms: userTerms[0],
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = useCallback(() => {
        setIsModalVisible(true);
    }, [setIsModalVisible]);

    const handleOk = useCallback(() => {
        setIsModalVisible(false);
    }, [setIsModalVisible]);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
    }, [setIsModalVisible]);

    const signupPostUser = useMutation(
        (payload) => signupPostUserApi(payload),
        {
            onSuccess: (res) => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: `You have successfully registered as a member.
                    Email has been sent
                    please check.`,
                });

                return history.push('/');
            },
            onError: (res) => {
                return handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: res.response?.data?.message,
                });
            },
        }
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

        values['terms_agree'] = checked ? 1 : 0;

        return signupPostUser.mutate(values);
    };

    useEffect(() => {
        if (termsChecked?.userTerms) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }, [termsChecked, setChecked]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    return (
        <SignWrap>
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
                                name="name"
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
                                name="email"
                                label="User ID (EMAIL)"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="Insert User Id"
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
                                // disabled={userPut.isLoading}
                            >
                                CREATE
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

export default MemberSignup;
