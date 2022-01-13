import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { commonMaterialGetListsAsyncAction } from 'store/common/material/reducer';
import { materialInfoPostFilterAsyncAction } from 'store/material/info/reducer';
import { companyGetRelationTypeAsyncAction } from 'store/company/reducer';
import { commonBasicGetListsAsyncAction } from 'store/common/basic/reducer';
import styled from 'styled-components';
import { FilterSelect } from 'components/common/select';
import TableButton from 'components/common/table/TableButton';
import { Form, Input, Space, Select } from 'antd';
import { PushpinOutlined } from '@ant-design/icons';

const MaterialFilter = (props) => {
    const { type, initialShow, onShow, onLeftSplit } = props;
    const [form] = Form.useForm();
    const materialFilterForm = useRef();
    const dispatch = useDispatch();
    const [_type, _setType] = useState(type || 'fabric');
    const typeLists = useMemo(
        () => [
            { id: 'fabric', name: 'FABRIC' },
            { id: 'trim', name: 'TRIM' },
            { id: 'accessories', name: 'ACCESSORIES' },
        ],
        []
    );
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 8 },
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

    const commonBasicGetLists = useSelector(
        (state) => state.commonBasicReducer.get.lists
    );
    const handleCommonBasicGetLists = useCallback(
        (payload) => dispatch(commonBasicGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const handleMaterialInfoPostFilter = useCallback(
        (payload) =>
            dispatch(materialInfoPostFilterAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialInfoPostFilterInit = useCallback(
        () => dispatch(materialInfoPostFilterAsyncAction.initial()),
        [dispatch]
    );

    const handleSearch = useCallback(
        (values) => {
            const _category =
                values?.categoryB && JSON.parse(values?.categoryB);
            if (_category) {
                values['categoryB'] = _category?.typeB;
                if (_category?.typeC) {
                    values['categoryC'] = _category?.typeC;
                }
            }

            return handleMaterialInfoPostFilter(values);
        },
        [handleMaterialInfoPostFilter]
    );

    //초기화
    useEffect(() => {
        return () => handleMaterialInfoPostFilterInit();
    }, [handleMaterialInfoPostFilterInit]);
    return (
        <MaterialFilterWrap>
            <div className="titleWrap">
                <div className="title">
                    <Space>
                        <PushpinOutlined />
                        ITEM SEARCH
                    </Space>
                </div>
                <div className="functionWrap">
                    <Space>
                        <TableButton
                            toolTip={{
                                placement: 'topRight',
                                title:
                                    _type === 'fabric'
                                        ? 'Fabric material search'
                                        : _type === 'trim'
                                        ? 'Trim material search'
                                        : 'Accssories material search',
                                arrowPointAtCenter: true,
                            }}
                            mode="search"
                            size="small"
                            onClick={() => {
                                materialFilterForm.current.submit();
                            }}
                        />

                        <TableButton
                            toolTip={{
                                placement: 'topLeft',
                                title: 'Reset',
                                arrowPointAtCenter: true,
                            }}
                            mode="reset"
                            size="small"
                            onClick={() => {
                                form.setFieldsValue({
                                    categoryB: undefined,
                                    supplier: undefined,
                                    chief: undefined,
                                    millArticle: undefined,
                                    vendor: undefined,
                                    RD: undefined,
                                });
                                handleMaterialInfoPostFilterInit();
                            }}
                        />

                        <TableButton
                            toolTip={{
                                placement: 'topLeft',
                                title: 'Close',
                                arrowPointAtCenter: true,
                            }}
                            mode="cancel"
                            size="small"
                            onClick={() => {
                                if (onLeftSplit) {
                                    onLeftSplit();
                                    return onShow({
                                        ...initialShow,
                                        [_type]: {
                                            status: false,
                                        },
                                    });
                                } else {
                                    // adhoc에서 사용
                                    return onShow();
                                }
                            }}
                        />
                    </Space>
                </div>
            </div>
            <div className="contentsWrap">
                <Form
                    {...layout}
                    form={form}
                    onFinish={handleSearch}
                    ref={materialFilterForm}
                    size="small"
                >
                    {type ? null : (
                        <Form.Item label="TYPE">
                            {FilterSelect({
                                _key: 'id',
                                _value: 'id',
                                text: 'name',
                                defaultValue: 'FABRIC',
                                placeholder: `Select Partial shipment`,
                                data: { data: { list: typeLists } },
                                onChange: (v) => _setType(v),
                            })}
                        </Form.Item>
                    )}
                    <Form.Item
                        name="categoryB"
                        label={`${
                            _type === 'fabric' ? 'Fabric Type' : 'Item Category'
                        }`}
                    >
                        {_type === 'fabric' ? (
                            <Select
                                placeholder="Select Fabric type"
                                showSearch
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                onDropdownVisibleChange={(e) => {
                                    if (e) handleCommonMaterialGetLists();
                                }}
                                loading={commonMaterialGetLists.isLoading}
                                bordered={false}
                            >
                                {commonMaterialGetLists.data &&
                                    commonMaterialGetLists.data.list
                                        .filter((v) => v.typeA === 'Fabric')
                                        .map((v) => {
                                            return (
                                                <Select.Option
                                                    key={v.id}
                                                    value={JSON.stringify(v)}
                                                >
                                                    {v.typeB}
                                                </Select.Option>
                                            );
                                        })}
                            </Select>
                        ) : (
                            <Select
                                placeholder="Select Category"
                                showSearch
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                onDropdownVisibleChange={(e) => {
                                    if (e) handleCommonMaterialGetLists();
                                }}
                                loading={commonMaterialGetLists.isLoading}
                                bordered={false}
                            >
                                {commonMaterialGetLists.data &&
                                    commonMaterialGetLists.data.list
                                        .filter(
                                            (v) =>
                                                v.typeA === 'Trim' ||
                                                v.typeA === 'Accessories'
                                        )
                                        .map((v) => {
                                            return (
                                                <Select.Option
                                                    key={v.id}
                                                    value={JSON.stringify(v)}
                                                >
                                                    {v.typeC
                                                        ? `${v.typeB} / ${v.typeC}`
                                                        : v.typeB}
                                                </Select.Option>
                                            );
                                        })}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item name="supplier" label="Supplier Name">
                        {FilterSelect({
                            _key: 'companyID',
                            value: 'companyID',
                            text: 'companyName',
                            placeholder: `Select Supplier name`,
                            data: companyGetRelationType,
                            onData: () =>
                                handleCompanyGetRelationType('SUPPLIER'),
                        })}
                    </Form.Item>
                    {_type === 'fabric' && (
                        <Form.Item name="chief" label="Yarn type">
                            {FilterSelect({
                                _key: 'id',
                                value: 'id',
                                text: 'name1',
                                placeholder: `Select Chief contents`,
                                data: commonBasicGetLists,
                                onData: () => handleCommonBasicGetLists('yarn'),
                            })}
                        </Form.Item>
                    )}

                    <Form.Item name="name" label="Item name">
                        <Input placeholder="Item name" bordered={false} />
                    </Form.Item>

                    {/* <Form.Item label="Material#">
                        <Space>
                            <Form.Item name="millArticle">
                                <Input
                                    placeholder="Mill Article#"
                                    bordered={false}
                                />
                            </Form.Item>
                            <Form.Item name="vendor">
                                <Input placeholder="Vendor#" bordered={false} />
                            </Form.Item>
                            <Form.Item name="RD">
                                <Input placeholder="RD#" bordered={false} />
                            </Form.Item>
                        </Space>
                    </Form.Item> */}
                </Form>
            </div>
        </MaterialFilterWrap>
    );
};

const MaterialFilterWrap = styled.div`
    padding: 0.5rem;
    border: 1px solid lightgray;
    border-radius: 3px;
    box-shadow: 3px 3px gray;

    .titleWrap {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        .title {
            ${(props) => props.theme.fonts.h7};
        }
    }

    .contentsWrap {
        .ant-form-item-label {
            label {
                color: #7f7f7f;
                ${(props) => props.theme.fonts.h5};
            }
        }

        .ant-space.ant-space-horizontal.ant-space-align-center {
            border: 0;
        }

        .ant-form-item-control-input input {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }

        .ant-form-item-control-input-content > div {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
            ${(props) => props.theme.fonts.h5};
        }

        .ant-select-selection-placeholder {
            ${(props) => props.theme.fonts.h5};
        }

        .ant-input.ant-input-sm.ant-input-borderless {
            ${(props) => props.theme.fonts.h5};
        }
    }
`;

export default MaterialFilter;
