import React, { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import moment from 'moment';
import { dashboardGetStatisticsApi } from 'core/api/dashboard/count';
import { newsGetListsApi } from 'core/api/news/news';
import { Dashboard } from 'components/templates';
import tutorialImgPersonal from 'asserts/images/tutorials_personal.png';
import tutorialImgCompany from 'asserts/images/tutorials_company.png';
import { companyGetSearchApi } from 'core/api/company/company';
import { useSelector } from 'react-redux';
import { handleNotification } from 'core/utils/notificationUtil';
import { userGetCheckApi, userPostJoinApi } from 'core/api/user/user';
import { Fragment } from 'react';
import Loading from 'components/UI/atoms/Loading';
import { newsGetWordCloudApi } from 'core/api/news/wordCloud';

const DashboardPage = () => {
    const now = new Date();
    const dayOfMonth = new Date();
    const [dataStatistics, setDataStatistics] = useState([]);
    const [date, setDate] = useState({
        current: moment(now),
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
    });
    const [rangeDate, setRangeDate] = useState([
        moment(dayOfMonth.setDate(dayOfMonth.getDate() - 7)),
        moment(now),
    ]);
    const [isNewsAll, setIsNewsAll] = useState(false);
    const companySearchRowKey = 'companyID';
    const [companySearchDataSource, setCompanySearchDataSource] = useState([]);
    const [companySearchPagination, setCompanySearchPagination] = useState({
        current: 1,
        pageSize: 15,
        searchKeyword: '',
        total: 0,
        type: 'normal',
    });
    const [lang, setLang] = useState('en');
    const [newsPagination, setNewsPagination] = useState({
        current: 1,
        pageSize: 10,
        searchKeyword: '',
        total: 0,
    });
    const [dataNews, setDataNews] = useState([]);

    const [dataWordCloud, setDataWordCloud] = useState([]);

    const userGetEmail = useSelector((state) => state.userReducer.get.email);

    const dataTutorialsData = useMemo(
        () => ({
            image:
                userGetEmail.data?.data?.user_type?.toLowerCase() === 'p'
                    ? tutorialImgPersonal
                    : tutorialImgCompany,
            imageDesc:
                userGetEmail.data?.data?.user_type?.toLowerCase() === 'p' ? (
                    <div className="imageDesc">
                        원부자재 등록은 기본적으로 자재의 소유주인
                        Supplier이지만 Vendor가 대신 등록 할 수 있도록 설계가
                        되어 있습니다. <br />
                        다만 Vendor가 대신 등록시{' '}
                        <span>한번 기록 되면 수정 및 삭제할 수 없습니다.</span>
                    </div>
                ) : (
                    <div className="imageDesc">
                        최초 가입 진행을 하기 위해서는 https://www.v-go.io/
                        사이트를 통해서 들어와서 우측 상단의 LOGIN 버튼을 클릭
                        합니다.
                    </div>
                ),
            video:
                userGetEmail.data?.data?.user_type?.toLowerCase() === 'p'
                    ? 'ZtKKNIje8FA'
                    : 'ZtKKNIje8FA',
            url:
                userGetEmail.data?.data?.user_type?.toLowerCase() === 'p'
                    ? 'https://v-go.notion.site/v-go/V-Go-Service-Guide-7f641ce3d4eb4588abb3faa33e35ff70'
                    : 'https://v-go.notion.site/v-go/V-Go-Service-Guide-7f641ce3d4eb4588abb3faa33e35ff70',
        }),
        [userGetEmail]
    );

    // Dashboard Fetch
    useQuery(
        [
            'dashboardGetNews',
            {
                country: lang,
                ...newsPagination,
                start: isNewsAll && rangeDate[0].format('YYYY-MM-DD'),
                end: isNewsAll && rangeDate[1].format('YYYY-MM-DD'),
            },
        ],
        () =>
            newsGetListsApi({
                country: lang,
                ...newsPagination,
                start: isNewsAll && rangeDate[0].format('YYYY-MM-DD'),
                end: isNewsAll && rangeDate[1].format('YYYY-MM-DD'),
            }),
        {
            onSuccess: (res) => {
                const { content, number, size, totalElements } =
                    res?.page || {};
                setDataNews(
                    content?.map((v) => ({
                        title: v?.headline,
                        content: v?.sentence,
                        href: v?.contentUrl,
                        outlets: v?.outlets,
                        reporter: v?.reporter,
                        imageUrl:
                            v?.categoryName === 'ktnews' ||
                            v?.categoryName === 'Fashionbiz'
                                ? v?.imageUrl
                                : null,
                        createDate: moment(v?.createDate).format('YYYY-MM-DD'),
                    }))
                );
                setNewsPagination((newsPagination) => ({
                    ...newsPagination,
                    current: number,
                    pageSize: size,
                    total: totalElements,
                }));
            },
        }
    );

    useQuery(
        ['dashboardGetStatistics', date],
        () => dashboardGetStatisticsApi(date),
        {
            onSuccess: (res) => {
                const { data } = res;
                const createdPo =
                    data.created_po?.map((v) => ({
                        date: v.date,
                        type: 'warning',
                        content: v.po_number,
                    })) || [];
                const confirmPo =
                    data.confirm_po?.map((v) => ({
                        date: v.date,
                        type: 'success',
                        content: v.po_number,
                    })) || [];
                const revertPo =
                    data.revert_po?.map((v) => ({
                        date: v.date,
                        type: 'error',
                        content: v.po_number,
                    })) || [];

                const handleModifyWord = (word) => {
                    if (word === 'created') {
                        return 'Created';
                    } else if (word === 'confirm') {
                        return 'Confirmed';
                    } else if (word === 'revert') {
                        return 'Reverted';
                    }
                };

                setDataStatistics({
                    poCount: Object.keys(data.po_count)?.map((v) => ({
                        type: handleModifyWord(v),
                        value: data.po_count[v],
                    })),
                    adhocPoCount: Object.keys(data.adhoc_po_count)?.map(
                        (v) => ({
                            type: handleModifyWord(v),
                            value: data.adhoc_po_count[v],
                        })
                    ),
                    restPoCount: [
                        { type: 'Cover', value: data.cover_count },
                        {
                            type: 'CBD',
                            value: data.cbd_option_count,
                        },
                        {
                            type: 'MCL',
                            value: data.mcl_option_count,
                        },
                    ],
                    po: [...createdPo, ...confirmPo, ...revertPo],
                });
            },
            cacheTime: 0,
        }
    );

    useQuery(
        [
            'newsGetWordCloud',
            {
                country: lang === 'ko' ? 'ko' : 'en',
                start: rangeDate[0].format('YYYY-MM-DD'),
                end: rangeDate[1].format('YYYY-MM-DD'),
            },
        ],
        () =>
            newsGetWordCloudApi({
                country: lang === 'ko' ? 'ko' : 'en',
                start: rangeDate[0].format('YYYY-MM-DD'),
                end: rangeDate[1].format('YYYY-MM-DD'),
            }),
        {
            onSuccess: (res) => {
                setDataWordCloud(
                    Object.keys(res?.data)?.map((v) => ({
                        text: v,
                        value: res?.data[v],
                    }))
                );
            },
            refetchOnWindowFocus: false,
        }
    );

    const companyGetSearchPages = useQuery(
        ['companyGetSearch', companySearchPagination],
        () => companyGetSearchApi(companySearchPagination),
        {
            onSuccess: (res) => {
                const searchKeyword = companySearchPagination?.searchKeyword;
                const { content, totalElements, number, size } = res?.page;
                setCompanySearchDataSource(searchKeyword === '' ? [] : content);
                setCompanySearchPagination((companySearchPagination) => ({
                    ...companySearchPagination,
                    current: searchKeyword ? number : 1,
                    pageSize: searchKeyword ? size : 15,
                    total: searchKeyword ? totalElements : 0,
                }));
            },
            cacheTime: 0,
        }
    );

    const { data: userGetCheck, refetch: userGetCheckRefetch } = useQuery(
        'userGetCheck',
        () => userGetCheckApi(),
        {
            cacheTime: 0,
        }
    );

    const { status: userPostJoin, mutate: handleUserPostJoin } = useMutation(
        (payload) => userPostJoinApi(payload),
        {
            onSuccess: () => {
                handleNotification({
                    type: 'success',
                    message: 'Success',
                    description: 'Successful request to join the company',
                });
            },
            onError: () => {
                handleNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'Company Join Request Failed',
                });
            },
            onSettled: () => {
                userGetCheckRefetch();
            },
        }
    );

    // Dashboard Function
    const handleDate = useCallback(
        (v) => {
            return setDate({
                current: v,
                year: v.year(),
                month: v.month() + 1,
                day: v.date(),
            });
        },
        [setDate]
    );

    const handleCompanySearch = useCallback(
        (v) => {
            const keyword = v.target.value;
            return setCompanySearchPagination((companySearchPagination) => ({
                ...companySearchPagination,
                searchKeyword: keyword,
            }));
        },
        [setCompanySearchPagination]
    );

    const handleCompanyJoinRequest = useCallback(
        (companyId) => {
            const { userId } = userGetEmail?.data?.data || {};

            return handleUserPostJoin({
                userID: userId,
                companyID: companyId,
            });
        },
        [
            userGetEmail,
            handleUserPostJoin, // eslint-disable-line
        ]
    );

    const handleChangeLang = (_lang) => {
        if (lang !== _lang) {
            setLang(_lang);
            setNewsPagination({
                current: 1,
                pageSize: 10,
                searchKeyword: '',
                total: 0,
            });
            return handleNotification({
                type: 'success',
                message: 'Success',
                description: 'Keywords are initialized',
            });
        }
    };

    return (
        <Fragment>
            {userPostJoin === 'loading' && <Loading />}

            <Dashboard
                userType={userGetEmail.data?.data?.user_type || 'c'}
                date={date}
                onDate={handleDate}
                dataStatistics={dataStatistics}
                dataTutorialsData={dataTutorialsData}
                dataNews={dataNews}
                isNewsAll={isNewsAll}
                onIsNewsAll={setIsNewsAll}
                companySearchRowKey={companySearchRowKey}
                companySearchDataSource={companySearchDataSource}
                companySearchPagination={companySearchPagination}
                companySearchIsLoading={companyGetSearchPages?.isLoading}
                onCompanySearchPagination={setCompanySearchPagination}
                onCompanySearch={handleCompanySearch}
                onCompanyJoinRequest={handleCompanyJoinRequest}
                onChangeLang={handleChangeLang}
                newsPagination={newsPagination}
                onNewsPagination={setNewsPagination}
                rangeDate={rangeDate}
                onRangeDate={setRangeDate}
                dataWordCloud={dataWordCloud}
                userGetCheck={userGetCheck}
            />
        </Fragment>
    );
};

export default DashboardPage;
