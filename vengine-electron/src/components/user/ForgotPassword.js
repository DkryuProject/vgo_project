import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';

import { Card } from 'antd';
import { Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import SignWrap from 'styles/SignWrap';
import VgoLogo from 'asserts/images/vgo_logo.png';
import { Loading } from 'components/common/loading';
import { userGetResetEmailAsyncAction } from 'store/user/reducer';
const ForgotPassword = (props) => {
    const { history } = props;
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();

    const userGetResetEmail = useSelector(
        (state) => state.userReducer.get.resetEmail
    );
    const handleUserGetResetEmail = useCallback(
        (payload) => dispatch(userGetResetEmailAsyncAction.request(payload)),
        [dispatch]
    );
    const handleUserGetResetEmailInit = useCallback(
        () => dispatch(userGetResetEmailAsyncAction.initial()),
        [dispatch]
    );

    const locationState = {
        pathname: '/signin',
    };

    const handleSubmit = useCallback(
        (values) => {
            return handleUserGetResetEmail(values?.email);
        },
        [handleUserGetResetEmail]
    );

    useEffect(() => {
        if (userGetResetEmail.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: userGetResetEmail.error.message,
            });
        } else if (userGetResetEmail.data) {
            localStorage.clear();
            history.push('/signin');
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'A request email has been sent',
            });
        }
    }, [userGetResetEmail, history, handleNotification]);

    useEffect(() => {
        return () => handleUserGetResetEmailInit();
    }, [handleUserGetResetEmailInit]);

    return (
        <div>
            {userGetResetEmail.isLoading && <Loading />}
            <SignWrap signin>
                <div className="titleWrap">
                    <img src={VgoLogo} alt="V-GO Logo" />
                    <h3>FORGOT YOUR PASSWORD?</h3>
                </div>

                <Card title="FORGOT PASSWORD" size="small">
                    <Form
                        onFinish={handleSubmit}
                        validateMessages={handleValidateMessage}
                    >
                        <Form.Item
                            name="email"
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
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="formButton"
                                size="small"
                            >
                                SUBMIT
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="formButton"
                                onClick={() => history.push(locationState)}
                                size="small"
                            >
                                LOGIN
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </SignWrap>
        </div>
    );
};

export default ForgotPassword;
