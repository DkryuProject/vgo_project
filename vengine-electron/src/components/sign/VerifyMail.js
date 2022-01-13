import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useNotification from "core/hook/useNotification";
import useValidateMessage from "core/hook/useValidateMessage";

import { signVerifyPostMailAsyncAction } from "store/sign/verify/reducer";
import { signCheckGetEmailAsyncAction } from "store/sign/check/reducer";

import { Card } from "antd";
import { Form, Input, Button } from "antd";
import { Loading } from "components/common/loading";
import { NotFound } from "components/common/notFound";

import { UserOutlined } from "@ant-design/icons";
import SignWrap from "styles/SignWrap";
import VgoLogo from "asserts/images/vgo_logo.png";

const VerifyMail = (props) => {
    const { history, location } = props;
    const type = location.state && location.state.type;
    const dispatch = useDispatch();
    const [state, setState] = useState(null);
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();

    const signVerifyPostMail = useSelector(
        (state) => state.signVerifyReducer.post.mail
    );
    const handleSignVerifyPostMail = useCallback(
        (payload) => dispatch(signVerifyPostMailAsyncAction.request(payload)),
        [dispatch]
    );

    const signCheckGetEmail = useSelector(
        (state) => state.signCheckReducer.get.email
    );
    const handleSignCheckGetEmail = useCallback(
        (payload) => dispatch(signCheckGetEmailAsyncAction.request(payload)),
        [dispatch]
    );

    const handleSubmit = useCallback(
        (values) => {
            setState(values);

            const promises = [Promise.resolve(handleSignCheckGetEmail(values))];
            Promise.all(promises);
        },
        [handleSignCheckGetEmail]
    );

    // 이메일 및 도메인 체크
    useEffect(() => {
        if (signCheckGetEmail.error) {
            handleSignVerifyPostMail(state);
            return handleNotification({
                type: "success",
                message: "Success",
                description: "Email Check",
            });
        } else if (signCheckGetEmail.data) {
            return handleNotification({
                type: "error",
                message: "Error",
                description: "Email Check",
            });
        }
    }, [
        state,
        signCheckGetEmail,
        handleSignVerifyPostMail,
        handleNotification,
    ]);

    // 이메일 인증
    useEffect(() => {
        if (signVerifyPostMail.error) {
            return handleNotification({
                type: "error",
                message: "Error",
                description: "Send Authentication Mail",
            });
        } else if (signVerifyPostMail.data === "" || signVerifyPostMail.data) {
            const locationState = {
                pathname: "/verifyCode",
                state: {
                    email: (state && state.email) || "",
                },
            };
            history.push(locationState);

            return handleNotification({
                type: "success",
                message: "Success",
                description: "Send Authentication Mail",
            });
        }
    }, [state, signVerifyPostMail, handleNotification, history]);

    if (!type) {
        return <NotFound />;
    }

    return (
        <div>
            {signCheckGetEmail.isLoading ||
                (signVerifyPostMail.isLoading && <Loading />)}
            <SignWrap>
                <div className="titleWrap">
                    <img src={VgoLogo} alt="V-GO Logo" />
                    {/* <h2>V-GO</h2> */}
                    <h3>A Better Way for your Apparel Job</h3>
                </div>
                <Card title="VERIFY EMAIL">
                    <Form
                        onFinish={handleSubmit}
                        validateMessages={handleValidateMessage}
                        size="small"
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
                                placeholder="Please insert to your e-mail address.
                                example@xxx.com"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="formButton"
                                disabled={
                                    signCheckGetEmail.isLoading ||
                                    signVerifyPostMail.isLoading
                                }
                            >
                                SUBMIT
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                className="formButton"
                                onClick={() => history.goBack()}
                            >
                                BACK
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </SignWrap>
        </div>
    );
};

export default VerifyMail;
