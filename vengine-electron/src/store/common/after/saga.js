import { takeLatest } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_COMMON_AFTER_GET_ID,
    commonAfterGetIdAsyncAction,
    ASYNC_COMMON_AFTER_GET_LISTS,
    commonAfterGetListsAsyncAction,
    ASYNC_COMMON_AFTER_GET_PAGES,
    commonAfterGetPagesAsyncAction,
    ASYNC_COMMON_AFTER_POST,
    commonAfterPostAsyncAction,
} from './reducer';

const commonAfterGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/after`,
        params: payload,
        method: 'GET',
    });
    return res.data;
};

export const commonAfterGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company-info/list?type=after`,
        method: 'GET',
    });
    return res.data;
};

const commonAfterGetPagesApi = async (payload) => {
    const search = {};
    const paging = {};
    const searchFilter = '';

    paging.page = payload.pagination.page / 10 + 1;
    paging.size = payload.pagination.size;

    search.paging = paging;
    search.searchFilter = searchFilter;

    const res = await apiUtil({
        url: `/v1/company/afters/page?page=${payload.pagination.current}&size=${payload.pagination.pageSize}`,
        data: search,
        method: 'GET',
    });
    return res.data;
};

const commonAfterPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/after`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const commonAfterGetIdSaga = createAsyncSaga(
    commonAfterGetIdAsyncAction,
    commonAfterGetIdApi
);

const commonAfterGetListsSaga = createAsyncSaga(
    commonAfterGetListsAsyncAction,
    commonAfterGetListsApi
);

const commonAfterGetPagesSaga = createAsyncSaga(
    commonAfterGetPagesAsyncAction,
    commonAfterGetPagesApi
);

const commonAfterPostSaga = createAsyncSaga(
    commonAfterPostAsyncAction,
    commonAfterPostApi
);

export function* watchCommonAfterSaga() {
    yield takeLatest(ASYNC_COMMON_AFTER_GET_ID.REQUEST, commonAfterGetIdSaga);
    yield takeLatest(
        ASYNC_COMMON_AFTER_GET_LISTS.REQUEST,
        commonAfterGetListsSaga
    );
    yield takeLatest(
        ASYNC_COMMON_AFTER_GET_PAGES.REQUEST,
        commonAfterGetPagesSaga
    );
    yield takeLatest(ASYNC_COMMON_AFTER_POST.REQUEST, commonAfterPostSaga);
}
