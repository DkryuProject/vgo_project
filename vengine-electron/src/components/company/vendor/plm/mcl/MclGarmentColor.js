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
    mclGarmentColorPostAsyncAction,
    mclGarmentColorGetListsAsyncAction,
    mclGarmentColorDeleteAsyncAction,
} from 'store/mcl/garmentColor/reducer';
import { mclOrderQtyGetIdAsyncAction } from 'store/mcl/orderQty/reducer';
import * as confirm from 'components/common/confirm';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import CustomTable from 'components/common/CustomTable';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

const MclGarmentColor = (props) => {
    const { match, initialShow, onShow, onLeftSplit } = props;
    const { mclOptionId } = match.params || '';
    const rowKey = 'id';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const mclGarmentColorGetLists = useSelector(
        (state) => state.mclGarmentColorReducer.get.lists
    );
    const handleMclGarmentColorGetLists = useCallback(
        (payload) =>
            dispatch(mclGarmentColorGetListsAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclGarmentColorGetListsInit = useCallback(
        () => dispatch(mclGarmentColorGetListsAsyncAction.initial()),
        [dispatch]
    );

    const mclGarmentColorPost = useSelector(
        (state) => state.mclGarmentColorReducer.post
    );
    const handleMclGarmentColorPost = useCallback(
        (payload) => dispatch(mclGarmentColorPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclGarmentColorPostInit = useCallback(
        () => dispatch(mclGarmentColorPostAsyncAction.initial()),
        [dispatch]
    );

    const mclGarmentColorDelete = useSelector(
        (state) => state.mclGarmentColorReducer.delete
    );
    const handleMclGarmentColorDelete = useCallback(
        (payload) =>
            dispatch(mclGarmentColorDeleteAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclGarmentColorDeleteInit = useCallback(
        () => dispatch(mclGarmentColorDeleteAsyncAction.initial()),
        [dispatch]
    );

    const handleMclOrderQtyGetId = useCallback(
        (payload) => dispatch(mclOrderQtyGetIdAsyncAction.request(payload)),
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
                                garmentColor: v.garmentColor,
                                id: v.rowStatus === 'new' ? null : v[rowKey],
                                poGarmentColor: v.poGarmentColor
                                    ? v.poGarmentColor.id
                                    : '',
                            };
                            return obj;
                        });

                        return handleMclGarmentColorPost({
                            id: mclOptionId,
                            data: newValues,
                        });
                    }
                });
            } else if (type === 'delete') {
                confirm.deleteConfirm((e) => {
                    if (e) {
                        return handleMclGarmentColorDelete(
                            selectedRowKeys.filter((v) => typeof v !== 'string')
                        );
                    }
                });
            }
        },
        [mclOptionId, handleMclGarmentColorPost, handleMclGarmentColorDelete]
    );

    // 조회
    useEffect(() => {
        if (mclOptionId) {
            handleMclGarmentColorGetLists(mclOptionId);
        }
    }, [mclOptionId, handleMclGarmentColorGetLists]);

    useEffect(() => {
        setIsLoading(mclGarmentColorGetLists.isLoading);

        if (mclGarmentColorGetLists.data) {
            setDataSource(mclGarmentColorGetLists.data.list);
        }
    }, [mclGarmentColorGetLists]);

    // 등록
    useEffect(() => {
        if (mclGarmentColorPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclGarmentColorPost.error.message,
            });
        } else if (mclGarmentColorPost.data) {
            handleMclGarmentColorGetLists(mclOptionId);

            onLeftSplit();
            onShow(initialShow);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'MCL Garment Color Creation Success',
            });
        }
    }, [
        mclGarmentColorPost,
        mclOptionId,
        initialShow,
        handleMclGarmentColorGetLists,
        handleNotification,
        onShow,
        onLeftSplit,
    ]);

    // 삭제
    useEffect(() => {
        if (mclGarmentColorDelete.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclGarmentColorDelete.error.message,
            });
        } else if (mclGarmentColorDelete.data) {
            const { selectedRows, dataSource } = editTableRef.current;
            let result = [];
            for (let v1 of dataSource) {
                if (!selectedRows.find((v2) => v2[rowKey] === v1[rowKey])) {
                    result.push(v1);
                }
            }
            setDataSource(result);
            handleMclGarmentColorGetLists(mclOptionId);
            // color, size, market 수정시
            // 조회 될떄 OrderQty 조회 함수 실행
            // handleMclOrderQtyGetId(mclOptionId);
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: ' MCL Garment Color Creation Failed',
            });
        }
    }, [
        mclGarmentColorDelete,
        editTableRef,
        mclOptionId,
        handleNotification,
        setDataSource,
        handleMclGarmentColorGetLists,
        handleMclOrderQtyGetId,
    ]);

    // 초기화
    useEffect(() => {
        return () => {
            handleMclGarmentColorGetListsInit();
            handleMclGarmentColorPostInit();
            handleMclGarmentColorDeleteInit();
        };
    }, [
        handleMclGarmentColorGetListsInit,
        handleMclGarmentColorPostInit,
        handleMclGarmentColorDeleteInit,
    ]);

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Input Color',
                dataIndex: 'garmentColor',
                editable: true,
                ellipsis: true,
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: 'Buyer Po Color',
                dataIndex: 'poGarmentColor',
                editable: true,
                ellipsis: true,
                selectBox: true,
                selectType: {
                    name: 'mcl',
                    type: 'assignPoColor',
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
                            GARMENT COLOR SETTING
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
                                        garmentColor: {
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
        <MclGarmentColorWrap>
            <div id="mclGarmentColorWrap">
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
        </MclGarmentColorWrap>
    );
};

const MclGarmentColorWrap = styled.div`
    height: 100%;
    padding: 0 1rem 0 1rem;
    overflow: auto;

    #mclGarmentColorWrap {
        min-width: 500px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
        // padding: 1rem;
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

export default React.memo(MclGarmentColor);
