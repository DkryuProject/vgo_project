import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import useGtag from 'core/hook/useGtag';
import { commonMaterialGetListsAsyncAction } from 'store/common/material/reducer';
import { companyGetRelationTypeAsyncAction } from 'store/company/reducer';
import {
    materialInfoPostAsyncAction,
    materialInfoGetIdAsyncAction,
} from 'store/material/info/reducer';
import { Row, Col, Form, Input, Button, Select, Radio, Space } from 'antd';
import {
    MaterialRegistrationYarn,
    MaterialRegistrationSubsidiary,
    MaterialRegistrationOption,
    MaterialRegistrationOffer,
} from './';
import { PushpinOutlined, SwapRightOutlined } from '@ant-design/icons';
import TableButton from 'components/common/table/TableButton';

const MaterialRegistrationWrite = (props) => {
    const infoForm = useRef();
    const { match, location, history } = props;

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [handleNotification] = useNotification();
    const [handleValidateMessage] = useValidateMessage();
    const { trackPageView } = useGtag();
    const [type, setType] = useState('fabric');
    const [infoId, setInfoId] = useState(0);
    const materialType = location.state ? location.state.type : type;

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

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

    const materialInfoGetId = useSelector(
        (state) => state.materialInfoReducer.get.id
    );
    const handleMaterialInfoGetId = useCallback(
        (payload) => dispatch(materialInfoGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialInfoGetIdInit = useCallback(
        () => dispatch(materialInfoGetIdAsyncAction.initial()),
        [dispatch]
    );

    const materialInfoPost = useSelector(
        (state) => state.materialInfoReducer.post
    );
    const handleMaterialInfoPost = useCallback(
        (payload) => dispatch(materialInfoPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialInfoPostInit = useCallback(
        (payload) => dispatch(materialInfoPostAsyncAction.initial(payload)),
        [dispatch]
    );

    const materialYarnGetInfoId = useSelector(
        (state) => state.materialYarnReducer.get.infoId
    );

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const isDisabled = useMemo(() => {
        if (!materialInfoGetId.data) {
            return false;
        }
        return (
            materialInfoGetId.data?.data.supplier.id !==
            userGetEmail.data?.data.company.companyID
        );
    }, [materialInfoGetId, userGetEmail]);

    const handleInfoSubmit = useCallback(
        (values) => {
            // 수정
            const newValues = { ...values };
            if (materialInfoGetId.data) {
                const { category, supplier } = materialInfoGetId.data.data;
                const { categoryId, supplierId } = values;
                newValues['categoryId'] =
                    typeof categoryId === 'string' ? category.id : categoryId;
                newValues['supplierId'] =
                    typeof supplierId === 'string' ? supplier.id : supplierId;
                return handleMaterialInfoPost(newValues);
            }

            // 등록
            return handleMaterialInfoPost(values);
        },
        [materialInfoGetId, handleMaterialInfoPost]
    );

    useEffect(() => {
        form.setFieldsValue({
            type,
        });
    }, [type, form]);

    // 조회
    useEffect(() => {
        if (match.params.id) {
            handleMaterialInfoGetId(match.params.id);
        }
    }, [match.params.id, handleMaterialInfoGetId]);

    useEffect(() => {
        if (materialInfoGetId.data) {
            const {
                id,
                type,
                name,
                category,
                supplier,
                // cw,
                // weight,
                construction,
                supplierMaterial,
                vendorMaterial,
                buyerMaterial,
                subsidiaryDetail,
            } = materialInfoGetId.data.data;
            form.setFieldsValue({
                materialInfoid: id,
                type: type,
                name: name,
                categoryId: category.typeB,
                supplierId: supplier.name,
                construction: construction,
                supplierMaterial: supplierMaterial,
                vendorMaterial: vendorMaterial,
                buyerMaterial: buyerMaterial,
                subsidiaryDetail: subsidiaryDetail,
            });
            setType(type);
        }
    }, [materialInfoGetId, form]);

    useEffect(() => {
        if (materialInfoPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: materialInfoPost.error.message,
            });
        } else if (materialInfoPost.data) {
            const { id } = materialInfoPost?.data?.data;
            handleMaterialInfoGetId(id);
            setInfoId(id);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Material information registration success',
            });
        }
    }, [materialInfoPost, handleMaterialInfoGetId, handleNotification]);

    useEffect(() => {
        return () => {
            handleMaterialInfoGetIdInit();
            handleMaterialInfoPostInit();
        };
    }, [handleMaterialInfoGetIdInit, handleMaterialInfoPostInit]);

    // Gtag
    useEffect(() => {
        if (match?.params?.id) {
            trackPageView({
                page_title: `${materialType?.toUpperCase()} | MATERIAL DETAIL | MATERIAL REGISTER `,
            });
        }
    }, [match.params.id, materialType, trackPageView]);

    return (
        <div>
            <InfoWrap>
                {!match.params.id && !infoId && (
                    <div className="tabsWrap">
                        <div className="groupWrap">
                            <Radio.Group
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                size="small"
                            >
                                <Radio.Button
                                    value="fabric"
                                    style={{
                                        padding: '0 1rem',
                                        fontSize: '0.625rem',
                                    }}
                                >
                                    Fabric
                                </Radio.Button>
                                <Radio.Button
                                    value="trim"
                                    style={{
                                        padding: '0 1rem',
                                        fontSize: '0.625rem',
                                    }}
                                >
                                    Trim
                                </Radio.Button>
                                <Radio.Button
                                    value="accessories"
                                    style={{
                                        padding: '0 1rem',
                                        fontSize: '0.625rem',
                                    }}
                                >
                                    accessories
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>
                )}
                <div className="infomationWrap">
                    <div className="titleWrap">
                        <div className="title">
                            <Space>
                                <PushpinOutlined />
                                NEW MATERIAL ITEM REGISTRATION
                            </Space>
                        </div>
                        <TableButton
                            toolTip={{
                                placement: 'topLeft',
                                title: 'MATERIAL Save item',
                                arrowPointAtCenter: true,
                            }}
                            mode="save"
                            size="small"
                            disabled={materialInfoPost.isLoading}
                            onClick={() => {
                                infoForm.current.submit();
                            }}
                        />
                    </div>

                    <div className="formWrap">
                        <Form
                            {...layout}
                            ref={infoForm}
                            className="infoForm"
                            onFinish={handleInfoSubmit}
                            form={form}
                            validateMessages={handleValidateMessage}
                            size="small"
                        >
                            <div className="inputHiddenWrap">
                                <Form.Item name="materialInfoid" hidden>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="type" hidden>
                                    <Input />
                                </Form.Item>
                            </div>
                            <Row>
                                <Col span={18}>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item
                                                name="name"
                                                label="Name"
                                                rules={[{ required: true }]}
                                            >
                                                <Input
                                                    placeholder="Insert Name"
                                                    maxLength="30"
                                                    disabled={isDisabled}
                                                    bordered={false}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="supplierId"
                                                label="Supplier Name"
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    placeholder="Select Supplier name"
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
                                                            handleCompanyGetRelationType(
                                                                'SUPPLIER'
                                                            );
                                                    }}
                                                    disabled={isDisabled}
                                                    bordered={false}
                                                >
                                                    {/* <Select.Option
                                                        key={
                                                            userGetEmail.data
                                                                ?.data.company
                                                                .companyID
                                                        }
                                                        value={
                                                            userGetEmail.data
                                                                ?.data.company
                                                                .companyID
                                                        }
                                                    >
                                                        {
                                                            userGetEmail.data
                                                                ?.data.company
                                                                .companyName
                                                        }
                                                    </Select.Option> */}
                                                    {companyGetRelationType.data &&
                                                        companyGetRelationType.data.list.map(
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
                                                </Select>
                                            </Form.Item>

                                            {materialType === 'fabric' ? (
                                                <Form.Item
                                                    name="construction"
                                                    label="Construction"
                                                >
                                                    <Input.TextArea
                                                        placeholder="Insert Construction"
                                                        maxLength="40"
                                                        disabled={isDisabled}
                                                        bordered={false}
                                                    />
                                                </Form.Item>
                                            ) : (
                                                <Form.Item
                                                    name="subsidiaryDetail"
                                                    label="Item Detail"
                                                >
                                                    <Input.TextArea
                                                        placeholder="Insert Item detail"
                                                        maxLength="40"
                                                        disabled={isDisabled}
                                                        bordered={false}
                                                    />
                                                </Form.Item>
                                            )}
                                        </Col>
                                        <Col span={12}>
                                            {materialType === 'fabric' ? (
                                                <Form.Item
                                                    name="categoryId"
                                                    label="Fabric Type"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Select
                                                        placeholder="Select Fabric type"
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
                                                        loading={
                                                            commonMaterialGetLists.isLoading
                                                        }
                                                        disabled={isDisabled}
                                                        bordered={false}
                                                    >
                                                        {commonMaterialGetLists.data &&
                                                            commonMaterialGetLists.data.list
                                                                .filter(
                                                                    (v) =>
                                                                        v.typeA ===
                                                                        'Fabric'
                                                                )
                                                                .map((v) => {
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
                                            ) : materialType === 'trim' ? (
                                                <Form.Item
                                                    name="categoryId"
                                                    label="Category"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Select
                                                        placeholder="Select Category"
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
                                                        loading={
                                                            commonMaterialGetLists.isLoading
                                                        }
                                                        disabled={isDisabled}
                                                        bordered={false}
                                                    >
                                                        {commonMaterialGetLists.data &&
                                                            commonMaterialGetLists.data.list
                                                                .filter(
                                                                    (v) =>
                                                                        v.typeA ===
                                                                        'Trim'
                                                                )
                                                                .map((v) => {
                                                                    return (
                                                                        <Select.Option
                                                                            key={
                                                                                v.id
                                                                            }
                                                                            value={
                                                                                v.id
                                                                            }
                                                                        >
                                                                            {v.typeC
                                                                                ? `${v.typeB} / ${v.typeC}`
                                                                                : v.typeB}
                                                                        </Select.Option>
                                                                    );
                                                                })}
                                                    </Select>
                                                </Form.Item>
                                            ) : (
                                                <Form.Item
                                                    name="categoryId"
                                                    label="Category"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Select
                                                        placeholder="Select Category"
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
                                                        loading={
                                                            commonMaterialGetLists.isLoading
                                                        }
                                                        disabled={isDisabled}
                                                        bordered={false}
                                                    >
                                                        {commonMaterialGetLists.data &&
                                                            commonMaterialGetLists.data.list
                                                                .filter(
                                                                    (v) =>
                                                                        v.typeA ===
                                                                        'Accessories'
                                                                )
                                                                .map((v) => {
                                                                    return (
                                                                        <Select.Option
                                                                            key={
                                                                                v.id
                                                                            }
                                                                            value={
                                                                                v.id
                                                                            }
                                                                        >
                                                                            {v.typeC
                                                                                ? `${v.typeB} / ${v.typeC}`
                                                                                : v.typeB}
                                                                        </Select.Option>
                                                                    );
                                                                })}
                                                    </Select>
                                                </Form.Item>
                                            )}

                                            <Form.Item
                                                name="supplierMaterial"
                                                label="Mill Article#"
                                            >
                                                <Input
                                                    placeholder="Insert Mill article#"
                                                    maxLength="30"
                                                    disabled={isDisabled}
                                                    bordered={false}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="vendorMaterial"
                                                label="Vendor#"
                                            >
                                                <Input
                                                    placeholder="Insert Vendor#"
                                                    maxLength="30"
                                                    disabled={isDisabled}
                                                    bordered={false}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="buyerMaterial"
                                                label="Rd#"
                                            >
                                                <Input
                                                    placeholder="Insert Rd#"
                                                    maxLength="30"
                                                    disabled={isDisabled}
                                                    bordered={false}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={6}>{/* 이미지 */}</Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </InfoWrap>

            {materialInfoGetId.data && (
                <OptionWrap>
                    <Row gutter={20}>
                        <Col span={10}>
                            {materialType === 'fabric' ? (
                                <div id="yarnWrap">
                                    <MaterialRegistrationYarn
                                        {...props}
                                        infoId={infoId}
                                    />
                                </div>
                            ) : (
                                <div id="subsidiaryWrap">
                                    <MaterialRegistrationSubsidiary
                                        {...props}
                                        infoId={infoId}
                                    />
                                </div>
                            )}
                        </Col>
                        <Col span={14}>
                            {(location.state ? location.state.type : type) ===
                                'fabric' ||
                            (location.state ? location.state.type : type) ===
                                'trim' ? (
                                <div id="optionWrap">
                                    <MaterialRegistrationOption
                                        {...props}
                                        infoId={infoId}
                                        infoType={type}
                                    />
                                </div>
                            ) : null}
                        </Col>
                    </Row>
                    <div id="offerWrap">
                        <MaterialRegistrationOffer
                            {...props}
                            infoId={infoId}
                            infoType={type}
                        />
                    </div>
                </OptionWrap>
            )}

            <ButtonWrap>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="formButton"
                    onClick={() => {
                        if (materialYarnGetInfoId.data) {
                            const totalRate =
                                materialYarnGetInfoId.data.list.reduce(
                                    (acc, cur) => {
                                        return (
                                            Number(acc.rate) + Number(cur.rate)
                                        );
                                    },
                                    { rate: 0 }
                                );
                            if (totalRate !== 100) {
                                return handleNotification({
                                    type: 'error',
                                    message: 'Error',
                                    description: 'Total rate is not 100',
                                });
                            }
                        }
                        history.goBack();
                    }}
                >
                    <Space>
                        Go to list after confirmation{' '}
                        <SwapRightOutlined style={{ color: '#ffffff' }} />
                    </Space>
                </Button>
            </ButtonWrap>
        </div>
    );
};

const InfoWrap = styled.div`
    padding: 2rem 2rem 0 1rem;
    .infomationWrap {
        padding: 0.5rem 1rem 1rem 0;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;

        .titleWrap {
            display: flex;
            padding: 0 1.5rem 1rem 1rem;
            justify-content: space-between;
            align-items: center;
            margin: 0rem 0;
            .title {
                ${({ theme }) => theme.fonts.h7}
            }
        }
        .formWrap {
            padding-top: 1rem;
        }
        .infoForm {
            // margin-top: 2rem;
            padding-bottom: 1rem;
            .ant-form-item-label {
                label {
                    ${({ theme }) => theme.fonts.h5};
                }
            }

            .ant-select-selection-placeholder {
                ${(props) => props.theme.fonts.h5};
            }

            .ant-form-item-control-input-content
                .ant-select.ant-select-borderless.ant-select-single.ant-select-show-arrow.ant-select-show-search {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }

            .ant-picker-input {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }

            .ant-input-number-input-wrap > input {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }

            .ant-form-item-control-input-content > input {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }

            .ant-form-item-control-input-content > textarea {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }
        }
    }

    .tabsWrap {
        display: flex;
        // border: 1px solid red;
        // width: 90%;
        // align-items: center;
        // justify-content: center;
        padding: 0 0rem 1rem 0rem;

        .groupWrap {
            width: 100%;
            // border: 1px solid red;
            border-bottom: 1px solid lightgray;
        }
    }
`;

const ButtonWrap = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    padding: 0 0.5rem;
`;

const OptionWrap = styled.div`
    padding: 1rem 2rem 1rem 1rem;
    #offerWrap {
        padding: 1rem 0;
    }
`;

export default MaterialRegistrationWrite;
