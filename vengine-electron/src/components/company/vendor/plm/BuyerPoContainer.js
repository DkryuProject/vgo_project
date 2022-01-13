import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useGtag from 'core/hook/useGtag';
import { buyerOrderGetSearchAsyncAction } from 'store/buyer/order/reducer';
import { cbdCoverGetDesignNumberAsyncAction } from 'store/cbd/cover/reducer';
import { BuyerPoSearch, BuyerPoSummary, BuyerPoDetail } from './buyerPo';
import * as confirm from 'components/common/confirm';
import Modal from 'antd/lib/modal/Modal';
import CustomTable from 'components/common/CustomTable';
import { Tooltip } from 'components/common/tooltip';
import TableButton from 'components/common/table/TableButton';
import { Space } from 'antd';
import styled from 'styled-components';

const BuyerPoContainer = () => {
    const dispatch = useDispatch();
    const { trackPageView } = useGtag();
    const tableRef = useRef();
    const [summary, setSummary] = useState([]);
    const [detail, setDetail] = useState([]);
    const [searchType, setSearchType] = useState('style');
    const [visibleModal, setVisibleModal] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    const buyerOrderGetSearch = useSelector(
        (state) => state.buyerOrderReducer.get.search
    );

    const handleBuyerOrderGetSearch = useCallback(
        (payload) => dispatch(buyerOrderGetSearchAsyncAction.request(payload)),
        [dispatch]
    );
    const handleBuyerOrderGetSearchInit = useCallback(
        () => dispatch(buyerOrderGetSearchAsyncAction.initial()),
        [dispatch]
    );

    const cbdCoverGetDesignNumber = useSelector(
        (state) => state.cbdCoverReducer.get.designNumber
    );
    const handleCbdCoverGetDesignNumber = useCallback(
        (payload) =>
            dispatch(cbdCoverGetDesignNumberAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCbdCoverGetDesignNumberInit = useCallback(
        () => dispatch(cbdCoverGetDesignNumberAsyncAction.initial()),
        [dispatch]
    );

    const handleExcute = useCallback(
        (type) => {
            const { selectedRowKeys } = tableRef.current;

            if (selectedRowKeys.length === 0) {
                return confirm.warningConfirm('No item is selected');
            }
            if (type === 'view') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        const { selectedRowKeys } = tableRef.current;
                        setVisibleModal(false);
                        return handleBuyerOrderGetSearch({
                            searchType: searchType,
                            searchKeyword: selectedRowKeys[0],
                        });
                    }
                });
            }
        },
        [tableRef, searchType, setVisibleModal, handleBuyerOrderGetSearch]
    );

    useEffect(() => {
        if (buyerOrderGetSearch.data) {
            const { orderSummaries, orderDetails } =
                buyerOrderGetSearch.data.data;
            setSummary(
                orderSummaries.map((v, i) => ({
                    ...v,
                    id: i + 1,
                }))
            );
            setDetail(orderDetails);
        }
        return () => handleBuyerOrderGetSearchInit();
    }, [
        buyerOrderGetSearch,
        setSummary,
        setDetail,
        handleBuyerOrderGetSearchInit,
    ]);

    useEffect(() => {
        if (cbdCoverGetDesignNumber.data) {
            if (cbdCoverGetDesignNumber.data.list.length === 1) {
                const { coverId } = cbdCoverGetDesignNumber.data.list[0];
                handleBuyerOrderGetSearch({
                    searchType: searchType,
                    searchKeyword: coverId,
                });
            } else {
                setDataSource(cbdCoverGetDesignNumber.data.list);
                setVisibleModal(true);
            }
        }

        return () => handleCbdCoverGetDesignNumberInit();
    }, [
        cbdCoverGetDesignNumber,
        searchType,
        handleBuyerOrderGetSearch,
        handleCbdCoverGetDesignNumberInit,
        setDataSource,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `GARMENT DETAIL | GARMENT PO `,
        });
    }, [trackPageView]);

    // 테이블
    const columns = [
        {
            title: 'Buyer',
            dataIndex: 'buyer',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: 'Season',
            dataIndex: 'season',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            render: (data) => (
                <Tooltip title={data?.name1}>{data?.name1}</Tooltip>
            ),
        },
        {
            title: 'Fabric Type',
            dataIndex: 'materialCategory',
            render: (data) => (
                <Tooltip title={data?.typeB}>{data?.typeB}</Tooltip>
            ),
        },
        {
            title: 'Garment Type',
            dataIndex: 'garmentCategory',
            render: (data) => (
                <Tooltip title={data?.name1}>{data?.name1}</Tooltip>
            ),
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            render: (data) => (
                <Tooltip title={data?.name}>{data?.name}</Tooltip>
            ),
        },
        {
            title: 'Design Number',
            dataIndex: 'designNumber',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space></Space>
            </div>
            <div className="functionWrap">
                <Space>
                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: ' Create',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => handleExcute('view')}
                    >
                        VIEW
                    </TableButton>
                </Space>
            </div>
        </div>
    );

    return (
        <BuyerPoWrap>
            <div className="buyerPoWrap">
                <BuyerPoSearch
                    onBuyerOrderGetSearch={
                        searchType === 'style'
                            ? handleBuyerOrderGetSearch
                            : handleCbdCoverGetDesignNumber
                    }
                    searchType={searchType}
                    onSearchType={setSearchType}
                />
            </div>
            <div style={{ padding: '0.5rem' }} />
            <div className="buyerPoWrap">
                <BuyerPoSummary summary={summary} />
            </div>
            <div style={{ padding: '0.5rem' }} />
            <div className="buyerPoWrap">
                <BuyerPoDetail detail={detail} />
            </div>
            <Modal
                title={
                    <div
                        style={{
                            fontSize: '0.6875rem',
                            fontWeight: 'bold',
                        }}
                    >
                        ORDER SEARCH
                    </div>
                }
                centered
                closable={false}
                visible={visibleModal}
                onOk={() => {
                    return handleExcute('view');
                }}
                onCancel={() => setVisibleModal(false)}
                width="90%"
            >
                <CustomTable
                    ref={tableRef}
                    title={() => title()}
                    rowKey="coverId"
                    initialColumns={columns}
                    dataSource={dataSource}
                    rowSelection={true}
                    rowSelectionType="radio"
                    pagination={false}
                />
            </Modal>
        </BuyerPoWrap>
    );
};

export default BuyerPoContainer;

const BuyerPoWrap = styled.div`
    height: 100%;
    padding: 1rem;
    overflow: auto;

    .buyerPoWrap {
        min-width: 500px;

        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
    }
`;
