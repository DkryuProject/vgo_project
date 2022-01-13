import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useGtag from 'core/hook/useGtag';
import dateFormat from 'core/utils/dateUtil';
import {
    materialInfoGetPagesAsyncAction,
    materialInfoPostExcelUploadAsyncAction,
    materialInfoPutDeleteAsyncAction,
} from 'store/material/info/reducer';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import { JcBetween } from 'styles/Layout';
import { Space, Input, Modal } from 'antd';
import {
    CaretRightOutlined,
    SearchOutlined,
    DisconnectOutlined,
    InboxOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import styled from 'styled-components';
import Dragger from 'antd/lib/upload/Dragger';
import { FilterSelect } from 'components/common/select';

const FileUpload = (props) => {
    const { onVisibleModal } = props;
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [dataSource, setDataSource] = useState({
        isLoading: false,
        errorList: [],
        excelList: [],
        fileName: null,
    });

    const [type, setType] = useState('fabric');

    const categoryOption = [
        { id: 'fabric', name: 'FABRIC' },
        { id: 'trim', name: 'TRIM' },
    ];

    const materialInfoPostExcelUpload = useSelector(
        (state) => state.materialInfoReducer.postExcelUpload
    );
    const handleMaterialInfoPostExcelUpload = useCallback(
        (payload) =>
            dispatch(materialInfoPostExcelUploadAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialInfoPostExcelUploadInit = useCallback(
        () => dispatch(materialInfoPostExcelUploadAsyncAction.initial()),
        [dispatch]
    );

    const uploadProps = useMemo(
        () => ({
            name: 'file',
            multiple: false,
            action: `${process.env.REACT_APP_BASE_URL}/v1/material/excel/upload/${type}`,

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
        }),
        [type]
    );

    const handleSubmit = useCallback(() => {
        return handleMaterialInfoPostExcelUpload({
            type: type,
            data: { fileName: dataSource.fileName },
        });
    }, [dataSource, type, handleMaterialInfoPostExcelUpload]);

    useEffect(() => {
        if (materialInfoPostExcelUpload.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: materialInfoPostExcelUpload.error.message,
            });
        } else if (materialInfoPostExcelUpload.data) {
            onVisibleModal(false);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Excel upload complete',
            });
        }
        return () => handleMaterialInfoPostExcelUploadInit();
    }, [
        materialInfoPostExcelUpload,
        onVisibleModal,
        setDataSource,
        handleNotification,
        handleMaterialInfoPostExcelUploadInit,
    ]);

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

    const excelListFabricColumns = [
        {
            title: 'SUPPLIER COMPANY CODE NO.',
            dataIndex: 'supplierCode',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'ITEM CATEGORY A',
            dataIndex: 'categoryA',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },

        {
            title: 'ITEM CATEGORY B',
            dataIndex: 'categoryB',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'ITEM NAME',
            dataIndex: 'itemName',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'CONSTRUCTION',
            dataIndex: 'construction',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'MILL ARTICLE#',
            dataIndex: 'millArticle',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'VENDOR#',
            dataIndex: 'vendor',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'RD#',
            dataIndex: 'rd',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },

        {
            title: 'CONTENTS#1',
            dataIndex: 'contents1',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'VALUE',
            dataIndex: 'value1',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'CONTENTS#2',
            dataIndex: 'contents2',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'VALUE',
            dataIndex: 'value2',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'CONTENTS#3',
            dataIndex: 'contents3',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'VALUE',
            dataIndex: 'value3',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'CONTENTS#4',
            dataIndex: 'contents4',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'VALUE',
            dataIndex: 'value4',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'RECIPIENT COMPANY CODE NO.',
            dataIndex: 'recipientCompanyCode',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'BUYER COMPANY NO.',
            dataIndex: 'buyerCode',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'BRAND COMPANY NO.',
            dataIndex: 'brandCode',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'FINISHING',
            dataIndex: 'fisishing',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'DYEING',
            dataIndex: 'dyeing',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'PRINTING',
            dataIndex: 'printing',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'CW',
            dataIndex: 'cw',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'CW UOM',
            dataIndex: 'cwUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'WEIGHT',
            dataIndex: 'weight',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'WEIGHT UOM',
            dataIndex: 'weightUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'CURRENCY',
            dataIndex: 'currency',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'UNIT PRICE',
            dataIndex: 'unitPrice',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'UOM',
            dataIndex: 'offerUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'MOQ',
            dataIndex: 'moq',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'MCQ',
            dataIndex: 'mcq',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
    ];

    const excelListTrimColumns = [
        {
            title: 'SUPPLIER COMPANY CODE NO.',
            dataIndex: 'supplierCode',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'ITEM CATEGORY A',
            dataIndex: 'categoryA',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },

        {
            title: 'ITEM CATEGORY B',
            dataIndex: 'categoryB',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'ITEM NAME',
            dataIndex: 'itemName',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'ITEM DETAIL',
            dataIndex: 'itemDetail',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'MILL ARTICLE#',
            dataIndex: 'millArticle',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'VENDOR#',
            dataIndex: 'vendor',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'RD#',
            dataIndex: 'rd',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'RECIPIENT COMPANY CODE NO.',
            dataIndex: 'recipientCompanyCode',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'BUYER COMPANY NO.',
            dataIndex: 'buyerCode',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'BRAND COMPANY NO.',
            dataIndex: 'brandCode',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'FINISHING',
            dataIndex: 'fisishing',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'CW',
            dataIndex: 'cw',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'CW UOM',
            dataIndex: 'cwUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'WEIGHT',
            dataIndex: 'weight',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'WEIGHT UOM',
            dataIndex: 'weightUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'CURRENCY',
            dataIndex: 'currency',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'UNIT PRICE',
            dataIndex: 'unitPrice',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'UOM',
            dataIndex: 'offerUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'MOQ',
            dataIndex: 'moq',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'MCQ',
            dataIndex: 'mcq',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
    ];

    return (
        <div>
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
                <Space>
                    {FilterSelect({
                        _key: 'id',
                        _value: 'id',
                        text: 'name',
                        defaultValue: type,
                        placeholder: `Select Category type`,
                        data: { data: { list: categoryOption } },
                        onChange: (e) => setType(e),
                        disabled: dataSource?.isLoading,
                    })}

                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'UPLOAD',
                            arrowPointAtCenter: true,
                        }}
                        size="small"
                        disabled={
                            dataSource?.isLoading ||
                            materialInfoPostExcelUpload?.isLoading
                        }
                        onClick={handleSubmit}
                    >
                        UPLOAD
                    </TableButton>
                </Space>
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
                initialColumns={
                    type === 'fabric'
                        ? excelListFabricColumns
                        : excelListTrimColumns
                }
                dataSource={dataSource?.excelList || []}
                loading={dataSource?.isLoading}
                pagination={false}
            />
        </div>
    );
};

const MaterialRegistrationLists = (props) => {
    const { match, history } = props;
    const rowKey = 'id';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        searchKeyword: '',
    });
    const [total, setTotal] = useState(0);
    const [visibleModal, setVisibleModal] = useState(false);

    const materialInfoGetPages = useSelector(
        (state) => state.materialInfoReducer.get.pages
    );
    const handleMaterialInfoGetPages = useCallback(
        (payload) => dispatch(materialInfoGetPagesAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialInfoGetPagesInit = useCallback(
        () => dispatch(materialInfoGetPagesAsyncAction.initial()),
        [dispatch]
    );

    const materialInfoPutDelete = useSelector(
        (state) => state.materialInfoReducer.put.delete
    );
    const handleMaterialInfoPutDelete = useCallback(
        (payload) =>
            dispatch(materialInfoPutDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMaterialInfoPutDeleteInit = useCallback(
        () => dispatch(materialInfoPutDeleteAsyncAction.initial()),
        [dispatch]
    );

    const materialInfoPostExcelUpload = useSelector(
        (state) => state.materialInfoReducer.postExcelUpload
    );

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows, selectedRowKeys } = editTableRef.current;

            if (selectedRows.length === 0) {
                return confirm.warningConfirm('No item is selected');
            }
            if (type === 'delete') {
                confirm.deleteConfirm((e) => {
                    if (e) {
                        return handleMaterialInfoPutDelete(selectedRowKeys);
                    }
                });
            }
        },
        [handleMaterialInfoPutDelete]
    );

    // 조회
    useEffect(() => {
        handleMaterialInfoGetPages(pagination);
        return () => {
            handleMaterialInfoGetPagesInit();
        };
    }, [
        pagination,
        handleMaterialInfoGetPages,
        handleMaterialInfoGetPagesInit,
        materialInfoPostExcelUpload,
    ]);

    // 삭제
    useEffect(() => {
        if (materialInfoPutDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: materialInfoPutDelete.error.message,
            });
        } else if (materialInfoPutDelete.data) {
            const { selectedRows } = editTableRef.current;
            let result = [];
            for (let v1 of dataSource) {
                if (!selectedRows.find((v2) => v2[rowKey] === v1[rowKey])) {
                    result.push(v1);
                }
            }

            setDataSource(result);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description:
                    'Material registration Info list deletion successful',
            });
        }

        return () => handleMaterialInfoPutDeleteInit();
    }, [
        materialInfoPutDelete,
        editTableRef,
        dataSource,
        handleNotification,
        handleMaterialInfoPutDeleteInit,
        setDataSource,
    ]);

    useEffect(() => {
        setIsLoading(materialInfoGetPages.isLoading);
        if (materialInfoGetPages.data) {
            const { content, totalElements } = materialInfoGetPages.data.page;
            setDataSource(content);
            setTotal(totalElements);
        }
    }, [materialInfoGetPages]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `MATERIAL LISTS | MATERIAL REGISTER `,
        });
    }, [trackPageView]);

    // 테이블
    const columns = [
        {
            title: 'Supplier name',
            dataIndex: 'supplier',
            ellipsis: true,
            width: '10%',
            align: 'left',
            render: (data, record) => {
                const { type } = record;
                const value = (
                    <div>
                        <div>({type.toUpperCase()})</div>
                        <div>{data?.name}</div>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Material',
            children: [
                {
                    title: 'Name and Number',
                    ellipsis: true,
                    width: '20%',
                    align: 'left',
                    render: (_, record) => {
                        const {
                            name,
                            supplierMaterial,
                            vendorMaterial,
                            buyerMaterial,
                        } = record;
                        const value = (
                            <div>
                                <JcBetween>
                                    <div>* Name :</div> <div>{name}</div>
                                </JcBetween>
                                <JcBetween>
                                    <div>* Mill article# :</div>{' '}
                                    <div>{supplierMaterial}</div>
                                </JcBetween>
                                <JcBetween>
                                    <div>* Vendor# :</div>{' '}
                                    <div>{vendorMaterial}</div>
                                </JcBetween>
                                <JcBetween>
                                    <div>* RD# :</div>{' '}
                                    <div>{buyerMaterial}</div>
                                </JcBetween>
                            </div>
                        );
                        return <Tooltip title={value}>{value}</Tooltip>;
                    },
                },
                {
                    title: 'Information',
                    ellipsis: true,
                    width: '40%',
                    align: 'left',
                    render: (_, record) => {
                        const { category, fabricContents, construction } =
                            record;
                        const value = (
                            <div>
                                <JcBetween>
                                    <div>* Item Category :</div>{' '}
                                    <div>
                                        {category?.typeB} {category?.typeC}
                                    </div>
                                </JcBetween>

                                <JcBetween>
                                    <div>* Content :</div>{' '}
                                    <div>
                                        {fabricContents.map((v) => {
                                            return (
                                                <span key={v.contents?.name}>
                                                    {v.rate}% {v.contents?.name}{' '}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </JcBetween>

                                <JcBetween>
                                    <div>* Construnction :</div>{' '}
                                    <div>{construction}</div>
                                </JcBetween>
                            </div>
                        );
                        return <Tooltip title={value}>{value}</Tooltip>;
                    },
                },
            ],
        },

        {
            title: 'Modified',
            children: [
                {
                    title: 'Date/Time',
                    dataIndex: 'updated',
                    ellipsis: true,
                    width: '10%',
                    align: 'left',
                    render: (data) => (
                        <Tooltip title={dateFormat(data)}>
                            {dateFormat(data)}
                        </Tooltip>
                    ),
                },
                {
                    title: 'By',
                    dataIndex: 'createdBy',
                    ellipsis: true,
                    width: '10%',
                    align: 'left',
                    render: (data) => (
                        <Tooltip title={data?.userName}>
                            {data?.userName}
                        </Tooltip>
                    ),
                },
                {
                    dataIndex: 'useYN',
                    ellipsis: true,
                    width: '3%',
                    align: 'left',
                    render: (data) => (
                        <Tooltip title={data === 'Y' && 'connected'}>
                            {data === 'Y' && <DisconnectOutlined />}
                        </Tooltip>
                    ),
                },
            ],
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    MATERIAL LIST
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <a
                        style={{ display: 'block' }}
                        href={
                            process.env
                                .REACT_APP_AWS_MATERIAL_FABRIC_DOWNLOAD_PATH
                        }
                        download
                    >
                        Upload Fabric template download
                    </a>
                    /
                    <a
                        style={{ display: 'block' }}
                        href={
                            process.env
                                .REACT_APP_AWS_MATERIAL_TRIM_DOWNLOAD_PATH
                        }
                        download
                    >
                        Upload Trim template download
                    </a>
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'UPLOAD',
                            arrowPointAtCenter: true,
                        }}
                        size="small"
                        onClick={() => setVisibleModal(true)}
                    >
                        UPLOAD
                    </TableButton>
                    <Input
                        size="small"
                        value={pagination.searchKeyword}
                        onChange={(e) =>
                            setPagination({
                                ...pagination,
                                searchKeyword: e.target.value,
                            })
                        }
                        placeholder="Search"
                        suffix={<SearchOutlined />}
                        bordered={false}
                        style={{
                            borderRadius: 0,
                            borderBottom: '1px solid lightgray',
                        }}
                    />
                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Create Material',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => history.push(`${match.url}/write`)}
                    />
                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Delete Material',
                            arrowPointAtCenter: true,
                        }}
                        mode="delete"
                        size="small"
                        onClick={() => handleExcute('delete')}
                    />
                </Space>
            </div>
        </div>
    );

    const onRow = (record) => {
        const locationState = {
            pathname: `${match.url}/detail/${record.id}`,
            state: {
                type: record.type,
            },
        };
        return {
            onClick: () => history.push(locationState),
        };
    };

    return (
        <MaterialRegWrap>
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
            <div className="materialReg">
                <CustomTable
                    ref={editTableRef}
                    title={title}
                    rowKey={rowKey}
                    initialColumns={columns}
                    dataSource={dataSource}
                    rowSelection={true}
                    loading={isLoading}
                    pagination={{ ...pagination, total }}
                    onChange={setPagination}
                    onRow={onRow}
                />
            </div>
        </MaterialRegWrap>
    );
};

export default MaterialRegistrationLists;

const MaterialRegWrap = styled.div`
    height: 100%;
    padding: 1rem;
    min-width: 500px;

    .materialReg {
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;

        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
            .title {
                ${({ theme }) => theme.fonts.h7};
            }
        }

        .functionWrap {
            .ant-space-item > a {
                ${(props) => props.theme.fonts.h5};
            }
        }

        .ant-input-affix-wrapper {
            border-bottom: 1px solid lightgray;
            border-radius: 0px;
        }
        .ant-input-affix-wrapper input {
            ${(props) => props.theme.fonts.h5};
        }
    }
`;
