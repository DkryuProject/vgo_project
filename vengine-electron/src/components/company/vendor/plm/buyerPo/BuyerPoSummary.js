import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Fragment } from 'react';
import formatNumberUtil from 'core/utils/formatNumberUtil';

const BuyerPoSummary = (props) => {
    const { summary } = props;
    const [sizeColumn, setSizeColumn] = useState([]);

    useEffect(() => {
        setSizeColumn(summary?.[0]?.sizeQuantity);
    }, [summary, setSizeColumn]);

    return (
        <BuyerPoSummaryWrap>
            <div id="buyerPoSummary">
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <CaretRightOutlined />
                            ORDER SUMMARY
                        </Space>
                    </div>
                </div>
                <div className="contentsWrap">
                    <div className="content">
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th rowSpan={2}>Color</th>
                                    <th colSpan={sizeColumn?.length}>
                                        Quantity
                                    </th>
                                    <th rowSpan={2}>Total</th>
                                    <th rowSpan={2}>Unit Price</th>
                                    <th rowSpan={2}>Amount</th>
                                    <th rowSpan={2}>Factory Name</th>
                                </tr>
                                <tr>
                                    {sizeColumn?.map((v) => (
                                        <th key={v.size}>{v.size}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {summary?.map((v, i) => {
                                    return (
                                        <Fragment key={i}>
                                            <tr>
                                                <td>{v.color}</td>
                                                {v.sizeQuantity?.map(
                                                    (v2, i2) => {
                                                        return (
                                                            <td
                                                                key={i2}
                                                                style={{
                                                                    textAlign:
                                                                        'right',
                                                                }}
                                                            >
                                                                {formatNumberUtil(
                                                                    v2.qty
                                                                )}
                                                            </td>
                                                        );
                                                    }
                                                )}
                                                <td
                                                    style={{
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    {formatNumberUtil(
                                                        v.totalQty
                                                    )}
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    {formatNumberUtil(
                                                        v.unitPrice
                                                    )}
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    {formatNumberUtil(v.amount)}
                                                </td>
                                                <td>{v.factory}</td>
                                            </tr>
                                            {summary.length === i + 1 && (
                                                <tr>
                                                    <td>Total</td>
                                                    {v.sizeQuantity?.map(
                                                        (v2, i2) => {
                                                            return (
                                                                <td
                                                                    key={i2}
                                                                    style={{
                                                                        textAlign:
                                                                            'right',
                                                                    }}
                                                                >
                                                                    {formatNumberUtil(
                                                                        summary.reduce(
                                                                            (
                                                                                acc,
                                                                                cur
                                                                            ) => {
                                                                                return (
                                                                                    acc +
                                                                                    Number(
                                                                                        cur.sizeQuantity.find(
                                                                                            (
                                                                                                v3
                                                                                            ) =>
                                                                                                v3.size ===
                                                                                                v2.size
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
                                                            textAlign: 'right',
                                                        }}
                                                    >
                                                        {formatNumberUtil(
                                                            summary.reduce(
                                                                (acc, cur) => {
                                                                    return (
                                                                        acc +
                                                                        Number(
                                                                            cur.totalQty
                                                                        )
                                                                    );
                                                                },
                                                                0
                                                            )
                                                        )}
                                                    </td>

                                                    <td
                                                        style={{
                                                            textAlign: 'right',
                                                        }}
                                                    >
                                                        {formatNumberUtil(
                                                            parseFloat(
                                                                summary.reduce(
                                                                    (
                                                                        acc,
                                                                        cur
                                                                    ) => {
                                                                        return (
                                                                            acc +
                                                                            Number(
                                                                                cur.unitPrice
                                                                            )
                                                                        );
                                                                    },
                                                                    0
                                                                )
                                                            ).toFixed(2)
                                                        )}
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: 'right',
                                                        }}
                                                    >
                                                        {formatNumberUtil(
                                                            parseFloat(
                                                                summary.reduce(
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
                                                            ).toFixed(2)
                                                        )}
                                                    </td>
                                                    <td>{v.factory}</td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </BuyerPoSummaryWrap>
    );
};

const BuyerPoSummaryWrap = styled.div`
    height: 100%;
    margin-top: 1rem;
    overflow: auto;

    padding: 1rem 2rem 1rem 1rem;

    #buyerPoSummary {
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
                        padding: 8px;
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

export default BuyerPoSummary;
