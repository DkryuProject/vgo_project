import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dateFormat from 'core/utils/dateUtil';
import useGtag from 'core/hook/useGtag';
import { Tooltip } from 'components/common/tooltip';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { Space, Row, Col, Card } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { noticeGetPagesAsyncAction } from 'store/notice/reducer';

const NoticeLists = (props) => {
    const { history } = props;
    const dispatch = useDispatch();
    const { trackPageView } = useGtag();
    const [dataSource, setDataSource] = useState({
        content: null,
        overView: [
            {
                type: 'open',
                count: 0,
            },
            {
                type: 'update',
                count: 0,
            },
            {
                type: 'other',
                count: 0,
            },
        ],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [total, setTotal] = useState(0);

    const noticeGetPages = useSelector(
        (state) => state.noticeReducer.get.pages
    );
    const handleNoticeGetPages = useCallback(
        (payload) => dispatch(noticeGetPagesAsyncAction.request(payload)),
        [dispatch]
    );
    // const handleNoticeGetPagesInit = useCallback(
    //     () => dispatch(noticeGetPagesAsyncAction.initial()),
    //     [dispatch]
    // );

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    // 조회
    useEffect(() => {
        if (userGetEmail.data) {
            handleNoticeGetPages(pagination);
        }
    }, [userGetEmail.data, pagination, handleNoticeGetPages]);

    useEffect(() => {
        setIsLoading(noticeGetPages.isLoading);
        if (noticeGetPages.data) {
            const { content, totalElements } = noticeGetPages.data.page;
            setDataSource((dataSource) => ({
                ...dataSource,
                content,
                overView: [
                    {
                        type: 'open',
                        count: content.filter((v) => v?.category === 0)?.length,
                    },
                    {
                        type: 'update',
                        count: content.filter((v) => v?.category === 1)?.length,
                    },
                    {
                        type: 'other',
                        count: content.filter((v) => v?.category === 2)?.length,
                    },
                ],
            }));
            setTotal(totalElements);
        }
    }, [noticeGetPages, setIsLoading, setDataSource]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `NOTICE LISTS`,
        });
    }, [trackPageView]);

    // 테이블
    const columns = [
        {
            title: 'TYPE',
            dataIndex: 'category',
            align: 'left',
            render: (data) => {
                const _data =
                    data === 0 ? 'OPEN' : data === 1 ? 'UPDATE' : 'OTHER';
                return <Tooltip title={_data}>{_data}</Tooltip>;
            },
        },
        {
            title: 'EVENT',
            dataIndex: 'event',
            align: 'left',
            render: (data) => {
                return <Tooltip title={data}>{data}</Tooltip>;
            },
        },
        {
            title: 'CREATED DATE',
            dataIndex: 'created',
            align: 'left',
            width: '150px',
            render: (data) => {
                return (
                    <Tooltip title={dateFormat(data)}>
                        {dateFormat(data)}
                    </Tooltip>
                );
            },
        },
        {
            title: 'UPDATED DATE',
            dataIndex: 'updated',
            align: 'left',
            width: '150px',
            render: (data) => {
                return (
                    <Tooltip title={dateFormat(data)}>
                        {dateFormat(data)}
                    </Tooltip>
                );
            },
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    NOTICE LISTS
                </Space>
            </div>
            <div className="functionWrap">
                {userGetEmail.data?.data?.level?.userLevelId === 3 && (
                    <TableButton
                        toolTip={{
                            placement: 'topLeft',
                            title: 'Selected Email Notice',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => history.push('/notice/write')}
                    />
                )}
            </div>
        </div>
    );

    const onRow = (record, rowIndex) => {
        const locationState = {
            pathname: `/notice/detail/${record.id}`,
            state: {
                detail: record,
            },
        };
        return {
            onClick: () => history.push(locationState),
        };
    };

    return (
        <NoticeListsWrap>
            <div id="noticeListsWrap">
                <Card
                    title={
                        <span
                            style={{ fontWeight: '600', fontSize: '0.6875rem' }}
                        >
                            OVER VIEW
                        </span>
                    }
                >
                    <Row gutter={['10']}>
                        {dataSource?.overView?.map((v) => (
                            <Col span={8} key={v?.type}>
                                <div
                                    style={{
                                        fontWeight: '600',
                                        fontSize: '0.625rem',
                                    }}
                                >
                                    {v?.count}
                                </div>
                                <div
                                    style={{
                                        fontWeight: '600',
                                        fontSize: '0.625rem',
                                    }}
                                >
                                    {v?.type?.toUpperCase()} ISSUE
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Card>
                <CustomTable
                    title={title}
                    rowKey="id"
                    initialColumns={columns}
                    dataSource={dataSource?.content}
                    rowSelection={false}
                    loading={isLoading}
                    onRow={onRow}
                    pagination={{ ...pagination, total }}
                    onChange={setPagination}
                />
            </div>
        </NoticeListsWrap>
    );
};

const NoticeListsWrap = styled.div`
    height: 100%;
    overflow: auto;
    padding: 1rem;
    #noticeListsWrap {
        min-width: 500px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            .title {
                ${(props) => props.theme.fonts.h7};
            }
        }
    }
`;

export default NoticeLists;
