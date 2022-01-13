import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import styled from 'styled-components';
import {
    mclCbdAssignGetOptionAsyncAction,
    mclCbdAssignPostAsyncAction,
    mclCbdAssignGetListsAsyncAction,
} from 'store/mcl/cbdAssign/reducer';
import { DefaultTable } from 'components/common/table';
import { Button, Checkbox, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const MclCbd = (props) => {
    const { match, initialShow, onShow, onLeftSplit } = props;
    const { mclOptionId } = match.params || '';
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const [type, setType] = useState(null);

    const mclCbdAssignGetOption = useSelector(
        (state) => state.mclCbdAssignReducer.get.option
    );
    const handleMclCbdAssignGetOption = useCallback(
        (payload) =>
            dispatch(mclCbdAssignGetOptionAsyncAction.request(payload)),
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

    const handleMclCbdAssignGetLists = useCallback(
        (payload) => dispatch(mclCbdAssignGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const handleApply = () => {
        const arr = [];
        selectedRows.map((v) => {
            let data = {};
            if (type && type.hasOwnProperty(Number(v.optionId))) {
                // initial data
                data = {
                    cbdOptionID: v.optionId,
                    fabricCheck: 0,
                    trimsCheck: 0,
                    accessoriesCheck: 0,
                };

                if (type[v.optionId].hasOwnProperty('fabric')) {
                    data['fabricCheck'] = type[v.optionId].fabric ? 1 : 0;
                }
                if (type[v.optionId].hasOwnProperty('trim')) {
                    data['trimsCheck'] = type[v.optionId].trim ? 1 : 0;
                }
                if (type[v.optionId].hasOwnProperty('accessories')) {
                    data['accessoriesCheck'] = type[v.optionId].accessories
                        ? 1
                        : 0;
                }
            }

            return arr.push(data);
        });
        if (arr.length > 0) {
            return handleMclCbdAssignPost({ id: mclOptionId, data: arr });
        } else {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: 'Please select an item',
            });
        }
    };

    // 조회
    useEffect(() => {
        if (mclOptionId) {
            handleMclCbdAssignGetOption(mclOptionId);
        }
    }, [mclOptionId, handleMclCbdAssignGetOption]);

    // 등록
    useEffect(() => {
        if (mclCbdAssignPost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: 'CBD Assign Failed',
            });
        } else if (mclCbdAssignPost.data) {
            if (mclOptionId) {
                handleMclCbdAssignGetLists(mclOptionId);
            }
            onLeftSplit();
            onShow({
                ...initialShow,
                cbd: {
                    status: false,
                },
            });

            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'CBD Assign Success',
            });
        }

        return () => handleMclCbdAssignPostInit();
    }, [
        mclOptionId,
        mclCbdAssignPost,
        initialShow,
        onShow,
        onLeftSplit,
        handleMclCbdAssignGetLists,
        handleMclCbdAssignPostInit,
        handleNotification,
    ]);

    // 테이블
    const [selectedRows, setSelectedRows] = useState([]);
    const columns = [
        {
            title: 'Cbd Option Name',
            dataIndex: 'name',
        },
        {
            title: 'Final Cost',
            dataIndex: 'finalCost',
        },
        {
            title: 'Fabric',
            dataIndex: 'optionId',
            render: (data) => (
                <Checkbox
                    onChange={(e) => {
                        if (type && type[data]) {
                            setType((type) => ({
                                ...type,
                                [data]: {
                                    ...type[data],
                                    fabric: e.target.checked,
                                },
                            }));
                        } else {
                            setType((type) => ({
                                ...type,
                                [data]: {
                                    fabric: e.target.checked,
                                },
                            }));
                        }
                    }}
                />
            ),
        },
        {
            title: 'Trim',
            dataIndex: 'optionId',
            render: (data) => (
                <Checkbox
                    onChange={(e) => {
                        if (type && type[data]) {
                            setType((type) => ({
                                ...type,
                                [data]: {
                                    ...type[data],
                                    trim: e.target.checked,
                                },
                            }));
                        } else {
                            setType((type) => ({
                                ...type,
                                [data]: {
                                    trim: e.target.checked,
                                },
                            }));
                        }
                    }}
                />
            ),
        },
        {
            title: 'Accessory',
            dataIndex: 'optionId',
            render: (data) => (
                <Checkbox
                    onChange={(e) => {
                        if (type && type[data]) {
                            setType((type) => ({
                                ...type,
                                [data]: {
                                    ...type[data],
                                    accessories: e.target.checked,
                                },
                            }));
                        } else {
                            setType((type) => ({
                                ...type,
                                [data]: {
                                    accessories: e.target.checked,
                                },
                            }));
                        }
                    }}
                />
            ),
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">{type}</div>
            <div className="functionWrap">
                <Space>
                    <Button onClick={handleApply}>APPLY</Button>
                    <Button
                        icon={<CloseOutlined />}
                        onClick={() => {
                            onLeftSplit();
                            onShow({
                                ...initialShow,
                                cbd: {
                                    status: false,
                                },
                            });
                        }}
                    />
                </Space>
            </div>
        </div>
    );

    const rowSelection = {
        selectedRows,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
        },
    };

    return (
        <MclCbdWrap>
            <div id="mclCbdWrap">
                <DefaultTable
                    title={() => title('CONNECTED CBD')}
                    tableKey="optionId"
                    columns={columns}
                    dataSource={
                        mclCbdAssignGetOption.data && mclCbdAssignGetOption
                    }
                    rowSelection={rowSelection}
                />
            </div>
        </MclCbdWrap>
    );
};

const MclCbdWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    #mclCbdWrap {
        min-width: 500px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
    }
`;

export default MclCbd;
