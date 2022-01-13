import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useNotification from "core/hook/useNotification";
import useValidateMessage from "core/hook/useValidateMessage";

import { signCheckGetDomainAsyncAction } from "store/sign/check/reducer";
import { signVerifyPostCodeAsyncAction } from "store/sign/verify/reducer";

import { Card } from "antd";
import { Form, Input, Button } from "antd";
import { Loading } from "components/common/loading";
import { NotFound } from "components/common/notFound";

import { UserOutlined } from "@ant-design/icons";
import SignWrap from "styles/SignWrap";
import VgoLogo from "asserts/images/vgo_logo.png";

const VerifyCode = (props) => {
    const { history, location } = props;
    const email = location.state && location.state.email;
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();

    const signCheckGetDomain = useSelector(
        (state) => state.signCheckReducer.get.domain
    );
    const handleSignCheckGetDomain = useCallback(
        (payload) => dispatch(signCheckGetDomainAsyncAction.request(payload)),
        [dispatch]
    );

    const signVerifyPostCode = useSelector(
        (state) => state.signVerifyReducer.post.code
    );
    const handleSignVerifyPostCode = useCallback(
        (payload) => dispatch(signVerifyPostCodeAsyncAction.request(payload)),
        [dispatch]
    );

    const handleSubmit = useCallback(
        (values) => {
            const domain = email.split("@")[1];
            const promises = [
                Promise.resolve(handleSignVerifyPostCode(values)),
                Promise.resolve(handleSignCheckGetDomain({ domain: domain })),
            ];
            return Promise.all(promises);
        },
        [handleSignVerifyPostCode, handleSignCheckGetDomain, email]
    );

    useEffect(() => {
        if (signVerifyPostCode.error) {
            return handleNotification({
                type: "error",
                message: "Error",
                description: "Please check the verification code again",
            });
        } else if (signVerifyPostCode.data) {
            if (signCheckGetDomain.error) {
                const locationState = {
                    pathname: "/signup",
                    state: {
                        email,
                    },
                };
                history.push(locationState);

                return handleNotification({
                    type: "success",
                    message: "Success",
                    description: "Verification Code Complete",
                });
            } else if (signCheckGetDomain.data) {
                const { userCompanyname } = signCheckGetDomain.data.data;
                const locationState = {
                    pathname: "/signup",
                    state: {
                        email,
                        companyName: userCompanyname,
                    },
                };
                history.push(locationState);

                return handleNotification({
                    type: "success",
                    message: "Success",
                    description: "Verification Code Complete",
                });
            }
        }
    }, [
        signVerifyPostCode,
        signCheckGetDomain,
        email,
        history,
        handleNotification,
    ]);

    if (!email) {
        return <NotFound />;
    }

    return (
        <div>
            {signVerifyPostCode.isLoading ||
                (signCheckGetDomain.isLoading && <Loading />)}
            <SignWrap>
                <div className="titleWrap">
                    <img src={VgoLogo} alt="V-GO Logo" />
                    {/* <h2>V-GO</h2> */}
                    <h3>A Better Way for your Apparel Job</h3>
                </div>
                <Card title="VERIFY CODE">
                    <Form
                        onFinish={handleSubmit}
                        validateMessages={handleValidateMessage}
                        size="small"
                    >
                        <Form.Item
                            name="code"
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
                                placeholder="Please insert to your e-mail Code."
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="formButton"
                                disabled={
                                    signVerifyPostCode.isLoading ||
                                    signCheckGetDomain.isLoading
                                }
                            >
                                SUBMIT
                            </Button>

                            {/* <Button
                                type="primary"
                                htmlType="submit"
                                className="formButton"
                                onClick={() => history.goBack()}
                            >
                                BACK
                            </Button> */}
                        </Form.Item>
                    </Form>
                </Card>
            </SignWrap>
        </div>
    );
};

export default VerifyCode;
