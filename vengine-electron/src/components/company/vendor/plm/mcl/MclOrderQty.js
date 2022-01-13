import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useGtag from 'core/hook/useGtag';
import {
    mclOrderQtyGetIdAsyncAction,
    mclOrderQtyPostAsyncAction,
} from 'store/mcl/orderQty/reducer';
import * as confirm from 'components/common/confirm';
import styled from 'styled-components';
import TableButton from 'components/common/table/TableButton';
import { Input, Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import formatNumberUtil from 'core/utils/formatNumberUtil';

const MclOrderQty = (props) => {
    const {
        match,
        // MclOption에서 view로 보여줘야됨
        readOnly,
    } = props;
    const { mclOptionId } = match.params || '';
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
    const [dataSource, setDataSource] = useState(null);
    const [colorGroup, setColorGroup] = useState([]);
    const [marketGroup, setMarketGroup] = useState({});

    const mclOrderQtyGetId = useSelector(
        (state) => state.mclOrderQtyReducer.get.id
    );
    const handleMclOrderQtyGetId = useCallback(
        (payload) => dispatch(mclOrderQtyGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclOrderQtyGetIdInit = useCallback(
        () => dispatch(mclOrderQtyGetIdAsyncAction.request()),
        [dispatch]
    );

    const mclOrderQtyPost = useSelector(
        (state) => state.mclOrderQtyReducer.post
    );
    const handleMclOrderQtyPost = useCallback(
        (payload) => dispatch(mclOrderQtyPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclOrderQtyPostInit = useCallback(
        () => dispatch(mclOrderQtyPostAsyncAction.initial()),
        [dispatch]
    );

    const handleChangeQty = (arr, mclOrderKey, colorKey, value) => {
        return arr.mclOrders.map((v, i) => {
            return i === parseInt(mclOrderKey)
                ? {
                      ...v,
                      colors: v.colors.map((v2, i2) => {
                          return i2 === parseInt(colorKey)
                              ? {
                                    ...v2,
                                    qty: value ? parseInt(value) : 0,
                                }
                              : v2;
                      }),
                  }
                : v;
        });
    };

    const handleSyncQty = useCallback(() => {
        setDataSource((dataSource) => ({
            ...dataSource,
            mclOrders: dataSource.mclOrders.map((v) => {
                return {
                    ...v,
                    colors: v.colors.map((v2) => {
                        return {
                            ...v2,
                            qty: v2.orderQty,
                        };
                    }),
                };
            }),
        }));
    }, [setDataSource]);

    const handleResetQty = useCallback(() => {
        setDataSource((dataSource) => ({
            ...dataSource,
            mclOrders: dataSource.mclOrders.map((v) => {
                return {
                    ...v,
                    colors: v.colors.map((v2) => {
                        return {
                            ...v2,
                            qty: 0,
                        };
                    }),
                };
            }),
        }));
    }, [setDataSource]);

    const handleSumColorQty = useCallback(
        (color, type, market) => {
            if (market) {
                return dataSource?.mclOrders.reduce((acc, cur) => {
                    if (market === cur.market.garmentMarket.name) {
                        for (let v2 of cur.colors) {
                            if (color === v2.color.garmentColor) {
                                acc += v2[type];
                            }
                        }
                    }

                    return acc;
                }, 0);
            } else {
                return dataSource?.mclOrders.reduce((acc, cur) => {
                    for (let v2 of cur.colors) {
                        if (color === v2.color.garmentColor) {
                            acc += v2[type];
                        }
                    }

                    return acc;
                }, 0);
            }
        },
        [dataSource]
    );

    const handleMSumTypeQty = useCallback(
        (type, market) => {
            if (market) {
                return dataSource?.mclOrders?.reduce((acc, cur) => {
                    if (market === cur?.market?.garmentMarket.name) {
                        acc =
                            acc +
                            cur?.colors?.reduce((acc2, cur2) => {
                                if (cur2[type]) {
                                    acc2 = acc2 + cur2[type];
                                }
                                return acc2;
                            }, 0);
                    }

                    return acc;
                }, 0);
            } else {
                return dataSource?.mclOrders?.reduce((acc, cur) => {
                    acc =
                        acc +
                        cur?.colors?.reduce((acc2, cur2) => {
                            if (cur2[type]) {
                                acc2 = acc2 + cur2[type];
                            }
                            return acc2;
                        }, 0);

                    return acc;
                }, 0);
            }
        },
        [dataSource]
    );

    const handleSubmit = useCallback(() => {
        const qtyList = dataSource.mclOrders
            .map((v) => {
                return v.colors.map((v2) => {
                    return {
                        colorId: v2.color.id,
                        id: v2.orderQtyId,
                        market: v.market && v.market.id,
                        qty: v2.qty,
                        sizeId: v.size && v.size.id,
                    };
                });
            })
            .reduce((acc, cur) => {
                return acc.concat(cur);
            }, []);

        const newValues = {
            preMclOrderQtyList: dataSource.preMclOrders.map((v) => ({
                id: v.id,
            })),
            qtyList: qtyList,
        };

        handleMclOrderQtyPost({ id: mclOptionId, data: newValues });
    }, [mclOptionId, dataSource, handleMclOrderQtyPost]);

    const handleExcute = useCallback(
        (type) => {
            if (type === 'save') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        handleSubmit();
                    }
                });
            } else if (type === 'reset') {
                confirm.warningConfirm('Reset', (e) => {
                    if (e) {
                        handleResetQty();
                    }
                });
            } else if (type === 'sync') {
                confirm.warningConfirm('sync', (e) => {
                    if (e) {
                        handleSyncQty();
                    }
                });
            }
        },
        [handleSubmit, handleResetQty, handleSyncQty]
    );

    const mclGarmentColorGetLists = useSelector(
        (state) => state.mclGarmentColorReducer.get.lists
    );
    const mclGarmentSizeGetLists = useSelector(
        (state) => state.mclGarmentSizeReducer.get.lists
    );
    const mclGarmentMarketGetLists = useSelector(
        (state) => state.mclGarmentMarketReducer.get.lists
    );

    // 조회
    useEffect(() => {
        if (mclOptionId) {
            if (mclGarmentColorGetLists.data?.list.length) {
                handleMclOrderQtyGetId(mclOptionId);
            } else {
                // 초기화
                setDataSource(null);
                // handleMclOrderQtyGetIdInit();
            }
        }
        return () => handleMclOrderQtyGetIdInit();
    }, [
        mclOptionId,
        mclGarmentColorGetLists,
        mclGarmentSizeGetLists,
        mclGarmentMarketGetLists,
        handleMclOrderQtyGetId,
        handleMclOrderQtyGetIdInit,
        setDataSource,
    ]);

    useEffect(() => {
        if (mclOrderQtyGetId.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclOrderQtyGetId.error.message,
            });
        } else if (mclOrderQtyGetId.data) {
            const _dataSource = mclOrderQtyGetId.data.data.preMclOrders.reduce(
                (acc, cur) => {
                    const color = cur.color.garmentColor;
                    if (acc[color]) {
                        acc[color] = acc[color] + cur.total;
                    } else {
                        acc[color] = cur.total;
                    }
                    return acc;
                },
                {}
            );

            // preMclOrders가 있던 경우
            if (Object.keys(_dataSource).length > 0) {
                setDataSource((dataSource) => ({
                    ...dataSource,
                    mclOrders: mclOrderQtyGetId.data.data.mclOrders.map(
                        (v, i) => {
                            return {
                                ...v,
                                colors: v.colors.map((v2) => {
                                    return {
                                        ...v2,
                                        qty:
                                            i === 0
                                                ? _dataSource[
                                                      v2.color.garmentColor
                                                  ] || 0
                                                : 0,
                                    };
                                }),
                            };
                        }
                    ),
                    preMclOrders: mclOrderQtyGetId.data.data.preMclOrders,
                }));
            } else {
                setDataSource(mclOrderQtyGetId.data.data);
            }
        }
    }, [mclOrderQtyGetId, handleNotification, setDataSource]);

    // size group 및 market group 생성
    useEffect(() => {
        if (dataSource) {
            const _colorGroup = dataSource.mclOrders.reduce((acc, cur) => {
                for (let v of cur.colors) {
                    if (acc.indexOf(v.color.garmentColor) === -1) {
                        acc.push(v.color.garmentColor);
                    }
                }

                return acc;
            }, []);
            // row에 po qty와 qty의 합계로 인해 totalOrderQty 배열 추가
            setColorGroup([..._colorGroup, 'TOTAL ORDER QTY']);

            const _marketGroup = dataSource.mclOrders.reduce((acc, cur) => {
                const market = cur.market && cur.market.garmentMarket.name;
                if (acc[market]) {
                    acc[market] = acc[market] + 1;
                } else {
                    acc[market] = 1;
                }
                return acc;
            }, {});

            setMarketGroup(_marketGroup);
        }
    }, [dataSource, setColorGroup, setMarketGroup]);

    // 등록
    useEffect(() => {
        if (mclOrderQtyPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclOrderQtyPost.error.message,
            });
        } else if (mclOrderQtyPost.data) {
            handleMclOrderQtyGetId(mclOptionId);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful creation of MCL Garment Qty',
            });
        }
        return () => handleMclOrderQtyPostInit();
    }, [
        mclOrderQtyPost,
        mclOptionId,
        handleMclOrderQtyGetId,
        handleMclOrderQtyPostInit,
        handleNotification,
    ]);

    // Gtag
    useEffect(() => {
        if (!readOnly) {
            trackPageView({
                page_title: `ORDER QTY | MCL OPTION DETAIL | DESIGN COVER | PLM  `,
            });
        }
    }, [readOnly, trackPageView]);

    return (
        <MclOrderQtyWrap readOnly={readOnly}>
            <div id="mclOrderQtyWrap">
                {readOnly || (
                    <div className="titleWrap">
                        <div className="title">
                            <Space>
                                <CaretRightOutlined />
                                GARMENT ORDER QTY
                            </Space>
                        </div>

                        <div className="functionWrap">
                            <Space>
                                <TableButton
                                    toolTip={{
                                        placement: 'topLeft',
                                        title: 'Sync Item',
                                        arrowPointAtCenter: true,
                                    }}
                                    size="small"
                                    onClick={() => handleExcute('sync')}
                                >
                                    Sync
                                </TableButton>

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
                                        title: 'Reset Item',
                                        arrowPointAtCenter: true,
                                    }}
                                    mode="reset"
                                    size="small"
                                    onClick={() => handleExcute('reset')}
                                />
                            </Space>
                        </div>
                    </div>
                )}

                <div className="contentsWrap">
                    <div className="content">
                        <table>
                            <thead>
                                <tr>
                                    <th rowSpan={2}>Market</th>
                                    <th rowSpan={2}>Size</th>

                                    {colorGroup.map((v) => {
                                        return (
                                            <th key={v} colSpan={2}>
                                                {v}
                                            </th>
                                        );
                                    })}
                                </tr>
                                <tr>
                                    {colorGroup.map((v) => {
                                        return (
                                            <Fragment key={v}>
                                                <th>PO</th>
                                                <th>Input</th>
                                            </Fragment>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {dataSource &&
                                    dataSource.mclOrders.map((v, i) => {
                                        return (
                                            <Fragment key={i}>
                                                <tr key={i}>
                                                    {marketGroup[
                                                        v.market &&
                                                            v.market
                                                                .garmentMarket
                                                                .name
                                                    ] &&
                                                        !(
                                                            i %
                                                            marketGroup[
                                                                v.market &&
                                                                    v.market
                                                                        .garmentMarket
                                                                        .name
                                                            ]
                                                        ) && (
                                                            <td
                                                                rowSpan={
                                                                    marketGroup[
                                                                        v.market &&
                                                                            v
                                                                                .market
                                                                                .garmentMarket
                                                                                .name
                                                                    ]
                                                                }
                                                                className="market"
                                                            >
                                                                {v.market
                                                                    ? v.market
                                                                          .garmentMarket
                                                                          .name
                                                                    : 'unidentified'}
                                                            </td>
                                                        )}

                                                    <td>
                                                        {v.size
                                                            ? v.size.garmentSize
                                                                  .name
                                                            : 'unidentified'}
                                                    </td>
                                                    {v.colors.map((v2, i2) => {
                                                        return (
                                                            <Fragment key={i2}>
                                                                <td>
                                                                    {formatNumberUtil(
                                                                        v2.orderQty
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {readOnly ? (
                                                                        formatNumberUtil(
                                                                            v2.qty
                                                                        )
                                                                    ) : (
                                                                        <Input
                                                                            value={
                                                                                v2.qty
                                                                            }
                                                                            data-order={
                                                                                i
                                                                            }
                                                                            data-color={
                                                                                i2
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                e.persist();

                                                                                const {
                                                                                    dataset,
                                                                                    value,
                                                                                } =
                                                                                    e.target;
                                                                                const {
                                                                                    order,
                                                                                    color,
                                                                                } =
                                                                                    dataset;

                                                                                return setDataSource(
                                                                                    (
                                                                                        dataSource
                                                                                    ) => ({
                                                                                        ...dataSource,
                                                                                        mclOrders:
                                                                                            handleChangeQty(
                                                                                                dataSource,
                                                                                                order,
                                                                                                color,
                                                                                                value
                                                                                            ),
                                                                                    })
                                                                                );
                                                                            }}
                                                                            size="small"
                                                                            bordered={
                                                                                false
                                                                            }
                                                                        />
                                                                    )}
                                                                </td>
                                                                {v.colors
                                                                    ?.length ===
                                                                    i2 + 1 && (
                                                                    <>
                                                                        <td>
                                                                            {formatNumberUtil(
                                                                                v.colors.reduce(
                                                                                    (
                                                                                        acc,
                                                                                        cur
                                                                                    ) => {
                                                                                        acc =
                                                                                            acc +
                                                                                            cur?.orderQty;
                                                                                        return acc;
                                                                                    },
                                                                                    0
                                                                                )
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {formatNumberUtil(
                                                                                v.colors.reduce(
                                                                                    (
                                                                                        acc,
                                                                                        cur
                                                                                    ) => {
                                                                                        acc =
                                                                                            acc +
                                                                                            cur?.qty;
                                                                                        return acc;
                                                                                    },
                                                                                    0
                                                                                )
                                                                            )}
                                                                        </td>
                                                                    </>
                                                                )}
                                                            </Fragment>
                                                        );
                                                    })}
                                                </tr>
                                                {/* Sub total */}
                                                {v.market &&
                                                Object.keys(marketGroup).find(
                                                    (v2) =>
                                                        v2 ===
                                                            v.market
                                                                .garmentMarket
                                                                .name &&
                                                        !(
                                                            (i + 1) %
                                                            marketGroup[v2]
                                                        )
                                                ) ? (
                                                    <tr className="total">
                                                        <td colSpan={2}>
                                                            Sub Total
                                                        </td>
                                                        {colorGroup.map(
                                                            (v2, i2) => {
                                                                return (
                                                                    <Fragment
                                                                        key={i2}
                                                                    >
                                                                        <td>
                                                                            {colorGroup?.length ===
                                                                            i2 +
                                                                                1
                                                                                ? formatNumberUtil(
                                                                                      handleMSumTypeQty(
                                                                                          'orderQty',
                                                                                          v
                                                                                              .market
                                                                                              .garmentMarket
                                                                                              .name
                                                                                      )
                                                                                  )
                                                                                : formatNumberUtil(
                                                                                      handleSumColorQty(
                                                                                          v2,
                                                                                          'orderQty',
                                                                                          v
                                                                                              .market
                                                                                              .garmentMarket
                                                                                              .name
                                                                                      )
                                                                                  )}
                                                                        </td>
                                                                        <td>
                                                                            {colorGroup?.length ===
                                                                            i2 +
                                                                                1
                                                                                ? formatNumberUtil(
                                                                                      handleMSumTypeQty(
                                                                                          'qty',
                                                                                          v
                                                                                              .market
                                                                                              .garmentMarket
                                                                                              .name
                                                                                      )
                                                                                  )
                                                                                : formatNumberUtil(
                                                                                      handleSumColorQty(
                                                                                          v2,
                                                                                          'qty',
                                                                                          v
                                                                                              .market
                                                                                              .garmentMarket
                                                                                              .name
                                                                                      )
                                                                                  )}
                                                                        </td>
                                                                    </Fragment>
                                                                );
                                                            }
                                                        )}
                                                    </tr>
                                                ) : null}
                                            </Fragment>
                                        );
                                    })}
                            </tbody>
                            <tfoot>
                                <tr className="total">
                                    <td colSpan={2}>Grand Total</td>
                                    {colorGroup.map((v, i) => {
                                        return (
                                            <Fragment key={i}>
                                                <td>
                                                    {colorGroup?.length ===
                                                    i + 1
                                                        ? formatNumberUtil(
                                                              handleMSumTypeQty(
                                                                  'orderQty'
                                                              )
                                                          )
                                                        : formatNumberUtil(
                                                              handleSumColorQty(
                                                                  v,
                                                                  'orderQty'
                                                              )
                                                          )}
                                                </td>
                                                <td>
                                                    {colorGroup?.length ===
                                                    i + 1
                                                        ? formatNumberUtil(
                                                              handleMSumTypeQty(
                                                                  'qty'
                                                              )
                                                          )
                                                        : formatNumberUtil(
                                                              handleSumColorQty(
                                                                  v,
                                                                  'qty'
                                                              )
                                                          )}
                                                </td>
                                            </Fragment>
                                        );
                                    })}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </MclOrderQtyWrap>
    );
};

const MclOrderQtyWrap = styled.div`
    ${(props) => props.readOnly || 'height: 100%'};
    // padding: 1rem;
    overflow: auto;
    padding: 0 2rem 2rem 0;

    #mclOrderQtyWrap {
        min-width: 500px;
        // border: 1px solid red;
        padding: 0.5rem 0.5rem 2rem 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                ${({ theme }) => theme.fonts.h7};
            }
        }

        .contentsWrap {
            margin-top: 1rem;
            .content {
                ${({ theme }) => theme.fonts.h5};
                table {
                    width: 100%;
                    thead tr th {
                        padding: 6px;
                        color: #000000;
                        text-align: center;
                        background-color: #b3d5d6;
                        border-top: 1px solid #000000;
                        border-bottom: 1px solid #000000;
                    }
                    tr {
                        background-color: #ffffff;
                    }
                    tr td {
                        padding: 6px;
                        text-align: center;
                        border: 1px dotted lightgray;
                        ${(props) => props.theme.fonts.h5};
                        &.market {
                            color: #000000;
                            background-color: #b3d5d6;
                        }
                    }
                    tbody tr.total,
                    tfoot tr.total {
                        ${(props) => props.theme.fonts.h6};
                        background-color: #d0dbf0;
                        border-top: 1px solid #000000;
                        border-bottom: 1px solid #000000;
                    }

                    .ant-input {
                        border-bottom: 1px solid lightgray;
                        border-radius: 0px;
                        ${(props) => props.theme.fonts.h5};
                    }
                }
            }
        }
    }
`;

export default React.memo(MclOrderQty);
