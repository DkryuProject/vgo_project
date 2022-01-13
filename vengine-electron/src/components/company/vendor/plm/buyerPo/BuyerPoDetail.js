import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Fragment } from 'react';
import dateFormat from 'core/utils/dateUtil';
import formatNumberUtil from 'core/utils/formatNumberUtil';

const BuyerPoDetail = (props) => {
    const { detail } = props;
    const [sizeColumn, setSizeColumn] = useState([]);

    useEffect(() => {
        setSizeColumn(
            detail.reduce((acc, cur) => {
                const orderSummaries = cur.orderSummaries[0];
                const sizeQuantity = [...orderSummaries.sizeQuantity].sort(
                    (a, b) => {
                        return a.size - b.size;
                    }
                );
                if (acc.length === 0) {
                    return (acc = [...sizeQuantity]);
                } else if (acc.length < sizeQuantity.length) {
                    return (acc = [...sizeQuantity]);
                }

                return acc;
            }, [])
        );
    }, [detail, setSizeColumn]);

    return (
        <BuyerPoDetailWrap>
            <div id="buyerPoDetail">
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <CaretRightOutlined />
                            ORDER DETAIL
                        </Space>
                    </div>
                </div>
                <div className="contentsWrap">
                    <div className="content">
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th colSpan={3}>Shipping window</th>
                                    <th rowSpan={2}>Market</th>
                                    <th rowSpan={2}>Destination</th>
                                    <th rowSpan={2}>Color</th>
                                    <th
                                        rowSpan={sizeColumn?.length ? 1 : 2}
                                        colSpan={sizeColumn?.length}
                                    >
                                        Quantity
                                    </th>
                                    <th rowSpan={2}>Total</th>
                                    <th rowSpan={2}>Unit Price</th>
                                    <th rowSpan={2}>Amount</th>
                                    <th rowSpan={2}>Factory Name</th>
                                </tr>
                                <tr>
                                    <th>PO</th>

                                    <th>Start</th>
                                    <th>End</th>
                                    {sizeColumn?.map((v) => (
                                        <th key={v.size}>{v.size}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {detail.map((v, i) => {
                                    const rowSpan = v.orderSummaries.length + 2;
                                    return (
                                        <Fragment key={i}>
                                            <tr>
                                                <td rowSpan={rowSpan}>
                                                    {v.documentRefNumber}
                                                </td>
                                                <td rowSpan={rowSpan}>
                                                    {dateFormat(
                                                        v.shippingWindow.start,
                                                        'dateOfBirth'
                                                    )}
                                                </td>
                                                <td rowSpan={rowSpan}>
                                                    {dateFormat(
                                                        v.shippingWindow.end,
                                                        'dateOfBirth'
                                                    )}
                                                </td>
                                                <td rowSpan={rowSpan}>
                                                    {v.market}
                                                </td>
                                                <td rowSpan={rowSpan}>
                                                    {v.destination}
                                                </td>
                                            </tr>

                                            {v.orderSummaries.map((v2, i2) => {
                                                let sizeQuantity = [
                                                    ...v2.sizeQuantity,
                                                ];
                                                sizeQuantity =
                                                    sizeQuantity.sort(
                                                        (a, b) => {
                                                            return (
                                                                a.size - b.size
                                                            );
                                                        }
                                                    );
                                                return (
                                                    <Fragment key={i2}>
                                                        <tr>
                                                            <td>{v2.color}</td>
                                                            {sizeQuantity.map(
                                                                (v3, i3) => {
                                                                    return (
                                                                        <td
                                                                            key={
                                                                                i3
                                                                            }
                                                                            style={{
                                                                                textAlign:
                                                                                    'right',
                                                                            }}
                                                                        >
                                                                            {formatNumberUtil(
                                                                                v3.qty
                                                                            )}
                                                                        </td>
                                                                    );
                                                                }
                                                            )}
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        'right',
                                                                }}
                                                            >
                                                                {formatNumberUtil(
                                                                    v2.totalQty
                                                                )}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        'right',
                                                                }}
                                                            >
                                                                {formatNumberUtil(
                                                                    parseFloat(
                                                                        v2.unitPrice
                                                                    ).toFixed(2)
                                                                )}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        'right',
                                                                }}
                                                            >
                                                                {formatNumberUtil(
                                                                    parseFloat(
                                                                        v2.amount
                                                                    ).toFixed(2)
                                                                )}
                                                            </td>
                                                            {i2 === 0 && (
                                                                <td
                                                                    rowSpan={
                                                                        rowSpan
                                                                    }
                                                                >
                                                                    {v2.factory}
                                                                </td>
                                                            )}
                                                        </tr>
                                                        {v.orderSummaries
                                                            .length ===
                                                            i2 + 1 && (
                                                            <tr>
                                                                <td>
                                                                    Sub Total
                                                                </td>
                                                                {sizeQuantity.map(
                                                                    (
                                                                        v3,
                                                                        i3
                                                                    ) => {
                                                                        return (
                                                                            <td
                                                                                key={
                                                                                    i3
                                                                                }
                                                                                style={{
                                                                                    textAlign:
                                                                                        'right',
                                                                                }}
                                                                            >
                                                                                {formatNumberUtil(
                                                                                    v.orderSummaries.reduce(
                                                                                        (
                                                                                            acc,
                                                                                            cur
                                                                                        ) => {
                                                                                            return (
                                                                                                acc +
                                                                                                Number(
                                                                                                    cur.sizeQuantity.find(
                                                                                                        (
                                                                                                            v4
                                                                                                        ) =>
                                                                                                            v4.size ===
                                                                                                            v3.size
                                                                                                    )
                                                                                                        .qty
                                                                                                )
                                                                                            );
                                                                                        },
                                                                                        0
                                                                                    )
                                                                                )}
                                                                            </td>
                                                                        );
                                                                    }
                                                                )}
                                                                <td
                                                                    style={{
                                                                        textAlign:
                                                                            'right',
                                                                    }}
                                                                >
                                                                    {formatNumberUtil(
                                                                        parseFloat(
                                                                            v.orderSummaries.reduce(
                                                                                (
                                                                                    acc,
                                                                                    cur
                                                                                ) => {
                                                                                    return (
                                                                                        acc +
                                                                                        Number(
                                                                                            cur.totalQty
                                                                                        )
                                                                                    );
                                                                                },
                                                                                0
                                                                            )
                                                                        ).toFixed(
                                                                            2
                                                                        )
                                                                    )}
                                                                </td>
                                                                <td></td>
                                                                <td
                                                                    style={{
                                                                        textAlign:
                                                                            'right',
                                                                    }}
                                                                >
                                                                    {formatNumberUtil(
                                                                        parseFloat(
                                                                            v.orderSummaries.reduce(
                                                                                (
                                                                                    acc,
                                                                                    cur
                                                                                ) => {
                                                                                    return (
                                                                                        acc +
                                                                                        Number(
                                                                                            cur.amount
                                                                                        )
                                                                                    );
                                                                                },
                                                                                0
                                                                            )
                                                                        ).toFixed(
                                                                            2
                                                                        )
                                                                    )}
                                                                </td>
                                                                {/* <td>factory</td> */}
                                                            </tr>
                                                        )}
                                                    </Fragment>
                                                );
                                            })}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </BuyerPoDetailWrap>
    );
};

const BuyerPoDetailWrap = styled.div`
    height: 100%;
    margin-top: 1rem;
    overflow: auto;
    padding: 1rem 2rem 2rem 1rem;

    #buyerPoDetail {
        min-width: 500px;

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
                }
            }
        }
    }
`;

export default BuyerPoDetail;
