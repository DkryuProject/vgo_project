import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useGtag from 'core/hook/useGtag';
import {
    userGetPagesAsyncAction,
    userPutStatusAsyncAction,
} from 'store/user/reducer';
import { invitePostAsyncAction } from 'store/sign/reducer';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import styled from 'styled-components';
import { BoxShadow, EditTable, TitleWrap } from 'components/UI/molecules';
import { userGetPersonalListApi, userPutJoinApi } from 'core/api/user/user';
import { useMutation, useQuery } from 'react-query';
import { Button } from 'components/UI/atoms';

const UserLists = (props) => {
    const rowKey = 'userId';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [total, setTotal] = useState(0);

    const personalTableRef = useRef();
    const personalRowKey = 'id';
    const [personalDataSource, setPersonalDataSource] = useState([]);
    const [personalPagination, setPersonalPagination] = useState({
        current: 1,
        pageSize: 15,
        total: 0,
    });

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const userGetPages = useSelector((state) => state.userReducer.get.pages);
    const handleUserGetPages = useCallback(
        (payload) => dispatch(userGetPagesAsyncAction.request(payload)),
        [dispatch]
    );
    const handleUserGetPagesInit = useCallback(
        () => dispatch(userGetPagesAsyncAction.initial()),
        [dispatch]
    );

    const userPutStatus = useSelector((state) => state.userReducer.putStatus);
    const handleUserPutStatus = useCallback(
        (payload) => dispatch(userPutStatusAsyncAction.request(payload)),
        [dispatch]
    );
    const handleUserPutStatusInit = useCallback(
        () => dispatch(userPutStatusAsyncAction.initial()),
        [dispatch]
    );

    const invitePost = useSelector((state) => state.signReducer.post.invite);
    const handleInvitePost = useCallback(
        (payload) => dispatch(invitePostAsyncAction.request(payload)),
        [dispatch]
    );
    const handleInvitePostInit = useCallback(
        () => dispatch(invitePostAsyncAction.initial()),
        [dispatch]
    );

    const { refetch: userGetPersonalListRefetch } = useQuery(
        ['userGetPersonalList', personalPagination],
        () => userGetPersonalListApi(personalPagination),
        {
            onSuccess: (res) => {
                const { content, number, size, totalElements } =
                    res?.page || {};
                setPersonalDataSource(content);
                setPersonalPagination((personalPagination) => ({
                    ...personalPagination,
                    current: number,
                    pageSize: size,
                    total: totalElements,
                }));
            },
        }
    );

    const { mutate: userPutJoinMutate } = useMutation(
        (payload) => userPutJoinApi(payload),
        {
            onSuccess: () => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Join request successful',
                });

                return handleUserGetPages({
                    ...pagination,
                    userId: userGetEmail.data.data.userId,
                });
            },
            onError: () => {
                handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'Join request failed',
                });
            },

            onSettled: () => {
                return userGetPersonalListRefetch();
            },
        }
    );

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows } = editTableRef.current;
            const { selectedRowKeys } = personalTableRef.current;

            if (
                type === 'confirm' || type === 'reject'
                    ? selectedRowKeys.length === 0
                    : selectedRows.length === 0
            ) {
                return confirm.warningConfirm('No item is selected');
            }
            if (type === 'invite') {
                const newValues = selectedRows.map((v) => {
                    return {
                        levelID: v.level?.userLevelId || v.level?.id,
                        // status: v.status.id || v.status,
                        email: v.email,
                    };
                });

                return handleInvitePost(newValues);
            } else if (type === 'save') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        const newValues = selectedRows.map((v) => {
                            return {
                                levelID: v.level?.userLevelId || v.level?.id,
                                status: v.status?.id || v.status,
                                userID: v.userId,
                            };
                        });
                        return handleUserPutStatus(newValues);
                    }
                });
            } else if (type === 'delete') {
                confirm.deleteConfirm((e) => {
                    if (e) {
                        let result = [];

                        for (let v1 of dataSource) {
                            if (
                                !selectedRows.find(
                                    (v2) =>
                                        v2[rowKey] === v1[rowKey] &&
                                        v2.rowStatus
                                )
                            ) {
                                result.push(v1);
                            }
                        }
                        setDataSource(result);
                    }
                });
            } else if (type === 'confirm') {
                confirm.warningConfirm('would you like to confirm', (e) => {
                    if (e) {
                        return userPutJoinMutate({
                            status: 'confirm',
                            data: selectedRowKeys,
                        });
                    }
                });
            } else if (type === 'reject') {
                confirm.warningConfirm('would you like to reject', (e) => {
                    if (e) {
                        return userPutJoinMutate({
                            status: 'reject',
                            data: selectedRowKeys,
                        });
                    }
                });
            }
        },
        [dataSource, handleInvitePost, handleUserPutStatus, userPutJoinMutate]
    );

    // 조회
    useEffect(() => {
        if (userGetEmail.data) {
            handleUserGetPages({
                ...pagination,
                userId: userGetEmail.data.data.userId,
            });
        }
        return () => {
            handleUserGetPagesInit();
        };
    }, [pagination, userGetEmail, handleUserGetPages, handleUserGetPagesInit]);

    useEffect(() => {
        setIsLoading(userGetPages.isLoading);
        if (userGetPages.data) {
            const { content, totalElements } = userGetPages.data.page;
            setDataSource(content);
            setTotal(totalElements);
        }
    }, [userGetPages]);

    // 유저 상태 변경
    useEffect(() => {
        if (userPutStatus.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: 'Only invited users can edit',
            });
        } else if (userPutStatus.data) {
            if (userGetEmail.data) {
                handleUserGetPages({
                    ...pagination,
                    userId: userGetEmail.data.data.userId,
                });
            }
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'User status change successful',
            });
        }

        return () => handleUserPutStatusInit();
    }, [
        userPutStatus,
        handleUserPutStatusInit,
        handleNotification,
        handleUserGetPages,
        userGetEmail,
        pagination,
    ]);

    // 초대하기
    useEffect(() => {
        if (invitePost.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: invitePost.error.message,
            });
        } else if (invitePost.data) {
            if (userGetEmail.data) {
                handleUserGetPages({
                    ...pagination,
                    userId: userGetEmail.data.data.userId,
                });
            }
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'User Invite success',
            });
        }

        return () => handleInvitePostInit();
    }, [
        invitePost,
        handleNotification,
        handleInvitePostInit,
        handleUserGetPages,
        userGetEmail,
        pagination,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `USER LISTS | SYSTEM `,
        });
    }, [trackPageView]);

    // 테이블
    const columns = [
        {
            title: 'User ID (EMAIL)',
            dataIndex: 'email',
            key: 'email',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Name',
            dataIndex: 'notEditable',
            key: 'userName',
            align: 'left',
            render: (_, record) => (
                <Tooltip title={record?.userName}>{record?.userName}</Tooltip>
            ),
        },

        {
            title: 'Mobile Phone#',
            dataIndex: 'notEditable',
            key: 'mobilePhone',
            inputType: 'number',
            align: 'left',
            render: (_, record) => (
                <Tooltip title={record?.mobilePhone}>
                    {record?.mobilePhone}
                </Tooltip>
            ),
        },

        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            editable: true,
            selectBox: true,
            selectType: { name: 'common', type: 'enums', path: 'userStatus' },
            align: 'left',
            render: (data) => {
                let value = '';
                const _data = data?.id || data;
                if (_data === 'A' || _data === 'Active') {
                    value = 'Active';
                } else if (_data === 'D' || _data === 'Deactive') {
                    value = 'Deactive';
                } else if (_data === 'W' || _data === 'Waiting') {
                    value = 'Waiting';
                }

                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },
        {
            title: 'Authorization',
            dataIndex: 'level',
            key: 'level',
            editable: true,
            selectBox: true,
            selectType: { name: 'user', type: 'level', path: 'list' },
            align: 'left',
            render: (data) => {
                const _data = data?.userLevelName || data?.name;
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
    ];

    const personalColumns = [
        {
            title: 'User ID (EMAIL)',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '79%',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    USER MANAGEMENT
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Invate item',
                            arrowPointAtCenter: true,
                        }}
                        mode="save"
                        size="small"
                        onClick={() => handleExcute('invite')}
                        disabled={invitePost.isLoading}
                    >
                        INVITE
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
                    >
                        MODIFY
                    </TableButton>
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
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
                        mode="remove"
                        size="small"
                        onClick={() => handleExcute('delete')}
                    />
                </Space>
            </div>
        </div>
    );

    const personalTitle = () => (
        <TitleWrap>
            <TitleWrap.Title suffix>JOIN REQUEST LIST</TitleWrap.Title>
            <TitleWrap.Function>
                <Button onClick={() => handleExcute('confirm')}>CONFIRM</Button>
                <Button onClick={() => handleExcute('reject')}>REJECT</Button>
            </TitleWrap.Function>
        </TitleWrap>
    );

    return (
        <UserListManagementWrap>
            <div className="userList">
                <CustomTable
                    ref={editTableRef}
                    title={title}
                    rowKey={rowKey}
                    initialColumns={columns}
                    dataSource={dataSource}
                    rowSelection={true}
                    loading={isLoading}
                    pagination={{ ...pagination, total }}
                    onChange={setPagination}
                />
            </div>

            <div style={{ marginTop: '1rem' }}>
                <BoxShadow>
                    <EditTable
                        ref={personalTableRef}
                        rowKey={personalRowKey}
                        title={personalTitle}
                        initialColumns={personalColumns}
                        dataSource={personalDataSource}
                        // loading={companySearchIsLoading}
                        pagination={personalPagination}
                        onChange={setPersonalPagination}
                        rowSelection={true}
                    />
                </BoxShadow>
            </div>
        </UserListManagementWrap>
    );
};

export default UserLists;

const UserListManagementWrap = styled.div`
    padding: 2rem 1rem 1rem 1rem;
    height: 100%;

    .userList {
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;

        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                ${({ theme }) => theme.fonts.h7}
            }
        }
    }
`;
