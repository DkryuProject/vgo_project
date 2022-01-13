import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useNotification from 'core/hook/useNotification';
import useGtag from 'core/hook/useGtag';
import { companyGetSearchAsyncAction } from 'store/company/reducer';
import { companyBizPostRelationAsyncAction } from 'store/companyInfo/reducer';
import { commonEnumsGetListsAsyncAction } from 'store/common/enums/reducer';
import styled from 'styled-components';
import * as confirm from 'components/common/confirm';
import CustomTable from 'components/common/CustomTable';
import TableButton from 'components/common/table/TableButton';
import { FilterSelect } from 'components/common/select';
import { Button, Space, Input } from 'antd';
import { CaretRightOutlined, SearchOutlined } from '@ant-design/icons';
import { Tooltip } from 'components/common/tooltip';

const PartnerManagementRelation = (props) => {
    const { match, history } = props;
    const rowKey = 'companyID';
    const editTableRef = useRef();
    const dispatch = useDispatch();
    const [handleNotification] = useNotification();
    const { trackPageView } = useGtag();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        searchKeyword: '',
        type: 'relation',
    });
    const [total, setTotal] = useState(0);
    const [relationType, setRelationType] = useState(null);

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const commonEnumsGetLists = useSelector(
        (state) => state.commonEnumsReducer.get.lists
    );
    const handleCommonEnumsGetLists = useCallback(
        (payload) => dispatch(commonEnumsGetListsAsyncAction.request(payload)),
        [dispatch]
    );

    const companyGetSearch = useSelector(
        (state) => state.companyReducer.get.search
    );
    const handleCompanyGetSearch = useCallback(
        (payload) => dispatch(companyGetSearchAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCompanyGetSearchInit = useCallback(
        () => dispatch(companyGetSearchAsyncAction.initial()),
        [dispatch]
    );

    const companyBizPostRelation = useSelector(
        (state) => state.companyInfoReducer.postBizRelation
    );
    const handleCompanyBizPostRelation = useCallback(
        (payload) =>
            dispatch(companyBizPostRelationAsyncAction.request(payload)),
        [dispatch]
    );
    const handleCompanyBizPostRelationInit = useCallback(
        () => dispatch(companyBizPostRelationAsyncAction.initial()),
        [dispatch]
    );

    const handleExcute = useCallback(
        (type) => {
            const { selectedRows } = editTableRef.current;

            if (selectedRows.length === 0) {
                return confirm.warningConfirm('No item is selected');
            }
            if (type === 'apply') {
                confirm.saveConfirm((e) => {
                    if (e) {
                        if (!relationType) {
                            return handleNotification({
                                type: 'error',
                                message: 'Error',
                                description: 'Please select a relation type.',
                            });
                        }

                        const newValues = selectedRows.map((v) => {
                            return {
                                bizCompanyID: v.companyID,
                                relationType: relationType,
                            };
                        });
                        return handleCompanyBizPostRelation(newValues);
                    }
                });
            }
        },
        [relationType, handleNotification, handleCompanyBizPostRelation]
    );

    // 조회
    useEffect(() => {
        if (userGetEmail.data) {
            handleCompanyGetSearch(pagination);
        }
        return () => {
            handleCompanyGetSearchInit();
        };
    }, [
        pagination,
        userGetEmail,
        handleCompanyGetSearch,
        handleCompanyGetSearchInit,
    ]);

    useEffect(() => {
        setIsLoading(companyGetSearch.isLoading);
        if (companyGetSearch.data) {
            const { content, totalElements } = companyGetSearch.data.page;
            setDataSource(content);
            setTotal(totalElements);
        }
    }, [companyGetSearch]);

    // 등록
    useEffect(() => {
        if (companyBizPostRelation.error) {
            return handleNotification({
                type: 'error',
                message: 'Error',
                description: companyBizPostRelation.error.message,
            });
        } else if (companyBizPostRelation.data) {
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Request for company relationship',
            });
        }

        return () => handleCompanyBizPostRelationInit();
    }, [
        companyBizPostRelation,
        handleNotification,
        handleCompanyBizPostRelationInit,
    ]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `RELATION | PARTNER MANAGEMENT | SYSTEM `,
        });
    }, [trackPageView]);

    // 테이블
    const columns = [
        {
            title: 'COMPANY NAME',
            dataIndex: 'companyName',
            key: 'companyName',
            align: 'left',
            render: (data) => <Tooltip title={data}>{data}</Tooltip>,
        },
        {
            title: 'COUNTRY',
            dataIndex: 'addresses',
            key: 'addresses',
            align: 'left',
            render: (data) => {
                const value = data.find((v) => v.representitive);
                return (
                    <Tooltip title={value?.country?.name1}>
                        {value?.country?.name1}
                    </Tooltip>
                );
            },
        },
        {
            title: 'CITY',
            dataIndex: 'addresses',
            key: 'addresses',
            align: 'left',
            render: (data) => {
                const value = data.find((v) => v.representitive);
                return (
                    <Tooltip title={value?.city?.name4}>
                        {value?.city?.name4}
                    </Tooltip>
                );
            },
        },
        {
            title: 'ADDRESS',
            dataIndex: 'addresses',
            key: 'addresses',
            align: 'left',
            render: (data) => {
                const value = data.find((v) => v.representitive);
                return <Tooltip title={value?.etc}>{value?.etc}</Tooltip>;
            },
        },
        {
            title: 'POSTAL CODE',
            dataIndex: 'addresses',
            key: 'addresses',
            align: 'left',
            render: (data) => {
                const value = data.find((v) => v.representitive);
                return (
                    <Tooltip title={value?.zipCode}>{value?.zipCode}</Tooltip>
                );
            },
        },
    ];

    const title = (type) => (
        <div className="titleWrap">
            <div className="title">
                <Space>
                    <CaretRightOutlined />
                    LIST OF COMPANY
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
                        suffix={<SearchOutlined />}
                        bordered={false}
                    />

                    <TableButton
                        toolTip={{
                            placement: 'topRight',
                            title: 'Company Create',
                            arrowPointAtCenter: true,
                        }}
                        mode="add"
                        size="small"
                        onClick={() => history.push(`${match.url}/new`)}
                    />
                </Space>
            </div>
        </div>
    );

    return (
        <PartnerManagementRelationWrap>
            <div className="partnerRelation">
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
                <div className="functionWrap">
                    <Space>
                        <span style={{ fontWeight: 'bold' }}>
                            *RELATION TYPE
                        </span>
                        <FilterSelect
                            _key="key"
                            _value="value"
                            text="value"
                            placeholder="Select Relation type"
                            filterType="relationType"
                            data={commonEnumsGetLists}
                            onData={handleCommonEnumsGetLists}
                            onChange={(v) => setRelationType(v)}
                        />
                        <Button onClick={() => handleExcute('apply')}>
                            APPLY
                        </Button>
                    </Space>
                </div>
            </div>
        </PartnerManagementRelationWrap>
    );
};

const PartnerManagementRelationWrap = styled.div`
    padding: 2rem 1rem 1rem 1rem;
    height: 100%;
    .partnerRelation {
        padding: 0.5rem 1rem 1rem 1rem;
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
        .functionWrap {
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;

            // span {
            //     ${({ theme }) => theme.fonts.h5};
            // }

            .ant-space-item
                .ant-select.ant-select-borderless.ant-select-single.ant-select-show-arrow.ant-select-show-search {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }

            .ant-space-item
                .ant-input-affix-wrapper.ant-input-affix-wrapper-sm.ant-input-affix-wrapper-borderless {
                border-bottom: 1px solid lightgray;
                border-radius: 0px;
                ${(props) => props.theme.fonts.h5};
            }

            .ant-select.ant-select-borderless.ant-select-single.ant-select-show-arrow.ant-select-show-search {
                width: 12rem;
            }
        }
    }
`;

export default PartnerManagementRelation;
