import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Input, Tooltip } from '../atoms';
import { Space } from 'antd';
import { EditTable, TitleWrap } from '../molecules';

const DashboardCompanySearch = (props) => {
    const {
        companySearchRowKey,
        companySearchDataSource,
        companySearchPagination,
        companySearchIsLoading,
        onCompanySearchPagination,
        onCompanySearch,
        onCompanyJoinRequest,
        userGetCheck,
    } = props || {};
    const history = useHistory();

    const columns = useMemo(
        () => [
            {
                title: 'Company',
                dataIndex: 'companyName',
                align: 'left',
                ellipsis: true,
                render: (data) => <Tooltip title={data}>{data}</Tooltip>,
            },
            {
                title: '',
                dataIndex: 'companyID',
                align: 'left',
                width: '50%',
                ellipsis: true,
                render: (data) => {
                    // register_status 상태값이 1or2면 Pending 상태
                    // join_status 상태값이 P이면 Pending 상태
                    const { join_check, register_check } =
                        userGetCheck?.data || {};
                    const { join_status } = join_check || {};
                    const { register_status } = register_check || {};

                    return register_status === 1 || register_status === 2 ? (
                        'There is a requesting company'
                    ) : join_status === 'P' ? (
                        'Pending'
                    ) : (
                        <Button
                            tooltip={{ title: 'Join Request' }}
                            onClick={() => onCompanyJoinRequest(data)}
                        >
                            Request
                        </Button>
                    );
                },
            },
        ],
        [userGetCheck, onCompanyJoinRequest]
    );
    const title = () => (
        <TitleWrap>
            <TitleWrap.Title suffix>COMPANY LIST</TitleWrap.Title>
        </TitleWrap>
    );

    return (
        <DashboardCompanySearchStyle>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Input
                    type="text"
                    placeholder="Please enter your company name"
                    onChange={onCompanySearch}
                    bordered={false}
                />
                <Button tooltip={{ title: 'Company search' }} mode="search" />
            </Space>

            <EditTable
                rowKey={companySearchRowKey}
                title={title}
                initialColumns={columns}
                dataSource={companySearchDataSource}
                loading={companySearchIsLoading}
                pagination={companySearchPagination}
                onChange={onCompanySearchPagination}
                rowSelection={false}
                locale={{
                    emptyText:
                        // register_status 상태값이 1or2면 Pending 상태
                        // join_status 상태값이 P이면 Pending 상태
                        userGetCheck?.data?.register_check?.register_status ===
                            1 ||
                        userGetCheck?.data?.register_check?.register_status ===
                            2 ? (
                            <span style={{ color: '#000' }}>
                                Vengine is checking the company you requested.
                            </span>
                        ) : userGetCheck?.data?.join_check?.join_status ===
                          'P' ? (
                            <span style={{ color: '#000' }}>
                                You have requested to join the{' '}
                                <b>
                                    {
                                        userGetCheck?.data?.join_check
                                            ?.join_company
                                    }
                                </b>{' '}
                                company.
                            </span>
                        ) : companySearchPagination?.searchKeyword ===
                          '' ? null : (
                            <span>
                                Can't find the company you're looking for ?{' '}
                                <span
                                    style={{ color: 'blue', cursor: 'pointer' }}
                                    onClick={() =>
                                        history.push('/signup/company')
                                    }
                                >
                                    Create a company
                                </span>
                            </span>
                        ),
                }}
            />
        </DashboardCompanySearchStyle>
    );
};

const DashboardCompanySearchStyle = styled.div`
    // display: flex;
    // justify-content: flex-end;
    margin-bottom: 1rem;
`;

export default DashboardCompanySearch;
