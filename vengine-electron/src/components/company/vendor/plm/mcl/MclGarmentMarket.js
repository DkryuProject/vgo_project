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
    mclGarmentMarketPostAsyncAction,
    mclGarmentMarketGetListsAsyncAction,
    mclGarmentMarketDeleteAsyncAction,
} from 'store/mcl/garmentMarket/reducer';
import * as confirm from 'components/common/confirm';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import CustomTable from 'components/common/CustomTable';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

const MclGarmentMarket = (props) => {
    const { match, initialShow, onShow, onLeftSplit } = props;
    const { mclOptionId } = match.params || '';
    const rowKey = 'id';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const mclGarmentMarketGetLists = useSelector(
        (state) => state.mclGarmentMarketReducer.get.lists
    );
    const handleMclGarmentMarketGetLists = useCallback(
        (payload) =>
            dispatch(mclGarmentMarketGetListsAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclGarmentMarketGetListsInit = useCallback(
        () => dispatch(mclGarmentMarketGetListsAsyncAction.initial()),
        [dispatch]
    );

    const mclGarmentMarketPost = useSelector(
        (state) => state.mclGarmentMarketReducer.post
    );
    const handleMclGarmentMarketPost = useCallback(
        (payload) => dispatch(mclGarmentMarketPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclGarmentMarketPostInit = useCallback(
        () => dispatch(mclGarmentMarketPostAsyncAction.initial()),
        [dispatch]
    );

    const mclGarmentMarketDelete = useSelector(
        (state) => state.mclGarmentMarketReducer.delete
    );
    const handleMclGarmentMarketDelete = useCallback(
        (payload) =>
            dispatch(mclGarmentMarketDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclGarmentMarketDeleteInit = useCallback(
        () => dispatch(mclGarmentMarketDeleteAsyncAction.initial()),
        [dispatch]
    );

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows, selectedRowKeys } = editTableRef.current;

            if (selectedRows.length === 0) {
                return confirm.warningConfirm('No item is selected');
            }
            if (type === 'save') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        const newValues = selectedRows.map((v, i) => {
                            const obj = {
                                garmentMarketId: v.garmentMarket.id,
                                id: v.rowStatus === 'new' ? null : v[rowKey],
                                poGarmentMarket: v.poGarmentMarket
                                    ? v.poGarmentMarket.id
                                    : '',
                            };
                            return obj;
                        });
                        return handleMclGarmentMarketPost({
                            id: mclOptionId,
                            data: newValues,
                        });
                    }
                });
            } else if (type === 'delete') {
                confirm.deleteConfirm((e) => {
                    if (e) {
                        return handleMclGarmentMarketDelete(
                            selectedRowKeys.filter((v) => typeof v !== 'string')
                        );
                    }
                });
            }
        },
        [mclOptionId, handleMclGarmentMarketPost, handleMclGarmentMarketDelete]
    );

    // 조회
    useEffect(() => {
        if (mclOptionId) {
            handleMclGarmentMarketGetLists(mclOptionId);
        }
    }, [mclOptionId, handleMclGarmentMarketGetLists]);

    useEffect(() => {
        setIsLoading(mclGarmentMarketGetLists.isLoading);

        if (mclGarmentMarketGetLists.data) {
            setDataSource(mclGarmentMarketGetLists.data.list);
        }
    }, [mclGarmentMarketGetLists]);

    // 등록
    useEffect(() => {
        if (mclGarmentMarketPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclGarmentMarketPost.error.message,
            });
        } else if (mclGarmentMarketPost.data) {
            handleMclGarmentMarketGetLists(mclOptionId);
            onLeftSplit();
            onShow(initialShow);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful creation of MCL Garment Market',
            });
        }
    }, [
        mclGarmentMarketPost,
        mclOptionId,
        initialShow,
        handleMclGarmentMarketGetLists,
        handleNotification,
        onShow,
        onLeftSplit,
    ]);

    // 삭제
    useEffect(() => {
        if (mclGarmentMarketDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclGarmentMarketDelete.error.message,
            });
        } else if (mclGarmentMarketDelete.data) {
            const { selectedRows, dataSource } = editTableRef.current;
            let result = [];
            for (let v1 of dataSource) {
                if (!selectedRows.find((v2) => v2[rowKey] === v1[rowKey])) {
                    result.push(v1);
                }
            }
            setDataSource(result);
            handleMclGarmentMarketGetLists(mclOptionId);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Successful deletion of MCL Garment Market',
            });
        }
    }, [
        mclGarmentMarketDelete,
        editTableRef,
        mclOptionId,
        handleNotification,
        setDataSource,
        handleMclGarmentMarketGetLists,
    ]);

    // 초기화
    useEffect(() => {
        return () => {
            handleMclGarmentMarketGetListsInit();
            handleMclGarmentMarketPostInit();
            handleMclGarmentMarketDeleteInit();
        };
    }, [
        handleMclGarmentMarketGetListsInit,
        handleMclGarmentMarketPostInit,
        handleMclGarmentMarketDeleteInit,
    ]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Select Market',
                dataIndex: 'garmentMarket',
                editable: true,
                ellipsis: true,
                selectBox: true,
                selectType: { name: 'market' },
                render: (data) => (
                    <Tooltip title={data?.name}>{data?.name}</Tooltip>
                ),
            },
            {
                title: 'Buyer Po Market',
                dataIndex: 'poGarmentMarket',
                editable: true,
                ellipsis: true,
                selectBox: true,
                selectType: {
                    name: 'mcl',
                    type: 'assignPoMarket',
                    path: mclOptionId,
                },
                render: (data) => (
                    <Tooltip title={data?.name || data}>
                        {data?.name || data}
                    </Tooltip>
                ),
            },
        ],
        [mclOptionId]
    );

    const title = useMemo(
        () => () =>
            (
                <div className="titleWrap">
                    <div className="title">
                        <Space>
                            <CaretRightOutlined />
                            Garment Market Setting
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
                                    title: 'Add item',
                                    arrowPointAtCenter: true,
                                }}
                                mode="add"
                                size="small"
                                onClick={() => editTableRef.current.handleAdd()}
                            />

                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Delete selected item',
                                    arrowPointAtCenter: true,
                                }}
                                mode="delete"
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
                                        garmentMarket: {
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
        <MclGarmentMarketWrap>
            <div id="mclGarmentMarketWrap">
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
        </MclGarmentMarketWrap>
    );
};

const MclGarmentMarketWrap = styled.div`
    height: 100%;
    padding: 0 1rem 0 1rem;
    overflow: auto;

    #mclGarmentMarketWrap {
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
            // margin-top: 1rem;
            .content {
                .contentTitle {
                    ${({ theme }) => theme.fonts.h5};
                }
            }
        }
    }
`;

export default MclGarmentMarket;
