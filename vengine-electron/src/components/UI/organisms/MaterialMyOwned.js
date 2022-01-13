import React, { Fragment } from 'react';
import {
    commonBasicGetListsApi,
    commonBasicGetUomApi,
} from 'core/api/common/basic';
import { companyGetRelationTypeApi } from 'core/api/company/company';
import { Button, Form, Input, Select } from '../atoms';
import { TitleWrap } from '../molecules';
import { commonYearGetListsApi } from 'core/api/common/year';
import { companyInfoGetListsApi } from 'core/api/company/info';
import handleCalculationResult from 'core/utils/uomUtil';

const MaterialMyOwned = (props) => {
    const {
        isDisabled,
        type,
        materialOwnForm,
        onMaterialOwnSubmit,
        onMaterialOwnCloseDrawer,
        onMaterialOwnDelete,
        weightInfo,
        onWeightInfo,
    } = props;
    return (
        <Fragment>
            <TitleWrap>
                <TitleWrap.Title suffix>OFFERED PRICE</TitleWrap.Title>
                <TitleWrap.Function>
                    {isDisabled || (
                        <Button
                            mode="save"
                            tooltip={{
                                title: 'Create',
                                placement: 'bottomLeft',
                            }}
                            onClick={() => {
                                return materialOwnForm?.submit();
                            }}
                        />
                    )}

                    <Button
                        mode="cancel"
                        tooltip={{ title: 'Close', placement: 'bottomLeft' }}
                        onClick={onMaterialOwnCloseDrawer}
                    />

                    {isDisabled || (
                        <Button
                            mode="delete"
                            tooltip={{
                                title: 'Delete',
                                placement: 'bottomLeft',
                            }}
                            onClick={onMaterialOwnDelete}
                        />
                    )}
                </TitleWrap.Function>
            </TitleWrap>
            <Form
                form={materialOwnForm}
                onFinish={onMaterialOwnSubmit}
                style={{ marginTop: '2rem' }}
            >
                <Form.Item
                    name="materialNo"
                    label="Material No:"
                    rules={[{ type: 'string', max: 30 }]}
                    style={{ marginTop: '0.5rem' }}
                >
                    <Input
                        type="text"
                        maxLength="30"
                        isDisabled={isDisabled}
                        bordered={false}
                    />
                </Form.Item>
                <Form.Item
                    name="recipientId"
                    label="Buying Company"
                    rules={[{ required: true }]}
                    style={{ marginTop: '0.5rem' }}
                >
                    <Select
                        _key="companyID"
                        _value="companyID"
                        _text="companyName"
                        requestKey="materialOwndPriceRegistrationBuyerALL"
                        onRequestApi={() =>
                            companyGetRelationTypeApi('BUYER', 'ALL')
                        }
                        isDisabled={isDisabled}
                        bordered={false}
                    />
                </Form.Item>
                {/* <Form.Item
                    name="buyerId"
                    label="Buyer Company"
                    style={{ marginTop: '0.5rem' }}
                >
                    <Select
                        _key="companyID"
                        _value="companyID"
                        _text="companyName"
                        requestKey="materialOwndPriceRegistrationBuyer"
                        onRequestApi={() => companyGetRelationTypeApi('BUYER')}
                        isDisabled={isDisabled}
                        bordered={false}
                    />
                </Form.Item>
                <Form.Item
                    name="brandId"
                    label="Brand Company"
                    style={{ marginTop: '0.5rem' }}
                >
                    <Select
                        _key="companyID"
                        _value="companyID"
                        _text="companyName"
                        requestKey={[
                            'materialOwndPriceRegistrationBrand',
                            materialOwnForm?.getFieldValue('buyerId'),
                        ]}
                        onRequestApi={() =>
                            companyGetBrandApi(
                                materialOwnForm?.getFieldValue('buyerId')
                            )
                        }
                        isDisabled={isDisabled}
                        bordered={false}
                    />
                </Form.Item> */}
                {type !== 'accessories' && (
                    <Fragment>
                        <Form.Item
                            name="finishing"
                            label="Finishing"
                            style={{ marginTop: '0.5rem' }}
                        >
                            <Input
                                type="text"
                                isDisabled={isDisabled}
                                bordered={false}
                            />
                        </Form.Item>
                        {type === 'fabric' && (
                            <Fragment>
                                <Form.Item
                                    name="dyeing"
                                    label="Dyeing"
                                    style={{ marginTop: '0.5rem' }}
                                >
                                    <Input
                                        type="text"
                                        isDisabled={isDisabled}
                                        bordered={false}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="printing"
                                    label="Printing"
                                    style={{ marginTop: '0.5rem' }}
                                >
                                    <Input
                                        type="text"
                                        isDisabled={isDisabled}
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Fragment>
                        )}
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
                                isDisabled={isDisabled}
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
                                isDisabled={isDisabled}
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
                                onChange={(v) =>
                                    onWeightInfo((weightInfo) => ({
                                        ...weightInfo,
                                        weight: v,
                                    }))
                                }
                                isDisabled={isDisabled}
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
                                    commonBasicGetUomApi('mass per area')
                                }
                                onFilter={(v) => {
                                    return (
                                        v?.name === 'g/m2' ||
                                        v?.name === 'oz/m2'
                                    );
                                }}
                                onChange={(_, row) =>
                                    onWeightInfo((weightInfo) => ({
                                        ...weightInfo,
                                        weightUOM: {
                                            id: row?.value,
                                            name3: row?.children,
                                        },
                                    }))
                                }
                                isDisabled={isDisabled}
                                bordered={false}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Conversion Value"
                            style={{ marginTop: '0.5rem' }}
                        >
                            <Input
                                type="number"
                                value={`${parseFloat(
                                    handleCalculationResult(
                                        weightInfo?.weight,
                                        weightInfo?.weightUOM?.name3,
                                        weightInfo?.weightUOM?.name3 === 'g/m2'
                                            ? 'oz/m2'
                                            : 'g/m2'
                                    )
                                )?.toFixed(4)} ${
                                    weightInfo?.weightUOM?.name3
                                        ? weightInfo?.weightUOM?.name3 ===
                                          'g/m2'
                                            ? 'oz/m2'
                                            : 'g/m2'
                                        : ''
                                }`}
                                isReadOnly={true}
                                bordered={false}
                            />
                        </Form.Item>
                    </Fragment>
                )}
                <Form.Item
                    name="uomId"
                    label="UOM (Supplier)"
                    rules={[{ required: true }]}
                    style={{ marginTop: '0.5rem' }}
                >
                    <Select
                        _key="id"
                        _value="id"
                        _text="name3"
                        onFilter={(v) =>
                            type === 'fabric'
                                ? (v.name2 === 'length' &&
                                      (v.name3 === 'yard' ||
                                          v.name3 === 'meter')) ||
                                  (v.name2 === 'mass' &&
                                      (v.name3 === 'kg' || v.name3 === 'lb'))
                                : v.name2 === 'counting' ||
                                  v.name2 === 'length' ||
                                  v.name2 === 'mass'
                        }
                        requestKey="materialOfferdPriceRegistrationUom"
                        onRequestApi={() => commonBasicGetListsApi('uom')}
                        isDisabled={isDisabled}
                        bordered={false}
                    />
                </Form.Item>
                {type !== 'fabric' && (
                    <Fragment>
                        <Form.Item
                            name="size"
                            label="Item Size name"
                            style={{ marginTop: '0.5rem' }}
                        >
                            <Input
                                type="text"
                                isDisabled={isDisabled}
                                bordered={false}
                            />
                        </Form.Item>

                        <Form.Item
                            name="sizeUomId"
                            label="Item Size UOM"
                            style={{ marginTop: '0.5rem' }}
                        >
                            <Select
                                _key="id"
                                _value="id"
                                _text="name3"
                                requestKey="materialOwndPriceRegistrationUom"
                                onRequestApi={() =>
                                    commonBasicGetListsApi('uom')
                                }
                                onFilter={(v) =>
                                    v?.name2 === 'counting' ||
                                    v?.name2 === 'length' ||
                                    v?.name2 === 'mass'
                                }
                                isDisabled={isDisabled}
                                bordered={false}
                            />
                        </Form.Item>
                    </Fragment>
                )}
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
                        requestKey="materialOwndPriceRegistrationCurrency"
                        onRequestApi={() => commonBasicGetListsApi('currency')}
                        isDisabled={isDisabled}
                        bordered={false}
                    />
                </Form.Item>
                <Form.Item
                    name="unitPrice"
                    label="Unit Price"
                    rules={[{ required: true, type: 'number' }]}
                    style={{ marginTop: '0.5rem' }}
                >
                    <Input
                        type="number"
                        step={type === 'fabric' ? '0.01' : '0.00001'}
                        onChange={(e) => {
                            const value = e
                                ? Number(
                                      parseFloat(e).toFixed(
                                          type === 'fabric' ? 2 : 5
                                      )
                                  )
                                : 0;
                            materialOwnForm.setFieldsValue({
                                unitPrice: value,
                            });
                        }}
                        isDisabled={isDisabled}
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
                        isDisabled={isDisabled}
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
                        onRequestApi={() => companyInfoGetListsApi('season')}
                        isDisabled={isDisabled}
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
                        isDisabled={isDisabled}
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
                        isDisabled={isDisabled}
                        bordered={false}
                    />
                </Form.Item>
            </Form>
        </Fragment>
    );
};

export default MaterialMyOwned;
