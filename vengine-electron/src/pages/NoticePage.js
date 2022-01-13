import React from 'react';
import { Route } from 'react-router-dom';
import { NoticeDetail, NoticeLists, NoticeWrite } from 'components/notice';

const NoticePage = (props) => {
    const { match } = props;
    return (
        <>
            <Route path={`${match.path}/lists`} component={NoticeLists} />
            <Route path={`${match.path}/write`} component={NoticeWrite} />
            <Route
                path={`${match.path}/detail/:noticeId`}
                component={NoticeDetail}
            />
        </>
    );
};

export default NoticePage;
