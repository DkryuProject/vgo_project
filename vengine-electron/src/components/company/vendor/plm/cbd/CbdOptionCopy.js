import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import { cbdOptionPostCopyAsyncAction } from 'store/cbd/option/reducer';
import styled from 'styled-components';
import TableButton from 'components/common/table/TableButton';
import { Row, Col, Form, Input, Radio, Space, Select, InputNumber } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import CustomTable from 'components/common/CustomTable';
import { Tooltip } from 'components/common/tooltip';
import {
    companyGetBrandAsyncAction,
    companyGetRelationTypeAsyncAction,
} from 'store/company/reducer';

import { FilterSelect } from 'components/common/select';
import { commonYearGetListsAsyncAction } from 'store/common/year/reducer';
import { companySearchListsAsyncAction } from 'store/companyInfo/reducer';
import { cbdCoverPostFilterAsyncAction } from 'store/cbd/cover/reducer';

const CbdOptionCopy = (props) => {
    const { cbdId, cbdCoverGetId, onVisible } = props;
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [form] = Form.useForm();
    const [searchform] = Form.useForm();
    const tableRef = useRef();
    const [copyType, setCopyType] = useState('current');
    const [dataSource, setDataSource] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const companyGetRelationType = useSelector(
        (state) => state.companyReducer.get.relationType
    );
    const handleCompanyGetRelationType = useCallback(
        (payload) =>
            dispatch(companyGetRelationTypeAsyncAction.request(payload)),
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

    const commonYearGetLists = useSelector(
        (state) => state.commonYearReducer.get.lists
    );
    const handleCommonYearGetLists = useCallback(
        (payload) => dispatch(commonYearGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const cbdCoverPostFilter = useSelector(
        (state) => state.cbdCoverReducer.postFilter
    );
    const handleCbdCoverPostFilter = useCallback(
        (payload) => dispatch(cbdCoverPostFilterAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdCoverPostFilterInit = useCallback(
        () => dispatch(cbdCoverPostFilterAsyncAction.initial()),
        [dispatch]
    );

    const cbdOptionPostCopy = useSelector(
        (state) => state.cbdOptionReducer.postCopy
    );
    const handleCbdOptionPostCopy = useCallback(
        (payload) => dispatch(cbdOptionPostCopyAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdOptionPostCopyInit = useCallback(
        () => dispatch(cbdOptionPostCopyAsyncAction.initial()),
        [dispatch]
    );

    const handleSubmit = useCallback(
        (values) => {
            let coverId = null;
            if (copyType === 'current') {
                coverId = cbdCoverGetId.data?.data?.coverId;
            } else if (copyType === 'other') {
                coverId = tableRef.current?.selectedRowKeys[0];
            }
            values['cbdCoverId'] = coverId;

            return handleCbdOptionPostCopy({
                ...values,
                cbdOptionId: Number(cbdId),
            });
        },

        [copyType, cbdId, cbdCoverGetId, tableRef, handleCbdOptionPostCopy]
    );

    const handleSearch = useCallback(
        (values) => {
            delete values['companyId'];

            return handleCbdCoverPostFilter(values);
        },
        [handleCbdCoverPostFilter]
    );

    // 검색
    useEffect(() => {
        setIsLoading(cbdCoverPostFilter?.isLoading);
        if (cbdCoverPostFilter.data) {
            setDataSource(cbdCoverPostFilter.data?.list);
        }

        return () => handleCbdCoverPostFilterInit();
    }, [cbdCoverPostFilter, setDataSource, handleCbdCoverPostFilterInit]);

    // 복사
    useEffect(() => {
        if (cbdOptionPostCopy.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdOptionPostCopy.error.message,
            });
        } else if (cbdOptionPostCopy.data) {
            onVisible(false);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'CBD information copy success',
            });
        }

        return () => handleCbdOptionPostCopyInit();
    }, [
        cbdOptionPostCopy,
        onVisible,
        handleNotification,
        handleCbdOptionPostCopyInit,
    ]);

    // 테이블
    const columns = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            align: 'left',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: 'Design No.',
            dataIndex: 'designNumber',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Season',
            align: 'left',
            render: (data, record) => {
                const value = (
                    <div>
                        {record?.season?.name} {record?.seasonYear}
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            align: 'left',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    SEARCH RESULT
                </Space>
            </div>
        </div>
    );

    return (
        <CbdOptionCopyWrap>
            <div
                className="titleWrap"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div className="title">CBD OPTION COPY FUNCTION</div>
                <div className="functionWrap">
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Assign',
                            arrowPointAtCenter: true,
                        }}
                        mode="save"
                        size="small"
                        onClick={() => form.submit()}
                    />
                </div>
            </div>
            <div className="contentsWrap">
                <div className="content">
                    <div className="optionContent">
                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={handleSubmit}
                            size="small"
                        >
                            <Row gutter={[10, 10]}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Option Name"
                                        name="cbdOptionName"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Insert option name"
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="targetProfit"
                                        label="Target Profilt (%)"
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber
                                            placeholder="Insert Profit cost"
                                            onBlur={(e) => {
                                                const { value } = e.target;
                                                form.setFieldsValue({
                                                    profitCost: value
                                                        ? parseFloat(
                                                              value
                                                          ).toFixed(2)
                                                        : 0,
                                                });
                                            }}
                                            step="0.01"
                                            min={0}
                                            max={100}
                                            formatter={(value) => `${value}%`}
                                            parser={(value) =>
                                                value.replace('%', '')
                                            }
                                            style={{ width: '100%' }}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Radio.Group
                                value={copyType}
                                onChange={(e) => setCopyType(e.target.value)}
                            >
                                <Space direction="vertical">
                                    <Radio value="current">
                                        Current Design Cover
                                    </Radio>
                                    <Radio value="other">
                                        Other Design Cover
                                    </Radio>
                                </Space>
                            </Radio.Group>
                        </Form>
                    </div>

                    {copyType === 'other' && (
                        <div className="searchContent">
                            <div className="titleWrap">
                                <div className="title">SEARCH OPTIONS</div>
                                <div className="functionWrap">
                                    <TableButton
                                        toolTip={{
                                            placement: 'topLeft',
                                            title: 'Search',
                                            arrowPointAtCenter: true,
                                        }}
                                        mode="search"
                                        size="small"
                                        onClick={() => searchform.submit()}
                                    />
                                </div>
                            </div>
                            <Form
                                layout="vertical"
                                form={searchform}
                                onFinish={handleSearch}
                                size="small"
                            >
                                <Row gutter={[10, 10]}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="companyId"
                                            label="BUYER"
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
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="brand" label="BRAND">
                                            {FilterSelect({
                                                _key: 'companyID',
                                                _value: 'companyID',
                                                text: 'companyName',
                                                placeholder: `Select Brand name`,
                                                data: companyGetBrand,
                                                onData: () => {
                                                    console.log(
                                                        'sad: ',
                                                        searchform.getFieldValue(
                                                            'companyId'
                                                        )
                                                    );
                                                    return handleCompanyGetBrand(
                                                        searchform.getFieldValue(
                                                            'companyId'
                                                        )
                                                    );
                                                },
                                            })}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="designNumber"
                                            label="DESIGN NUMBER"
                                        >
                                            <Input
                                                bordered={false}
                                                maxLength="20"
                                                placeholder="Insert Design number"
                                                size="small"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="orderType"
                                            label="ORDER TYPE"
                                        >
                                            <Select
                                                placeholder="Select Order type name"
                                                showSearch
                                                filterOption={(input, option) =>
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
                                                                    key={v.id}
                                                                    value={v.id}
                                                                >
                                                                    {v.name}
                                                                </Select.Option>
                                                            );
                                                        }
                                                    )}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="seasonName"
                                            label="SEASON NAME"
                                        >
                                            <Select
                                                placeholder="Select Season name"
                                                showSearch
                                                filterOption={(input, option) =>
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
                                                        .type === 'season' &&
                                                    companyInfoGetLists.data.result.list.map(
                                                        (v, i) => {
                                                            return (
                                                                <Select.Option
                                                                    key={v.id}
                                                                    value={v.id}
                                                                >
                                                                    {v.name}
                                                                </Select.Option>
                                                            );
                                                        }
                                                    )}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="seasonYear"
                                            label="SEASON YEAR"
                                        >
                                            <Select
                                                placeholder="Select Season year"
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
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
                                                                    value={v}
                                                                >
                                                                    {v}
                                                                </Select.Option>
                                                            );
                                                        })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>

                            <CustomTable
                                ref={tableRef}
                                title={title}
                                rowKey="coverId"
                                initialColumns={columns}
                                dataSource={dataSource}
                                rowSelection={true}
                                pagination={false}
                                loading={isLoading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </CbdOptionCopyWrap>
    );
};

const CbdOptionCopyWrap = styled.div`
    .titleWrap {
        display: flex;
        justify-content: space-between;
        .title {
            ${(props) => props.theme.fonts.h7};
        }
    }

    .contentsWrap {
        margin-top: 1rem;
        .content {
            .searchContent {
                margin-top: 1rem;
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
`;

export default CbdOptionCopy;
