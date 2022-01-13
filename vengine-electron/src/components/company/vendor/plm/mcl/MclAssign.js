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
import {
    mclPlanningGetListsAsyncAction,
    mclPlanningPostIdAsyncAction,
} from 'store/mcl/planning/reducer';
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
import { DrawerContext } from 'components/context/drawerContext';
import { useMutation } from 'react-query';
import { materialOfferPostApi } from 'core/api/material/offer';
import { Fragment } from 'react';

const MclAssign = (props) => {
    const { match, type, initialShow, onShow, onLeftSplit } = props;
    const { mclOptionId } = match.params || '';
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

    const mclPlanningPostId = useSelector(
        (state) => state.mclPlanningReducer.post.id
    );
    const handleMclPlanningPostId = useCallback(
        (payload) => dispatch(mclPlanningPostIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPlanningPostIdInit = useCallback(
        () => dispatch(mclPlanningPostIdAsyncAction.initial()),
        [dispatch]
    );

    const handleMclPlanningGetLists = useCallback(
        (payload) => dispatch(mclPlanningGetListsAsyncAction.request(payload)),
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

        return handleMclPlanningPostId({
            id: Number(mclOptionId),
            data: [
                selectedRows.reduce((acc, cur) => {
                    acc = cur.materialOffers?.find(
                        (v) => v.id === Number(selectedOfferRowKeys)
                    );
                    return acc?.id;
                }, undefined),
            ],
        });
    }, [
        mclOptionId,
        editTableRef,
        materialOfferTableRef,
        handleMclPlanningPostId,
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
    }, [type, materialInfoGetPages, materialInfoPostFilter]);

    // 등록
    useEffect(() => {
        if (mclPlanningPostId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPlanningPostId.error.message,
            });
        } else if (mclPlanningPostId.data) {
            onLeftSplit();
            onShow({
                ...initialShow,
                [type]: false,
            });
            handleMclPlanningGetLists(mclOptionId);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'CBD option assignment success',
            });
        }
    }, [
        mclPlanningPostId,
        type,
        mclOptionId,
        initialShow,
        onShow,
        onLeftSplit,
        handleMclPlanningGetLists,
        handleNotification,
    ]);

    useEffect(() => {
        return () => handleMclPlanningPostIdInit();
    }, [handleMclPlanningPostIdInit]);

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
                <Space>
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

    const expandable = {
        expandedRowRender: (record) => {
            const { id, materialInfo, materialOffers } = record;
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
        <MclAssignOutterWrap>
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
        </MclAssignOutterWrap>
    );
};

const MclAssignOutterWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #cbdAssignWrap {
        min-width: 800px;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                ${({ theme }) => theme.fonts.h7};
            }
        }
    }

    .ant-table.ant-table-small
        .ant-table-tbody
        .ant-table-wrapper:only-child
        .ant-table {
        margin: 0;
    }
`;

export default MclAssign;
