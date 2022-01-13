import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { commonBasicGetListsAsyncAction } from 'store/common/basic/reducer';
import { commonYearGetListsAsyncAction } from 'store/common/year/reducer';
import { commonMaterialGetListsAsyncAction } from 'store/common/material/reducer';
import {
    companyGetBrandAsyncAction,
    companyGetRelationTypeAsyncAction,
} from 'store/company/reducer';
import { companySearchListsAsyncAction } from 'store/companyInfo/reducer';
import {
    cbdCoverGetIdAsyncAction,
    cbdCoverPostAsyncAction,
    cbdCoverPostImageAsyncAction,
} from 'store/cbd/cover/reducer';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import styled from 'styled-components';
import { Row, Col, Form, Input, Select, Upload, Space } from 'antd';
import * as confirm from 'components/common/confirm';
import { PushpinOutlined } from '@ant-design/icons';
import noImage from 'asserts/images/no_image.png';
import TableButton from 'components/common/table/TableButton';
import { FilterSelect } from 'components/common/select';

const CoverWrite = (props) => {
    const { match, history } = props;
    // const { Meta } = Card;
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const [file, setFile] = useState(null);
    const upload = {
        name: 'file',
        beforeUpload: (file) => {
            setFile(file);
            return false;
        },
    };

    const commonBasicGetLists = useSelector(
        (state) => state.commonBasicReducer.get.lists
    );
    const handleCommonBasicGetLists = useCallback(
        (payload) => dispatch(commonBasicGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const commonYearGetLists = useSelector(
        (state) => state.commonYearReducer.get.lists
    );
    const handleCommonYearGetLists = useCallback(
        (payload) => dispatch(commonYearGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const companyGetBrand = useSelector(
        (state) => state.companyReducer.get.brand
    );
    const handleCompanyGetBrand = useCallback(
        (payload) => dispatch(companyGetBrandAsyncAction.request(payload)),
        [dispatch]
    );

    const companyInfoGetLists = useSelector(
        (state) => state.companyInfoReducer.searchLists
    );
    const handleCompanyInfoGetLists = useCallback(
        (payload) => dispatch(companySearchListsAsyncAction.request(payload)),
        [dispatch]
    );

    const commonMaterialGetLists = useSelector(
        (state) => state.commonMaterialReducer.get.lists
    );
    const handleCommonMaterialGetLists = useCallback(
        (payload) =>
            dispatch(commonMaterialGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const companyGetRelationType = useSelector(
        (state) => state.companyReducer.get.relationType
    );
    const handleCompanyGetRelationType = useCallback(
        (payload) =>
            dispatch(companyGetRelationTypeAsyncAction.request(payload)),
        [dispatch]
    );

    const cbdCoverGetId = useSelector((state) => state.cbdCoverReducer.get.id);
    const handleCbdCoverGetId = useCallback(
        (payload) => dispatch(cbdCoverGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdCoverGetIdInit = useCallback(
        () => dispatch(cbdCoverGetIdAsyncAction.initial()),
        [dispatch]
    );

    const cbdCoverPost = useSelector((state) => state.cbdCoverReducer.post);
    const handleCbdCoverPost = useCallback(
        (payload) => dispatch(cbdCoverPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdCoverPostInit = useCallback(
        () => dispatch(cbdCoverPostAsyncAction.initial()),
        [dispatch]
    );

    const cbdCoverPostImage = useSelector(
        (state) => state.cbdCoverReducer.postImage
    );
    const handleCbdCoverPostImage = useCallback(
        (payload) => dispatch(cbdCoverPostImageAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdCoverPostImageInit = useCallback(
        () => dispatch(cbdCoverPostImageAsyncAction.initial()),
        [dispatch]
    );

    const handleSubmit = (values) => {
        // 수정
        if (cbdCoverGetId.data) {
            const newValues = { ...values };

            const {
                commonCurrency,
                garmentCategory,
                gender,
                orderType,
                buyer,
                materialCategory,
                season,
                brand,
            } = cbdCoverGetId.data.data;

            const {
                commonCurrencyId,
                commonGarmentCategoryId,
                commonGenderId,
                commonOrderTypeId,
                companyId,
                materialCategoryId,
                seasonId,
                vendorBrandId,
            } = values;

            // newValues['commonCurrencyId'] = 18662;
            // 달러 고정 취소
            newValues['commonCurrencyId'] =
                typeof commonCurrencyId === 'string'
                    ? commonCurrency.id
                    : commonCurrencyId;
            newValues['commonGarmentCategoryId'] =
                typeof commonGarmentCategoryId === 'string'
                    ? garmentCategory.id
                    : commonGarmentCategoryId;

            newValues['commonGenderId'] =
                typeof commonGenderId === 'string' ? gender.id : commonGenderId;

            newValues['commonOrderTypeId'] =
                typeof commonOrderTypeId === 'string'
                    ? orderType.id
                    : commonOrderTypeId;

            newValues['companyId'] =
                typeof companyId === 'string' ? buyer.id : companyId;

            newValues['materialCategoryId'] =
                typeof materialCategoryId === 'string'
                    ? materialCategory.id
                    : materialCategoryId;

            newValues['seasonId'] =
                typeof seasonId === 'string' ? season.id : seasonId;

            newValues['vendorBrandId'] =
                typeof vendorBrandId === 'string' ? brand.id : vendorBrandId;

            // newValues['status'] = newValues['status'] ? 'OPEN' : 'CLOSE';
            newValues['status'] = 'OPEN';
            return confirm.saveConfirm(() => handleCbdCoverPost(newValues));
        }

        // 등록
        // values['commonCurrencyId'] = 18662;
        // values['status'] = values['status'] ? 'OPEN' : 'CLOSE';
        values['status'] = 'OPEN';
        return confirm.saveConfirm(() => handleCbdCoverPost(values));
    };

    useEffect(() => {
        if (cbdCoverPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdCoverPost.error.message,
            });
        } else if (cbdCoverPost.data) {
            if (file) {
                handleCbdCoverPostImage({
                    id: cbdCoverPost.data.data.coverId,
                    file: file,
                });
            }
            handleNotification({
                type: 'success',
                message: 'Success',
                description: 'CBD Cover creation success',
            });
            return history.goBack();
        }

        return () => handleCbdCoverPostInit();
    }, [
        cbdCoverPost,
        file,
        history,
        handleCbdCoverPostImage,
        handleCbdCoverPostInit,
        handleNotification,
    ]);

    useEffect(() => {
        if (cbdCoverPostImage.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: 'CBD Cover image upload failed',
            });
        } else if (cbdCoverPostImage.data) {
            // return handleNotification({
            //     type: 'success',
            //     message: 'Success',
            //     description: 'CBD Cover image upload success',
            // });
        }

        return () => handleCbdCoverPostImageInit();
    }, [cbdCoverPostImage, handleNotification, handleCbdCoverPostImageInit]);

    useEffect(() => {
        if (match.params.id) {
            handleCbdCoverGetId(match.params.id);
        }
        return () => {
            handleCbdCoverGetIdInit();
        };
    }, [match, handleCbdCoverGetId, handleCbdCoverGetIdInit]);

    useEffect(() => {
        if (cbdCoverGetId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdCoverGetId.error.message,
            });
        } else if (cbdCoverGetId.data) {
            const {
                // status,
                cbdName,
                commonCurrency,
                garmentCategory,
                gender,
                orderType,
                buyer,
                coverId,
                designNumber,
                materialCategory,
                season,
                seasonYear,
                brand,
            } = cbdCoverGetId.data.data;
            // setChecked(status === 'OPEN' ? true : false);
            form.setFieldsValue({
                // status: status,
                cbdName: cbdName,
                commonCurrencyId: commonCurrency.name2,
                commonGarmentCategoryId: garmentCategory.name1,
                commonGenderId: gender.name1,
                commonOrderTypeId: orderType.name,
                companyId: buyer.name,
                coverId: coverId,
                designNumber: designNumber,
                materialCategoryId: materialCategory.typeB,
                seasonId: season.name,
                seasonYear: seasonYear,
                vendorBrandId: brand.name,
            });
        }
    }, [cbdCoverGetId, form, handleNotification]);

    return (
        <CoverWriteWrap>
            <div className="shadow">
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <PushpinOutlined />
                            NEW COVER PAGE
                        </Space>
                    </div>

                    <Row gutter={10}>
                        <Col span={16}>
                            <div>
                                <Form
                                    {...layout}
                                    onFinish={handleSubmit}
                                    form={form}
                                    validateMessages={handleValidateMessage}
                                    style={{ paddingTop: '1rem' }}
                                    size="small"
                                >
                                    <Row gutter={10}>
                                        <Col span={6}>
                                            <Upload {...upload}>
                                                <div className="ratioBox">
                                                    <div
                                                        className="ratioContent"
                                                        style={{
                                                            backgroundImage: `url(${cbdCoverGetId.data?.data.imagPath})`,
                                                            backgroundSize:
                                                                'cover',
                                                            resize: 'both',
                                                            textAlign: 'center',
                                                            fontSize: '16pt',
                                                            border: '1px solid lightgray',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        {!cbdCoverGetId.data && (
                                                            <ImageWrap
                                                                src={noImage}
                                                                alt="no image"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </Upload>
                                        </Col>
                                        <Col span={16}>
                                            {/* <Form.Item
                                                name="status"
                                                label="STATUS"
                                                rules={[{ required: true }]}
                                            >
                                                <Switch
                                                    checked={checked}
                                                    onChange={() =>
                                                        setChecked(
                                                            (checked) =>
                                                                !checked
                                                        )
                                                    }
                                                />
                                            </Form.Item> */}
                                            <Form.Item name="coverId" hidden>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                name="cbdName"
                                                label="COVER NAME"
                                                rules={[{ required: true }]}
                                            >
                                                <Input
                                                    bordered={false}
                                                    maxLength="30"
                                                    placeholder="Insert Cover name"
                                                    size="small"
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="designNumber"
                                                label="DESIGN NUMBER"
                                                rules={[{ required: true }]}
                                            >
                                                <Input
                                                    bordered={false}
                                                    maxLength="20"
                                                    placeholder="Insert Design number"
                                                    size="small"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name="companyId"
                                                label="BUYER"
                                                rules={[{ required: true }]}
                                            >
                                                {FilterSelect({
                                                    _key: 'companyID',
                                                    _value: 'companyID',
                                                    text: 'companyName',
                                                    placeholder: `Select Buyer name`,
                                                    data: companyGetRelationType,
                                                    onData: () =>
                                                        handleCompanyGetRelationType(
                                                            'BUYER'
                                                        ),
                                                })}

                                                {/* <Select
                                                    placeholder="Select Buyer name"
                                                    showSearch
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                    onDropdownVisibleChange={(
                                                        e
                                                    ) => {
                                                        if (
                                                            e &&
                                                            !companyGetLists.data
                                                        )
                                                            handleCompanytGetLists();
                                                    }}
                                                    bordered={false}
                                                    size="small"
                                                >
                                                    {companyGetLists.data &&
                                                        companyGetLists.data.list.map(
                                                            (v) => {
                                                                return (
                                                                    <Select.Option
                                                                        key={
                                                                            v.companyID
                                                                        }
                                                                        value={
                                                                            v.companyID
                                                                        }
                                                                        size="small"
                                                                    >
                                                                        {
                                                                            v.companyName
                                                                        }
                                                                    </Select.Option>
                                                                );
                                                            }
                                                        )}
                                                </Select> */}
                                            </Form.Item>

                                            <Form.Item
                                                name="vendorBrandId"
                                                label="BRAND"
                                                rules={[{ required: true }]}
                                            >
                                                {FilterSelect({
                                                    _key: 'companyID',
                                                    _value: 'companyID',
                                                    text: 'companyName',
                                                    placeholder: `Select Brand name`,
                                                    data: companyGetBrand,
                                                    onData: () => {
                                                        return handleCompanyGetBrand(
                                                            typeof form.getFieldValue(
                                                                'companyId'
                                                            ) === 'string'
                                                                ? cbdCoverGetId
                                                                      .data
                                                                      ?.data
                                                                      ?.buyer
                                                                      ?.id
                                                                : form.getFieldValue(
                                                                      'companyId'
                                                                  )
                                                        );
                                                    },
                                                })}

                                                {/* <Select
                                                    placeholder="Select Brand name"
                                                    showSearch
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                    onDropdownVisibleChange={(
                                                        e
                                                    ) => {
                                                        if (e)
                                                            handleCompanyGetBrand(
                                                                typeof form.getFieldValue(
                                                                    'companyId'
                                                                ) === 'string'
                                                                    ? cbdCoverGetId
                                                                          .data
                                                                          ?.data
                                                                          ?.buyer
                                                                          ?.id
                                                                    : form.getFieldValue(
                                                                          'companyId'
                                                                      )
                                                            );
                                                    }}
                                                    bordered={false}
                                                    size="small"
                                                >
                                                    {companyGetBrand.data?.list.map(
                                                        (v) => {
                                                            return (
                                                                <Select.Option
                                                                    key={
                                                                        v.companyID
                                                                    }
                                                                    value={
                                                                        v.companyID
                                                                    }
                                                                >
                                                                    {
                                                                        v.companyName
                                                                    }
                                                                </Select.Option>
                                                            );
                                                        }
                                                    )}
                                                </Select> */}
                                            </Form.Item>
                                            <Form.Item
                                                name="seasonYear"
                                                label="SEASON YEAR"
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    placeholder="Select Season year"
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toString()
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input
                                                                    .toString()
                                                                    .toLowerCase()
                                                            ) >= 0
                                                    }
                                                    onDropdownVisibleChange={(
                                                        e
                                                    ) => {
                                                        if (
                                                            e &&
                                                            !commonYearGetLists.data
                                                        )
                                                            handleCommonYearGetLists();
                                                    }}
                                                    bordered={false}
                                                >
                                                    {commonYearGetLists.data &&
                                                        commonYearGetLists.data.list
                                                            .slice(0)
                                                            .reverse()
                                                            .map((v, i) => {
                                                                return (
                                                                    <Select.Option
                                                                        key={i}
                                                                        value={
                                                                            v
                                                                        }
                                                                    >
                                                                        {v}
                                                                    </Select.Option>
                                                                );
                                                            })}
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                name="seasonId"
                                                label="SEASON NAME"
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    placeholder="Select Season name"
                                                    showSearch
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                    onDropdownVisibleChange={(
                                                        e
                                                    ) => {
                                                        if (e)
                                                            handleCompanyInfoGetLists(
                                                                'season'
                                                            );
                                                    }}
                                                    bordered={false}
                                                >
                                                    {companyInfoGetLists.data &&
                                                        companyInfoGetLists.data
                                                            .type ===
                                                            'season' &&
                                                        companyInfoGetLists.data.result.list.map(
                                                            (v, i) => {
                                                                return (
                                                                    <Select.Option
                                                                        key={
                                                                            v.id
                                                                        }
                                                                        value={
                                                                            v.id
                                                                        }
                                                                    >
                                                                        {v.name}
                                                                    </Select.Option>
                                                                );
                                                            }
                                                        )}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                name="commonGenderId"
                                                label="GENDER"
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    placeholder="Select Gender name"
                                                    showSearch
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                    onDropdownVisibleChange={(
                                                        e
                                                    ) => {
                                                        if (e)
                                                            handleCommonBasicGetLists(
                                                                'gender'
                                                            );
                                                    }}
                                                    bordered={false}
                                                >
                                                    {commonBasicGetLists.data &&
                                                        commonBasicGetLists.data.list.map(
                                                            (v, i) => {
                                                                return (
                                                                    <Select.Option
                                                                        key={
                                                                            v.id
                                                                        }
                                                                        value={
                                                                            v.id
                                                                        }
                                                                    >
                                                                        {
                                                                            v.name1
                                                                        }
                                                                    </Select.Option>
                                                                );
                                                            }
                                                        )}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                name="commonGarmentCategoryId"
                                                label="GARMENT TYPE"
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    placeholder="Select Garment type name"
                                                    showSearch
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                    onDropdownVisibleChange={(
                                                        e
                                                    ) => {
                                                        if (e)
                                                            handleCommonBasicGetLists(
                                                                'garment_category'
                                                            );
                                                    }}
                                                    bordered={false}
                                                >
                                                    {commonBasicGetLists.data &&
                                                        commonBasicGetLists.data.list.map(
                                                            (v, i) => {
                                                                return (
                                                                    <Select.Option
                                                                        key={
                                                                            v.id
                                                                        }
                                                                        value={
                                                                            v.id
                                                                        }
                                                                    >
                                                                        {
                                                                            v.name1
                                                                        }
                                                                    </Select.Option>
                                                                );
                                                            }
                                                        )}
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                name="materialCategoryId"
                                                label="FABRIC TYPE"
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    placeholder="Select Fabric type name"
                                                    showSearch
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                    onDropdownVisibleChange={(
                                                        e
                                                    ) => {
                                                        if (
                                                            e &&
                                                            !commonMaterialGetLists.data
                                                        )
                                                            handleCommonMaterialGetLists();
                                                    }}
                                                    bordered={false}
                                                >
                                                    {commonMaterialGetLists.data &&
                                                        commonMaterialGetLists.data.list
                                                            .filter(
                                                                (v) =>
                                                                    v.typeA ===
                                                                    'Fabric'
                                                            )
                                                            .map((v, i) => {
                                                                return (
                                                                    <Select.Option
                                                                        key={
                                                                            v.id
                                                                        }
                                                                        value={
                                                                            v.id
                                                                        }
                                                                    >
                                                                        {
                                                                            v.typeB
                                                                        }
                                                                    </Select.Option>
                                                                );
                                                            })}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                name="commonOrderTypeId"
                                                label="ORDER TYPE"
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    placeholder="Select Order type name"
                                                    showSearch
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                    onDropdownVisibleChange={(
                                                        e
                                                    ) => {
                                                        if (e)
                                                            handleCompanyInfoGetLists(
                                                                'order'
                                                            );
                                                    }}
                                                    bordered={false}
                                                >
                                                    {companyInfoGetLists.data &&
                                                        companyInfoGetLists.data
                                                            .type === 'order' &&
                                                        companyInfoGetLists.data.result.list.map(
                                                            (v, i) => {
                                                                return (
                                                                    <Select.Option
                                                                        key={
                                                                            v.id
                                                                        }
                                                                        value={
                                                                            v.id
                                                                        }
                                                                    >
                                                                        {v.name}
                                                                    </Select.Option>
                                                                );
                                                            }
                                                        )}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                name="commonCurrencyId"
                                                label="CURRENCY"
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    placeholder="Select Currency name"
                                                    showSearch
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                    onDropdownVisibleChange={(
                                                        e
                                                    ) => {
                                                        if (e)
                                                            handleCommonBasicGetLists(
                                                                'currency'
                                                            );
                                                    }}
                                                    bordered={false}
                                                >
                                                    {commonBasicGetLists.data?.list
                                                        .filter(
                                                            (v) =>
                                                                v?.name2 ===
                                                                    'KRW' ||
                                                                v?.name2 ===
                                                                    'USD'
                                                        )
                                                        .map((v) => {
                                                            return (
                                                                <Select.Option
                                                                    key={v.id}
                                                                    value={v.id}
                                                                >
                                                                    {v.name2}
                                                                </Select.Option>
                                                            );
                                                        })}
                                                </Select>
                                            </Form.Item>
                                            <div className="buttonWrap">
                                                <Space>
                                                    <TableButton
                                                        toolTip={{
                                                            placement:
                                                                'topRight',
                                                            title: 'Cover Page Create',
                                                            arrowPointAtCenter: true,
                                                        }}
                                                        mode="save"
                                                        size="small"
                                                        onClick={() => {
                                                            form.submit();
                                                        }}
                                                    />

                                                    <TableButton
                                                        toolTip={{
                                                            placement:
                                                                'topRight',
                                                            title: 'Back',
                                                            arrowPointAtCenter: true,
                                                        }}
                                                        mode="cancel"
                                                        size="small"
                                                        onClick={() =>
                                                            history.goBack()
                                                        }
                                                    />
                                                </Space>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div
                                style={{ paddingTop: '2rem' }}
                                className="site-card-wrapper"
                            >
                                {/* <Card
                                    hoverable
                                    style={{ width: 280 }}
                                    cover={
                                        <img
                                            alt="example"
                                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                                        />
                                    }
                                >
                                    <Meta
                                        title="Europe Street beat"
                                        description="www.vengine.io"
                                    />
                                </Card> */}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </CoverWriteWrap>
    );
};

const CoverWriteWrap = styled.div`
    padding: 1rem;
    .shadow {
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
    }
    .titleWrap {
        padding: 0 1rem 1rem 1rem;
        margin: 0.3rem 0rem;
        .title {
            ${({ theme }) => theme.fonts.h7}
        }
    }

    .buttonWrap {
        display: flex;
        justify-content: flex-end;
    }

    .ant-upload {
        width: 100%;
    }

    .ant-form-item-label {
        label {
            ${({ theme }) => theme.fonts.h5};
        }
    }

    .ant-form-item-required {
        ${({ theme }) => theme.fonts.h5};
        color: #7f7f7f;
    }

    .ant-form-item-control-input-content > input {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
        ${(props) => props.theme.fonts.h5};
    }

    .ant-form-item-control-input-content > div {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
        ${(props) => props.theme.fonts.h5};
    }

    .ratioBox {
        ${({ theme }) => theme.controls.ratioBox};
    }
    .ratioContent {
        ${({ theme }) => theme.controls.ratioContent};
    }
`;

const ImageWrap = styled.img`
    align-item: center;
    justify-content: center;
    // border-radius: 20%;
    width: 100%;
    height: 100%;
    border: 0;
    // opacity: 20;
`;

export default CoverWrite;
