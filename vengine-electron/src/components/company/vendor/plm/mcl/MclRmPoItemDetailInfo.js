import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import {
    mclPoGetItemListsAsyncAction,
    mclPoPostItemIdAsyncAction,
    mclPoGetPagesAsyncAction,
} from 'store/mcl/po/reducer';
import { Tooltip } from 'components/common/tooltip';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import { Fragment } from 'react';
import { Ellipsis } from 'components/UI/atoms';

const MclRmPoItemDetailInfo = (props, ref) => {
    const {
        match,
        // 생성된 row id 수정에 필요
        rmPoId,
        onMoveStep,
        initialShow,
        onShow,
        onLeftSplit,
    } = props;
    const { mclOptionId } = match.params || '';

    const tableRef = useRef();
    const rowKey = 'id';
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const pagination = {
        current: 1,
        pageSize: 15,
        searchKeyword: '',
    };
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Po에서 저장 되지 않은 아이템
    const mclPoGetItemLists = useSelector(
        (state) => state.mclPoReducer.get.itemLists
    );
    const handleMclPoGetItemLists = useCallback(
        (payload) => dispatch(mclPoGetItemListsAsyncAction.request(payload)),
        [dispatch]
    );
    // const handleMclPoGetItemListsInit = useCallback(
    //     () => dispatch(mclPoGetItemListsAsyncAction.initial()),
    //     [dispatch]
    // );

    const mclPoPostItemId = useSelector(
        (state) => state.mclPoReducer.post.itemId
    );
    const handleMclPoPostItemId = useCallback(
        (payload) => dispatch(mclPoPostItemIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPoPostItemIdInit = useCallback(
        () => dispatch(mclPoPostItemIdAsyncAction.initial()),
        [dispatch]
    );

    const handleMclPoGetPages = useCallback(
        (payload) => dispatch(mclPoGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const cbdCoverGetId = useSelector((state) => state.cbdCoverReducer.get.id);

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows } = tableRef.current;

            if (selectedRows.length === 0) {
                // return confirm.warningConfirm('No item is selected');
                return onMoveStep('next');
            }
            if (type === 'save') {
                confirm.saveConfirm(async (e) => {
                    if (e) {
                        const newValues = selectedRows.map((v) => ({
                            dependencyItems: v.dependencyItemList.map((v2) => ({
                                colorId: v2.color?.id,
                                marketId: v2.market?.id,
                                sizeId: v2.size?.id,
                                orderedUomId: v.orderedUom?.id,
                            })),
                            mclMaterialInfoID: v.mclMaterialInfo?.id,
                            styleNumbers: v.styleNumbers,
                        }));

                        handleMclPoPostItemId({ id: rmPoId, data: newValues });
                    }
                });
            }
        },
        [tableRef, rmPoId, onMoveStep, handleMclPoPostItemId]
    );

    useImperativeHandle(ref, () => ({
        handleExcute,
    }));

    // 조회
    useEffect(() => {
        if (rmPoId) {
            handleMclPoGetItemLists(rmPoId);
        }
    }, [rmPoId, handleMclPoGetItemLists]);

    useEffect(() => {
        setIsLoading(mclPoGetItemLists.isLoading);
        if (mclPoGetItemLists.data) {
            setDataSource(
                mclPoGetItemLists.data.list.map((v) => ({
                    ...v,
                    id: v.mclMaterialInfo.id,
                }))
            );
        }
    }, [mclPoGetItemLists]);

    // 등록
    useEffect(() => {
        if (mclPoPostItemId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPoPostItemId.error.message,
            });
        } else if (mclPoPostItemId.data) {
            onMoveStep('next');
            handleMclPoGetPages({ id: mclOptionId, data: pagination });
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful registration of MCL PO item details',
            });
        }

        return () => handleMclPoPostItemIdInit();
    }, [
        mclPoPostItemId,
        mclOptionId,
        pagination,
        onMoveStep,
        handleMclPoGetPages,
        handleNotification,
        handleMclPoPostItemIdInit,
    ]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Style#',
                dataIndex: 'styleNumbers',
                align: 'left',
                render: (data, record) => {
                    const value = (
                        <div>
                            <div>Design# : {record?.designNumber}</div>
                            <div>Style# : {data.map((v) => v).join(', ')}</div>
                        </div>
                    );

                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Item Information',
                dataIndex: 'mclMaterialInfo',
                align: 'left',
                render: (data, record) => {
                    const {
                        materialInfo,
                        supplierMaterial,
                        fabricCw,
                        fabricCwUom,
                        fabricWeight,
                        fabricWeightUom,
                        materialAfterManufacturingFashion,
                        materialAfterManufacturingFinishing,
                        materialAfterManufacturingDyeing,
                        subsidiaryDetail,
                        subsidiarySize,
                        subsidiarySizeUom,
                    } = data;
                    const {
                        type,
                        category,
                        item_name,
                        usagePlace,
                        fabricContents,
                        constructionType,
                        constructionEpi,
                        constructionPpi,
                        yarnSizeWrap,
                        yarnSizeWeft,
                        shrinkagePlus,
                        shrinkageMinus,
                    } = materialInfo || {};
                    const output = (
                        <Fragment>
                            <Ellipsis>
                                Category : {category?.typeB} {category?.typeC}
                            </Ellipsis>
                            <Ellipsis>Item name : {item_name || '-'}</Ellipsis>
                            <Ellipsis>
                                Material No. : {supplierMaterial || '-'}
                            </Ellipsis>
                        </Fragment>
                    );
                    const outputTooltip = (
                        <Fragment>
                            <div>Usage : {usagePlace || '-'}</div>
                            <div>
                                {' '}
                                Category : {category?.typeB} {category?.typeC}
                            </div>
                            <div>Item name : {item_name || '-'}</div>
                            <div>Material No. : {supplierMaterial || '-'}</div>
                            {type === 'fabric' ? (
                                <Fragment>
                                    <div>
                                        Contents :{' '}
                                        {fabricContents?.map((v) => (
                                            <span key={v.id}>
                                                {v?.contents?.name} {v?.rate}%
                                            </span>
                                        )) || '-'}{' '}
                                    </div>
                                    <div>
                                        Construction : {constructionType || '-'}{' '}
                                        {constructionEpi || '-'}{' '}
                                        {constructionPpi || '-'}{' '}
                                        {yarnSizeWrap || '-'}{' '}
                                        {yarnSizeWeft || '-'}{' '}
                                        {shrinkagePlus > 0 && '+'}
                                        {shrinkagePlus || '-'}{' '}
                                        {/* {shrinkageMinus > 0 && '-'} */}
                                        {shrinkageMinus || '-'}
                                    </div>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <div>
                                        Item Size :{' '}
                                        {data?.subsidiarySize ? (
                                            <span>
                                                {subsidiarySize}{' '}
                                                {subsidiarySizeUom?.name3}
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </div>

                                    <div>
                                        Item Detail : {subsidiaryDetail || '-'}
                                    </div>
                                </Fragment>
                            )}

                            <div>
                                CW/Weight:{' '}
                                {fabricCw ? (
                                    <span>
                                        {fabricCw}{' '}
                                        {fabricCwUom?.name3 || 'inch'}
                                    </span>
                                ) : (
                                    '-'
                                )}{' '}
                                {fabricWeight ? (
                                    <span>
                                        {' '}
                                        {fabricWeight}{' '}
                                        {fabricWeightUom?.name3 || 'GSM'}
                                    </span>
                                ) : (
                                    '-'
                                )}
                            </div>
                            <div>
                                Finished/Dye Method:{' '}
                                {type === 'fabric' &&
                                    (materialAfterManufacturingFinishing?.name ||
                                        '-')}{' '}
                                {materialAfterManufacturingDyeing?.name || '-'}{' '}
                                {type === 'fabric' &&
                                    (materialAfterManufacturingFashion?.name ||
                                        '-')}
                            </div>
                        </Fragment>
                    );

                    return <Tooltip title={outputTooltip}>{output}</Tooltip>;
                },
            },
            {
                title: 'Uom',
                dataIndex: 'orderedUom',
                align: 'left',
                render: (data) => (
                    <Tooltip title={data.name3}>{data.name3}</Tooltip>
                ),
            },
            {
                title: 'Unit Price',
                children: [
                    {
                        title: cbdCoverGetId.data?.data.commonCurrency.name2,
                        dataIndex: 'unitPrice',
                        align: 'right',
                        // editable: true,
                        render: (data) => {
                            const value = (
                                <div>
                                    <div>
                                        {formatNumberUtil(data)}{' '}
                                        {
                                            cbdCoverGetId.data?.data
                                                .commonCurrency.name3
                                        }
                                    </div>
                                </div>
                            );
                            return <Tooltip title={value}>{value}</Tooltip>;
                        },
                    },
                ],
            },
            {
                title: 'Required QTY',
                dataIndex: 'requiredQty',
                align: 'right',
                render: (data) => {
                    const _data = formatNumberUtil(data);
                    return <Tooltip title={_data}>{_data}</Tooltip>;
                },
            },
            {
                title: 'Issued QTY',
                dataIndex: 'issuedQty',
                align: 'right',
                render: (data) => {
                    const _data = formatNumberUtil(data);
                    return <Tooltip title={_data}>{_data}</Tooltip>;
                },
            },
            {
                title: 'Balance QTY',
                dataIndex: 'balanceQty',
                align: 'right',
                render: (data) => {
                    const _data = formatNumberUtil(data);
                    return <Tooltip title={_data}>{_data}</Tooltip>;
                },
            },
        ],
        [cbdCoverGetId]
    );

    const title = () => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    ITEM SELECT
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Save item',
                            arrowPointAtCenter: true,
                        }}
                        mode="save"
                        size="small"
                        onClick={() => handleExcute('save')}
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
                            onLeftSplit();
                            onShow({
                                ...initialShow,
                                rmPo: {
                                    status: false,
                                },
                            });
                        }}
                    />
                </Space>
            </div>
        </div>
    );

    return (
        <MclRmWrap>
            <CustomTable
                ref={tableRef}
                title={title}
                rowKey={rowKey}
                initialColumns={columns}
                dataSource={dataSource}
                rowSelection={true}
                loading={isLoading}
                pagination={false}
            />
        </MclRmWrap>
    );
};

const MclRmWrap = styled.div`
    .titleWrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
            ${({ theme }) => theme.fonts.h7};
        }
    }
`;

export default React.memo(forwardRef(MclRmPoItemDetailInfo));
