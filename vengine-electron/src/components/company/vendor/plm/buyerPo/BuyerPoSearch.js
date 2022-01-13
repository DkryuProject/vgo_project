import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import {
    companyGetBrandAsyncAction,
    companyGetRelationTypeAsyncAction,
} from 'store/company/reducer';
import styled from 'styled-components';
import { Input, Space, Form, Modal, Tooltip } from 'antd';
import { FilterSelect } from 'components/common/select';
import TableButton from 'components/common/table/TableButton';
import { companySearchListsAsyncAction } from 'store/companyInfo/reducer';
import Dragger from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import CustomTable from 'components/common/CustomTable';
import { buyerOrderPostExcelUploadAsyncAction } from 'store/buyer/order/reducer';
import dateFormat from 'core/utils/dateUtil';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
};

const FileUpload = (props) => {
    const { onVisibleModal } = props;
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState({
        isLoading: false,
        errorList: [],
        excelList: [],
        fileName: null,
    });

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

    const buyerOrderPostExcelUpload = useSelector(
        (state) => state.buyerOrderReducer.post.excelUpload
    );
    const handleBuyerOrderPostExcelUpload = useCallback(
        (payload) =>
            dispatch(buyerOrderPostExcelUploadAsyncAction.request(payload)),
        [dispatch]
    );
    const handleBuyerOrderPostExcelUploadInit = useCallback(
        () => dispatch(buyerOrderPostExcelUploadAsyncAction.initial()),
        [dispatch]
    );

    useEffect(
        () =>
            console.log(
                'buyerOrderPostExcelUpload: ',
                buyerOrderPostExcelUpload
            ),
        [buyerOrderPostExcelUpload]
    );

    const handleSubmit = useCallback(
        (values) => {
            if (dataSource?.errorList?.length) {
                return handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'Please re-upload after fixing the error',
                });
            }
            values['buyer'] = JSON.parse(values['buyer'])?.companyName;
            handleBuyerOrderPostExcelUpload({
                ...values,
                fileName: dataSource?.fileName,
            });
        },
        [dataSource, handleBuyerOrderPostExcelUpload, handleNotification]
    );

    const uploadProps = {
        name: 'file',
        multiple: false,
        action: `${process.env.REACT_APP_BASE_URL}/v1/order/excel/upload`,
        headers: {
            'X-AUTH-TOKEN': localStorage.getItem('authToken'),
            'X-Requested-With': null,
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'uploading') {
                setDataSource((dataSource) => ({
                    ...dataSource,
                    isLoading: true,
                }));
            }
            if (status === 'done') {
                setDataSource({
                    isLoading: false,
                    errorList: info?.file?.response?.data?.errorList?.map(
                        (v, i) => ({
                            ...v,
                            index: i + 1,
                        })
                    ),
                    excelList: info?.file?.response?.data?.excelList?.map(
                        (v, i) => ({
                            ...v,
                            index: i + 1,
                        })
                    ),
                    fileName: info?.file?.response?.data?.fileName,
                });
            } else if (status === 'error') {
                setDataSource((dataSource) => ({
                    isLoading: false,
                    errorList: [],
                    excelList: [],
                    fileName: null,
                }));
            }

            // setDataSource((dataSource) => ({
            //     ...dataSource,
            //     isLoading: false,
            // }));
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    useEffect(() => {
        if (buyerOrderPostExcelUpload.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                // description: buyerOrderPostExcelUpload.error.message,
                description: 'Please check the excel format',
            });
        } else if (buyerOrderPostExcelUpload.data) {
            onVisibleModal(false);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Excel upload complete',
            });
        }
    }, [
        buyerOrderPostExcelUpload,
        onVisibleModal,
        // setDataSource,
        handleNotification,
    ]);

    useEffect(() => {
        return () => handleBuyerOrderPostExcelUploadInit();
    }, [handleBuyerOrderPostExcelUploadInit]);

    // 테이블
    const errorListColumns = [
        {
            title: 'LINE#',
            dataIndex: 'row',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'FIELD#',
            dataIndex: 'fieldHeader',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Error Description',
            align: 'left',
            render: (_, record) => {
                const { message, exceptionMessage } = record;
                return (
                    <Tooltip title={exceptionMessage || message}>
                        {exceptionMessage || message}
                    </Tooltip>
                );
            },
        },
    ];

    const excelListColumns = [
        {
            title: 'COLOR',
            dataIndex: 'color',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'DESTINATION COUNTRY',
            dataIndex: 'destinationCountry',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },

        {
            title: 'INCOTERMS',
            dataIndex: 'incoterms',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'MARKET',
            dataIndex: 'market',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'ORIGIN COUNTRY',
            dataIndex: 'originCountry',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'PO NUMBER',
            dataIndex: 'poNumber',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'QTY',
            dataIndex: 'qty',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'SHIP MODE',
            dataIndex: 'shipMode',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },

        {
            title: 'SIZE',
            dataIndex: 'size',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'SKU NUMBER',
            dataIndex: 'sku',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'START',
            dataIndex: 'start',
            align: 'left',
            render: (data) => {
                const _data = dateFormat(data, 'dateOfBirth');
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'END',
            dataIndex: 'end',
            align: 'left',
            render: (data) => {
                const _data = dateFormat(data, 'dateOfBirth');
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'STYLE',
            dataIndex: 'style',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'UNIT PRICE',
            dataIndex: 'unitPrice',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
    ];

    return (
        <div>
            <Form
                {...layout}
                form={form}
                onFinish={handleSubmit}
                size="small"
                bordered={false}
            >
                <Form.Item
                    name="buyer"
                    label="BUYER"
                    rules={[{ required: true }]}
                >
                    {FilterSelect({
                        _key: 'companyID',
                        // _value: 'companyName',
                        text: 'companyName',
                        placeholder: `Select Buyer name`,
                        data: companyGetRelationType,
                        onData: () => handleCompanyGetRelationType('BUYER'),
                    })}
                </Form.Item>

                <Form.Item
                    name="brand"
                    label="BRAND"
                    rules={[{ required: true }]}
                >
                    {FilterSelect({
                        _key: 'companyID',
                        _value: 'companyName',
                        text: 'companyName',
                        placeholder: `Select Brand name`,
                        data: companyGetBrand,
                        onData: () => {
                            let buyerComapnyID = JSON.parse(
                                form.getFieldValue('buyer')
                            );
                            buyerComapnyID = buyerComapnyID.companyID;

                            return handleCompanyGetBrand(buyerComapnyID);
                        },
                    })}
                </Form.Item>

                <Form.Item
                    name="programType"
                    label="Program Type"
                    rules={[{ required: true }]}
                >
                    {FilterSelect({
                        _key: 'id',
                        _value: 'name',
                        text: 'name',
                        placeholder: 'Select Program type',
                        filterType: 'program',
                        data: companyInfoGetLists,
                        onData: () => handleCompanyInfoGetLists('program'),
                    })}
                </Form.Item>
            </Form>
            <Dragger {...uploadProps} disabled={dataSource?.isLoading}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Click or drag file to this area to upload
                </p>
            </Dragger>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '1rem',
                }}
            >
                <TableButton
                    toolTip={{
                        placement: 'topLeft',
                        title: 'UPLOAD PO',
                        arrowPointAtCenter: true,
                    }}
                    size="small"
                    disabled={
                        dataSource?.isLoading ||
                        buyerOrderPostExcelUpload?.isLoading
                    }
                    onClick={() => form.submit()}
                >
                    UPLOAD
                </TableButton>
            </div>

            <CustomTable
                title={() => <div className="title">ERROR LIST</div>}
                rowKey="index"
                initialColumns={errorListColumns}
                dataSource={dataSource?.errorList}
                loading={dataSource?.isLoading}
                pagination={false}
            />
            <CustomTable
                title={() => <div className="title">EXCEL LIST</div>}
                rowKey="index"
                initialColumns={excelListColumns}
                dataSource={dataSource?.excelList || []}
                loading={dataSource?.isLoading}
                pagination={false}
            />
        </div>
    );
};

const BuyerPoSearch = (props) => {
    const { onBuyerOrderGetSearch, searchType, onSearchType } = props;
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);

    return (
        <BuyerPoSearchWrap>
            {/* Modal안에 있는 내용을 초기화 하기 위한 조건문 */}
            {visibleModal && (
                <Modal
                    title={<div className="title">FILE UPLOAD</div>}
                    centered
                    okButtonProps={{ style: { display: 'none' } }}
                    // closable={false}
                    wrapClassName="modalWrap"
                    visible={visibleModal}
                    onOk={() => setVisibleModal(false)}
                    onCancel={() => setVisibleModal(false)}
                    width="90%"
                >
                    <FileUpload
                        visibleModal={visibleModal}
                        onVisibleModal={setVisibleModal}
                    />
                </Modal>
            )}

            <div id="BuyerPoSearchWrap">
                <Space>
                    <FilterSelect
                        _key="key"
                        _value="key"
                        text="name"
                        placeholder="Select Search  type"
                        defaultValue="style"
                        data={{
                            data: {
                                list: [
                                    { key: 'style', name: 'Style#' },
                                    { key: 'design', name: 'Design#' },
                                ],
                            },
                        }}
                        onChange={(e) => onSearchType(e)}
                    />
                    <Input
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        bordered={false}
                    />
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Search',
                            arrowPointAtCenter: true,
                        }}
                        mode="search"
                        size="small"
                        onClick={() =>
                            onBuyerOrderGetSearch(
                                searchType === 'style'
                                    ? { searchType, searchKeyword }
                                    : searchKeyword
                            )
                        }
                    />
                </Space>
                <Space>
                    <a
                        style={{ display: 'block' }}
                        href={process.env.REACT_APP_AWS_BUYER_PO_DOWNLOAD_PATH}
                        download
                    >
                        Upload template download
                    </a>
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'UPLOAD PO',
                            arrowPointAtCenter: true,
                        }}
                        size="small"
                        onClick={() => setVisibleModal(true)}
                    >
                        UPLOAD PO
                    </TableButton>
                </Space>
            </div>
        </BuyerPoSearchWrap>
    );
};

const BuyerPoSearchWrap = styled.div`
    #BuyerPoSearchWrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 2rem 1rem 1rem;
    }

    .ant-select-selector > span {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
        ${(props) => props.theme.fonts.h5};
    }

    .ant-space-item > input {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
        ${(props) => props.theme.fonts.h5};
    }

    .ant-select-selection-search > input {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
        ${(props) => props.theme.fonts.h5};
    }

    .ant-select-selection-search > div {
        border-bottom: 1px solid lightgray;
        border-radius: 0px;
        ${(props) => props.theme.fonts.h5};
    }
`;

export default BuyerPoSearch;
