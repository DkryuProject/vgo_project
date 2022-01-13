import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useGtag from 'core/hook/useGtag';
import {
    cbdCoverGetPagesAsyncAction,
    cbdCoverGetIdAsyncAction,
} from 'store/cbd/cover/reducer';
import CustomTable from 'components/common/CustomTable';
import { Space, Input } from 'antd';
import { CaretRightOutlined, SearchOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import styled from 'styled-components';

const CoverLists = (props) => {
    const { match, history } = props;
    const rowKey = 'coverId';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const { trackPageView } = useGtag();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        searchKeyword: '',
    });
    const [total, setTotal] = useState(0);

    const cbdCoverGetPages = useSelector(
        (state) => state.cbdCoverReducer.get.pages
    );
    const handleCbdCoverGetPages = useCallback(
        (payload) => dispatch(cbdCoverGetPagesAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdCoverGetPagesInit = useCallback(
        () => dispatch(cbdCoverGetPagesAsyncAction.initial()),
        [dispatch]
    );

    const handleCbdCoverGetIdInit = useCallback(
        () => dispatch(cbdCoverGetIdAsyncAction.initial()),
        [dispatch]
    );

    // 조회
    useEffect(() => {
        handleCbdCoverGetPages(pagination);
        return () => {
            handleCbdCoverGetPagesInit();
            handleCbdCoverGetIdInit();
        };
    }, [
        pagination,
        handleCbdCoverGetPages,
        handleCbdCoverGetPagesInit,
        handleCbdCoverGetIdInit,
    ]);

    useEffect(() => {
        setIsLoading(cbdCoverGetPages.isLoading);
        if (cbdCoverGetPages.data) {
            const { content, totalElements } = cbdCoverGetPages.data.page;
            setDataSource(content);
            setTotal(totalElements);
        }
    }, [cbdCoverGetPages]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `LISTS | DESIGN COVER | PLM `,
        });
    }, [trackPageView]);

    // 테이블
    const columns = [
        {
            title: 'Buyer',
            dataIndex: 'buyer',
            key: 'buyer',
            align: 'left',
            render: (data) => <Tooltip title={data.name}>{data.name}</Tooltip>,
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            align: 'left',
            render: (data) => <Tooltip title={data.name}>{data.name}</Tooltip>,
        },

        {
            title: 'Season',
            dataIndex: 'season',
            key: 'season',
            align: 'left',
            render: (_, record) => {
                const value = (
                    <div>
                        <span>{record.season?.name}</span>
                        <span>{record.seasonYear}</span>
                    </div>
                );
                return <Tooltip title={value}>{value}</Tooltip>;
            },
        },

        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            align: 'left',
            render: (data) => (
                <Tooltip title={data.name1}>{data.name1}</Tooltip>
            ),
        },
        {
            title: 'Fabric Type',
            dataIndex: 'materialCategory',
            key: 'materialCategory',
            align: 'left',
            render: (data) => (
                <Tooltip title={data.typeB}>{data.typeB}</Tooltip>
            ),
        },
        {
            title: 'Garment Type',
            dataIndex: 'garmentCategory',
            key: 'garmentCategory',
            align: 'left',
            render: (data) => (
                <Tooltip title={data.name1}>{data.name1}</Tooltip>
            ),
        },
        {
            title: 'Design #',
            dataIndex: 'designNumber',
            key: 'designNumber',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            key: 'orderType',
            align: 'left',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: 'Cover Name',
            dataIndex: 'cbdName',
            key: 'cbdName',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            align: 'left',
            render: (data) => (
                <Tooltip title={data.userName}>{data.userName}</Tooltip>
            ),
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space
                    style={{
                        fontSize: '0.6875rem',
                        color: '#000000',
                        fontWeight: 'bold',
                    }}
                >
                    <CaretRightOutlined />
                    DESIGN COVER LIST
                </Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <Input
                        size="small"
                        value={pagination.searchKeyword}
                        onChange={(e) =>
                            setPagination({
                                ...pagination,
                                searchKeyword: e.target.value,
                            })
                        }
                        placeholder="Search"
                        suffix={<SearchOutlined style={{ color: '#068485' }} />}
                        bordered={false}
                        style={{
                            borderRadius: 0,
                            borderBottom: '1px solid lightgray',
                        }}
                    />

                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Create Design Cover ',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => history.push(`${match.url}/write`)}
                    />
                </Space>
            </div>
        </div>
    );

    const onRow = (record) => {
        return {
            onClick: () =>
                history.push(`${match.url}/detail/${record.coverId}`),
        };
    };

    return (
        <CoverWrap>
            <div className="shadow">
                <CustomTable
                    ref={editTableRef}
                    title={title}
                    rowKey={rowKey}
                    initialColumns={columns}
                    dataSource={dataSource}
                    rowSelection={false}
                    loading={isLoading}
                    pagination={{ ...pagination, total }}
                    onChange={setPagination}
                    onRow={onRow}
                />
            </div>
        </CoverWrap>
    );
};

export default CoverLists;

const CoverWrap = styled.div`
    padding: 1rem;
    .shadow {
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
    }
`;
