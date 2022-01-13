import React, { Fragment, useCallback } from 'react';
import {
    commonBasicGetListsApi,
    commonBasicGetUomApi,
} from 'core/api/common/basic';
import { companyGetRelationTypeApi } from 'core/api/company/company';
import { AutoComplete, Button, Form, Input, Select } from '../atoms';
import { TitleWrap } from '../molecules';
import { commonYearGetListsApi } from 'core/api/common/year';
import { companyInfoGetListsApi } from 'core/api/company/info';
import { Divider } from 'antd';
import handleCalculationResult from 'core/utils/uomUtil';

const MaterialOfferedPrice = (props) => {
    const {
        isDetail,
        isDisabled,
        isUsedInfo,
        isSameWritingCompany,
        initialValues,
        type,
        offerId,
        materialOfferForm,
        onMaterialOfferSubmit,
        onMaterialOfferCloseDrawer,
        onMaterialOfferDelete,
        weightInfo,
        onWeightInfo,
    } = props;

    // isDisabled는 현재 Material 작성자와 Supplier를 비교
    // isUsedInfo는 현재 Material이 사용 되었는지를 확인
    const isCheckedDisabled = !(!isDisabled && !isUsedInfo);

    const ButtonSave = useCallback(() => {
        if (!isDetail) {
            return (
                <Button
                    mode="save"
                    tooltip={{ title: 'Create', placement: 'bottomLeft' }}
                    onClick={() => {
                        return materialOfferForm?.submit();
                    }}
                />
            );
        } else if (!isDisabled) {
            return (
                <Button
                    mode="save"
                    tooltip={{ title: 'Save', placement: 'bottomLeft' }}
                    onClick={() => {
                        return materialOfferForm?.submit();
                    }}
                ></Button>
            );
        }

        return null;
    }, [isDetail, isDisabled, materialOfferForm]);

    return (
        <Fragment>
            <TitleWrap>
                <TitleWrap.Title suffix>OFFERED PRICE</TitleWrap.Title>
                <TitleWrap.Function>
                    <ButtonSave />

                    <Button
                        mode="cancel"
                        tooltip={{ title: 'Close', placement: 'bottomLeft' }}
                        onClick={onMaterialOfferCloseDrawer}
                    />
                    {isCheckedDisabled ||
                        (offerId && (
                            <Button
                                mode="delete"
                                tooltip={{
                                    title: 'Delete',
                                    placement: 'bottomLeft',
                                }}
                                onClick={onMaterialOfferDelete}
                            />
                        ))}
                </TitleWrap.Function>
            </TitleWrap>
            <Form
                form={materialOfferForm}
                onFinish={onMaterialOfferSubmit}
                initialValues={initialValues}
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
                        isDisabled={isDetail && isCheckedDisabled}
                        bordered={false}
                    />
                </Form.Item>
                <Form.Item
                    name="recipientId"
                    label="Buying Company"
                    rules={[{ required: true }]}
                    hidden={isDetail && !isSameWritingCompany}
                    style={{ marginTop: '0.5rem' }}
                >
                    <Select
                        _key="companyID"
                        _value="companyID"
                        _text="companyName"
                        requestKey="materialOfferdPriceRegistrationBuyerALL"
                        onRequestApi={() =>
                            companyGetRelationTypeApi('BUYER', 'ALL')
                        }
                        isDisabled={
                            // isDetail && (!isSameWritingCompany || isDisabled)
                            isCheckedDisabled
                        }
                        bordered={false}
                    />
                </Form.Item>
                {type !== 'accessories' && (
                    <Fragment>
                        <Form.Item
                            name="finishing"
                            label="Post Processing"
                            style={{ marginTop: '0.5rem' }}
                        >
                            <Input
                                type="text"
                                isDisabled={isDetail && isCheckedDisabled}
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
                                        isDisabled={
                                            isDetail && isCheckedDisabled
                                        }
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
                                        isDisabled={
                                            isDetail && isCheckedDisabled
                                        }
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
                                isDisabled={isDetail && isCheckedDisabled}
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
                                isDisabled={isDetail && isCheckedDisabled}
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
                                isDisabled={isDetail && isCheckedDisabled}
                                onChange={(v) =>
                                    onWeightInfo?.((weightInfo) => ({
                                        ...weightInfo,
                                        weight: v,
                                    }))
                                }
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
                                    onWeightInfo?.((weightInfo) => ({
                                        ...weightInfo,
                                        weightUOM: {
                                            id: row?.value,
                                            name3: row?.children,
                                        },
                                    }))
                                }
                                isDisabled={isDetail && isCheckedDisabled}
                                bordered={false}
                            />
                        </Form.Item>
                        {onWeightInfo && (
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
                                            weightInfo?.weightUOM?.name3 ===
                                                'g/m2'
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
                        )}
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
                        isDisabled={isDetail && isCheckedDisabled}
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
                                type="number"
                                max="10"
                                min="0"
                                isDisabled={isDetail && isCheckedDisabled}
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
                                requestKey="materialOfferdPriceRegistrationUom"
                                onRequestApi={() =>
                                    commonBasicGetListsApi('uom')
                                }
                                onFilter={(v) =>
                                    v?.name2 === 'counting' ||
                                    v?.name2 === 'length' ||
                                    v?.name2 === 'mass'
                                }
                                isDisabled={isDetail && isCheckedDisabled}
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
                        requestKey="materialOfferdPriceRegistrationCurrency"
                        onRequestApi={() => commonBasicGetListsApi('currency')}
                        isDisabled={isDetail && isCheckedDisabled}
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
                            materialOfferForm.setFieldsValue({
                                unitPrice: value,
                            });
                        }}
                        isDisabled={isDetail && isCheckedDisabled}
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
                        isDisabled={isDetail && isCheckedDisabled}
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
                        isDisabled={isDetail && isCheckedDisabled}
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
                        isDisabled={isDetail && isCheckedDisabled}
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
                        isDisabled={isDetail && isCheckedDisabled}
                        bordered={false}
                    />
                </Form.Item>
                <Form.Item
                    name="lead_time"
                    label="Lead Time"
                    rules={[{ type: 'string', max: 3 }]}
                    style={{ marginTop: '0.5rem' }}
                >
                    <Input
                        type="text"
                        max="3"
                        isDisabled={isDetail && isCheckedDisabled}
                        bordered={false}
                    />
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
                                    commonBasicGetListsApi('characteristic')
                                }
                                tag={true}
                                bordered={false}
                                isDisabled={isDisabled}
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
                                    commonBasicGetListsApi('solid_pattern')
                                }
                                tag={true}
                                bordered={false}
                                isDisabled={isDisabled}
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
                                    commonBasicGetListsApi('function')
                                }
                                tag={true}
                                bordered={false}
                                isDisabled={isDisabled}
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
                                    commonBasicGetListsApi('performance')
                                }
                                tag={true}
                                bordered={false}
                                isDisabled={isDisabled}
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
                                    commonBasicGetListsApi('stretch')
                                }
                                tag={true}
                                bordered={false}
                                isDisabled={isDisabled}
                            />
                        </Form.Item>
                    </Fragment>
                )}
            </Form>
        </Fragment>
    );
};

export default MaterialOfferedPrice;
