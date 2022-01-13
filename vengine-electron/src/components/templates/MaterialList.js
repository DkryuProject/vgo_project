import React, { memo, Fragment } from 'react';
import styled from 'styled-components';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import { Button, Tooltip, Input, Ellipsis, Select } from 'components/UI/atoms';
import { BoxShadow, EditTable, TitleWrap } from 'components/UI/molecules';
import { MaterialExcelUpload } from 'components/UI/organisms';
import dateFormat from 'core/utils/dateUtil';
import { DisconnectOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';

const MaterialList = (props) => {
    const {
        materialListTable,
        materialListRowKey,
        materialListDataSource,
        materialListPagination,
        onMaterialListPagination,
        materialListIsLoading,
        onMaterialListClickRow,
        onMaterialListClickCreate,
        onMaterialListDelete,
        materialType,
        onMaterialExcelUploadModal,
        onMaterialInfoGetExcelTemplate,
    } = props || {};

    const columns = [
        {
            title: 'Item Category',
            dataIndex: 'materialInfo',
            align: 'left',
            ellipsis: true,
            width: '7%',
            render: (data) => {
                const { category } = data || {};
                const output = (
                    <Fragment>
                        {category?.typeA} {category?.typeB && '/'}{' '}
                        {category?.typeB} {category?.typeC && '/'}{' '}
                        {category?.typeC}
                    </Fragment>
                );
                return <Tooltip title={output}>{output}</Tooltip>;
            },
        },
        {
            title: 'Supplier name',
            dataIndex: 'materialInfo',
            align: 'left',
            ellipsis: true,
            width: '7%',
            render: (data) => (
                <Tooltip title={data?.supplier?.name}>
                    {data?.supplier?.name}
                </Tooltip>
            ),
        },
        {
            title: 'Item name',
            dataIndex: 'materialInfo',
            align: 'left',
            ellipsis: true,
            width: '7%',
            render: (data) => (
                <Tooltip title={data?.item_name}>{data?.item_name}</Tooltip>
            ),
        },
        // {
        //     title: 'Material No.',
        //     dataIndex: 'materialOffers',
        //     align: 'left',
        //     ellipsis: true,
        //     width: '7%',
        //     render: (data) => {
        //         const output = (
        //             <Ellipsis>
        //                 {data?.map((v, i) => (
        //                     <span key={v.id}>
        //                         {v?.materialNo || '-'}{' '}
        //                         {/* {data?.length > i + 1 && ','} */}
        //                     </span>
        //                 )) || '-'}
        //             </Ellipsis>
        //         );
        //         return <Tooltip title={output}>{output}</Tooltip>;
        //     },
        // },
        {
            title: 'Material Information',
            dataIndex: 'materialInfo',
            align: 'left',
            ellipsis: true,
            render: (data) => {
                const {
                    type,
                    fabricContents,
                    constructionType,
                    constructionEpi,
                    constructionPpi,
                    yarnSizeWrap,
                    yarnSizeWeft,
                    shrinkagePlus,
                    shrinkageMinus,
                    item_detail,
                } = data || {};
                const output = (
                    <Fragment>
                        {type === 'fabric' ? (
                            <Fragment>
                                <Ellipsis>
                                    * Composition (%):{' '}
                                    {fabricContents?.map((v) => (
                                        <span key={v.id}>
                                            {v?.contents?.name} {v?.rate}%{' '}
                                        </span>
                                    )) || '-'}
                                </Ellipsis>
                                <Ellipsis>
                                    {constructionType || '-'} &{' '}
                                    {yarnSizeWrap || '-'} x{' '}
                                    {yarnSizeWeft || '-'} &{' '}
                                    {constructionEpi || '-'} x{' '}
                                    {constructionPpi || '-'} &{' '}
                                    {shrinkagePlus && '+'}
                                    {shrinkagePlus || '-'}{' '}
                                    {shrinkageMinus || '-'}
                                    {/* {usage_type || '-'} & {sus_eco || '-'} &{' '}
                                {application || '-'} */}
                                </Ellipsis>
                            </Fragment>
                        ) : (
                            <Ellipsis>
                                * Item Detail : {item_detail || '-'}
                            </Ellipsis>
                        )}
                    </Fragment>
                );
                return (
                    <Tooltip
                        title={
                            <Fragment>
                                {type === 'fabric' ? (
                                    <Fragment>
                                        <div>
                                            * Composition (%):{' '}
                                            {fabricContents?.map((v) => (
                                                <span key={v.id}>
                                                    {v?.contents?.name}{' '}
                                                    {v?.rate}%{' '}
                                                </span>
                                            )) || '-'}
                                        </div>
                                        <div>
                                            {constructionType || '-'} &{' '}
                                            {yarnSizeWrap || '-'} x{' '}
                                            {yarnSizeWeft || '-'} &{' '}
                                            {constructionEpi || '-'} x{' '}
                                            {constructionPpi || '-'} &{' '}
                                            {shrinkagePlus && '+'}
                                            {shrinkagePlus || '-'}{' '}
                                            {shrinkageMinus || '-'}
                                            {/* {usage_type || '-'} &{' '}
                                        {sus_eco || '-'} &{' '}
                                        {application || '-'} */}
                                        </div>
                                    </Fragment>
                                ) : (
                                    <div>
                                        * Item Detail : {item_detail || '-'}
                                    </div>
                                )}
                            </Fragment>
                        }
                    >
                        {output}
                    </Tooltip>
                );
            },
        },
        // {
        //     title: 'Content',
        //     dataIndex: 'materialOffers',
        //     align: 'left',
        //     ellipsis: true,
        //     width: '600px',
        //     render: (data) => {
        //         const output = data
        //             // ?.filter((_, i) => i < 3)
        //             ?.slice(0,3)
        //             ?.map((v, i) => {
        //                 return (
        //                     <div
        //                         key={v?.id}
        //                         style={{
        //                             marginTop: i ? '1rem' : '0',
        //                             paddingTop: i ? '.4rem' : '0',
        //                             borderTop: i ? '1px solid #000' : '0',
        //                         }}
        //                     >
        //                         <Row
        //                             style={{ borderBottom: '1px dotted #000' }}
        //                         >
        //                             <Col span={4}>* Material No.:</Col>
        //                             <Col span={8}>{v?.materialNo || '-'}</Col>
        //                             <Col span={4}>* Buying Company.:</Col>
        //                             <Col span={8}>
        //                                 {v?.recipient?.name || '-'}
        //                             </Col>
        //                         </Row>
        //                         <Row style={{ borderBottom: '1px dotted #000' }}>

        //                         </Row>

        //                         <Row
        //                             style={{ borderBottom: '1px dotted #000' }}
        //                         >
        //                             <Col span={8}>* Width/Weight:</Col>
        //                             <Col span={16}>
        //                                 {v?.itemOption?.cw || '-'}
        //                                 {v?.itemOption?.cwUom?.name3 ||
        //                                     '-'} /{' '}
        //                                 {v?.itemOption?.weight || '-'}
        //                                 {v?.itemOption?.weightUom?.name3 || '-'}
        //                             </Col>
        //                         </Row>
        //                         <Row
        //                             style={{ borderBottom: '1px dotted #000' }}
        //                         >
        //                             <Col span={8}>* Dyeing:</Col>
        //                             <Col span={16}>
        //                                 {v?.itemOption?.dyeing || '-'}
        //                             </Col>
        //                         </Row>
        //                         <Row
        //                             style={{ borderBottom: '1px dotted #000' }}
        //                         >
        //                             <Col span={8}>* Post Processing:</Col>
        //                             <Col span={16}>
        //                                 {v?.itemOption?.finishing || '-'}
        //                             </Col>
        //                         </Row>
        //                         <Row
        //                             style={{ borderBottom: '1px dotted #000' }}
        //                         >
        //                             <Col span={8}>* Printing:</Col>
        //                             <Col span={16}>
        //                                 {v?.itemOption?.printing || '-'}
        //                             </Col>
        //                         </Row>
        //                         <Row
        //                             style={{ borderBottom: '1px dotted #000' }}
        //                         >
        //                             <Col span={4}>* Currency:</Col>
        //                             <Col span={8}>
        //                                 {v?.currency?.name2 || '-'}
        //                             </Col>
        //                             <Col span={4}>* Unit Price:</Col>
        //                             <Col span={8}>
        //                                 {v?.currency?.name3 || '-'}{' '}
        //                                 {formatNumberUtil(
        //                                     v?.currency?.unitPrice
        //                                 ) || '-'}
        //                             </Col>
        //                         </Row>
        //                         <Row
        //                             style={{ borderBottom: '1px dotted #000' }}
        //                         >
        //                             <Col span={8}>* UOM:</Col>
        //                             <Col span={16}>{v?.uom?.name3 || '-'}</Col>
        //                         </Row>
        //                         <Row
        //                             style={{ borderBottom: '1px dotted #000' }}
        //                         >
        //                             <Col span={8}>* MCQ/MOQ:</Col>
        //                             <Col span={16}>
        //                                 {v?.uom?.name3 || '-'} {v?.mcq || '-'}{' '}
        //                                 {v?.moq || '-'}{' '}
        //                             </Col>
        //                         </Row>
        //                         <Row
        //                             style={{ borderBottom: '1px dotted #000' }}
        //                         >
        //                             <Col span={8}>* Lead Time:</Col>
        //                             <Col span={16}>{v?.lead_time || '-'}</Col>
        //                         </Row>
        //                     </div>
        //                 );
        //             });

        //         return output;
        //     },
        // },
        {
            title: 'Content',
            dataIndex: 'materialOffers',
            align: 'left',
            ellipsis: true,
            width: '900px',
            render: (data, record) => {
                const { materialInfo } = record || {};
                const { type } = materialInfo || {};
                const output = data?.slice(0, 3)?.map((v, i) => {
                    return (
                        <div
                            key={v?.id}
                            style={{
                                marginTop: i ? '1rem' : '0',
                                paddingTop: i ? '.4rem' : '0',
                                // borderTop: i ? '1px solid #000' : '0',
                            }}
                        >
                            <Row
                            // style={{ borderBottom: '1px dotted #000' }}
                            >
                                <Col span={4}>* Material No.:</Col>
                                <Col span={8}>
                                    <Ellipsis>{v?.materialNo || '-'}</Ellipsis>
                                </Col>
                                <Col span={4}>* Buying Company.:</Col>
                                <Col span={8}>{v?.recipient?.name || '-'}</Col>
                            </Row>
                            <Row
                            // style={{ borderBottom: '1px dotted #000' }}
                            >
                                <Col span={6}>
                                    {type !== 'accessories' ? (
                                        <Row gutter={10}>
                                            <Col span={12}>
                                                * FW / CW / Weight:{' '}
                                            </Col>
                                            <Col span={12}>
                                                <Ellipsis>
                                                    {v?.fabricFullWidth || '-'}
                                                    {v?.fullWidthUom?.name3 ||
                                                        '-'}{' '}
                                                    / {v?.itemOption?.cw || '-'}
                                                    {v?.itemOption?.cwUom
                                                        ?.name3 || '-'}{' '}
                                                    /{' '}
                                                    {v?.itemOption?.weight ||
                                                        '-'}
                                                    {v?.itemOption?.weightUom
                                                        ?.name3 || '-'}
                                                </Ellipsis>
                                            </Col>
                                            <Col span={12}>
                                                * Post Processing:{' '}
                                            </Col>
                                            <Col span={12}>
                                                <Ellipsis>
                                                    {v?.itemOption?.finishing ||
                                                        '-'}
                                                </Ellipsis>
                                            </Col>
                                            {type === 'fabric' && (
                                                <Fragment>
                                                    <Col span={12}>
                                                        * Dyeing:{' '}
                                                    </Col>
                                                    <Col span={12}>
                                                        <Ellipsis>
                                                            {v?.itemOption
                                                                ?.dyeing || '-'}
                                                        </Ellipsis>
                                                    </Col>
                                                    <Col span={12}>
                                                        * Printing:{' '}
                                                    </Col>
                                                    <Col span={12}>
                                                        <Ellipsis>
                                                            {v?.itemOption
                                                                ?.printing ||
                                                                '-'}
                                                        </Ellipsis>
                                                    </Col>
                                                </Fragment>
                                            )}
                                        </Row>
                                    ) : (
                                        <Row gutter={10}>
                                            <Col span={12}>* Size: </Col>
                                            <Col span={12}>
                                                <Ellipsis>
                                                    {v?.itemSizeOption?.size ||
                                                        '-'}
                                                    {v?.itemSizeOption?.sizeUom
                                                        ?.name3 || '-'}
                                                </Ellipsis>
                                            </Col>
                                        </Row>
                                    )}
                                </Col>
                                <Col span={6}>
                                    <Row gutter={10}>
                                        <Col span={12}>* Currency: </Col>
                                        <Col span={12}>
                                            <Ellipsis>
                                                {v?.currency?.name2 || '-'}
                                            </Ellipsis>
                                        </Col>
                                        <Col span={12}>* Unit Price: </Col>
                                        <Col span={12}>
                                            <Ellipsis>
                                                {formatNumberUtil(
                                                    v?.unitPrice
                                                ) || '-'}
                                            </Ellipsis>
                                        </Col>
                                        <Col span={12}>* UOM: </Col>
                                        <Col span={12}>
                                            <Ellipsis>
                                                {v?.uom?.name3 || '-'}
                                            </Ellipsis>
                                        </Col>
                                    </Row>
                                </Col>
                                {type === 'fabric' && (
                                    <Col span={6}>
                                        <Row gutter={10}>
                                            <Col span={12}>
                                                * Characteristic:{' '}
                                            </Col>
                                            <Col span={12}>
                                                <Ellipsis>
                                                    {v?.characteristic || '-'}
                                                </Ellipsis>
                                            </Col>
                                            <Col span={12}>* Pattern: </Col>
                                            <Col span={12}>
                                                <Ellipsis>
                                                    {v?.solid_pattern || '-'}
                                                </Ellipsis>
                                            </Col>
                                            <Col span={12}>* Performance: </Col>
                                            <Col span={12}>
                                                <Ellipsis>
                                                    {v?.performance || '-'}
                                                </Ellipsis>
                                            </Col>
                                            <Col span={12}>* Stretch: </Col>
                                            <Col span={12}>
                                                <Ellipsis>
                                                    {v?.stretch || '-'}
                                                </Ellipsis>
                                            </Col>
                                            <Col span={12}>* Function: </Col>
                                            <Col span={12}>
                                                <Ellipsis>
                                                    {v?.function || '-'}
                                                </Ellipsis>
                                            </Col>
                                        </Row>
                                    </Col>
                                )}

                                <Col span={6}>
                                    <Row gutter={10}>
                                        <Col span={12}>* MCQ: </Col>
                                        <Col span={12}>
                                            <Ellipsis>
                                                {formatNumberUtil(v?.mcq) ||
                                                    '-'}
                                            </Ellipsis>
                                        </Col>
                                        <Col span={12}>* MOQ: </Col>
                                        <Col span={12}>
                                            <Ellipsis>
                                                {formatNumberUtil(v?.moq) ||
                                                    '-'}
                                            </Ellipsis>
                                        </Col>
                                        <Col span={12}>* Lead Time: </Col>
                                        <Col span={12}>
                                            <Ellipsis>
                                                {v?.lead_time || '-'}
                                            </Ellipsis>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            {/* <Row
                                style={{ borderBottom: '1px dotted #000' }}
                            >
                                <Col span={8}>* Width/Weight:</Col>
                                <Col span={16}>
                                    {v?.itemOption?.cw || '-'}
                                    {v?.itemOption?.cwUom?.name3 ||
                                        '-'} /{' '}
                                    {v?.itemOption?.weight || '-'}
                                    {v?.itemOption?.weightUom?.name3 || '-'}
                                </Col>
                            </Row>
                            <Row
                                style={{ borderBottom: '1px dotted #000' }}
                            >
                                <Col span={8}>* Dyeing:</Col>
                                <Col span={16}>
                                    {v?.itemOption?.dyeing || '-'}
                                </Col>
                            </Row>
                            <Row
                                style={{ borderBottom: '1px dotted #000' }}
                            >
                                <Col span={8}>* Post Processing:</Col>
                                <Col span={16}>
                                    {v?.itemOption?.finishing || '-'}
                                </Col>
                            </Row>
                            <Row
                                style={{ borderBottom: '1px dotted #000' }}
                            >
                                <Col span={8}>* Printing:</Col>
                                <Col span={16}>
                                    {v?.itemOption?.printing || '-'}
                                </Col>
                            </Row>
                            <Row
                                style={{ borderBottom: '1px dotted #000' }}
                            >
                                <Col span={4}>* Currency:</Col>
                                <Col span={8}>
                                    {v?.currency?.name2 || '-'}
                                </Col>
                                <Col span={4}>* Unit Price:</Col>
                                <Col span={8}>
                                    {v?.currency?.name3 || '-'}{' '}
                                    {formatNumberUtil(
                                        v?.currency?.unitPrice
                                    ) || '-'}
                                </Col>
                            </Row>
                            <Row
                                style={{ borderBottom: '1px dotted #000' }}
                            >
                                <Col span={8}>* UOM:</Col>
                                <Col span={16}>{v?.uom?.name3 || '-'}</Col>
                            </Row>
                            <Row
                                style={{ borderBottom: '1px dotted #000' }}
                            >
                                <Col span={8}>* MCQ/MOQ:</Col>
                                <Col span={16}>
                                    {v?.uom?.name3 || '-'} {v?.mcq || '-'}{' '}
                                    {v?.moq || '-'}{' '}
                                </Col>
                            </Row>
                            <Row
                                style={{ borderBottom: '1px dotted #000' }}
                            >
                                <Col span={8}>* Lead Time:</Col>
                                <Col span={16}>{v?.lead_time || '-'}</Col>
                            </Row> */}
                        </div>
                    );
                });

                return output;
            },
        },
        {
            title: 'Modified',
            dataIndex: 'materialInfo',
            align: 'left',
            ellipsis: true,
            width: '13%',
            render: (data) => {
                const output = (
                    <Fragment>
                        <Ellipsis>
                            * Modified Date/Time: {dateFormat(data?.updated)}
                        </Ellipsis>
                        <Ellipsis>
                            * Modified By: {data?.createdBy?.userName}
                        </Ellipsis>
                    </Fragment>
                );

                return (
                    <Tooltip
                        title={
                            <Fragment>
                                <div>
                                    * Modified Date/Time:{' '}
                                    {dateFormat(data?.updated)}
                                </div>
                                <div>
                                    * Modified By: {data?.createdBy?.userName}
                                </div>
                            </Fragment>
                        }
                    >
                        {output}
                    </Tooltip>
                );
            },
        },

        {
            title: 'Linked',
            dataIndex: 'materialInfo',
            align: 'left',
            ellipsis: true,
            width: '3%',
            render: (data) => {
                return (
                    <Tooltip
                        title={
                            data?.useYN?.toLowerCase() === 'y' && 'connected'
                        }
                    >
                        {data?.useYN?.toLowerCase() === 'y' && (
                            <DisconnectOutlined />
                        )}
                    </Tooltip>
                );
            },
        },
    ];

    const title = () => (
        <TitleWrap>
            <TitleWrap.Title suffix>MATERIAL LIST</TitleWrap.Title>
            <TitleWrap.Function>
                <MaterialExcelUpload
                    materialType={materialType}
                    onMaterialExcelUploadModal={onMaterialExcelUploadModal}
                    onMaterialInfoGetExcelTemplate={
                        onMaterialInfoGetExcelTemplate
                    }
                />
                <Select
                    _key="id"
                    _value="id"
                    _text="value"
                    placeholder="Select Type"
                    responseData={[
                        { id: 'fabric', value: 'Fabric' },
                        { id: 'trim', value: 'Trim' },
                        { id: 'accessories', value: 'Accessories' },
                    ]}
                    onChange={(id) =>
                        onMaterialListPagination((materialListPagination) => ({
                            ...materialListPagination,
                            type: id,
                        }))
                    }
                    bordered={false}
                />

                <Input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => {
                        e.persist();
                        return onMaterialListPagination(
                            (materialListPagination) => ({
                                ...materialListPagination,
                                current: 1,
                                searchKeyword: e.target?.value,
                            })
                        );
                    }}
                    bordered={false}
                />
                <Button
                    mode="write"
                    tooltip={{ title: 'Create' }}
                    onClick={onMaterialListClickCreate}
                />
                <Button
                    mode="remove"
                    tooltip={{ title: 'Delete selected item ' }}
                    onClick={onMaterialListDelete}
                />
            </TitleWrap.Function>
        </TitleWrap>
    );

    const onRow = (record) => {
        const { type, id } = record?.materialInfo;

        return {
            onClick: () => onMaterialListClickRow(type, id),
        };
    };

    const expandable = {
        expandedRowRender: (v) => (
            <Row>
                <Col span={5}>
                    -Usage Type: {v?.materialInfo?.usage_type || '-'}
                </Col>
                <Col span={5}>
                    -Application: {v?.materialInfo?.application || '-'}
                </Col>
                <Col span={5}>-Sus/Eco: {v?.materialInfo?.sus_eco || '-'}</Col>
            </Row>
        ),
        rowExpandable: (v) => v?.materialInfo?.type === 'fabric',
    };

    return (
        <MaterialListStyle>
            <BoxShadow>
                <EditTable
                    ref={materialListTable}
                    rowKey={materialListRowKey}
                    title={title}
                    initialColumns={columns}
                    dataSource={materialListDataSource}
                    loading={materialListIsLoading}
                    pagination={materialListPagination}
                    onChange={onMaterialListPagination}
                    onRow={onRow}
                    expandable={expandable}
                    rowSelection={true}
                />
            </BoxShadow>
        </MaterialListStyle>
    );
};

const MaterialListStyle = styled.div`
    padding: 1rem;
`;

export default memo(MaterialList);
