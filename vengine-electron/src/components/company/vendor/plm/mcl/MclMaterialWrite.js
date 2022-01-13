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
import { commonBasicGetListsAsyncAction } from 'store/common/basic/reducer';
import { companyGetRelationTypeAsyncAction } from 'store/company/reducer';

import * as confirm from 'components/common/confirm';
import styled from 'styled-components';
import TableButton from 'components/common/table/TableButton';
import {
    Form,
    Space,
    Drawer,
    Radio,
    Checkbox,
    Tabs,
    InputNumber,
    Divider,
} from 'antd';

import { FilterSelect } from 'components/common/select';
import { MaterialRegistrationYarn } from 'components/company/vendor/database';
import { PushpinOutlined } from '@ant-design/icons';
import {
    mclPlanningPostNewAsyncAction,
    mclPlanningGetListsAsyncAction,
} from 'store/mcl/planning/reducer';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import { Fragment } from 'react';
import { AutoComplete, Input, Select } from 'components/UI/atoms';
import {
    commonBasicGetListsApi,
    commonBasicGetUomApi,
} from 'core/api/common/basic';
import { commonMaterialGetListsApi } from 'core/api/common/material';
import { commonYearGetListsApi } from 'core/api/common/year';
import { companyInfoGetListsApi } from 'core/api/company/info';

const { TabPane } = Tabs;

const MclMaterialWrite = (props) => {
    const { match, onShow, initialShow, type, onLeftSplit } = props;
    const { mclOptionId } = match.params || '';
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [handleValidateMessage] = useValidateMessage();
    const [handleNotification] = useNotification();
    const [netYy, setNetYy] = useState(0);
    const [loss, setLoss] = useState(0);
    const [unitPrice, setUnitPrice] = useState(0);
    const [visible, setVisible] = useState(false);
    const materialYarnTableRef = useRef();

    const grossYy = useMemo(() => {
        return netYy * (loss / 100 + 1);
    }, [netYy, loss]);

    const [color, setColor] = useState({ type: 'NotApplicable', ids: [] });
    const [size, setSize] = useState({ type: 'NotApplicable', ids: [] });
    const [market, setMarket] = useState({ type: 'NotApplicable', ids: [] });

    const companyGetRelationType = useSelector(
        (state) => state.companyReducer.get.relationType
    );
    const handleCompanyGetRelationType = useCallback(
        (payload) =>
            dispatch(companyGetRelationTypeAsyncAction.request(payload)),
        [dispatch]
    );

    const mclPlanningPostNew = useSelector(
        (state) => state.mclPlanningReducer.post.new
    );
    const handleMclPlanningPostNew = useCallback(
        (payload) => dispatch(mclPlanningPostNewAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPlanningPostNewInit = useCallback(
        () => dispatch(mclPlanningPostNewAsyncAction.initial()),
        [dispatch]
    );

    const handleMclPlanningGetLists = useCallback(
        (payload) => dispatch(mclPlanningGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    // Actual color
    const commonBasicGetLists = useSelector(
        (state) => state.commonBasicReducer.get.lists
    );
    const handleCommonBasicGetLists = useCallback(
        (payload) => dispatch(commonBasicGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    // GARMENT COLOR
    const mclGarmentColorGetLists = useSelector(
        (state) => state.mclGarmentColorReducer.get.lists
    );

    // GARMENT SIZE
    const mclGarmentSizeGetLists = useSelector(
        (state) => state.mclGarmentSizeReducer.get.lists
    );

    // GARMENT MARKET
    const mclGarmentMarketGetLists = useSelector(
        (state) => state.mclGarmentMarketReducer.get.lists
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

        values['colorDependency'] = color;
        values['sizeDependency'] = size;
        values['marketDependency'] = market;
        values['actualColor'] = values['actualColor'] || null;

        return handleMclPlanningPostNew({
            id: mclOptionId,
            type: type,
            data: values,
        });
    };

    const handleDependency = (variable, fn, arr, column) => {
        arr = arr || [];
        return (
            <>
                <Radio.Group
                    value={variable.type}
                    onChange={(e) =>
                        fn((prev) => {
                            const type = e.target.value;
                            return {
                                ...prev,
                                type: type,
                                ids: type === 'All' ? arr.map((v) => v.id) : [],
                            };
                        })
                    }
                >
                    <Radio value="All">All</Radio>
                    <Radio value="Selective">Selective</Radio>
                    <Radio value="NotApplicable">Not Applicable</Radio>
                </Radio.Group>
                <div style={{ marginTop: '1rem' }}>
                    <Checkbox.Group
                        options={arr.map((v) => ({
                            label:
                                typeof v[column] === 'string'
                                    ? v[column]
                                    : v[column].name,
                            value: v.id,
                            disabled: variable.type === 'NotApplicable',
                        }))}
                        value={variable.ids}
                        onChange={(v) =>
                            fn((prev) => {
                                const length = arr.length;

                                return {
                                    ...prev,
                                    type: !v.length
                                        ? 'NotApplicable'
                                        : v.length === length
                                        ? 'All'
                                        : 'Selective',
                                    ids: v,
                                };
                            })
                        }
                    />
                </div>
            </>
        );
    };

    // 등록
    useEffect(() => {
        if (mclPlanningPostNew.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPlanningPostNew.error.message,
            });
        } else if (mclPlanningPostNew.data) {
            onLeftSplit();
            onShow({
                ...initialShow,
                materialWrite: {
                    status: false,
                },
            });
            handleMclPlanningGetLists(mclOptionId);

            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'CBD information creation success',
            });
        }

        return () => handleMclPlanningPostNewInit();
    }, [
        mclPlanningPostNew,
        initialShow,
        onShow,
        type,
        mclOptionId,
        onLeftSplit,
        handleNotification,
        handleMclPlanningPostNewInit,
        handleMclPlanningGetLists,
    ]);

    return (
        <MclMaterialWriteOutterWrap>
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
            <div id="mclMaterialWriteWrap">
                <div className="titleWrap">
                    <div className="title">
                        {' '}
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
                                    title: 'Create ' + type.toUpperCase(),
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
                                    title: 'Close',
                                    arrowPointAtCenter: true,
                                }}
                                mode="cancel"
                                size="small"
                                onClick={() => {
                                    return onShow({
                                        ...initialShow,
                                        [type]: {
                                            status: true,
                                        },
                                        materialWrite: {
                                            status: false,
                                        },
                                    });
                                }}
                            />
                        </Space>
                    </div>
                </div>
                <div className="contentsWrap">
                    <div className="content">
                        <Form
                            {...layout}
                            form={form}
                            onFinish={handleSubmit}
                            validateMessages={handleValidateMessage}
                            initialValues={{
                                netYy: 0,
                                tolerance: 0,
                                unitPrice: 0,
                                cwUomId: 31,
                                fullWidthUomId: 31,
                                currencyId: 314,
                                uomId: type === 'fabric' ? 33 : 54,
                            }}
                        >
                            <Form.Item name="usagePlace" label="Usage">
                                <Input
                                    placeholder="Insert Usage name"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item name="netYy" label="Net yy">
                                <InputNumber
                                    placeholder="Insert Net yy"
                                    onChange={(e) => {
                                        const value = e
                                            ? parseFloat(e).toFixed(3)
                                            : 0;
                                        form.setFieldsValue({
                                            netYy: value,
                                        });

                                        setNetYy(value);
                                    }}
                                    formatter={(value) =>
                                        value.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ','
                                        )
                                    }
                                    parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, '')
                                    }
                                    step="0.001"
                                    style={{ width: '100%' }}
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item name="tolerance" label="Loss">
                                <InputNumber
                                    placeholder="Insert Loss"
                                    onChange={(e) => {
                                        const value = e
                                            ? parseFloat(e).toFixed(2)
                                            : 0;
                                        form.setFieldsValue({
                                            tolerance: value,
                                        });

                                        setLoss(value);
                                    }}
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
                            <Form.Item label="Gross yy">
                                <div className="fakeInput">
                                    {parseFloat(
                                        formatNumberUtil(grossYy)
                                    ).toFixed(3)}
                                </div>
                            </Form.Item>
                            <Form.Item
                                name="uomId"
                                label="UOM (Vendor)"
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
                            <Form.Item name="unitPrice" label="Unit Price">
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
                                        setUnitPrice(value);
                                    }}
                                    step="0.001"
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
                            <Form.Item label="Amount">
                                <div className="fakeInput">
                                    {parseFloat(
                                        formatNumberUtil(grossYy * unitPrice)
                                    ).toFixed(type === 'fabric' ? 2 : 5)}
                                </div>
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

                                    <Form.Item
                                        name="sizeMemo"
                                        label="Size Description"
                                    >
                                        <Input
                                            placeholder="Insert Size description"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </Fragment>
                            )}
                            {/* {type === 'fabric' ? (
                                <Fragment>
                                    <Form.Item
                                        name="constructionType"
                                        label="CONSTRUCTION TYPE"
                                        rules={[
                                            {
                                                string: { max: 15 },
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Insert Construction type"
                                            maxLength="40"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="yarnSizeWrap"
                                        label="YARN SIZE WRAP"
                                        rules={[
                                            {
                                                required: true,
                                                string: { max: 15 },
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
                                        label="YARN SIZE WELT"
                                        rules={[
                                            {
                                                required: true,
                                                string: { max: 15 },
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
                                                type: 'number',
                                                max: 0,
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            type="number"
                                            step="0.1"
                                            max="0"
                                            placeholder="Insert Shrinkage"
                                            bordered={false}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>

                                    <Form.Item
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
                                    </Form.Item>
                                </Fragment>
                            ) : (
                                <>
                                    <Form.Item
                                        name="sizeMemo"
                                        label="SIZE DESCRIPTION"
                                    >
                                        <Input
                                            placeholder="Insert Size description"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="subsidiaryDetail"
                                        label="ITEM DETAIL"
                                    >
                                        <Input
                                            placeholder="Insert Item detail"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </>
                            )} */}

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
                                        rules={[{ type: 'string', max: 100 }]}
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
                                        rules={[{ type: 'string', max: 100 }]}
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
                                        rules={[{ type: 'string', max: 100 }]}
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

                            <Form.Item name="itemColor" label="Item Color">
                                <Input
                                    placeholder="Insert item color"
                                    bordered={false}
                                />
                            </Form.Item>

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

                            <Form.Item name="mcq" label="MCQ">
                                <InputNumber
                                    placeholder="Insert MCQ"
                                    max="9999999999"
                                    bordered={false}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item name="moq" label="MOQ">
                                <InputNumber
                                    placeholder="Insert MOQ"
                                    max="9999999999"
                                    bordered={false}
                                    style={{ width: '100%' }}
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
                        <div id="dependencyWrap">
                            <Tabs defaultActiveKey="color">
                                <TabPane tab="COLOR" key="color">
                                    {handleDependency(
                                        color,
                                        setColor,
                                        mclGarmentColorGetLists.data &&
                                            mclGarmentColorGetLists.data.list,
                                        'garmentColor'
                                    )}
                                </TabPane>
                                {type !== 'fabric' && (
                                    <>
                                        <TabPane tab="SIZE" key="size">
                                            {handleDependency(
                                                size,
                                                setSize,
                                                mclGarmentSizeGetLists.data &&
                                                    mclGarmentSizeGetLists.data
                                                        .list,
                                                'garmentSize'
                                            )}
                                        </TabPane>
                                        <TabPane tab="MARKET" key="market">
                                            {handleDependency(
                                                market,
                                                setMarket,
                                                mclGarmentMarketGetLists.data &&
                                                    mclGarmentMarketGetLists
                                                        .data.list,
                                                'garmentMarket'
                                            )}
                                        </TabPane>
                                    </>
                                )}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </MclMaterialWriteOutterWrap>
    );
};

const MclMaterialWriteOutterWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #mclMaterialWriteWrap {
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
                        ${(props) => props.theme.fonts.h6};
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

                .ant-tabs-content-holder span {
                    ${(props) => props.theme.fonts.h5};
                }
            }
        }
    }
`;

export default MclMaterialWrite;
