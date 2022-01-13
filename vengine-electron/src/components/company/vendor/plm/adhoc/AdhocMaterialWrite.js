import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useValidateMessage from 'core/hook/useValidateMessage';
import { mclAdhocPostMaterialAsyncAction } from 'store/mcl/adhoc/reducer';
import { companyGetRelationTypeAsyncAction } from 'store/company/reducer';

import * as confirm from 'components/common/confirm';
import styled from 'styled-components';
import TableButton from 'components/common/table/TableButton';
import { Form, Space, Drawer, InputNumber, Divider } from 'antd';
import { FilterSelect } from 'components/common/select';
import { AutoComplete, Input, Select } from 'components/UI/atoms/';
import { MaterialRegistrationYarn } from 'components/company/vendor/database';
import { PushpinOutlined } from '@ant-design/icons';
import { commonBasicGetListsAsyncAction } from 'store/common/basic/reducer';
import { Fragment } from 'react';
import {
    commonBasicGetListsApi,
    commonBasicGetUomApi,
} from 'core/api/common/basic';
import { commonMaterialGetListsApi } from 'core/api/common/material';
import { commonYearGetListsApi } from 'core/api/common/year';
import { companyInfoGetListsApi } from 'core/api/company/info';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AdhocMaterialWrite = (props) => {
    const { onAdhocAssign } = props;

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [handleValidateMessage] = useValidateMessage();
    const [handleNotification] = useNotification();

    const [visible, setVisible] = useState(false);
    const materialYarnTableRef = useRef();
    const [type, setType] = useState('fabric');
    const typeLists = useMemo(
        () => [
            { id: 'fabric', name: 'FABRIC' },
            { id: 'trim', name: 'TRIM' },
            { id: 'accessories', name: 'ACCESSORIES' },
        ],
        []
    );

    const companyGetRelationType = useSelector(
        (state) => state.companyReducer.get.relationType
    );
    const handleCompanyGetRelationType = useCallback(
        (payload) =>
            dispatch(companyGetRelationTypeAsyncAction.request(payload)),
        [dispatch]
    );

    const commonBasicGetLists = useSelector(
        (state) => state.commonBasicReducer.get.lists
    );
    const handleCommonBasicGetLists = useCallback(
        (payload) => dispatch(commonBasicGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const mclAdhocPostMaterial = useSelector(
        (state) => state.mclAdhocReducer.post.material
    );
    const handleMclAdhocPostMaterial = useCallback(
        (payload) => dispatch(mclAdhocPostMaterialAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclAdhocPostMaterialInit = useCallback(
        () => dispatch(mclAdhocPostMaterialAsyncAction.initial()),
        [dispatch]
    );

    const handleSubmit = (values) => {
        const selectedContentRows =
            materialYarnTableRef.current?.current.selectedRows || [];
        const contentDataSource =
            materialYarnTableRef.current?.current.dataSource || [];

        // Material Yarn Data
        const materialYarns =
            selectedContentRows.length > 0 &&
            selectedContentRows.map((v) => {
                return {
                    contentsId: v.contents ? v.contents.id : null,
                    rate: Number(v.rate),
                };
            });

        if (materialYarns) {
            if (
                type === 'fabric' &&
                materialYarns.some((v) => !v.contentsId || !v.rate)
            ) {
                return handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'Yarn are required values',
                });
            } else if (
                contentDataSource.reduce((acc, cur) => {
                    return Number(acc) + Number(cur.rate) || 0;
                }, 0) !== 100
            ) {
                return handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'The total rate is not 100.',
                });
            }
            values['materialYarnRequestList'] = materialYarns;
        } else if (type === 'fabric') {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: 'Yarn are required values',
            });
        }

        values['type'] = type;
        // values['materialYarnRequestList'] = [{ contentsId: 289, rate: 100 }];
        console.log('values: ', values);

        return handleMclAdhocPostMaterial(values);
    };

    // 등록
    useEffect(() => {
        if (mclAdhocPostMaterial.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclAdhocPostMaterial.error.message,
            });
        } else if (mclAdhocPostMaterial.data) {
            onAdhocAssign(() => ({ type: null, status: true }));

            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful creation of AD HOC Material',
            });
        }

        return () => handleMclAdhocPostMaterialInit();
    }, [
        mclAdhocPostMaterial,
        onAdhocAssign,
        handleNotification,
        handleMclAdhocPostMaterialInit,
    ]);

    return (
        <AdhocMaterialWriteWrap>
            <Drawer
                title=""
                width="500px"
                placement="right"
                closable={false}
                onClose={() => setVisible(false)}
                visible={visible}
            >
                <MaterialRegistrationYarn
                    {...props}
                    ref={materialYarnTableRef}
                    onVisible={setVisible}
                />
            </Drawer>
            <div id="adhocMaterialWriteWrap">
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <PushpinOutlined />
                            NEW ITEM DETAIL INFORMATION
                        </Space>
                    </div>
                    <div className="functionWrap">
                        <Space>
                            <TableButton
                                toolTip={{
                                    placement: 'topRight',
                                    title: type?.toUpperCase() + ' Create',
                                    arrowPointAtCenter: true,
                                }}
                                mode="save"
                                size="small"
                                onClick={() => {
                                    confirm.saveConfirm(() => form.submit());
                                }}
                            />

                            <TableButton
                                toolTip={{
                                    placement: 'topRight',
                                    title: type?.toUpperCase() + ' Close',
                                    arrowPointAtCenter: true,
                                }}
                                mode="cancel"
                                size="small"
                                onClick={() =>
                                    onAdhocAssign(() => ({
                                        type: null,
                                        status: true,
                                    }))
                                }
                            />
                        </Space>
                    </div>
                </div>
                <div className="contentsWrap">
                    <div className="content">
                        <Form
                            {...layout}
                            form={form}
                            initialValues={{
                                unitPrice: 0,
                                cwUomId: 31,
                                fullWidthUomId: 31,
                                currencyId: 314,
                                uomId: type === 'fabric' ? 33 : 54,
                            }}
                            onFinish={handleSubmit}
                            validateMessages={handleValidateMessage}
                        >
                            <Form.Item label="Type">
                                {FilterSelect({
                                    _key: 'id',
                                    _value: 'id',
                                    text: 'name',
                                    defaultValue: 'FABRIC',
                                    placeholder: `Select Partial shipment`,
                                    data: { data: { list: typeLists } },
                                    onChange: (v) => setType(v),
                                })}
                            </Form.Item>
                            {/* <Form.Item
                                name="name"
                                label="ITEM NAME"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Insert Item name"
                                    bordered={false}
                                />
                            </Form.Item> */}

                            <Form.Item
                                name="item_name"
                                label={
                                    type === 'fabric'
                                        ? 'Fabric name'
                                        : 'Item name'
                                }
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Insert Item Name"
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item
                                name="uomId"
                                label="Original UOM"
                                rules={[{ required: true }]}
                                style={{ marginTop: '0.5rem' }}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name3"
                                    onFilter={(v) =>
                                        type === 'fabric'
                                            ? v.name2 === 'length' &&
                                              v.name3 === 'yard'
                                            : v.name2 === 'counting' ||
                                              v.name2 === 'length' ||
                                              v.name2 === 'mass'
                                    }
                                    requestKey="materialOfferdPriceRegistrationUom"
                                    onRequestApi={() =>
                                        commonBasicGetListsApi('uom')
                                    }
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="unitPrice"
                                label="Unit Price"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber
                                    placeholder="Insert Unit price"
                                    onChange={(e) => {
                                        const value = e
                                            ? parseFloat(e).toFixed(
                                                  type === 'fabric' ? 2 : 5
                                              )
                                            : 0;

                                        form.setFieldsValue({
                                            unitPrice: value,
                                        });
                                    }}
                                    step="0.01"
                                    formatter={(value) =>
                                        value.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ','
                                        )
                                    }
                                    parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, '')
                                    }
                                    style={{ width: '100%' }}
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item
                                name="categoryId"
                                label={
                                    type === 'fabric'
                                        ? 'Fabric Type'
                                        : 'Item Category'
                                }
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text={(v) => {
                                        return `${
                                            v?.typeC
                                                ? `${v.typeB} / ${v.typeC}`
                                                : v.typeB
                                        }`;
                                    }}
                                    requestKey={`materialInformationCategory${type}`}
                                    onFilter={(v) =>
                                        v.typeA?.toLowerCase() === type
                                    }
                                    onRequestApi={commonMaterialGetListsApi}
                                    placeholder={
                                        type === 'fabric'
                                            ? 'Select Fabric Type'
                                            : 'Select Item Type'
                                    }
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="supplierId"
                                label="Supplier"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                {FilterSelect({
                                    _key: 'companyID',
                                    value: 'companyID',
                                    text: 'companyName',
                                    placeholder: 'Select Supplier',
                                    data: companyGetRelationType,
                                    onData: () =>
                                        handleCompanyGetRelationType(
                                            'SUPPLIER'
                                        ),
                                })}
                            </Form.Item>

                            {type === 'fabric' ? (
                                <Form.Item label="Contents">
                                    <div
                                        className="fakeInput"
                                        onClick={() =>
                                            setVisible({
                                                status: true,
                                            })
                                        }
                                    >
                                        {materialYarnTableRef.current &&
                                        materialYarnTableRef.current.current
                                            .selectedRows.length > 0
                                            ? materialYarnTableRef.current.current.selectedRows.map(
                                                  (v) => {
                                                      if (
                                                          !v.rate &&
                                                          !v.contents
                                                      ) {
                                                          return '';
                                                      } else {
                                                          return `${v.rate}% ${
                                                              v.contents &&
                                                              v.contents.name
                                                          } `;
                                                      }
                                                  }
                                              )
                                            : 'Select Yarns'}
                                    </div>
                                </Form.Item>
                            ) : (
                                <Fragment>
                                    <Form.Item
                                        name="size"
                                        label="Size"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="number"
                                            min="0"
                                            max="10"
                                            placeholder="Insert Size"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="sizeUomId"
                                        label="Size UOM"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        {FilterSelect({
                                            _key: 'id',
                                            _value: 'id',
                                            text: 'name3',
                                            placeholder: 'Select Size UOM',
                                            filter: (v) =>
                                                v.name2 === 'counting' ||
                                                v.name2 === 'mass' ||
                                                v.name2 === 'length',
                                            data: commonBasicGetLists,
                                            onData: () =>
                                                handleCommonBasicGetLists(
                                                    'uom'
                                                ),
                                        })}
                                    </Form.Item>
                                </Fragment>
                            )}

                            {type === 'fabric' ? (
                                <Fragment>
                                    <Divider
                                        orientation="left"
                                        style={{
                                            marginTop: '2rem',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                        }}
                                    >
                                        Tags
                                    </Divider>
                                    <Form.Item
                                        name="usage_type"
                                        label="Usage Type"
                                        rules={[
                                            {
                                                type: 'string',
                                                max: 100,
                                            },
                                        ]}
                                    >
                                        <AutoComplete
                                            _key="id"
                                            _value="name1"
                                            _text="name1"
                                            requestKey="materialInformationUsageType"
                                            onRequestApi={() =>
                                                commonBasicGetListsApi(
                                                    'usage_type'
                                                )
                                            }
                                            tag={true}
                                            placeholder="Insert Usage Type"
                                            bordered={false}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="application"
                                        label="Application"
                                        rules={[
                                            {
                                                type: 'string',
                                                max: 100,
                                            },
                                        ]}
                                    >
                                        <AutoComplete
                                            _key="id"
                                            _value="name1"
                                            _text="name1"
                                            requestKey="materialInformationApplication"
                                            onRequestApi={() =>
                                                commonBasicGetListsApi(
                                                    'application'
                                                )
                                            }
                                            tag={true}
                                            placeholder="Insert Application name"
                                            bordered={false}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="sus_eco"
                                        label="Sus/Eco"
                                        rules={[
                                            {
                                                type: 'string',
                                                max: 100,
                                            },
                                        ]}
                                    >
                                        <AutoComplete
                                            _key="id"
                                            _value="name1"
                                            _text="name1"
                                            requestKey="materialInformationSusEco"
                                            onRequestApi={() =>
                                                commonBasicGetListsApi(
                                                    'sus_eco'
                                                )
                                            }
                                            tag={true}
                                            placeholder="Insert Sus/Eco name"
                                            bordered={false}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="structure"
                                        label="Structure"
                                        rules={[
                                            {
                                                required: true,
                                                type: 'string',
                                                max: 100,
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Insert Structure"
                                            // maxLength="40"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="yarnSizeWrap"
                                        label="Yarn Size Wrap"
                                        rules={[
                                            {
                                                required: true,
                                                type: 'string',
                                                max: 15,
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Insert Yarn size wrap"
                                            maxLength="15"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="yarnSizeWeft"
                                        label="Yarn Size Welt"
                                        rules={[
                                            {
                                                required: true,
                                                type: 'string',
                                                max: 15,
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Insert Yarn size welt"
                                            maxLength="40"
                                            bordered={false}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="constructionEpi"
                                        label="EPI"
                                        rules={[
                                            {
                                                required: true,
                                                type: 'number',
                                                min: 0,
                                                max: 999,
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="Insert Epi"
                                            min="0"
                                            max="999"
                                            bordered={false}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="PPI"
                                        name="constructionPpi"
                                        rules={[
                                            {
                                                required: true,
                                                type: 'number',
                                                min: 0,
                                                max: 999,
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            type="number"
                                            min="0"
                                            max="999"
                                            placeholder="Insert Ppi"
                                            bordered={false}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Shrinkage +"
                                        name="shrinkagePlus"
                                        rules={[
                                            {
                                                required: true,
                                                type: 'number',
                                                min: 0,
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            placeholder="Insert Shrinkage"
                                            bordered={false}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Shrinkage -"
                                        name="shrinkageMinus"
                                        rules={[
                                            {
                                                required: true,
                                                type: 'number',
                                                min: 0,
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            placeholder="Insert Shrinkage"
                                            bordered={false}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>

                                    {/* <Form.Item
                                        name="actualColor"
                                        label="ACTUAL COLOR"
                                    >
                                        {FilterSelect({
                                            _key: 'id',
                                            value: 'id',
                                            text: 'name1',
                                            placeholder: 'Select Color',
                                            data: commonBasicGetLists,
                                            onData: () =>
                                                handleCommonBasicGetLists(
                                                    'color'
                                                ),
                                        })}
                                    </Form.Item> */}
                                </Fragment>
                            ) : (
                                <Form.Item
                                    name="item_detail"
                                    label="Item Detail"
                                >
                                    <Input
                                        placeholder="Insert Item detail"
                                        bordered={false}
                                    />
                                </Form.Item>
                            )}

                            <Form.Item name="materialNo" label="Mill Article#">
                                <Input
                                    placeholder="Insert Mill Article#"
                                    maxLength="30"
                                    bordered={false}
                                />
                            </Form.Item>

                            {type !== 'accessoris' && (
                                <>
                                    <Form.Item
                                        name="fabricFullWidth"
                                        label="Full Width"
                                        rules={[
                                            {
                                                required: type === 'fabric',
                                                type: 'number',
                                                max: 99,
                                            },
                                        ]}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <Input
                                            type="number"
                                            max="99"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="fullWidthUomId"
                                        label="Full Width UOM"
                                        rules={[
                                            {
                                                required: type === 'fabric',
                                            },
                                        ]}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <Select
                                            _key="id"
                                            _value="id"
                                            _text="name"
                                            requestKey="materialOfferdPriceRegistrationFullWidthUom"
                                            onRequestApi={() =>
                                                commonBasicGetUomApi('length')
                                            }
                                            onFilter={(v) => v?.name === 'inch'}
                                            isDisabled={true}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="cw"
                                        label="Cuttable Width"
                                        rules={[
                                            {
                                                required: type === 'fabric',
                                                type: 'number',
                                                max: 99,
                                            },
                                        ]}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <Input
                                            type="number"
                                            max="99"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="cwUomId"
                                        label="Cuttable Width UOM"
                                        rules={[
                                            {
                                                required: type === 'fabric',
                                            },
                                        ]}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <Select
                                            _key="id"
                                            _value="id"
                                            _text="name"
                                            requestKey="materialOfferdPriceRegistrationCwUom"
                                            onRequestApi={() =>
                                                commonBasicGetUomApi('length')
                                            }
                                            onFilter={(v) => v?.name === 'inch'}
                                            isDisabled={true}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="weight"
                                        label="Weight"
                                        rules={[
                                            {
                                                required: type === 'fabric',
                                                type: 'number',
                                                max: 999,
                                            },
                                        ]}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <Input
                                            type="number"
                                            max="999"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="weightUomId"
                                        label="UOM (Weight)"
                                        rules={[
                                            {
                                                required: type === 'fabric',
                                            },
                                        ]}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <Select
                                            _key="id"
                                            _value="id"
                                            _text="name"
                                            requestKey="materialOfferdPriceRegistrationWeightUom"
                                            onRequestApi={() =>
                                                commonBasicGetUomApi(
                                                    'mass per area'
                                                )
                                            }
                                            onFilter={(v) => {
                                                return (
                                                    v?.name === 'g/m2' ||
                                                    v?.name === 'oz/m2'
                                                );
                                            }}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </>
                            )}

                            {type === 'fabric' && (
                                <Form.Item name="printing" label="Printing">
                                    <Input
                                        placeholder="Insert Printing"
                                        bordered={false}
                                    />
                                </Form.Item>
                            )}

                            {type !== 'accessories' && (
                                <Form.Item
                                    name="finishing"
                                    label="Post Processing"
                                >
                                    <Input
                                        placeholder="Insert Post Processing"
                                        bordered={false}
                                    />
                                </Form.Item>
                            )}

                            {type === 'fabric' && (
                                <Form.Item name="dyeing" label="Dyeing">
                                    <Input
                                        placeholder="Insert Dyeing"
                                        bordered={false}
                                    />
                                </Form.Item>
                            )}

                            {/* 예외 Components UI */}
                            <Form.Item
                                name="currencyId"
                                label="Currency"
                                rules={[{ required: true }]}
                                style={{ marginTop: '0.5rem' }}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name2"
                                    requestKey="materialOfferdPriceRegistrationCurrency"
                                    onRequestApi={() =>
                                        commonBasicGetListsApi('currency')
                                    }
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item
                                name="seasonYear"
                                label="Year"
                                style={{ marginTop: '0.5rem' }}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name"
                                    requestKey="materialOfferdPriceRegistrationSeasonYear"
                                    onRequestApi={() => commonYearGetListsApi()}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="seasonID"
                                label="Season"
                                style={{ marginTop: '0.5rem' }}
                            >
                                <Select
                                    _key="id"
                                    _value="id"
                                    _text="name"
                                    requestKey="materialOfferdPriceRegistrationSeasonName"
                                    onRequestApi={() =>
                                        companyInfoGetListsApi('season')
                                    }
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="moq"
                                label="MOQ"
                                rules={[{ type: 'number', max: 9999999999 }]}
                                style={{ marginTop: '0.5rem' }}
                            >
                                <Input
                                    type="number"
                                    max="9999999999"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="mcq"
                                label="MCQ"
                                rules={[{ type: 'number', max: 9999999999 }]}
                                style={{ marginTop: '0.5rem' }}
                            >
                                <Input
                                    type="number"
                                    max="9999999999"
                                    bordered={false}
                                />
                            </Form.Item>

                            <Form.Item
                                name="lead_time"
                                label="Lead Time"
                                rules={[{ type: 'string', max: 3 }]}
                                style={{ marginTop: '0.5rem' }}
                            >
                                <Input type="text" max="3" bordered={false} />
                            </Form.Item>

                            {type === 'fabric' && (
                                <Fragment>
                                    <Divider
                                        orientation="left"
                                        style={{
                                            marginTop: '2rem',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                        }}
                                    >
                                        Tags
                                    </Divider>
                                    <Form.Item
                                        name="characteristic"
                                        label="Characteristic"
                                        rules={[{ type: 'string', max: 100 }]}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <AutoComplete
                                            _key="id"
                                            _value="name1"
                                            _text="name1"
                                            requestKey="materialOfferdPriceRegistrationCharacteristic"
                                            onRequestApi={() =>
                                                commonBasicGetListsApi(
                                                    'characteristic'
                                                )
                                            }
                                            tag={true}
                                            bordered={false}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="solid_pattern"
                                        label="Pattern"
                                        rules={[{ type: 'string', max: 100 }]}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <AutoComplete
                                            _key="id"
                                            _value="name1"
                                            _text="name1"
                                            requestKey="materialOfferdPriceRegistrationSolidPattern"
                                            onRequestApi={() =>
                                                commonBasicGetListsApi(
                                                    'solid_pattern'
                                                )
                                            }
                                            tag={true}
                                            bordered={false}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="function"
                                        label="Function"
                                        rules={[{ type: 'string', max: 100 }]}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <AutoComplete
                                            _key="id"
                                            _value="name1"
                                            _text="name1"
                                            requestKey="materialOfferdPriceRegistrationFunction"
                                            onRequestApi={() =>
                                                commonBasicGetListsApi(
                                                    'function'
                                                )
                                            }
                                            tag={true}
                                            bordered={false}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="performance"
                                        label="Performance"
                                        rules={[{ type: 'string', max: 100 }]}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <AutoComplete
                                            _key="id"
                                            _value="name1"
                                            _text="name1"
                                            requestKey="materialOfferdPriceRegistrationPerformance"
                                            onRequestApi={() =>
                                                commonBasicGetListsApi(
                                                    'performance'
                                                )
                                            }
                                            tag={true}
                                            bordered={false}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="stretch"
                                        label="Stretch"
                                        rules={[{ type: 'string', max: 100 }]}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <AutoComplete
                                            _key="id"
                                            _value="name1"
                                            _text="name1"
                                            requestKey="materialOfferdPriceRegistrationStretch"
                                            onRequestApi={() =>
                                                commonBasicGetListsApi(
                                                    'stretch'
                                                )
                                            }
                                            tag={true}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </Fragment>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </AdhocMaterialWriteWrap>
    );
};

const AdhocMaterialWriteWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #adhocMaterialWriteWrap {
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;

        min-width: 500px;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            .title {
                ${(props) => props.theme.fonts.h7};
            }
        }
        // .ant-form-item-control-input-content {
        //     height: 32px;
        // }
        .contentsWrap {
            .content {
                .fakeInput {
                    height: 100%;
                    padding: 0px 11px;
                    background-color: #fff;
                    // border: 1px solid #d9d9d9;
                    // border-radius: 2px;
                    color: #7f7f7f;
                    ${(props) => props.theme.fonts.h5};
                }
                .ant-form-item-label {
                    label {
                        ${(props) => props.theme.fonts.h5};
                    }
                }

                .ant-select-selection-placeholder {
                    ${(props) => props.theme.fonts.h5};
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
            }
        }
    }
`;

export default AdhocMaterialWrite;
