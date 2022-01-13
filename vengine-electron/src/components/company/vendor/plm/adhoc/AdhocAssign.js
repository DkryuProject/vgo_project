import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
    useContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import { materialInfoGetPagesAsyncAction } from 'store/material/info/reducer';
import styled from 'styled-components';
import { MaterialFilter } from 'components/common/filter';

import CustomTable from 'components/common/CustomTable';
import { Space, Form as AntForm } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import { Ellipsis } from 'components/UI/atoms';
import {
    MaterialOfferedPrice,
    MaterialOfferedPriceTable,
} from 'components/UI/organisms';
import { materialOfferPostApi } from 'core/api/material/offer';
import { useMutation } from 'react-query';
import { DrawerContext } from 'components/context/drawerContext';
import { Fragment } from 'react';

const AdhocAssign = (props) => {
    const {
        // match,
        initialShow,
        // onShow,
        onLeftSplit,
        adhocAssign,
        onAdhocAssign,
        onMaterialItems,
    } = props;
    const rowKey = 'id';
    const [handleNotification] = useNotification();
    const editTableRef = useRef();
    const materialOfferTableRef = useRef();
    const dispatch = useDispatch();
    const { openDrawer, closeDrawer } = useContext(DrawerContext);
    const [materialOfferForm] = AntForm.useForm();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        searchKeyword: '',
    });
    const [total, setTotal] = useState(0);

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

    const materialInfoPostFilter = useSelector(
        (state) => state.materialInfoReducer.postFilter
    );

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const handleAssign = useCallback(() => {
        // Material key
        const { selectedRowKeys, selectedRows } = editTableRef.current;
        const type = selectedRows?.[0]?.materialInfo?.type;
        const category = selectedRows?.[0]?.materialInfo?.category;
        // Material offer key
        const selectedOfferRowKeys =
            materialOfferTableRef.current?.selectedRowKeys || [];

        if (
            selectedRowKeys.length === 0 ||
            !selectedRows.reduce((acc, cur) => {
                acc = cur.materialOffers.find(
                    (v) => v.id === Number(selectedOfferRowKeys)
                );
                return acc?.id;
            }, undefined)
        ) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: 'Please select only one item.',
            });
        }

        const data = {
            item: selectedRows?.reduce((acc, cur) => {
                acc.push({
                    ...cur,
                    materialOffers: cur?.materialOffers?.filter(
                        (v) => v.id === Number(selectedOfferRowKeys)
                    ),
                });
                return acc;
            }, []),
            categoryID: category.id,
            materialInfoID: Number(selectedRowKeys),
            materialOfferID: selectedRows.reduce((acc, cur) => {
                acc = cur.materialOffers.find(
                    (v) => v.id === Number(selectedOfferRowKeys)
                );
                return acc?.id;
            }, undefined),
            type: type,
            unitPrice: selectedRows.reduce((acc, cur) => {
                acc = cur.materialOffers.find(
                    (v) => v.id === Number(selectedOfferRowKeys)
                );
                return acc?.unitPrice;
            }, undefined),
        };

        // 여기
        // 화면을 초가화 해야함

        onAdhocAssign({ status: false });
        onMaterialItems(data);
    }, [
        editTableRef,
        materialOfferTableRef,
        // materialSubsidiaryTableRef,
        // adhocAssign,
        onAdhocAssign,
        onMaterialItems,
        handleNotification,
    ]);

    const { mutate: materialOfferPostMutate } = useMutation(
        (payload) => materialOfferPostApi(payload),
        {
            onSuccess: () => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Material Offered price creation success',
                });
                closeDrawer('materialOfferPrice');

                return handleMaterialInfoGetPages({ ...pagination });
            },
        }
    );

    // Detail Offer Function
    const handleMaterialOfferSubmit = useCallback(
        (values) => {
            // recipientId ALL 처리
            if (values['recipientId'] < 0) {
                values['recipientId'] = null;
            }
            return materialOfferPostMutate({
                id: values['materialId'],
                data: values,
            });
        },
        [materialOfferPostMutate]
    );

    // 조회
    useEffect(() => {
        if (!materialInfoPostFilter.data) {
            handleMaterialInfoGetPages({ ...pagination });
        }
        return () => {
            handleMaterialInfoGetPagesInit();
        };
    }, [
        adhocAssign,
        pagination,
        materialInfoPostFilter,
        handleMaterialInfoGetPages,
        handleMaterialInfoGetPagesInit,
    ]);

    useEffect(() => {
        setIsLoading(materialInfoGetPages.isLoading);
        if (materialInfoGetPages.data) {
            const { content, totalElements } = materialInfoGetPages.data.page;
            setDataSource(
                content?.map((v) => ({ ...v, id: v?.materialInfo?.id }))
            );
            setTotal(totalElements);
        }
        if (materialInfoPostFilter.data) {
            setDataSource(
                materialInfoPostFilter.data.list
                    // ?.filter((v) => v?.materialInfo?.type === type)
                    .map((v) => ({ ...v, id: v?.materialInfo?.id }))
            );
        }
    }, [materialInfoGetPages, materialInfoPostFilter]);

    // 테이블
    // const columns = [
    //     {
    //         title: 'Supplier',
    //         dataIndex: 'materialInfo',
    //         align: 'left',
    //         render: (data) => {
    //             const { supplier } = data || {};
    //             return (
    //                 <Tooltip title={supplier?.name}>
    //                     {supplier?.name || '-'}
    //                 </Tooltip>
    //             );
    //         },
    //     },
    //     {
    //         title: 'Item name and Number',
    //         dataIndex: 'materialInfo',
    //         align: 'left',
    //         render: (data, record) => {
    //             const { category, name } = data || {};
    //             const { materialOffers } = record || [];
    //             const outputTooltip = (
    //                 <div>
    //                     <div>* Category : {category?.name || '-'}</div>
    //                     <div>* Item name : {name || '-'}</div>
    //                     <div>
    //                         * Material No. :{' '}
    //                         {materialOffers?.map((v, i) => (
    //                             <span key={v.id}>
    //                                 {v?.materialNo || '-'}
    //                                 {data?.length > i + 1 && ','}
    //                             </span>
    //                         )) || '-'}
    //                     </div>
    //                 </div>
    //             );
    //             const value = (
    //                 <div>
    //                     <Ellipsis>
    //                         * Category : {category?.name || '-'}
    //                     </Ellipsis>
    //                     <Ellipsis>* Item name : {name || '-'}</Ellipsis>
    //                     <Ellipsis>
    //                         * Material No. :{' '}
    //                         {materialOffers?.map((v, i) => (
    //                             <span key={v.id}>
    //                                 {v?.materialNo || '-'}
    //                                 {data?.length > i + 1 && ','}
    //                             </span>
    //                         )) || '-'}
    //                     </Ellipsis>
    //                 </div>
    //             );
    //             return <Tooltip title={outputTooltip}>{value}</Tooltip>;
    //         },
    //     },
    //     {
    //         title: 'Item Detail Information',
    //         dataIndex: 'materialInfo',
    //         align: 'left',
    //         render: (data, record) => {
    //             const {
    //                 type,
    //                 fabricContents,
    //                 constructionType,
    //                 constructionEpi,
    //                 constructionPpi,
    //                 shrinkagePlus,
    //                 shrinkageMinus,
    //                 yarnSizeWrap,
    //                 yarnSizeWeft,
    //                 subsidiaryDetail,
    //             } = data || {};
    //             const outputTooltip = (
    //                 <div>
    //                     {type === 'fabric' ? (
    //                         <>
    //                             <div>
    //                                 * Contents :{' '}
    //                                 {fabricContents?.map((v) => (
    //                                     <span key={v.id}>
    //                                         {v.contents.name} {v.rate}%{' '}
    //                                     </span>
    //                                 ))}
    //                             </div>
    //                             <div>
    //                                 * Construction: {constructionType || '-'}{' '}
    //                                 {constructionEpi || '-'}{' '}
    //                                 {constructionPpi || '-'}{' '}
    //                                 {yarnSizeWrap || '-'}{' '}
    //                                 {yarnSizeWeft || '-'}{' '}
    //                                 {shrinkagePlus && '+'}
    //                                 {shrinkagePlus || '-'}{' '}
    //                                 {shrinkageMinus && '-'}
    //                                 {shrinkageMinus || '-'}
    //                             </div>
    //                         </>
    //                     ) : (
    //                         <div>
    //                             * Item Detail : {subsidiaryDetail || '-'}
    //                         </div>
    //                     )}
    //                 </div>
    //             );
    //             const output = (
    //                 <div>
    //                     {type === 'fabric' ? (
    //                         <>
    //                             <Ellipsis>
    //                                 * Contents :{' '}
    //                                 {fabricContents?.map((v) => (
    //                                     <span key={v.id}>
    //                                         {v.contents.name} {v.rate}%{' '}
    //                                     </span>
    //                                 ))}
    //                             </Ellipsis>
    //                             <Ellipsis>
    //                                 * Construction: {constructionType || '-'}{' '}
    //                                 {constructionEpi || '-'}{' '}
    //                                 {constructionPpi || '-'}{' '}
    //                                 {yarnSizeWrap || '-'}{' '}
    //                                 {yarnSizeWeft || '-'}{' '}
    //                                 {shrinkagePlus && '+'}
    //                                 {shrinkagePlus || '-'}{' '}
    //                                 {shrinkageMinus && '-'}
    //                                 {shrinkageMinus || '-'}
    //                             </Ellipsis>
    //                         </>
    //                     ) : (
    //                         <Ellipsis>
    //                             * Item Detail : {subsidiaryDetail || '-'}
    //                         </Ellipsis>
    //                     )}
    //                 </div>
    //             );
    //             return <Tooltip title={outputTooltip}>{output}</Tooltip>;
    //         },
    //     },
    // ];

    const columns = useMemo(
        () => [
            {
                title: 'Supplier',
                dataIndex: 'materialInfo',
                align: 'left',
                render: (data) => {
                    const { supplier } = data || {};

                    return (
                        <Tooltip title={supplier?.name}>
                            {supplier?.name || '-'}
                        </Tooltip>
                    );
                },
            },

            {
                title: 'Item name and Number',
                dataIndex: 'materialInfo',
                align: 'left',
                render: (data) => {
                    const { type, category, item_name } = data || {};

                    const output = (
                        <Fragment>
                            <Ellipsis>
                                * Item Category: {category?.typeA}{' '}
                                {category?.typeB && '/'} {category?.typeB}{' '}
                                {category?.typeC && '/'} {category?.typeC}
                            </Ellipsis>
                            <Ellipsis>
                                *{' '}
                                {type === 'fabric'
                                    ? 'Fabric name'
                                    : 'Item name'}
                                : {item_name || '-'}
                            </Ellipsis>
                        </Fragment>
                    );

                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    <div>
                                        * Item Category: {category?.typeA}{' '}
                                        {category?.typeB && '/'}{' '}
                                        {category?.typeB}{' '}
                                        {category?.typeC && '/'}{' '}
                                        {category?.typeC}
                                    </div>
                                    <div>
                                        *{' '}
                                        {type === 'fabric'
                                            ? 'Fabric name'
                                            : 'Item name'}
                                        : {item_name || '-'}
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
                title: 'Item Detail Information',
                dataIndex: 'materialInfo',
                align: 'left',
                render: (data) => {
                    const {
                        type,
                        fabricContents,
                        constructionType,
                        constructionEpi,
                        constructionPpi,
                        shrinkagePlus,
                        shrinkageMinus,
                        yarnSizeWrap,
                        yarnSizeWeft,
                        item_detail,
                        usage_type,
                        sus_eco,
                        application,
                    } = data || {};

                    const output = (
                        <Fragment>
                            {type === 'fabric' ? (
                                <>
                                    <Ellipsis>
                                        * Composition (%):{' '}
                                        {fabricContents?.map((v) => (
                                            <span key={v.id}>
                                                {v.contents.name} {v.rate}%{' '}
                                            </span>
                                        ))}
                                    </Ellipsis>
                                    <Ellipsis>
                                        * Usage Type: {usage_type || '-'}
                                    </Ellipsis>
                                    <Ellipsis>
                                        * Sus/Eco: {sus_eco || '-'}
                                    </Ellipsis>
                                    <Ellipsis>
                                        * Application: {application || '-'}
                                    </Ellipsis>
                                    <Ellipsis>
                                        * Construction:{' '}
                                        {constructionType || '-'}{' '}
                                        {constructionEpi || '-'}{' '}
                                        {constructionPpi || '-'}{' '}
                                        {yarnSizeWrap || '-'}{' '}
                                        {yarnSizeWeft || '-'}{' '}
                                        {shrinkagePlus && '+'}
                                        {shrinkagePlus || '-'}{' '}
                                        {/* {shrinkageMinus && '-'} */}
                                        {shrinkageMinus || '-'}
                                    </Ellipsis>
                                </>
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
                                        <>
                                            <div>
                                                * Composition (%):{' '}
                                                {fabricContents?.map((v) => (
                                                    <span key={v.id}>
                                                        {v.contents.name}{' '}
                                                        {v.rate}%{' '}
                                                    </span>
                                                ))}
                                            </div>
                                            <div>
                                                * Usage Type:{' '}
                                                {usage_type || '-'}
                                            </div>
                                            <div>
                                                * Sus/Eco: {sus_eco || '-'}
                                            </div>
                                            <div>
                                                * Application:{' '}
                                                {application || '-'}
                                            </div>
                                            <div>
                                                * Construction:{' '}
                                                {constructionType || '-'}{' '}
                                                {constructionEpi || '-'}{' '}
                                                {constructionPpi || '-'}{' '}
                                                {yarnSizeWrap || '-'}{' '}
                                                {yarnSizeWeft || '-'}{' '}
                                                {shrinkagePlus && '+'}
                                                {shrinkagePlus || '-'}{' '}
                                                {/* {shrinkageMinus && '-'} */}
                                                {shrinkageMinus || '-'}
                                            </div>
                                        </>
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
        ],
        []
    );

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space
                    style={{
                        fontSize: '0.6875rem',
                        color: '#000000',
                        fontWeight: 'bold',
                    }}
                >
                    <CaretRightOutlined />
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: ' Assign',
                            arrowPointAtCenter: true,
                        }}
                        size="small"
                        onClick={handleAssign}
                    >
                        Assign
                    </TableButton>

                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: ' Create',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() =>
                            onAdhocAssign({
                                type: 'write',
                                status: true,
                            })
                        }
                    />
                </Space>
            </div>
        </div>
    );

    const expandable = {
        expandedRowRender: (record) => {
            const { id, materialInfo, materialOffers } = record;
            const { supplier } = materialInfo || {};
            const isDisabled =
                supplier?.id !== userGetEmail.data?.data.company.companyID;
            return (
                <MaterialOfferedPriceTable
                    materialOfferTable={materialOfferTableRef}
                    materialOfferRowKey="id"
                    materialOfferDataSource={materialOffers}
                    rowSelectionType="radio"
                    onMaterialOfferOpenDrawer={() => {
                        openDrawer(
                            'materialOfferPrice',
                            <MaterialOfferedPrice
                                initialValues={{
                                    recipientId: isDisabled
                                        ? userGetEmail.data?.data.company
                                              .companyID
                                        : undefined,
                                    cwUomId: 31,
                                    fullWidthUomId: 31,
                                }}
                                isDisabled={isDisabled}
                                type={materialInfo?.type}
                                materialOfferForm={materialOfferForm}
                                onMaterialOfferSubmit={(values) =>
                                    handleMaterialOfferSubmit({
                                        ...values,
                                        materialId: id,
                                    })
                                }
                                onMaterialOfferCloseDrawer={() =>
                                    closeDrawer('materialOfferPrice')
                                }
                            />
                        );
                    }}
                />
            );
        },
    };

    return (
        <AdhocAssignOutterWrap>
            <div id="adhocAssignWrap">
                <MaterialFilter
                    // type={type}
                    initialShow={initialShow}
                    onShow={() => onAdhocAssign({ status: false })}
                    onLeftSplit={onLeftSplit}
                />
                <div style={{ padding: '0.5rem' }} />
                <div
                    style={{
                        padding: '0.5rem',
                        border: '1px solid lightgray',
                        borderRadius: '3px',
                        boxShadow: '3px 3px gray',
                    }}
                >
                    <CustomTable
                        ref={editTableRef}
                        title={() => title()}
                        rowKey={rowKey}
                        initialColumns={columns}
                        dataSource={dataSource}
                        rowSelection={true}
                        rowSelectionType="radio"
                        loading={isLoading}
                        pagination={{ ...pagination, total }}
                        onChange={setPagination}
                        expandable={expandable}
                        // onExpand={(expanded, record) => {
                        //     if (expanded) {
                        //         if (!selectedRowKeys.includes(record.id)) {
                        //             setSelectedRowKeys((selectedRowKeys) => [
                        //                 ...selectedRowKeys,
                        //                 record.id,
                        //             ]);
                        //         }
                        //     } else {
                        //         setSelectedRowKeys((selectedRowKeys) =>
                        //             selectedRowKeys.filter((v) => v !== record.id)
                        //         );
                        //     }
                        // }}
                    />
                </div>
            </div>
        </AdhocAssignOutterWrap>
    );
};

const AdhocAssignOutterWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #adhocAssignWrap {
        min-width: 800px;
    }

    .ant-table.ant-table-small
        .ant-table-tbody
        .ant-table-wrapper:only-child
        .ant-table {
        margin: 0;
    }
`;

export default AdhocAssign;
