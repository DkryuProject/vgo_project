import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
// import { signinPostApi } from 'store/sign/saga';
// import { userGetEmailApi } from 'store/user/saga';
import { userGetEmailAsyncAction } from 'store/user/reducer';
import { signinPostAsyncAction } from 'store/sign/reducer';
import styled from 'styled-components';
import { Card, Col, Row } from 'antd';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import SignWrap from 'styles/SignWrap';
import VgoLogo from 'asserts/images/vgo_logo.png';
import { Loading } from 'components/common/loading';

const Signin = (props) => {
    const { history } = props;
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();

    const signinPost = useSelector((state) => state.signReducer.post.signin);
    const handleSigninPost = useCallback(
        (payload) => dispatch(signinPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleSigninPostInit = useCallback(
        () => dispatch(signinPostAsyncAction.initial()),
        [dispatch]
    );

    // User Email
    const userGetEmail = useSelector((state) => state.userReducer.get.email);
    const handleUserGetEmail = useCallback(
        (payload) => dispatch(userGetEmailAsyncAction.request(payload)),
        [dispatch]
    );

    const handleSubmit = useCallback(
        (values) => {
            return handleSigninPost(values);
        },
        [handleSigninPost]
    );

    useEffect(() => {
        if (signinPost.error) {
            if (signinPost.error?.code === 'USER007') {
                return handleNotification({
                    type: 'error',
                    message: 'Error',
                    description:
                        'The password is incorrect. Please check again.',
                });
            }

            return handleNotification({
                type: 'error',
                message: 'Error',
                description: signinPost.error?.message,
            });
        } else if (signinPost.data) {
            const email = localStorage.getItem('email');
            const lang = 'ko';
            handleUserGetEmail({ email, lang });

            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Log-in succeed',
            });
        }
    }, [signinPost, handleUserGetEmail, handleNotification]);

    useEffect(() => {
        return () => handleSigninPostInit();
    }, [handleSigninPostInit]);

    useEffect(() => {
        if (userGetEmail.data) {
            return history.push('/');
        }
    }, [userGetEmail, history]);

    return (
        <div>
            {signinPost.isLoading && <Loading />}
            <SignWrap signin>
                <div className="titleWrap">
                    <img src={VgoLogo} alt="V-GO Logo" />
                    <h3>A Better Way for your Apparel Job</h3>
                </div>

                <Card title="LOGIN" size="small">
                    <Form
                        onFinish={handleSubmit}
                        validateMessages={handleValidateMessage}
                    >
                        <FormItemStyle>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <UserOutlined className="site-form-item-icon" />
                                    }
                                    className="formInput"
                                    placeholder="Email"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={
                                        <LockOutlined className="site-form-item-icon" />
                                    }
                                    type="password"
                                    className="formInput"
                                    placeholder="Password"
                                    bordered={false}
                                />
                            </Form.Item>
                        </FormItemStyle>
                        <Form.Item>
                            <Row gutter={[10, 10]}>
                                <Col span={24}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="formButton"
                                        disabled={signinPost.isLoading}
                                        size="small"
                                    >
                                        LOGIN
                                    </Button>
                                </Col>
                                <Col span={24}>
                                    <Button
                                        type="primary"
                                        htmlType="button"
                                        className="formButton"
                                        size="small"
                                        onClick={() =>
                                            history.push('/signup/member')
                                        }
                                    >
                                        CREATE MY PERSONAL ACCOUNT
                                    </Button>
                                </Col>
                                {/* <Col span={12}>
                                    <Button
                                        type="primary"
                                        htmlType="button"
                                        className="formButton"
                                        size="small"
                                        onClick={() => history.push('/signup')}
                                    >
                                        CREATE MY BUSINESS ACCOUNT
                                    </Button>
                                </Col> */}
                            </Row>
                        </Form.Item>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                cursor: 'pointer',
                            }}
                            onClick={() => history.push('/forgotPassword')}
                        >
                            Forgot Password
                        </div>
                    </Form>
                </Card>
            </SignWrap>
        </div>
    );
};

const FormItemStyle = styled.div`
    label {
        display: none;
    }
`;

export default React.memo(Signin);
