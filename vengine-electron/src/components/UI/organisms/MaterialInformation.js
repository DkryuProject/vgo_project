import React from 'react';
import styled from 'styled-components';
import {
    AutoComplete,
    Button,
    Form,
    Input,
    Radio,
    Select,
} from 'components/UI/atoms';
import { TitleWrap } from 'components/UI/molecules';
import { Col, Divider, Row, Space } from 'antd';
import { commonMaterialGetListsApi } from 'core/api/common/material';
import { companyGetRelationTypeApi } from 'core/api/company/company';
import { Fragment } from 'react';
import { commonBasicGetListsApi } from 'core/api/common/basic';

const MaterialInformation = (props) => {
    const {
        isDisabled,
        isUsedInfo,
        type,
        onType,
        materialId,
        materialInfoForm,
        onMaterialInfoSubmit,
        onMaterialYarnOpenDrawer,
    } = props;

    // isDisabled는 현재 Material 작성자와 Supplier를 비교
    // isUsedInfo는 현재 Material이 사용 되었는지를 확인
    const isCheckedDisabled = !(!isDisabled && !isUsedInfo);

    return (
        <MaterialInformationStyle>
            <TitleWrap>
                <TitleWrap.Title suffix>MATERIAL INFORMATION</TitleWrap.Title>
                {isDisabled || (
                    <TitleWrap.Function>
                        <Button
                            mode={materialId ? 'save' : 'write'}
                            tooltip={{ title: materialId ? 'Save' : 'Create' }}
                            onClick={() => materialInfoForm?.submit()}
                        />
                    </TitleWrap.Function>
                )}
            </TitleWrap>

            {materialId ? null : (
                <Radio.Group
                    value={type}
                    onChange={(type) => onType(type?.target?.value)}
                    style={{ marginTop: '1rem' }}
                >
                    <Radio.Button
                        value="fabric"
                        style={{ padding: '0 1rem', fontSize: '0.625' }}
                    >
                        Fabric
                    </Radio.Button>

                    <Radio.Button
                        value="trim"
                        style={{ padding: '0 1rem', fontSize: '0.625' }}
                    >
                        Trim
                    </Radio.Button>

                    <Radio.Button
                        value="accessories"
                        style={{ padding: '0 1rem', fontSize: '0.625' }}
                    >
                        Accessories
                    </Radio.Button>
                </Radio.Group>
            )}

            <Form
                layout="vertical"
                form={materialInfoForm}
                onFinish={onMaterialInfoSubmit}
            >
                <Form.Item name="type" hidden>
                    <Input type="text" bordered={false} />
                </Form.Item>
                <Form.Item name="id" hidden>
                    <Input type="text" bordered={false} />
                </Form.Item>

                <Row gutter={[20, 20]} style={{ marginTop: '1rem' }}>
                    <Col span={12}>
                        <Form.Item
                            name="item_name"
                            label="Item name"
                            rules={[{ required: true }]}
                        >
                            {/* {type === 'fabric' ? (
                                <AutoComplete
                                    _key="id"
                                    _value="name1"
                                    _text="name1"
                                    requestKey="materialInformationItemName"
                                    onRequestApi={() =>
                                        commonBasicGetListsApi('item_name')
                                    }
                                    tag={true}
                                    bordered={false}
                                    placeholder="Insert Fabric Name"
                                    isDisabled={isDisabled}
                                />
                            ) : (
                                <Input
                                    type="text"
                                    placeholder="Insert Item Name"
                                    isDisabled={isDisabled}
                                    bordered={false}
                                />
                            )} */}

                            <Input
                                type="text"
                                placeholder="Insert Item Name"
                                isDisabled={isCheckedDisabled}
                                bordered={false}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[20, 20]} style={{ marginTop: '1rem' }}>
                    <Col span={4}>
                        <Form.Item
                            name="category"
                            label={
                                type === 'fabric'
                                    ? 'Fabric Type'
                                    : 'Item Category'
                            }
                            rules={[{ required: true }]}
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
                                isDisabled={isCheckedDisabled}
                                placeholder={
                                    type === 'fabric'
                                        ? 'Select Fabric Type'
                                        : 'Select Item Type'
                                }
                                bordered={false}
                            />
                        </Form.Item>
                    </Col>
                    {type === 'fabric' && (
                        <Fragment>
                            <Col span={4}>
                                <Form.Item
                                    name="structure"
                                    label="Structure "
                                    rules={[
                                        {
                                            required: true,
                                            type: 'string',
                                            max: 100,
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        // maxLength="15"
                                        placeholder="Insert Structure"
                                        isDisabled={isCheckedDisabled}
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
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
                                        type="text"
                                        maxLength="15"
                                        isDisabled={isCheckedDisabled}
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="yarnSizeWeft"
                                    label="Yarn Size Weft"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'string',
                                            max: 15,
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        maxLength="15"
                                        isDisabled={isCheckedDisabled}
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>
                        </Fragment>
                    )}
                </Row>
                <Row gutter={[20, 20]} style={{ marginTop: '1rem' }}>
                    <Col span={4}>
                        <Form.Item
                            name="supplier"
                            label="Supplier name"
                            rules={[{ required: true }]}
                        >
                            <Select
                                _key="companyID"
                                _value="companyID"
                                _text="companyName"
                                onRequestApi={() =>
                                    companyGetRelationTypeApi('SUPPLIER')
                                }
                                placeholder="Select Supplier name"
                                isDisabled={isCheckedDisabled}
                                bordered={false}
                            />
                        </Form.Item>
                    </Col>
                    {type === 'fabric' ? (
                        <Fragment>
                            <Col span={4}>
                                <Form.Item
                                    name="fabricContents"
                                    label="Fabric Contents"
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        type="text"
                                        onClick={onMaterialYarnOpenDrawer}
                                        isReadOnly
                                        placeholder="Insert Fabric Contents"
                                        isDisabled={isCheckedDisabled}
                                        bordered={false}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Space>
                                    <Form.Item
                                        label="EPI"
                                        name="constructionEpi"
                                        rules={[
                                            {
                                                required: true,
                                                type: 'number',
                                                min: 0,
                                                max: 999,
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="number"
                                            min="0"
                                            max="999"
                                            isDisabled={isCheckedDisabled}
                                            bordered={false}
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
                                        <Input
                                            type="number"
                                            min="0"
                                            max="999"
                                            isDisabled={isCheckedDisabled}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </Space>
                            </Col>

                            <Col span={4}>
                                <Space>
                                    <Form.Item
                                        label="Shrinkage +"
                                        name="shrinkagePlus"
                                        rules={[
                                            {
                                                type: 'number',
                                                min: 0,
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            isDisabled={isCheckedDisabled}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Shrinkage -"
                                        name="shrinkageMinus"
                                        rules={[
                                            {
                                                type: 'number',
                                                min: 0,
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            isDisabled={isCheckedDisabled}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </Space>
                            </Col>
                        </Fragment>
                    ) : (
                        <Col span={4}>
                            <Form.Item
                                name="item_detail"
                                label="Item Detail :"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    type="text"
                                    isDisabled={isCheckedDisabled}
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                    )}
                </Row>

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
                        <Row gutter={[20, 20]} style={{ marginTop: '1rem' }}>
                            <Col span={16}>
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
                                            commonBasicGetListsApi('usage_type')
                                        }
                                        tag={true}
                                        placeholder="Insert Usage Type"
                                        bordered={false}
                                        isDisabled={isDisabled}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={16}>
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
                                        isDisabled={isDisabled}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={16}>
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
                                            commonBasicGetListsApi('sus_eco')
                                        }
                                        tag={true}
                                        placeholder="Insert Sus/Eco name"
                                        bordered={false}
                                        isDisabled={isDisabled}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Fragment>
                )}
            </Form>
        </MaterialInformationStyle>
    );
};

const MaterialInformationStyle = styled.div`
    padding: 1rem;
`;

export default MaterialInformation;
