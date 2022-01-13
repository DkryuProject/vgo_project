import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import styled from 'styled-components';

import {
    mclAssignPoPostAsyncAction,
    mclAssignPoGetListsAsyncAction,
} from 'store/mcl/assignPo/reducer';
import { buyerOrderGetIdAsyncAction } from 'store/buyer/order/reducer';
import * as confirm from 'components/common/confirm';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import CustomTable from 'components/common/CustomTable';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

const MclPoAssignSummary = (props) => {
    const { match, initialShow, onShow, onLeftSplit } = props;
    const { mclOptionId } = match.params || '';
    const rowKey = 'orderId';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const buyerOrderGetId = useSelector(
        (state) => state.buyerOrderReducer.get.id
    );
    const handleBuyerOrderGetId = useCallback(
        (payload) => dispatch(buyerOrderGetIdAsyncAction.request(payload)),
        [dispatch]
    );
    const handleBuyerOrderGetIdInit = useCallback(
        () => dispatch(buyerOrderGetIdAsyncAction.initial()),
        [dispatch]
    );

    const mclAssignPoPost = useSelector(
        (state) => state.mclAssignPoReducer.post
    );
    const handleMclAssignPoPost = useCallback(
        (payload) => dispatch(mclAssignPoPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclAssignPoPostInit = useCallback(
        () => dispatch(mclAssignPoPostAsyncAction.initial()),
        [dispatch]
    );

    const handleMclAssignPoGetLists = useCallback(
        (payload) => dispatch(mclAssignPoGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows } = editTableRef.current;

            if (selectedRows.length === 0) {
                return confirm.warningConfirm('No item is selected');
            }
            if (type === 'save') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        const newValues = selectedRows.map((v, i) => {
                            const obj = {
                                mclPreBookingId: v.mclPreBookingId,
                                orderId: v[rowKey],
                                orderItems: v.itemIds,
                            };
                            return obj;
                        });

                        return handleMclAssignPoPost({
                            id: mclOptionId,
                            data: newValues,
                        });
                    }
                });
            }
        },
        [mclOptionId, handleMclAssignPoPost]
    );

    // 조회
    useEffect(() => {
        if (mclOptionId) {
            handleBuyerOrderGetId(mclOptionId);
        }
    }, [mclOptionId, handleBuyerOrderGetId]);

    useEffect(() => {
        setIsLoading(buyerOrderGetId.isLoading);

        if (buyerOrderGetId.data) {
            setDataSource(buyerOrderGetId.data.list);
        }
    }, [buyerOrderGetId]);

    // 등록
    useEffect(() => {
        if (mclAssignPoPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclAssignPoPost.error.message,
            });
        } else if (mclAssignPoPost.data) {
            handleMclAssignPoGetLists(mclOptionId);
            onLeftSplit();
            onShow(initialShow);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful creation of MCL Assign PO',
            });
        }
        return () => handleMclAssignPoPostInit();
    }, [
        mclAssignPoPost,
        mclOptionId,
        initialShow,
        handleNotification,
        handleMclAssignPoGetLists,
        handleMclAssignPoPostInit,
        onLeftSplit,
        onShow,
    ]);

    // 초기화
    useEffect(() => {
        return () => {
            handleBuyerOrderGetIdInit();
        };
    }, [handleBuyerOrderGetIdInit]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'STYLE#',
                dataIndex: 'styleNo',
                ellipsis: true,
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'PO#',
                dataIndex: 'poNo',
                ellipsis: true,
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'QTY',
                dataIndex: 'orderQty',
                ellipsis: true,
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'AMOUNT',
                dataIndex: 'orderAmount',
                ellipsis: true,
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'MARKET',
                dataIndex: 'market',
                ellipsis: true,
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'MANUFACTURE',
                dataIndex: 'manufacture',
                ellipsis: true,
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'START',
                dataIndex: 'shipStart',
                ellipsis: true,
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'END',
                dataIndex: 'shipEnd',
                ellipsis: true,
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
        ],
        []
    );

    const title = useMemo(
        () => () =>
            (
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <CaretRightOutlined />
                            SELECTING BUYER PO TO CONNECT
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
                                        poAssignSummary: {
                                            status: false,
                                        },
                                    });
                                }}
                            />
                        </Space>
                    </div>
                </div>
            ),
        [initialShow, handleExcute, onLeftSplit, onShow]
    );

    return (
        <MclPoAssignSummaryWrap>
            <div id="mclPoAssignSummaryWrap">
                <CustomTable
                    ref={editTableRef}
                    title={title}
                    rowKey={rowKey}
                    initialColumns={columns}
                    dataSource={dataSource}
                    rowSelection={true}
                    loading={isLoading}
                    pagination={false}
                />
            </div>
        </MclPoAssignSummaryWrap>
    );
};

const MclPoAssignSummaryWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #mclPoAssignSummaryWrap {
        min-width: 500px;
        padding: 0.5rem;
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
                .contentTitle {
                    ${({ theme }) => theme.fonts.h5};
                }
            }
        }
    }
`;

export default MclPoAssignSummary;
