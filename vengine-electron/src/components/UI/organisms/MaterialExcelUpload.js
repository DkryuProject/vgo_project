import React, { Fragment } from 'react';
import styled from 'styled-components';
import { EditTable } from '../molecules';
import { Button, Select, Tooltip } from '../atoms';
import { Space } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';

const MaterialExcelUpload = (props) => {
    const { onMaterialExcelUploadModal, onMaterialInfoGetExcelTemplate } =
        props || {};
    return (
        <MaterialExcelUploadStyle>
            <Space>
                <div onClick={() => onMaterialInfoGetExcelTemplate('fabric')}>
                    Fabric items upload template (Excel)
                </div>
                /
                <div onClick={() => onMaterialInfoGetExcelTemplate('trim')}>
                    Trim items upload template (Excel)
                </div>
                /
                <div
                    onClick={() =>
                        onMaterialInfoGetExcelTemplate('accessories')
                    }
                >
                    Accessory items upload template (Excel)
                </div>
                <Button
                    tooltip={{ title: 'Upload' }}
                    onClick={onMaterialExcelUploadModal}
                >
                    UPLOAD
                </Button>
            </Space>
        </MaterialExcelUploadStyle>
    );
};

const FileUpload = (props) => {
    const {
        materialExcelUploadRowKey,
        materialExcelUploadDataSource,
        materialType,
        onMaterialType,
        uploadProps,
    } = props || {};

    const categoryOption = [
        { id: 'fabric', name: 'FABRIC' },
        { id: 'trim', name: 'TRIM' },
        { id: 'accessories', name: 'ACCESSORIES' },
    ];

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
            title: 'No.',
            dataIndex: 'no',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Supplier Name',
            dataIndex: 'supplier',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },

        {
            title: 'Fabric type',
            dataIndex: 'itemCategory',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Structure',
            dataIndex: 'structure',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Yarn Size(Wrap)',
            dataIndex: 'yarnSizeWrap',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Yarn Size(Weft)',
            dataIndex: 'yarnSizeWeft',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Construction (EPI)',
            dataIndex: 'epi',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Construction (PPI)',
            dataIndex: 'ppi',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },

        {
            title: 'Shrinkage (+)',
            dataIndex: 'shrinkagePlus',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Shrinkage (-)',
            dataIndex: 'shrinkageMinus',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Fabric Contents(1)',
            dataIndex: 'fabricContents1',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Value',
            dataIndex: 'value1',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Fabric Contents(2)',
            dataIndex: 'fabricContents2',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Value',
            dataIndex: 'value2',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Fabric Contents(3)',
            dataIndex: 'fabricContents3',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Value',
            dataIndex: 'value3',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Fabric Contents(4)',
            dataIndex: 'fabricContents4',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Value',
            dataIndex: 'value4',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Material No.',
            dataIndex: 'materialNo',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Buyer Name',
            dataIndex: 'buyer',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Post Processing',
            dataIndex: 'postProcessing',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Dyeing',
            dataIndex: 'dyeing',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Printing',
            dataIndex: 'printing',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'UOM (Supplier)',
            dataIndex: 'originalUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Full Width',
            dataIndex: 'fullWidth',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Full Width (UOM)',
            dataIndex: 'fullWidthUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Cuttable Width',
            dataIndex: 'width',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Cuttable CWidth (UOM)',
            dataIndex: 'widthUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'UOM (Weight)',
            dataIndex: 'weightUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Moq',
            dataIndex: 'moq',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Mcq',
            dataIndex: 'mcq',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
    ];

    const excelListTrimColumns = [
        {
            title: 'No.',
            dataIndex: 'no',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Supplier Name',
            dataIndex: 'supplier',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Category',
            dataIndex: 'itemCategory',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Detail',
            dataIndex: 'itemDetail',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Size',
            dataIndex: 'itemSize',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Size UOM',
            dataIndex: 'itemSizeUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Material No.',
            dataIndex: 'materialNo',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Buyer Name',
            dataIndex: 'buyer',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Post Processing',
            dataIndex: 'postProcessing',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'UOM (Supplier)',
            dataIndex: 'originalUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Full Width',
            dataIndex: 'fullWidth',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Full Width (UOM)',
            dataIndex: 'fullWidthUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Cuttable Width',
            dataIndex: 'width',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Cuttable CWidth (UOM)',
            dataIndex: 'widthUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'UOM (Weight)',
            dataIndex: 'weightUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Moq',
            dataIndex: 'moq',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Mcq',
            dataIndex: 'mcq',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
    ];

    const excelListAccColumns = [
        {
            title: 'No.',
            dataIndex: 'no',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Supplier Name',
            dataIndex: 'supplier',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Type',
            dataIndex: 'itemType',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Category',
            dataIndex: 'itemCategory',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Detail',
            dataIndex: 'itemDetail',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Size',
            dataIndex: 'itemSize',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Item Size UOM',
            dataIndex: 'itemSizeUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Material No.',
            dataIndex: 'materialNo',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Buyer Name',
            dataIndex: 'buyer',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Post Processing',
            dataIndex: 'postProcessing',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'UOM (Supplier)',
            dataIndex: 'originalUom',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Moq',
            dataIndex: 'moq',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Mcq',
            dataIndex: 'mcq',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
    ];

    return (
        <FileUploadStyle>
            <SelectWrap>
                <Select
                    _key="id"
                    _value="id"
                    _text="name"
                    defaultValue={materialType}
                    responseData={categoryOption}
                    onChange={(v) => {
                        return onMaterialType(v);
                    }}
                    isDisabled={materialExcelUploadDataSource?.isLoading}
                    bordered={false}
                />
            </SelectWrap>

            <Dragger
                {...uploadProps}
                disabled={materialExcelUploadDataSource?.isLoading}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Click or drag file to this area to upload
                </p>
            </Dragger>

            <EditTable
                rowKey={materialExcelUploadRowKey}
                title={() => <Fragment>ERROR LIST</Fragment>}
                initialColumns={errorListColumns}
                dataSource={materialExcelUploadDataSource?.errorList}
                pagination={false}
            />

            <EditTable
                rowKey={materialExcelUploadRowKey}
                title={() => <Fragment>EXCEL LIST</Fragment>}
                initialColumns={
                    materialType === 'fabric'
                        ? excelListFabricColumns
                        : materialType === 'trim'
                        ? excelListTrimColumns
                        : excelListAccColumns
                }
                dataSource={materialExcelUploadDataSource?.excelList || []}
                pagination={false}
            />
        </FileUploadStyle>
    );
};

MaterialExcelUpload.FileUpload = FileUpload;

const MaterialExcelUploadStyle = styled.div`
    .ant-space-item > div {
        ${(props) => props.theme.fonts.h5};
        color: #068485;
        cursor: pointer;
    }
`;

const FileUploadStyle = styled.div`
    .ant-table-title {
        ${(props) => props.theme.fonts.h6};
    }
`;

const SelectWrap = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    & > span {
        width: 200px;
    }
`;

export default MaterialExcelUpload;
