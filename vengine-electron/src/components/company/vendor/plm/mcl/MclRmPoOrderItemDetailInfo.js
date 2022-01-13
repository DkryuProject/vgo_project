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
import handleCalculationResult from 'core/utils/uomUtil';

import {
    mclPoGetItemIdAsyncAction,
    mclPoPutItemIdAsyncAction,
    mclPoPutPublishIdAsyncAction,
    mclPoGetPagesAsyncAction,
    mclPoDeleteItemIdAsyncAction,
} from 'store/mcl/po/reducer';
import styled from 'styled-components';
import { Tooltip } from 'components/common/tooltip';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { Space, InputNumber, Checkbox, Row, Col } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import formatNumberUtil from 'core/utils/formatNumberUtil';
import { Button, Ellipsis, Input, Select } from 'components/UI/atoms';
import { Fragment } from 'react';

const MclRmPoOrderItemDetailInfo = (props, ref) => {
    const {
        match,
        // 생성된 row id 수정에 필요
        rmPoId,
        initialShow,
        onShow,
        onLeftSplit,
        currency,
    } = props;
    const { mclOptionId } = match.params || '';
    const tableRef = useRef();
    const rowKey = 'itemID';
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const pagination = {
        current: 1,
        pageSize: 15,
        searchKeyword: '',
    };
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [purchaseQty, setPurchaseQty] = useState(0);
    // const [unitPrice, setUnitPrice] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(null);
    const [sampleOrder, setSampleOrder] = useState(null);
    const [adjUom, setAdjUom] = useState(null);
    const [orderOptionCheck, setOrderOptionCheck] = useState(false);
    const [orderOption, setOrderOption] = useState([
        {
            name: null,
            type: null,
            value: 0,
        },
    ]);
    const [valueCalculated, setValueCalculated] = useState(0);
    const valueCalculatedInputRef = useRef([]);

    // Po에서 저장 된 아이템
    const mclPoGetItemId = useSelector(
        (state) => state.mclPoReducer.get.itemId
    );
    const handleMclPoGetItemId = useCallback(
        (payload) => dispatch(mclPoGetItemIdAsyncAction.request(payload)),
        [dispatch]
    );
    // const handleMclPoGetItemIdInit = useCallback(
    //     () => dispatch(mclPoGetItemIdAsyncAction.initial()),
    //     [dispatch]
    // );

    const mclPoPutItemId = useSelector(
        (state) => state.mclPoReducer.put.itemId
    );
    const handleMclPoPutItemId = useCallback(
        (payload) => dispatch(mclPoPutItemIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPoPutItemIdInit = useCallback(
        () => dispatch(mclPoPutItemIdAsyncAction.initial()),
        [dispatch]
    );

    const mclPoPutPublishId = useSelector(
        (state) => state.mclPoReducer.put.publishId
    );
    const handleMclPoPutPublishId = useCallback(
        (payload) => dispatch(mclPoPutPublishIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPoPutPublishIdInit = useCallback(
        () => dispatch(mclPoPutPublishIdAsyncAction.initial()),
        [dispatch]
    );

    const mclPoDeleteItemId = useSelector(
        (state) => state.mclPoReducer.delete.itemId
    );
    const handleMclPoDeleteItemId = useCallback(
        (payload) => dispatch(mclPoDeleteItemIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclPoDeleteItemIdInit = useCallback(
        () => dispatch(mclPoDeleteItemIdAsyncAction.initial()),
        [dispatch]
    );

    const cbdCoverGetId = useSelector((state) => state.cbdCoverReducer.get.id);

    const handleMclPoGetPages = useCallback(
        (payload) => dispatch(mclPoGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows } = tableRef.current;

            if (selectedRows.length === 0 && type !== 'publish') {
                return confirm.warningConfirm('No item is selected');
            }
            if (type === 'save') {
                console.log('selectedRows: ', selectedRows);

                confirm.saveConfirm(async (e) => {
                    if (e) {
                        const newValues = {};
                        newValues['exchangeRate'] = exchangeRate;
                        newValues['orderItemList'] = selectedRows.map((v) => ({
                            dependencyItems: v.dependencyItemList.map((v2) => {
                                return {
                                    dependencyItemId: v2.id,
                                    colorId: v2.color && v2.color.id,
                                    marketId: v2.market && v2.market.id,
                                    // orderedUomId: adjUom[v.itemID]
                                    //     ? adjUom[v.itemID].value
                                    //     : v.orderedAdjUom.id,
                                    orderedUomId: v2?.orderedUom?.id,
                                    purchaseQty: Math.ceil(
                                        v?.mclMaterialInfo?.materialInfo
                                            ?.type === 'fabric'
                                            ? handleCalculationResult(
                                                  Number(
                                                      purchaseQty[v.itemID]?.[
                                                          v2.id
                                                      ]
                                                  ) || 0,
                                                  adjUom[v?.itemID]?.children,
                                                  v2?.orderedUom?.name3,
                                                  {
                                                      cw: v?.mclMaterialInfo
                                                          ?.fabricCw,
                                                      cwUom: v?.mclMaterialInfo
                                                          ?.fabricCwUom?.name3,
                                                      weight: v?.mclMaterialInfo
                                                          ?.fabricWeight,
                                                      weightUom:
                                                          v?.mclMaterialInfo
                                                              ?.fabricWeightUom
                                                              ?.name3,
                                                  }
                                              )
                                            : (Number(
                                                  purchaseQty[v.itemID]?.[v2.id]
                                              ) || 0) /
                                                  (valueCalculated?.[
                                                      v.itemID
                                                  ] || 0)
                                    ),
                                    sizeId: v2.size && v2.size.id,
                                    // unitPrice:
                                    //     Number(unitPrice[v.itemID]?.[v2.id]) ||
                                    //     0,
                                };
                            }),
                            orderItemId: v.itemID,
                            fromToUom: valueCalculated[v.itemID],
                            mclMaterialInfoID: v.mclMaterialInfo.id,
                            orderedAdjUomID: adjUom[v.itemID].value,
                            purchaseQty: Math.ceil(
                                v?.mclMaterialInfo?.materialInfo?.type ===
                                    'fabric'
                                    ? handleCalculationResult(
                                          purchaseQty[v.itemID]
                                              ? Object.keys(
                                                    purchaseQty[v.itemID]
                                                ).reduce((acc, cur) => {
                                                    if (
                                                        typeof acc === 'object'
                                                    ) {
                                                        return (
                                                            Number(
                                                                purchaseQty[
                                                                    v.itemID
                                                                ][acc]
                                                            ) +
                                                            Number(
                                                                purchaseQty[
                                                                    v.itemID
                                                                ][cur]
                                                            )
                                                        );
                                                    } else {
                                                        return (
                                                            Number(acc) +
                                                            Number(
                                                                purchaseQty[
                                                                    v.itemID
                                                                ][cur]
                                                            )
                                                        );
                                                    }
                                                }, 0)
                                              : 0,
                                          adjUom[v?.itemID]?.children,
                                          v?.orderedUom?.name3,
                                          {
                                              cw: v?.mclMaterialInfo?.fabricCw,
                                              cwUom: v?.mclMaterialInfo
                                                  ?.fabricCwUom?.name3,
                                              weight: v?.mclMaterialInfo
                                                  ?.fabricWeight,
                                              weightUom:
                                                  v?.mclMaterialInfo
                                                      ?.fabricWeightUom?.name3,
                                          }
                                      )
                                    : purchaseQty[v.itemID]
                                    ? Object.keys(purchaseQty[v.itemID]).reduce(
                                          (acc, cur) => {
                                              if (typeof acc === 'object') {
                                                  return (
                                                      Number(
                                                          purchaseQty[v.itemID][
                                                              acc
                                                          ]
                                                      ) +
                                                      Number(
                                                          purchaseQty[v.itemID][
                                                              cur
                                                          ]
                                                      )
                                                  );
                                              } else {
                                                  return (
                                                      Number(acc) +
                                                      Number(
                                                          purchaseQty[v.itemID][
                                                              cur
                                                          ]
                                                      )
                                                  );
                                              }
                                          },
                                          0
                                      )
                                    : 0 / (valueCalculated?.[v.itemID] || 0)
                            ),
                            styleNumbers: v.styleNumbers,
                            unitPrice: Number(v.unitPrice),
                            sampleOrder: {
                                advertisementQty: Math.ceil(
                                    v?.mclMaterialInfo?.materialInfo?.type ===
                                        'fabric'
                                        ? handleCalculationResult(
                                              Number(
                                                  sampleOrder[v.itemID]
                                                      ?.advertisementQty
                                              ),
                                              adjUom[v?.itemID]?.children,
                                              v?.orderedUom?.name3,
                                              {
                                                  cw: v?.mclMaterialInfo
                                                      ?.fabricCw,
                                                  cwUom: v?.mclMaterialInfo
                                                      ?.fabricCwUom?.name3,
                                                  weight: v?.mclMaterialInfo
                                                      ?.fabricWeight,
                                                  weightUom:
                                                      v?.mclMaterialInfo
                                                          ?.fabricWeightUom
                                                          ?.name3,
                                              }
                                          )
                                        : Number(
                                              sampleOrder[v.itemID]
                                                  ?.advertisementQty
                                          ) /
                                              (valueCalculated?.[v?.itemID] ||
                                                  0)
                                ),
                                advertisementUnitPrice: Number(
                                    sampleOrder[v.itemID].advertisementUnitPrice
                                ),
                                advertisementUom: adjUom[v.itemID].value,
                                preProductionQty: Math.ceil(
                                    v?.mclMaterialInfo?.materialInfo?.type ===
                                        'fabric'
                                        ? handleCalculationResult(
                                              Number(
                                                  sampleOrder[v.itemID]
                                                      ?.preProductionQty
                                              ),
                                              adjUom[v?.itemID]?.children,
                                              v?.orderedUom?.name3,
                                              {
                                                  cw: v?.mclMaterialInfo
                                                      ?.fabricCw,
                                                  cwUom: v?.mclMaterialInfo
                                                      ?.fabricCwUom?.name3,
                                                  weight: v?.mclMaterialInfo
                                                      ?.fabricWeight,
                                                  weightUom:
                                                      v?.mclMaterialInfo
                                                          ?.fabricWeightUom
                                                          ?.name3,
                                              }
                                          )
                                        : Number(
                                              sampleOrder[v.itemID]
                                                  ?.preProductionQty
                                          ) /
                                              (valueCalculated?.[v?.itemID] ||
                                                  0)
                                ),
                                preProductionUnitPrice: Number(
                                    sampleOrder[v.itemID].preProductionUnitPrice
                                ),
                                preProductionUom: adjUom[v.itemID].value,
                            },
                        }));

                        if (orderOptionCheck) {
                            if (orderOption?.some((v) => !v.name || !v.type)) {
                                return handleNotification({
                                    type: 'error',
                                    message: 'Error',
                                    description: 'Please check the option',
                                });
                            }

                            newValues['orderOption'] = orderOption;
                        }

                        return handleMclPoPutItemId({
                            id: rmPoId,
                            data: newValues,
                        });
                    }
                });
            } else if (type === 'delete') {
                confirm.deleteConfirm((e) => {
                    if (e) {
                        const itemIdArr = selectedRows.map((v) => v.itemID);
                        return handleMclPoDeleteItemId(itemIdArr);
                    }
                });
            } else if (type === 'publish') {
                confirm.warningConfirm(
                    'Please check again. Published order will not be modified',
                    async (e) => {
                        if (e) {
                            return handleMclPoPutPublishId(rmPoId);
                        }
                    }
                );
            }
        },
        [
            tableRef,
            rmPoId,
            sampleOrder,
            purchaseQty,
            // unitPrice,
            adjUom,
            exchangeRate,
            orderOptionCheck,
            orderOption,
            valueCalculated,
            handleMclPoPutItemId,
            handleMclPoPutPublishId,
            handleMclPoDeleteItemId,
            handleNotification,
        ]
    );

    useImperativeHandle(ref, () => ({
        handleExcute,
    }));

    // 조회
    useEffect(() => {
        if (rmPoId) {
            handleMclPoGetItemId(rmPoId);
        }
    }, [rmPoId, handleMclPoGetItemId]);

    useEffect(() => {
        setIsLoading(mclPoGetItemId.isLoading);

        // 업데이트
        if (mclPoGetItemId.data) {
            // Item 조회
            setAdjUom(
                mclPoGetItemId.data.data.orderItemList.reduce((acc, cur) => {
                    acc[cur.itemID] = {
                        key:
                            Object.keys(cur.orderedAdjUom).length > 0
                                ? cur.orderedAdjUom.id
                                : cur.orderedUom.id,
                        value:
                            Object.keys(cur.orderedAdjUom).length > 0
                                ? cur.orderedAdjUom.id
                                : cur.orderedUom.id,
                        children:
                            Object.keys(cur.orderedAdjUom).length > 0
                                ? cur.orderedAdjUom.name3
                                : cur.orderedUom.name3,
                    };
                    return acc;
                }, {})
            );

            setSampleOrder(
                mclPoGetItemId.data.data.orderItemList.reduce((acc, cur) => {
                    acc[cur.itemID] = {
                        advertisementQty:
                            cur.sampleOrder.advertisementQty || null,
                        advertisementUnitPrice:
                            cur.sampleOrder.advertisementUnitPrice || 0,
                        advertisementUom:
                            cur.sampleOrder.advertisementUom || {},
                        preProductionQty:
                            cur.sampleOrder.preProductionQty || null,
                        preProductionUnitPrice:
                            cur.sampleOrder.preProductionUnitPrice || 0,
                        preProductionUom:
                            cur.sampleOrder.preProductionUom || {},
                    };
                    return acc;
                }, {})
            );
            setOrderOptionCheck(!!mclPoGetItemId.data?.data?.option?.length);
            setOrderOption((orderOption) =>
                mclPoGetItemId.data?.data?.option?.length
                    ? mclPoGetItemId.data?.data?.option
                    : orderOption
            );

            setExchangeRate(Number(mclPoGetItemId.data.data.exchangeRate) || 0);
            setValueCalculated(
                mclPoGetItemId.data.data?.orderItemList?.reduce((acc, cur) => {
                    if (cur?.fromToUom) {
                        acc[cur.itemID] = cur?.fromToUom;
                    }

                    return acc;
                }, {})
            );
            setDataSource(
                mclPoGetItemId.data.data.orderItemList.map((v) => ({
                    ...v,
                    orderedAdjUom: Object.keys(v.orderedAdjUom).length
                        ? v.orderedAdjUom
                        : v.orderedUom,
                    dependencyItemList: v.dependencyItemList.map((v2, i2) => ({
                        ...v2,
                        itemID: v.itemID,
                    })),
                }))
            );
        }
    }, [
        mclPoGetItemId,
        rmPoId,
        setAdjUom,
        setSampleOrder,
        setExchangeRate,
        setPurchaseQty,
        // setUnitPrice,
        setDataSource,
        setOrderOptionCheck,
        setOrderOption,
        setValueCalculated,
    ]);

    // adjUom 수정시 purchaseQty 및 sampleOrder 수량 조정
    useEffect(() => {
        if (adjUom && dataSource.length > 0) {
            setPurchaseQty(
                dataSource.reduce((acc, cur) => {
                    const {
                        fabricCw,
                        fabricCwUom,
                        fabricWeight,
                        fabricWeightUom,
                        materialInfo,
                    } = cur.mclMaterialInfo;
                    const { type } = materialInfo || {};
                    acc[cur?.itemID] = cur?.dependencyItemList?.reduce(
                        (acc2, cur2) => {
                            acc2[cur2?.id] = Math.ceil(
                                type === 'fabric'
                                    ? handleCalculationResult(
                                          cur2?.purchaseQty,
                                          cur?.orderedUom?.name3,
                                          adjUom[cur?.itemID]?.children,
                                          {
                                              cw: fabricCw,
                                              cwUom: fabricCwUom?.name3,
                                              weight: fabricWeight,
                                              weightUom: fabricWeightUom?.name3,
                                          }
                                      )
                                    : cur2?.purchaseQty *
                                          (valueCalculated[cur?.itemID] || 0)
                                // cur2?.purchaseQty
                            );

                            return acc2;
                        },
                        {}
                    );

                    return acc;
                }, {})
            );

            setSampleOrder((sampleOrder) =>
                dataSource.reduce((acc, cur) => {
                    const {
                        fabricCw,
                        fabricCwUom,
                        fabricWeight,
                        fabricWeightUom,
                        materialInfo,
                    } = cur.mclMaterialInfo;
                    const { type } = materialInfo || {};
                    acc[cur?.itemID] = {
                        ...sampleOrder[cur?.itemID],
                        advertisementQty: Math.ceil(
                            type === 'fabric'
                                ? handleCalculationResult(
                                      cur?.sampleOrder.advertisementQty,
                                      cur?.orderedUom?.name3,
                                      adjUom[cur?.itemID]?.children,
                                      {
                                          cw: fabricCw,
                                          cwUom: fabricCwUom?.name3,
                                          weight: fabricWeight,
                                          weightUom: fabricWeightUom?.name3,
                                      }
                                  )
                                : cur?.sampleOrder.advertisementQty *
                                      (valueCalculated[cur?.itemID] || 0)
                        ),

                        preProductionQty: Math.ceil(
                            type === 'fabric'
                                ? handleCalculationResult(
                                      cur?.sampleOrder.preProductionQty,
                                      cur?.orderedUom?.name3,
                                      adjUom[cur?.itemID]?.children,
                                      {
                                          cw: fabricCw,
                                          cwUom: fabricCwUom?.name3,
                                          weight: fabricWeight,
                                          weightUom: fabricWeightUom?.name3,
                                      }
                                  )
                                : cur?.sampleOrder.preProductionQty *
                                      (valueCalculated[cur?.itemID] || 0)
                        ),
                    };

                    return acc;
                }, {})
            );
            // valueCalculatedInputRef.current[itemID]
        }
    }, [adjUom, dataSource, valueCalculated, setSampleOrder, setPurchaseQty]);

    // 수정
    useEffect(() => {
        if (mclPoPutItemId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPoPutItemId.error.message,
            });
        } else if (mclPoPutItemId.data) {
            // setPurchaseQty(0);
            handleMclPoGetPages({ id: mclOptionId, data: pagination });
            handleMclPoGetItemId(rmPoId);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successfully modifying MCL PO item details',
            });
        }

        return () => handleMclPoPutItemIdInit();
    }, [
        mclPoPutItemId,
        mclOptionId,
        pagination,
        rmPoId,
        setPurchaseQty,
        handleMclPoGetPages,
        handleMclPoGetItemId,
        handleNotification,
        handleMclPoPutItemIdInit,
    ]);

    useEffect(() => {
        if (mclPoPutPublishId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPoPutPublishId.error.message,
            });
        } else if (mclPoPutPublishId.data) {
            handleMclPoGetPages({ id: mclOptionId, data: pagination });
            onShow(initialShow);
            onLeftSplit();
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'MCL Po Item Publish Success',
            });
        }
        return () => handleMclPoPutPublishIdInit();
    }, [
        mclPoPutPublishId,
        initialShow,
        onShow,
        onLeftSplit,
        mclOptionId,
        pagination,
        handleNotification,
        handleMclPoGetPages,
        handleMclPoPutPublishIdInit,
    ]);

    // 삭제
    useEffect(() => {
        if (mclPoDeleteItemId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclPoDeleteItemId.error.message,
            });
        } else if (mclPoDeleteItemId.data) {
            handleMclPoGetItemId(rmPoId);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful deletion of MCL PO item details',
            });
        }
        return () => handleMclPoDeleteItemIdInit();
    }, [
        rmPoId,
        mclPoDeleteItemId,
        handleMclPoGetItemId,
        handleNotification,
        handleMclPoDeleteItemIdInit,
    ]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Style#',
                dataIndex: 'styleNumbers',
                align: 'left',
                render: (data) => {
                    const value = <div>{data.map((v) => v).join(', ')}</div>;

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
                render: (data, record) => {
                    const { orderedUom, itemID, mclMaterialInfo } =
                        record || {};
                    const { materialInfo } = mclMaterialInfo || {};
                    const { type } = materialInfo || {};
                    return (
                        <div>
                            <Tooltip title={data.name3}>{data.name3}</Tooltip>

                            {type !== 'fabric' &&
                                orderedUom?.name3 !==
                                    adjUom[itemID]?.children && (
                                    <Space style={{ marginTop: '5px' }}>
                                        <div>1 {orderedUom?.name3}</div>{' '}
                                        <span
                                            style={{
                                                color: 'red',
                                                fontSize: '14px',
                                            }}
                                        >
                                            {'→'}
                                        </span>
                                        <InputNumber
                                            ref={(el) =>
                                                (valueCalculatedInputRef.current[
                                                    itemID
                                                ] = el)
                                            }
                                            value={valueCalculated[itemID]}
                                            onChange={(e) =>
                                                setValueCalculated(
                                                    (valueCalculated) => ({
                                                        ...valueCalculated,
                                                        [itemID]: e
                                                            ? Number(
                                                                  parseFloat(
                                                                      e
                                                                  )?.toFixed(4)
                                                              )
                                                            : 0,
                                                    })
                                                )
                                            }
                                            min="0"
                                            formatter={(value) =>
                                                formatNumberUtil(value)
                                            }
                                            parser={(value) =>
                                                value.replace(/\$\s?|(,*)/g, '')
                                            }
                                            bordered={false}
                                            style={{
                                                borderRadius: '0px',
                                                borderBottom:
                                                    '1px solid lightgray',
                                                width: '70px',
                                                fontSize: '10px',
                                            }}
                                        />
                                        <div>{adjUom[itemID]?.children}</div>
                                    </Space>
                                )}
                        </div>
                    );
                },
            },
            {
                title: 'Adj Uom',
                dataIndex: 'orderedAdjUom',
                selectBox: true,
                selectType: {
                    name: 'common',
                    type: 'list',
                    path: 'uom',
                    filter: 'counting&length&mass',
                },
                editable: true,
                render: (data) => (
                    <Tooltip title={data?.name3 || data?.name}>
                        {data?.name3 || data?.name}
                    </Tooltip>
                ),
            },
            {
                title: 'Unit Price',
                editable: true,
                children:
                    cbdCoverGetId.data?.data.commonCurrency?.id === currency?.id
                        ? [
                              {
                                  title: cbdCoverGetId.data?.data.commonCurrency
                                      .name2,
                                  dataIndex: 'unitPrice',
                                  editable: true,
                                  inputType: 'decimals',
                                  inputValidate: { maxLength: 2 },
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
                                      return (
                                          <Tooltip title={value}>
                                              {value}
                                          </Tooltip>
                                      );
                                  },
                              },
                          ]
                        : [
                              {
                                  title: cbdCoverGetId.data?.data.commonCurrency
                                      .name2,
                                  dataIndex: 'unitPrice',
                                  editable: true,
                                  inputType: 'decimals',
                                  inputValidate: { maxLength: 3 },
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
                                      return (
                                          <Tooltip title={value}>
                                              {value}
                                          </Tooltip>
                                      );
                                  },
                              },
                              {
                                  title: currency?.name2,
                                  dataIndex: 'unitPrice',
                                  render: (data) => {
                                      const value = (
                                          <div>
                                              <div>
                                                  {formatNumberUtil(
                                                      data * exchangeRate
                                                  )}{' '}
                                                  {currency?.name3}
                                              </div>
                                          </div>
                                      );
                                      return (
                                          <Tooltip title={value}>
                                              {value}
                                          </Tooltip>
                                      );
                                  },
                              },
                          ],
            },
            {
                title: 'Required Qty',
                dataIndex: 'requiredQty',
                render: (_, record) => {
                    const { itemID, requiredQty, orderedUom, mclMaterialInfo } =
                        record;
                    const {
                        fabricCw,
                        fabricCwUom,
                        fabricWeight,
                        fabricWeightUom,
                        materialInfo,
                    } = mclMaterialInfo;
                    const { type } = materialInfo || {};
                    const calculationResult = Math.ceil(
                        type === 'fabric'
                            ? handleCalculationResult(
                                  requiredQty,
                                  orderedUom?.name3,
                                  adjUom[itemID]?.children,
                                  {
                                      cw: fabricCw,
                                      cwUom: fabricCwUom?.name3,
                                      weight: fabricWeight,
                                      weightUom: fabricWeightUom?.name3,
                                  }
                              )
                            : requiredQty * (valueCalculated[itemID] || 0)
                    );

                    const value = (
                        <div>
                            <div>
                                {formatNumberUtil(requiredQty)}{' '}
                                {orderedUom?.name3}
                            </div>
                            {orderedUom?.name3 !== adjUom[itemID]?.children && (
                                <div>
                                    ({formatNumberUtil(calculationResult)}{' '}
                                    {adjUom[itemID]?.children})
                                </div>
                            )}
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Issued Qty',
                dataIndex: 'issuedQty',
                render: (_, record) => {
                    const { itemID, issuedQty, orderedUom, mclMaterialInfo } =
                        record;
                    const {
                        fabricCw,
                        fabricCwUom,
                        fabricWeight,
                        fabricWeightUom,
                        materialInfo,
                    } = mclMaterialInfo;
                    const { type } = materialInfo || {};
                    const calculationResult = Math.ceil(
                        type === 'fabric'
                            ? handleCalculationResult(
                                  issuedQty,
                                  orderedUom?.name3,
                                  adjUom[itemID]?.children,
                                  {
                                      cw: fabricCw,
                                      cwUom: fabricCwUom?.name3,
                                      weight: fabricWeight,
                                      weightUom: fabricWeightUom?.name3,
                                  }
                              )
                            : issuedQty * (valueCalculated?.[itemID] || 0)
                    );

                    const value = (
                        <div>
                            <div>
                                {formatNumberUtil(issuedQty)}{' '}
                                {orderedUom?.name3}
                            </div>
                            {orderedUom?.name3 !== adjUom[itemID]?.children && (
                                <div>
                                    ({formatNumberUtil(calculationResult)}{' '}
                                    {adjUom[itemID]?.children})
                                </div>
                            )}
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Balance Qty',
                dataIndex: 'balanceQty',
                render: (_, record) => {
                    const { itemID, balanceQty, orderedUom, mclMaterialInfo } =
                        record;
                    const {
                        fabricCw,
                        fabricCwUom,
                        fabricWeight,
                        fabricWeightUom,
                        materialInfo,
                    } = mclMaterialInfo;
                    const { type } = materialInfo || {};
                    const calculationResult = Math.ceil(
                        type === 'fabric'
                            ? handleCalculationResult(
                                  balanceQty,
                                  orderedUom?.name3,
                                  adjUom[itemID]?.children,
                                  {
                                      cw: fabricCw,
                                      cwUom: fabricCwUom?.name3,
                                      weight: fabricWeight,
                                      weightUom: fabricWeightUom?.name3,
                                  }
                              )
                            : balanceQty * (valueCalculated?.[itemID] || 0)
                    );

                    const value = (
                        <div>
                            <div>
                                {formatNumberUtil(balanceQty)}{' '}
                                {orderedUom?.name3}
                            </div>
                            {orderedUom?.name3 !== adjUom[itemID]?.children && (
                                <div>
                                    ({formatNumberUtil(calculationResult)}{' '}
                                    {adjUom[itemID]?.children})
                                </div>
                            )}
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Purchase Qty',
                dataIndex: 'itemID',
                render: (data, record) => {
                    const value =
                        purchaseQty[data] &&
                        formatNumberUtil(
                            Object.keys(purchaseQty[data]).reduce(
                                (acc, cur) => {
                                    if (typeof acc === 'object') {
                                        return (
                                            Number(purchaseQty[data][acc]) +
                                            Number(purchaseQty[data][cur])
                                        );
                                    } else {
                                        return (
                                            Number(acc) +
                                            Number(purchaseQty[data][cur])
                                        );
                                    }
                                },
                                0
                            )
                        );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
        ],
        [
            purchaseQty,
            currency,
            cbdCoverGetId,
            exchangeRate,
            adjUom,
            valueCalculated,
        ]
    );

    const dependencyColumn = useMemo(
        () => [
            {
                title: 'Market',
                dataIndex: 'market',
                render: (data) => (
                    <Tooltip title={data?.garmentMarket.name || '-'}>
                        {data?.garmentMarket.name || '-'}
                    </Tooltip>
                ),
            },
            {
                title: 'Color',
                dataIndex: 'color',
                render: (data) => (
                    <Tooltip title={data?.garmentColor || '-'}>
                        {data?.garmentColor || '-'}
                    </Tooltip>
                ),
            },
            {
                title: 'Size',
                dataIndex: 'size',
                render: (data) => (
                    <Tooltip title={data?.garmentSize.name || '-'}>
                        {data?.garmentSize.name || '-'}
                    </Tooltip>
                ),
            },
            {
                title: 'Required Qty',
                dataIndex: 'requireQty',
                render: (_, record) => {
                    const { itemID, requireQty, orderedUom, mclMaterialInfo } =
                        record;
                    const {
                        fabricCw,
                        fabricCwUom,
                        fabricWeight,
                        fabricWeightUom,
                        materialInfo,
                    } = mclMaterialInfo;
                    const { type } = materialInfo || {};

                    const calculationResult = Math.ceil(
                        type === 'fabric'
                            ? handleCalculationResult(
                                  requireQty,
                                  orderedUom?.name3,
                                  adjUom[itemID]?.children,
                                  {
                                      cw: fabricCw,
                                      cwUom: fabricCwUom?.name3,
                                      weight: fabricWeight,
                                      weightUom: fabricWeightUom?.name3,
                                  }
                              )
                            : requireQty * (valueCalculated?.[itemID] || 0)
                    );

                    const value = (
                        <div>
                            <div>
                                {requireQty} {orderedUom?.name3}
                            </div>
                            {orderedUom?.name3 !== adjUom[itemID]?.children && (
                                <div>
                                    ({calculationResult}{' '}
                                    {adjUom[itemID]?.children})
                                </div>
                            )}
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Issued Qty',
                dataIndex: 'orderQty',
                render: (_, record) => {
                    const { itemID, orderQty, orderedUom, mclMaterialInfo } =
                        record;
                    const {
                        fabricCw,
                        fabricCwUom,
                        fabricWeight,
                        fabricWeightUom,
                        materialInfo,
                    } = mclMaterialInfo;

                    const { type } = materialInfo || {};
                    const calculationResult = Math.ceil(
                        type === 'fabric'
                            ? handleCalculationResult(
                                  orderQty,
                                  orderedUom?.name3,
                                  adjUom[itemID]?.children,
                                  {
                                      cw: fabricCw,
                                      cwUom: fabricCwUom?.name3,
                                      weight: fabricWeight,
                                      weightUom: fabricWeightUom?.name3,
                                  }
                              )
                            : orderQty * (valueCalculated?.[itemID] || 0)
                    );

                    const value = (
                        <div>
                            <div>
                                {orderQty} {orderedUom?.name3}
                            </div>
                            {orderedUom?.name3 !== adjUom[itemID]?.children && (
                                <div>
                                    ({calculationResult}{' '}
                                    {adjUom[itemID]?.children})
                                </div>
                            )}
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Balance Qty',
                dataIndex: 'balanceQty',
                render: (_, record) => {
                    const { itemID, balanceQty, orderedUom, mclMaterialInfo } =
                        record;
                    const {
                        fabricCw,
                        fabricCwUom,
                        fabricWeight,
                        fabricWeightUom,
                        materialInfo,
                    } = mclMaterialInfo;

                    const { type } = materialInfo || {};
                    const calculationResult = Math.ceil(
                        type === 'fabric'
                            ? handleCalculationResult(
                                  balanceQty,
                                  orderedUom?.name3,
                                  adjUom[itemID]?.children,
                                  {
                                      cw: fabricCw,
                                      cwUom: fabricCwUom?.name3,
                                      weight: fabricWeight,
                                      weightUom: fabricWeightUom?.name3,
                                  }
                              )
                            : balanceQty * (valueCalculated?.[itemID] || 0)
                    );

                    const value = (
                        <div>
                            <div>
                                {balanceQty} {orderedUom?.name3}
                            </div>
                            {orderedUom?.name3 !== adjUom[itemID]?.children && (
                                <div>
                                    ({calculationResult}{' '}
                                    {adjUom[itemID]?.children})
                                </div>
                            )}
                        </div>
                    );
                    return <Tooltip title={value}>{value}</Tooltip>;
                },
            },
            {
                title: 'Purchase Qty',
                dataIndex: 'itemID',
                render: (_, record) => {
                    const { itemID, orderedUom, mclMaterialInfo } = record;
                    const {
                        fabricCw,
                        fabricCwUom,
                        fabricWeight,
                        fabricWeightUom,
                        materialInfo,
                    } = mclMaterialInfo;

                    const { type } = materialInfo || {};

                    // 반대로 치환
                    const calculationResult = Math.ceil(
                        type === 'fabric'
                            ? handleCalculationResult(
                                  purchaseQty?.[itemID]?.[record.id],
                                  adjUom[itemID]?.children,
                                  orderedUom?.name3,
                                  {
                                      cw: fabricCw,
                                      cwUom: fabricCwUom?.name3,
                                      weight: fabricWeight,
                                      weightUom: fabricWeightUom?.name3,
                                  }
                              ) || 0
                            : purchaseQty?.[itemID]?.[record.id] /
                                  (valueCalculated?.[itemID] || 0)
                    );

                    const value = (
                        <div>
                            {orderedUom?.name3 === adjUom[itemID]?.children ? (
                                <Space>
                                    <InputNumber
                                        // defaultValue={0}
                                        value={
                                            purchaseQty?.[itemID]?.[
                                                record.id
                                            ] || 0
                                        }
                                        onChange={(e) => {
                                            setPurchaseQty((purchaseQty) => ({
                                                ...purchaseQty,
                                                [itemID]: {
                                                    ...purchaseQty[itemID],
                                                    [record.id]:
                                                        parseInt(e) || 0,
                                                },
                                            }));
                                        }}
                                        formatter={(value) =>
                                            formatNumberUtil(value)
                                        }
                                        parser={(value) =>
                                            value.replace(/\$\s?|(,*)/g, '')
                                        }
                                        bordered={false}
                                        style={{
                                            borderRadius: '0px',
                                            borderBottom: '1px solid lightgray',
                                            width: '100%',
                                            fontSize: '10px',
                                        }}
                                    />
                                    {orderedUom?.name3}
                                </Space>
                            ) : (
                                <Space>
                                    <Space>
                                        <InputNumber
                                            // defaultValue={0}
                                            value={calculationResult}
                                            formatter={(value) =>
                                                formatNumberUtil(value)
                                            }
                                            parser={(value) =>
                                                value.replace(/\$\s?|(,*)/g, '')
                                            }
                                            bordered={false}
                                            disabled={true}
                                            style={{
                                                borderRadius: '0px',
                                                borderBottom:
                                                    '1px solid lightgray',
                                                width: '100%',
                                                fontSize: '10px',
                                            }}
                                        />
                                        {orderedUom?.name3}
                                    </Space>
                                    <Space>
                                        <InputNumber
                                            // defaultValue={0}
                                            value={
                                                purchaseQty?.[itemID]?.[
                                                    record.id
                                                ] || 0
                                            }
                                            onChange={(e) => {
                                                setPurchaseQty(
                                                    (purchaseQty) => ({
                                                        ...purchaseQty,
                                                        [itemID]: {
                                                            ...purchaseQty[
                                                                itemID
                                                            ],
                                                            [record.id]:
                                                                parseInt(e) ||
                                                                0,
                                                        },
                                                    })
                                                );
                                            }}
                                            formatter={(value) =>
                                                formatNumberUtil(value)
                                            }
                                            parser={(value) =>
                                                value.replace(/\$\s?|(,*)/g, '')
                                            }
                                            bordered={false}
                                            style={{
                                                borderRadius: '0px',
                                                borderBottom:
                                                    '1px solid lightgray',
                                                width: '100%',
                                                fontSize: '10px',
                                            }}
                                        />
                                        {adjUom[itemID]?.children}
                                    </Space>
                                </Space>
                            )}
                        </div>
                    );

                    return value;
                },
            },
        ],
        [adjUom, purchaseQty, valueCalculated]
    );

    const title = () => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    ITEM DETAIL INFORMATION
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    {cbdCoverGetId.data?.data.commonCurrency?.id !==
                        currency?.id && (
                        <Space
                            style={{ fontSize: '0.625rem', color: '#7f7f7f' }}
                        >
                            Exchange Rate
                            <InputNumber
                                placeholder="Exchange rate"
                                value={exchangeRate}
                                onChange={(e) => setExchangeRate(Number(e))}
                                formatter={(value) =>
                                    formatNumberUtil(formatNumberUtil)
                                }
                                parser={(value) =>
                                    value.replace(/\$\s?|(,*)/g, '')
                                }
                                bordered={false}
                                style={{
                                    borderRadius: '0px',
                                    borderBottom: '1px solid lightgray',
                                    fontSize: '10px',
                                }}
                            />
                        </Space>
                    )}

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
                            title: 'Remove',
                            arrowPointAtCenter: true,
                        }}
                        mode="remove"
                        size="small"
                        onClick={() => handleExcute('delete')}
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

    const expandable = {
        expandedRowRender: (record) => {
            const { itemID, orderedUom, currency, mclMaterialInfo } = record;

            const {
                fabricCw,
                fabricCwUom,
                fabricWeight,
                fabricWeightUom,
                materialInfo,
            } = mclMaterialInfo;
            const { type: materialInfoType } = materialInfo || {};

            const purchaseOty = (type) => (
                <Space>
                    <InputNumber
                        value={sampleOrder?.[itemID]?.[type]}
                        onChange={(e) => {
                            setSampleOrder((sampleOrder) => ({
                                ...sampleOrder,
                                [itemID]: {
                                    ...sampleOrder[itemID],
                                    [type]: parseInt(e) || 0,
                                },
                            }));
                        }}
                        formatter={(value) => formatNumberUtil(value)}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        bordered={false}
                        style={{
                            borderRadius: '0px',
                            borderBottom: '1px solid lightgray',
                            width: '100%',
                            fontSize: '10px',
                        }}
                    />
                    {adjUom[itemID]?.children}
                </Space>
            );

            return (
                <TableStyle>
                    <table>
                        <tbody>
                            <tr>
                                <th rowSpan="2">SAMPLE ORDER REQUEST</th>
                                <th>Pre-Production Sample</th>
                                <td>
                                    <InputNumber
                                        value={
                                            sampleOrder?.[record.itemID]
                                                ?.preProductionUnitPrice
                                        }
                                        onChange={(e) => {
                                            // e.persist();
                                            setSampleOrder((sampleOrder) => ({
                                                ...sampleOrder,
                                                [record.itemID]: {
                                                    ...sampleOrder[
                                                        record.itemID
                                                    ],
                                                    preProductionUnitPrice: e
                                                        ? parseFloat(e).toFixed(
                                                              2
                                                          )
                                                        : 0,
                                                },
                                            }));
                                        }}
                                        formatter={(value) =>
                                            formatNumberUtil(value)
                                        }
                                        parser={(value) =>
                                            value.replace(/\$\s?|(,*)/g, '')
                                        }
                                        bordered={false}
                                        style={{
                                            borderRadius: '0px',
                                            borderBottom: '1px solid lightgray',
                                            width: '100%',
                                            fontSize: '10px',
                                        }}
                                    />
                                </td>
                                <td> {currency?.name3}</td>
                                <th>PURCHASE QTY</th>
                                <td>
                                    {orderedUom?.name3 ===
                                    adjUom[itemID]?.children ? (
                                        purchaseOty('preProductionQty')
                                    ) : (
                                        <Space>
                                            <Space>
                                                <InputNumber
                                                    value={Math.ceil(
                                                        materialInfoType ===
                                                            'fabric'
                                                            ? handleCalculationResult(
                                                                  sampleOrder?.[
                                                                      itemID
                                                                  ]
                                                                      ?.preProductionQty,
                                                                  adjUom?.[
                                                                      itemID
                                                                  ]?.children,
                                                                  orderedUom?.name3,
                                                                  {
                                                                      cw: fabricCw,
                                                                      cwUom: fabricCwUom?.name3,
                                                                      weight: fabricWeight,
                                                                      weightUom:
                                                                          fabricWeightUom?.name3,
                                                                  }
                                                              ) || 0
                                                            : sampleOrder?.[
                                                                  itemID
                                                              ]
                                                                  ?.preProductionQty /
                                                                  (valueCalculated[
                                                                      itemID
                                                                  ] || 0)
                                                    )}
                                                    disabled={true}
                                                    bordered={false}
                                                    formatter={(value) =>
                                                        formatNumberUtil(value)
                                                    }
                                                    parser={(value) =>
                                                        value.replace(
                                                            /\$\s?|(,*)/g,
                                                            ''
                                                        )
                                                    }
                                                    style={{
                                                        borderRadius: '0px',
                                                        borderBottom:
                                                            '1px solid lightgray',
                                                        fontSize: '10px',
                                                    }}
                                                />
                                                {orderedUom?.name3}
                                            </Space>
                                            {purchaseOty('preProductionQty')}
                                        </Space>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>Advertisement Sample</th>
                                <td>
                                    <InputNumber
                                        value={
                                            sampleOrder?.[record.itemID]
                                                ?.advertisementUnitPrice
                                        }
                                        onChange={(e) => {
                                            setSampleOrder((sampleOrder) => ({
                                                ...sampleOrder,
                                                [record.itemID]: {
                                                    ...sampleOrder[
                                                        record.itemID
                                                    ],
                                                    advertisementUnitPrice: e
                                                        ? parseFloat(e).toFixed(
                                                              2
                                                          )
                                                        : 0,
                                                },
                                            }));
                                        }}
                                        formatter={(value) =>
                                            formatNumberUtil(value)
                                        }
                                        parser={(value) =>
                                            value.replace(/\$\s?|(,*)/g, '')
                                        }
                                        bordered={false}
                                        style={{
                                            borderRadius: '0px',
                                            borderBottom: '1px solid lightgray',
                                            width: '100%',
                                            fontSize: '10px',
                                        }}
                                    />
                                </td>
                                <td> {record.currency?.name3}</td>
                                <th>PURCHASE QTY</th>
                                <td>
                                    {orderedUom?.name3 ===
                                    adjUom[itemID]?.children ? (
                                        purchaseOty('advertisementQty')
                                    ) : (
                                        <Space>
                                            <Space>
                                                <InputNumber
                                                    value={Math.ceil(
                                                        materialInfoType ===
                                                            'fabric'
                                                            ? handleCalculationResult(
                                                                  sampleOrder?.[
                                                                      itemID
                                                                  ]
                                                                      ?.advertisementQty,
                                                                  adjUom?.[
                                                                      itemID
                                                                  ]?.children,
                                                                  orderedUom?.name3,
                                                                  {
                                                                      cw: fabricCw,
                                                                      cwUom: fabricCwUom?.name3,
                                                                      weight: fabricWeight,
                                                                      weightUom:
                                                                          fabricWeightUom?.name3,
                                                                  }
                                                              ) || 0
                                                            : sampleOrder?.[
                                                                  itemID
                                                              ]
                                                                  ?.advertisementQty /
                                                                  (valueCalculated[
                                                                      itemID
                                                                  ] || 0)
                                                    )}
                                                    formatter={(value) =>
                                                        formatNumberUtil(value)
                                                    }
                                                    parser={(value) =>
                                                        value.replace(
                                                            /\$\s?|(,*)/g,
                                                            ''
                                                        )
                                                    }
                                                    disabled={true}
                                                    bordered={false}
                                                    style={{
                                                        borderRadius: '0px',
                                                        borderBottom:
                                                            '1px solid lightgray',
                                                        fontSize: '10px',
                                                    }}
                                                />
                                                {orderedUom?.name3}
                                            </Space>
                                            {purchaseOty('advertisementQty')}
                                        </Space>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ marginTop: '1rem' }}>
                        <CustomTable
                            rowKey="id"
                            initialColumns={dependencyColumn}
                            dataSource={dataSource.reduce((acc, cur) => {
                                if (cur.itemID === record.itemID) {
                                    acc = cur.dependencyItemList.map((v) => ({
                                        ...v,
                                        mclMaterialInfo: cur.mclMaterialInfo,
                                    }));
                                }

                                return acc;
                            }, [])}
                            rowSelection={false}
                            pagination={false}
                        />
                    </div>
                </TableStyle>
            );
        },
    };
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
                expandable={expandable}
                callback={setAdjUom}
            />
            <div>
                <Checkbox
                    checked={orderOptionCheck}
                    onChange={(v) => setOrderOptionCheck(v.target?.checked)}
                    style={{ marginTop: '1rem' }}
                >
                    Do you want add option to "Upcharge" of "Discount"
                </Checkbox>

                {orderOptionCheck &&
                    orderOption?.map((v, i) => {
                        return (
                            <div key={i}>
                                <Row
                                    gutter={[10, 10]}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        marginTop: '0.7rem',
                                    }}
                                >
                                    <Col span={2}>
                                        <div
                                            style={{
                                                fontSize: '0.7rem',
                                                fontWeight: '600',
                                            }}
                                        >
                                            Type
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        <Select
                                            _key="id"
                                            _value="id"
                                            _text="name"
                                            defaultValue={v?.name}
                                            responseData={[
                                                {
                                                    id: 'Upcharge',
                                                    name: 'Upcharge',
                                                },
                                                {
                                                    id: 'Discount on Sale',
                                                    name: 'Discount on Sale',
                                                },
                                            ]}
                                            onChange={(name) =>
                                                setOrderOption(
                                                    orderOption?.map(
                                                        (v2, i2) => {
                                                            if (i === i2) {
                                                                return {
                                                                    ...v2,
                                                                    name: name,
                                                                };
                                                            } else {
                                                                return v2;
                                                            }
                                                        }
                                                    )
                                                )
                                            }
                                            bordered={false}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <Select
                                            _key="id"
                                            _value="id"
                                            _text="name"
                                            defaultValue={v?.type}
                                            responseData={[
                                                { id: 'Num', name: 'Num' },
                                                {
                                                    id: 'Percentage',
                                                    name: 'Percentage',
                                                },
                                            ]}
                                            onChange={(type) =>
                                                setOrderOption(
                                                    orderOption?.map(
                                                        (v2, i2) => {
                                                            if (i === i2) {
                                                                return {
                                                                    ...v2,
                                                                    type: type,
                                                                };
                                                            } else {
                                                                return v2;
                                                            }
                                                        }
                                                    )
                                                )
                                            }
                                            bordered={false}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <Input
                                            type="number"
                                            value={v?.value}
                                            max={
                                                v.type === 'Percentage'
                                                    ? '100'
                                                    : 'false'
                                            }
                                            min="0"
                                            step={
                                                v.type === 'Percentage'
                                                    ? 'false'
                                                    : '0.01'
                                            }
                                            onChange={(value) =>
                                                setOrderOption(
                                                    orderOption?.map(
                                                        (v2, i2) => {
                                                            if (i === i2) {
                                                                return {
                                                                    ...v2,
                                                                    value:
                                                                        v.type ===
                                                                        'Percentage'
                                                                            ? parseInt(
                                                                                  value
                                                                              )
                                                                            : parseFloat(
                                                                                  value
                                                                              ).toFixed(
                                                                                  2
                                                                              ),
                                                                };
                                                            } else {
                                                                return v2;
                                                            }
                                                        }
                                                    )
                                                )
                                            }
                                            style={{ fontSize: '10px' }}
                                            bordered={false}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        {orderOption.length === 1 && (
                                            <Button
                                                onClick={() =>
                                                    setOrderOption(
                                                        (orderOption) => [
                                                            ...orderOption,
                                                            {
                                                                name: '',
                                                                type: '',
                                                                value: 0,
                                                            },
                                                        ]
                                                    )
                                                }
                                            >
                                                ADD
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        );
                    })}
            </div>
        </MclRmWrap>
    );
};

const TableStyle = styled.div`
    table td {
        padding-left: 0.3rem;
        padding-right: 0.3rem;
    }
`;

const MclRmWrap = styled.div`
    .titleWrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
            ${(props) => props.theme.fonts.h7};
        }
    }

    .functionWrap {
        color: '#7f7f7f';
        ${(props) => props.theme.fonts.h5};
    }

    input:disabled {
        color: #000;
    }
`;

export default React.memo(forwardRef(MclRmPoOrderItemDetailInfo));
