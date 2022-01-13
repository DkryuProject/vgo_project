import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import { mclPlanningGetListsAsyncAction } from 'store/mcl/planning/reducer';
import {
    mclCbdAssignGetListsAsyncAction,
    mclCbdAssignPostAsyncAction,
} from 'store/mcl/cbdAssign/reducer';
import * as confirm from 'components/common/confirm';
import styled from 'styled-components';
import { Tooltip } from 'components/common/tooltip';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { Space, Checkbox } from 'antd';

const MclPlanningCopy = (props) => {
    const { match, initialShow, onShow, onLeftSplit } = props;
    const { mclOptionId } = match.params || '';
    const rowKey = 'id';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [dataSource, setDataSource] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(null);

    const mclCbdAssignGetLists = useSelector(
        (state) => state.mclCbdAssignReducer.get.lists
    );
    const handleMclCbdAssignGetLists = useCallback(
        (payload) => dispatch(mclCbdAssignGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const mclCbdAssignPost = useSelector(
        (state) => state.mclCbdAssignReducer.post
    );
    const handleMclCbdAssignPost = useCallback(
        (payload) => dispatch(mclCbdAssignPostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleMclCbdAssignPostInit = useCallback(
        () => dispatch(mclCbdAssignPostAsyncAction.initial()),
        [dispatch]
    );

    const handleMclPlanningGetLists = useCallback(
        (payload) => dispatch(mclPlanningGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const handleChangeCheck = useCallback(
        (type, checked, record) => {
            const { handleSelectRows } = editTableRef.current;
            handleSelectRows(record);
            return setChecked((_) => ({
                ..._,
                [record.id]: {
                    ..._[record.id],
                    [type]: checked,
                },
            }));
        },
        [editTableRef]
    );

    // 조회
    useEffect(() => {
        handleMclCbdAssignGetLists(mclOptionId);
    }, [mclOptionId, handleMclCbdAssignGetLists]);

    useEffect(() => {
        setIsLoading(mclCbdAssignGetLists.isLoading);
        if (mclCbdAssignGetLists.data) {
            setDataSource(
                mclCbdAssignGetLists.data.list.map((v) => {
                    return {
                        ...v,
                        id: v.cbdOption.optionId,
                    };
                })
            );

            mclCbdAssignGetLists.data.list.map((v) => {
                return setChecked((checked) => ({
                    ...checked,
                    [v.cbdOption.optionId]: {
                        fabricCheck: v.fabricCheck || 0,
                        trimsCheck: v.trimsCheck || 0,
                        accessoriesCheck: v.accessoriesCheck || 0,
                    },
                }));
            });
        }
    }, [mclCbdAssignGetLists, setChecked]);

    // 등록
    useEffect(() => {
        if (mclCbdAssignPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: mclCbdAssignPost.error.message,
            });
        } else if (mclCbdAssignPost.data) {
            handleMclPlanningGetLists(mclOptionId);
            onShow(initialShow);
            onLeftSplit();
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'MCL planning assign Success',
            });
        }
        return () => handleMclCbdAssignPostInit();
    }, [
        mclCbdAssignPost,
        mclOptionId,
        initialShow,
        handleMclPlanningGetLists,
        handleMclCbdAssignPostInit,
        handleNotification,
        onShow,
        onLeftSplit,
    ]);

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
                                cbdOptionID: v.cbdOption.optionId,
                                mclCbdAssignId: v.mclCbdAssignId,
                                fabricCheck: checked[v.id].fabricCheck ? 1 : 0,
                                trimsCheck: checked[v.id].trimsCheck ? 1 : 0,
                                accessoriesCheck: checked[v.id].accessoriesCheck
                                    ? 1
                                    : 0,
                            };
                            return obj;
                        });

                        return handleMclCbdAssignPost({
                            id: mclOptionId,
                            data: newValues,
                        });
                    }
                });
            }
        },
        [mclOptionId, checked, handleMclCbdAssignPost]
    );

    // 테이블
    const columns = useMemo(
        () => [
            {
                title: 'Cbd Option Name',
                dataIndex: 'cbdOption',
                render: (data) => (
                    <Tooltip title={data?.name}>{data?.name}</Tooltip>
                ),
            },
            {
                title: 'Final Cost',
                dataIndex: 'cbdOption',
                render: (data) => (
                    <Tooltip title={data?.finalCost}>{data?.finalCost}</Tooltip>
                ),
            },
            {
                title: 'Fabric',
                dataIndex: 'fabricCheck',
                render: (_, record) => {
                    return (
                        <Checkbox
                            checked={
                                checked[record.id].fabricCheck ? true : false
                            }
                            onChange={(e) =>
                                handleChangeCheck(
                                    'fabricCheck',
                                    e.target.checked,
                                    record
                                )
                            }
                        />
                    );
                },
            },
            {
                title: 'Trim',
                dataIndex: 'trimsCheck',
                render: (_, record) => {
                    return (
                        <Checkbox
                            checked={
                                checked[record.id].trimsCheck ? true : false
                            }
                            onChange={(e) =>
                                handleChangeCheck(
                                    'trimsCheck',
                                    e.target.checked,
                                    record
                                )
                            }
                        />
                    );
                },
            },
            {
                title: 'Accessory',
                dataIndex: 'accessoriesCheck',
                render: (_, record) => {
                    return (
                        <Checkbox
                            checked={
                                checked[record.id].accessoriesCheck
                                    ? true
                                    : false
                            }
                            onChange={(e) =>
                                handleChangeCheck(
                                    'accessoriesCheck',
                                    e.target.checked,
                                    record
                                )
                            }
                        />
                    );
                },
            },
        ],
        [checked, handleChangeCheck]
    );

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                {/* <Space>
                    <CaretRightOutlined />
                    {type.toUpperCase() + ' COST'}
                </Space> */}
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
                                planningCopy: {
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
        <MclPlanningWrap>
            <div id="mclPlanningWrap">
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
        </MclPlanningWrap>
    );
};

const MclPlanningWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #mclPlanningWrap {
        min-width: 500px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
    }
`;

export default React.memo(MclPlanningCopy);
