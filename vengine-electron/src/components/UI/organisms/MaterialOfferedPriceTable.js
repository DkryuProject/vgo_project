import React, { useMemo } from 'react';
import { Button, Ellipsis, Tooltip } from 'components/UI/atoms';
import { EditTable, TitleWrap } from 'components/UI/molecules';
import { Fragment } from 'react';

const OfferedPrice = (props) => {
    const {
        type,
        isDisabled,
        materialOfferTable,
        materialOfferRowKey,
        materialOfferDataSource,
        onMaterialOfferOpenDrawer,
        onMaterialOfferClickRow,
        onMaterialOfferMakeMyOwn,
        rowSelectionType, // CBD Assign
    } = props;

    const columns = useMemo(
        () => [
            {
                title: 'Material No.(Original)',
                dataIndex: 'originalMaterialNo',
                align: 'left',
                ellipsis: true,
                width: isDisabled ? '0' : '7%',
                render: (data) => (
                    <Tooltip title={data || '-'}>{data || '-'}</Tooltip>
                ),
            },
            {
                title: 'Material No.',
                dataIndex: 'materialNo',
                align: 'left',
                ellipsis: true,
                render: (data) => (
                    <Tooltip title={data || '-'}>{data || '-'}</Tooltip>
                ),
            },
            {
                title: 'Buying Company',
                dataIndex: 'recipient',
                align: 'left',
                ellipsis: true,
                render: (data) => (
                    <Tooltip title={data?.name || 'ALL'}>
                        {data?.name || 'ALL'}
                    </Tooltip>
                ),
            },
            // {
            //     title: 'Buyer Company',
            //     dataIndex: 'buyer',
            //     align: 'left',
            //     ellipsis: true,
            //     render: (data) => (
            //         <Tooltip title={data?.name || '-'}>
            //             {data?.name || '-'}
            //         </Tooltip>
            //     ),
            // },
            // {
            //     title: 'Brand Company',
            //     dataIndex: 'brand',
            //     align: 'left',
            //     ellipsis: true,
            //     render: (data) => (
            //         <Tooltip title={data?.name || '-'}>
            //             {data?.name || '-'}
            //         </Tooltip>
            //     ),
            // },
            {
                title: 'Item Size Options',
                dataIndex: 'itemSizeOption',
                align: 'left',
                width: type === 'fabric' ? '0' : '10%',
                ellipsis: true,
                render: (data) => {
                    const { size, sizeUom } = data;
                    const output = (
                        <Ellipsis>
                            * Item Size :{' '}
                            {size ? (
                                <span>
                                    {size} {sizeUom?.name3}
                                </span>
                            ) : (
                                '-'
                            )}
                        </Ellipsis>
                    );

                    return <Tooltip title={output}>{output}</Tooltip>;
                },
            },
            {
                title: 'Item Options',
                dataIndex: 'itemOption',
                width: type !== 'accessories' ? '20%' : '0',
                align: 'left',
                ellipsis: true,
                render: (data, record) => {
                    const {
                        cw,
                        cwUom,
                        weight,
                        weightUom,
                        finishing,
                        dyeing,
                        printing,
                    } = data || {};
                    const { fabricFullWidth, fullWidthUom } = record || {};
                    const output = (
                        <Fragment>
                            <Ellipsis>
                                * FW / CW / Weight:{' '}
                                {fabricFullWidth ? (
                                    <span>
                                        {fabricFullWidth}{' '}
                                        {fullWidthUom?.name3 || '-'}
                                    </span>
                                ) : (
                                    '-'
                                )}{' '}
                                /{' '}
                                {cw ? (
                                    <span>
                                        {cw} {cwUom?.name3 || '-'}
                                    </span>
                                ) : (
                                    '-'
                                )}{' '}
                                /{' '}
                                {weight ? (
                                    <span>
                                        {' '}
                                        {weight} {weightUom?.name3 || '-'}
                                    </span>
                                ) : (
                                    '-'
                                )}
                            </Ellipsis>
                            <Ellipsis>
                                * Post Processing: {finishing || '-'}{' '}
                            </Ellipsis>
                            {type === 'fabric' && (
                                <Fragment>
                                    <Ellipsis>
                                        * Dyeing: {dyeing || '-'}{' '}
                                    </Ellipsis>
                                    <Ellipsis>
                                        * Printing: {printing || '-'}{' '}
                                    </Ellipsis>
                                </Fragment>
                            )}
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    <div>
                                        * FW / CW / Weight:{' '}
                                        {fabricFullWidth ? (
                                            <span>
                                                {fabricFullWidth}{' '}
                                                {fullWidthUom?.name3 || '-'}
                                            </span>
                                        ) : (
                                            '-'
                                        )}{' '}
                                        /{' '}
                                        {cw ? (
                                            <span>
                                                {cw} {cwUom?.name3 || '-'}
                                            </span>
                                        ) : (
                                            '-'
                                        )}{' '}
                                        /{' '}
                                        {weight ? (
                                            <span>
                                                {' '}
                                                {weight}{' '}
                                                {weightUom?.name3 || '-'}
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </div>
                                    <div>
                                        * Post Processing: {finishing || '-'}{' '}
                                    </div>
                                    {type === 'fabric' && (
                                        <Fragment>
                                            <div>
                                                * Dyeing: {dyeing || '-'}{' '}
                                            </div>
                                            <div>
                                                * Printing: {printing || '-'}{' '}
                                            </div>
                                        </Fragment>
                                    )}
                                </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },

            {
                title: 'Unit Price & UOM',
                align: 'left',
                ellipsis: true,
                render: (_, record) => {
                    const { unitPrice, currency, uom } = record || {};
                    const output = (
                        <Fragment>
                            <Ellipsis>
                                * Currency: {currency?.name2 || '-'}
                            </Ellipsis>
                            <Ellipsis>
                                * Unit Price: {currency?.name3 || '-'}{' '}
                                {unitPrice || '-'}
                            </Ellipsis>
                            <Ellipsis>* UOM: {uom?.name3 || '-'}</Ellipsis>
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    <div>
                                        * Currency: {currency?.name2 || '-'}
                                    </div>
                                    <div>
                                        * Unit Price: {currency?.name3 || '-'}{' '}
                                        {unitPrice || '-'}
                                    </div>
                                    <div>* UOM: {uom?.name3 || '-'}</div>
                                </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Item Tag',
                align: 'left',
                width: type === 'fabric' ? '10%' : '0',
                ellipsis: true,
                render: (data) => {
                    const {
                        function: _function,
                        performance,
                        characteristic,
                        solid_pattern,
                        stretch,
                    } = data || {};

                    const output = (
                        <Fragment>
                            <Ellipsis>
                                * Characteristic: {characteristic || '-'}
                            </Ellipsis>
                            <Ellipsis>
                                * Pattern: {solid_pattern || '-'}
                            </Ellipsis>
                            <Ellipsis>
                                * Performance: {performance || '-'}
                            </Ellipsis>
                            <Ellipsis>
                                * Stretch: stretch: {stretch || '-'}
                            </Ellipsis>
                            <Ellipsis>* Function: {_function || '-'}</Ellipsis>
                        </Fragment>
                    );

                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    <div>
                                        * Characteristic:{' '}
                                        {characteristic || '-'}
                                    </div>
                                    <div>* Pattern: {solid_pattern || '-'}</div>
                                    <div>
                                        * Performance: {performance || '-'}
                                    </div>
                                    <div>
                                        * Stretch: stretch: {stretch || '-'}
                                    </div>
                                    <div>* Function: {_function || '-'}</div>
                                </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Order Condition',
                align: 'left',
                ellipsis: true,
                render: (_, record) => {
                    const { mcq, moq, lead_time } = record || {};
                    const output = (
                        <Fragment>
                            <Ellipsis>* MCQ: {mcq ?? '-'}</Ellipsis>
                            <Ellipsis>* MOQ: {moq ?? '-'}</Ellipsis>
                            <Ellipsis>* Lead Time: {lead_time || '-'}</Ellipsis>
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    <div>* MCQ: {mcq ?? '-'}</div>
                                    <div>* MOQ: {moq ?? '-'}</div>
                                    <div>* Lead Time: {lead_time || '-'}</div>
                                </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Modified Date/Time/By',
                dataIndex: 'updated',
                align: 'left',
                ellipsis: true,
                render: (data, record) => {
                    const output = (
                        <Fragment>
                            <Ellipsis>* Modified Data/Time: {data}</Ellipsis>
                            <Ellipsis>
                                * By: {record?.createdBy?.userName}
                            </Ellipsis>
                        </Fragment>
                    );
                    return (
                        <Tooltip
                            title={
                                <Fragment>
                                    <div>* Modified Data/Time: {data}</div>
                                    <div>
                                        * By: {record?.createdBy?.userName}
                                    </div>
                                </Fragment>
                            }
                        >
                            {output}
                        </Tooltip>
                    );
                },
            },
        ],
        [isDisabled, type]
    );

    const title = () => (
        <TitleWrap>
            <TitleWrap.Title suffix>OFFERED PRICE</TitleWrap.Title>
            <TitleWrap.Function>
                {isDisabled && (
                    <Button
                        tooltip={{ title: 'Make My Own' }}
                        onClick={onMaterialOfferMakeMyOwn}
                    >
                        Make My Own
                    </Button>
                )}
                <Button
                    mode="write"
                    tooltip={{ title: 'Create' }}
                    onClick={onMaterialOfferOpenDrawer}
                />
            </TitleWrap.Function>
        </TitleWrap>
    );

    const onRow = (record) => {
        const { id } = record;

        return {
            onClick: () => onMaterialOfferClickRow?.(id),
        };
    };

    return (
        <EditTable
            ref={materialOfferTable}
            rowKey={materialOfferRowKey}
            title={title}
            initialColumns={columns}
            dataSource={materialOfferDataSource}
            pagination={false}
            rowSelection={true}
            rowSelectionType={rowSelectionType}
            onRow={onRow}
        />
    );
};

export default OfferedPrice;
