import React from 'react';
import styled from 'styled-components';
import { Col, Row } from 'antd';
import {
    DashboardCompanySearch,
    DashboardNews,
    DashboardStatistics,
    DashboardTutorials,
    DashboardWordCloud,
} from 'components/UI/organisms';
import { Fragment } from 'react';

const Dashboard = (props) => {
    const {
        userType,
        // date,
        onDate,
        dataStatistics,
        dataTutorialsData,
        dataNews,
        isNewsAll,
        onIsNewsAll,

        companySearchRowKey,
        companySearchDataSource,
        companySearchPagination,
        companySearchIsLoading,
        onCompanySearchPagination,
        onCompanySearch,
        onCompanyJoinRequest,

        onChangeLang,
        newsPagination,
        onNewsPagination,
        rangeDate,
        onRangeDate,

        dataWordCloud,

        userGetCheck,
    } = props || {};
    return (
        <DashboardStyle>
            <Row gutter={[30, 10]}>
                <Col span={isNewsAll ? 0 : 12}>
                    {/* 개인이면 News 회사면 Graph */}
                    {userType?.toLowerCase() === 'p' ? (
                        <Fragment>
                            <DashboardWordCloud
                                dataWordCloud={dataWordCloud}
                                onNewsPagination={onNewsPagination}
                            />
                            <DashboardNews
                                rangeDate={rangeDate}
                                onRangeDate={onRangeDate}
                                dataNews={dataNews}
                                isNewsAll={isNewsAll}
                                onIsNewsAll={onIsNewsAll}
                                onChangeLang={onChangeLang}
                                newsPagination={newsPagination}
                                onNewsPagination={onNewsPagination}
                            />
                        </Fragment>
                    ) : (
                        <DashboardStatistics
                            onDate={onDate}
                            dataStatistics={dataStatistics}
                        />
                    )}
                    <DashboardTutorials dataTutorialsData={dataTutorialsData} />
                </Col>

                <Col span={isNewsAll ? 20 : 12}>
                    {!isNewsAll && userType?.toLowerCase() === 'p' && (
                        <Row gutter={30}>
                            <Col span={8}>
                                <div className="companySearchDesc">
                                    Search for the company you want to join, and
                                    create a company if it doesn't exist.
                                </div>
                            </Col>
                            <Col span={16}>
                                <DashboardCompanySearch
                                    companySearchRowKey={companySearchRowKey}
                                    companySearchDataSource={
                                        companySearchDataSource
                                    }
                                    companySearchPagination={
                                        companySearchPagination
                                    }
                                    companySearchIsLoading={
                                        companySearchIsLoading
                                    }
                                    onCompanySearchPagination={
                                        onCompanySearchPagination
                                    }
                                    onCompanySearch={onCompanySearch}
                                    onCompanyJoinRequest={onCompanyJoinRequest}
                                    userGetCheck={userGetCheck}
                                />
                            </Col>
                        </Row>
                    )}

                    {(isNewsAll || userType?.toLowerCase() === 'c') && (
                        <Fragment>
                            <DashboardWordCloud
                                dataWordCloud={dataWordCloud}
                                onNewsPagination={onNewsPagination}
                            />
                            <DashboardNews
                                rangeDate={rangeDate}
                                onRangeDate={onRangeDate}
                                dataNews={dataNews}
                                isNewsAll={isNewsAll}
                                onIsNewsAll={onIsNewsAll}
                                onChangeLang={onChangeLang}
                                newsPagination={newsPagination}
                                onNewsPagination={onNewsPagination}
                            />
                        </Fragment>
                    )}
                </Col>
            </Row>
        </DashboardStyle>
    );
};

const DashboardStyle = styled.div`
    padding: 1rem;

    .companySearchDesc {
        ${(props) => props.theme.fonts.h6};
    }
`;

export default Dashboard;
