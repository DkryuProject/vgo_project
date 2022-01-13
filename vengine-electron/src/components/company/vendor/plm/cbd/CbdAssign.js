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
import {
    cbdInfoPostAssignAsyncAction,
    cbdInfoGetListsAsyncAction,
} from 'store/cbd/info/reducer';
import styled from 'styled-components';
import { MaterialFilter } from 'components/common/filter';

import CustomTable from 'components/common/CustomTable';
import { Space, Row, Form as AntForm } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import { Ellipsis } from 'components/UI/atoms';
import {
    MaterialOfferedPrice,
    MaterialOfferedPriceTable,
} from 'components/UI/organisms';
import { useMutation } from 'react-query';
import { materialOfferPostApi } from 'core/api/material/offer';
import { DrawerContext } from 'components/context/drawerContext';
import { Fragment } from 'react';

const CbdAssign = (props) => {
    const { match, type, initialShow, onShow, onLeftSplit } = props;
    const { cbdId } = match.params || '';
    const { openDrawer, closeDrawer } = useContext(DrawerContext);
    const [materialOfferForm] = AntForm.useForm();
    const [handleNotification] = useNotification();
    const rowKey = 'id';
    const editTableRef = useRef();
    const materialOfferTableRef = useRef();
    const dispatch = useDispatch();
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

    const cbdInfoPostAssign = useSelector(
        (state) => state.cbdInfoReducer.postAssign
    );
    const handleCbdInfoPostAssign = useCallback(
        (payload) => dispatch(cbdInfoPostAssignAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdInfoPostAssignInit = useCallback(
        () => dispatch(cbdInfoPostAssignAsyncAction.initial()),
        [dispatch]
    );

    const handleCbdInfoGetLists = useCallback(
        (payload) => dispatch(cbdInfoGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const materialInfoPostFilter = useSelector(
        (state) => state.materialInfoReducer.postFilter
    );

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const handleAssign = useCallback(() => {
        // Material key
        const { selectedRowKeys, selectedRows } = editTableRef.current;
        // Material offer key
        const selectedOfferRowKeys = materialOfferTableRef.current
            ? materialOfferTableRef.current?.selectedRowKeys
            : [];

        if (
            selectedRowKeys.length === 0 ||
            !selectedRows.reduce((acc, cur) => {
                acc = cur.materialOffers?.find(
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

        return handleCbdInfoPostAssign({
            cbdOptionID: Number(cbdId),
            materialOfferID: selectedRows.reduce((acc, cur) => {
                acc = cur.materialOffers?.find(
                    (v) => v.id === Number(selectedOfferRowKeys)
                );
                return acc?.id;
            }, undefined),
        });
    }, [
        cbdId,
        editTableRef,
        materialOfferTableRef,
        handleCbdInfoPostAssign,
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

                return handleMaterialInfoGetPages({ ...pagination, type });
            },
        }
    );

    // Detail Offer Function
    const handleMaterialOfferSubmit = (values) => {
        // recipientId ALL 처리
        if (values['recipientId'] < 0) {
            values['recipientId'] = null;
        }
        return materialOfferPostMutate({
            id: values['materialId'],
            data: values,
        });
    };

    // 조회
    useEffect(() => {
        if (!materialInfoPostFilter.data) {
            handleMaterialInfoGetPages({ ...pagination, type });
        }
        return () => {
            handleMaterialInfoGetPagesInit();
        };
    }, [
        pagination,
        type,
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
                    ?.filter((v) => v?.materialInfo?.type === type)
                    .map((v) => ({ ...v, id: v?.materialInfo?.id }))
            );
        }
    }, [materialInfoGetPages, materialInfoPostFilter, type]);

    // Assign 결과
    useEffect(() => {
        if (cbdInfoPostAssign.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: cbdInfoPostAssign.error.message,
            });
        } else if (cbdInfoPostAssign.data) {
            onLeftSplit();
            onShow({
                ...initialShow,
                [type]: false,
            });
            handleCbdInfoGetLists({ type: type, id: cbdId });
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'CBD Option assign Success',
            });
        }
        // return () => handleCbdInfoPostAssignInit();
    }, [
        cbdInfoPostAssign,
        type,
        cbdId,
        initialShow,
        onShow,
        onLeftSplit,
        handleCbdInfoGetLists,
        handleNotification,
        // handleCbdInfoPostAssignInit,
    ]);

    useEffect(() => {
        return () => handleCbdInfoPostAssignInit();
    }, [handleCbdInfoPostAssignInit]);

    // 테이블
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
                    const { category, item_name } = data || {};

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
        [type]
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
                    {type.toUpperCase() + ' ITEM'}
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Assign ' + type.toUpperCase(),
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
                            title: 'Create ' + type.toUpperCase(),
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() =>
                            onShow({
                                ...initialShow,
                                materialWrite: {
                                    type: type,
                                    status: true,
                                },
                            })
                        }
                    />
                </Space>
            </div>
        </div>
    );

    // const [isRender, setIsRender] = useState(false);
    // const tRef = useRef();

    // useEffect(() => {
    //     console.log('materialOfferTableRef: ', materialOfferTableRef);
    //     // console.log('editTableRef: ', editTableRef);
    //     // const id = materialOfferTableRef?.current?.find(
    //     //     (v) => v?.current?.selectedRowKeys?.length > 0
    //     // )?.current?.selectedRowKeys?.[0];

    //     const a = Object.keys(materialOfferTableRef?.current)?.reduce(
    //         (acc, cur) => {
    //             if (
    //                 materialOfferTableRef?.current[cur]?.current
    //                     ?.selectedRowKeys?.length > 0
    //             ) {
    //                 tRef.current =
    //                     materialOfferTableRef?.current[
    //                         cur
    //                     ]?.current?.selectedRowKeys[0];

    //                 // return materialOfferTableRef?.current[
    //                 //     cur
    //                 // ]?.current?.onSelectChange([], {});
    //             }

    //             // let a = materialOfferTableRef?.current[
    //             //     cur
    //             // ]?.current?.onSelectChange([], {});

    //             return tRef.current;
    //         },
    //         null
    //     );
    //     // const dataSource2 = editTableRef?.current?.dataSource;
    //     // console.log('dataSource2: ', dataSource2);
    //     console.log('dataSource', dataSource);
    //     let t = [];
    //     t = dataSource?.reduce((acc, cur) => {
    //         if (
    //             cur?.materialOptions?.find(
    //                 (v) => v?.materialOptionID === tRef.current
    //             )
    //         ) {
    //             acc = { ...cur };
    //         }
    //         return acc;
    //     }, {});
    //     console.log('id: ', tRef);
    //     // console.log('t: ', t);
    //     if (Object.keys(t)?.length) {
    //         console.log('실행');
    //         return editTableRef?.current?.onSelectChange([t?.id], t);
    //     }
    // }, [editTableRef, materialOfferTableRef, dataSource, tRef, isRender]);

    const expandable = {
        expandedRowRender: (record) => {
            const { id, materialOffers, materialInfo } = record || {};
            const { supplier } = materialInfo || {};
            const isDisabled =
                supplier?.id !== userGetEmail.data?.data.company.companyID;

            return (
                <Row>
                    <MaterialOfferedPriceTable
                        materialOfferTable={materialOfferTableRef}
                        materialOfferRowKey="id"
                        materialOfferDataSource={materialOffers}
                        rowSelectionType="radio"
                        onMaterialOfferOpenDrawer={() => {
                            // setOfferId(null);
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
                                    type={type}
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
                        // onMaterialOfferClickRow,
                    />
                </Row>
            );
        },
    };

    return (
        <CbdAssignOutterWrap>
            <div id="cbdAssignWrap">
                <MaterialFilter
                    type={type}
                    initialShow={initialShow}
                    onShow={onShow}
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
                        title={() => title(type)}
                        rowKey={rowKey}
                        initialColumns={columns}
                        dataSource={dataSource}
                        rowSelection={true}
                        rowSelectionType="radio"
                        loading={isLoading}
                        pagination={
                            materialInfoPostFilter.data
                                ? false
                                : { ...pagination, total }
                        }
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
        </CbdAssignOutterWrap>
    );
};

const CbdAssignOutterWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #cbdAssignWrap {
        min-width: 800px;
    }

    .ant-table.ant-table-small
        .ant-table-tbody
        .ant-table-wrapper:only-child
        .ant-table {
        margin: 0;
    }
`;

// const Empty = styled.div`
//     padding-bottom: 1rem;
// `;

export default CbdAssign;
