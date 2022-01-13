import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import {
    commonBasicGetCountriesAsyncAction,
    commonBasicGetCitiesAsyncAction,
} from 'store/common/basic/reducer';
import { companyBizPostNewPartnerAsyncAction } from 'store/companyInfo/reducer';
import { commonEnumsGetListsAsyncAction } from 'store/common/enums/reducer';
import { Card, Form, Input, Button, Row, Col, Space, Upload } from 'antd';

import SignWrap from 'styles/SignWrap';
import { FilterSelect } from 'components/common/select';
import { PaperClipOutlined } from '@ant-design/icons';

const PartnerManagementNew = (props) => {
    const { history } = props;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();
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

    const commonEnumsGetLists = useSelector(
        (state) => state.commonEnumsReducer.get.lists
    );
    const handleCommonEnumsGetLists = useCallback(
        (payload) => dispatch(commonEnumsGetListsAsyncAction.request(payload)),
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

    const companyBizPostNewPartner = useSelector(
        (state) => state.companyInfoReducer.postBizNewPartner
    );
    const handleCompanyBizPostNewPartner = useCallback(
        (payload) =>
            dispatch(companyBizPostNewPartnerAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCompanyBizPostNewPartnerInit = useCallback(
        () => dispatch(companyBizPostNewPartnerAsyncAction.initial()),
        [dispatch]
    );

    const handleSubmit = useCallback(
        (values) => {
            // if (values['emails'].some((v) => v.match(regExp) === null)) {
            //     return handleNotification({
            //         type: 'error',
            //         message: 'Error',
            //         description: 'Please check your email format',
            //     });
            // }

            return handleCompanyBizPostNewPartner(values);
        },
        [handleCompanyBizPostNewPartner]
    );

    useEffect(() => {
        if (companyBizPostNewPartner.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: companyBizPostNewPartner.error.message,
            });
        } else if (companyBizPostNewPartner.data) {
            handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful registration of new partner company',
            });
            return history.push('/vendor/system/partnermanagement');
        }
    }, [companyBizPostNewPartner, history, handleNotification]);

    // 초기화
    useEffect(() => {
        return () => handleCompanyBizPostNewPartnerInit();
    }, [handleCompanyBizPostNewPartnerInit]);

    // 테이블
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    return (
        <SignWrap>
            <Card
                title="COMPANY INFORMATION"
                extra={
                    <div style={{ fontSize: '0.625rem' }}>
                        <span style={{ color: 'red' }}>*</span>It cannot be
                        modified or deleted after registration, so please fill
                        it out carefully.
                    </div>
                }
                style={{
                    border: '1px solid lightgray',
                    borderRadius: '3px',
                    boxShadow: '3px 3px gray',
                    padding: '0.5rem',
                }}
            >
                <Form
                    {...layout}
                    form={form}
                    onFinish={handleSubmit}
                    validateMessages={handleValidateMessage}
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="INVITE USER ID (EMAIL)"
                                name="email"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="Insert Invite user id"
                                    bordered={false}
                                />

                                {/* <Select
                                        mode="tags"
                                        open={false}
                                        style={{ width: '100%' }}
                                        bordered={false}
                                        placeholder="Please enter your email"
                                    /> */}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="relationType"
                                label="RELATION TYPE"
                                rules={[{ required: true }]}
                            >
                                <FilterSelect
                                    _key="key"
                                    value="key"
                                    text="value"
                                    placeholder="Select Relation type"
                                    filterType="relationType"
                                    data={commonEnumsGetLists}
                                    onData={handleCommonEnumsGetLists}
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
                                name="companyName"
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
                                    <Button
                                        icon={
                                            <PaperClipOutlined
                                                style={{
                                                    fontSize: '12pt',
                                                }}
                                            />
                                        }
                                    />
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
                        <Col span={12}>
                            <Form.Item name="state" label="STATE">
                                <Input
                                    placeholder="Insert State"
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
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
                    </Row>

                    <div className="buttonWrap">
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="formButton"
                                disabled={companyBizPostNewPartner.isLoading}
                            >
                                REQUEST
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </SignWrap>
    );
};

export default PartnerManagementNew;
