import { takeLatest } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_COMMON_BASIC_GET_ID,
    commonBasicGetIdAsyncAction,
    ASYNC_COMMON_BASIC_GET_LISTS,
    commonBasicGetListsAsyncAction,
    ASYNC_COMMON_BASIC_GET_PAGES,
    commonBasicGetPagesAsyncAction,
    ASYNC_COMMON_BASIC_GET_COUNTRIES,
    commonBasicGetCountriesAsyncAction,
    ASYNC_COMMON_BASIC_GET_CITIES,
    commonBasicGetCitiesAsyncAction,
    ASYNC_COMMON_BASIC_GET_UOM,
    commonBasicGetUomAsyncAction,
    ASYNC_COMMON_BASIC_GET_PORT,
    commonBasicGetPortAsyncAction,
    ASYNC_COMMON_BASIC_POST,
    commonBasicPostAsyncAction,
} from './reducer';

const commonBasicGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/basic`,
        params: payload,
        method: 'GET',
    });
    return res.data;
};

const commonBasicGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/basic/list/${payload}`,
        method: 'GET',
    });
    return res.data;
};

const commonBasicGetPagesApi = async (payload) => {
    const search = {};
    const paging = {};
    const searchFilter = '';

    paging.page = payload.pagination.page / 10 + 1;
    paging.size = payload.pagination.size;

    search.paging = paging;
    search.searchFilter = searchFilter;

    const res = await apiUtil({
        url: `/v1/common/basic/page/${payload.type}?page=${payload.pagination.current}&size=${payload.pagination.pageSize}`,
        method: 'GET',
    });
    return res.data;
};

const commonBasicGetCountriesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/basic/countries`,
        method: 'GET',
    });

    return res.data;
};

const commonBasicGetCitiesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/basic/cities/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const commonBasicGetUomApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/basic/uom/${payload}`,
        method: 'GET',
    });
    return { ...res.data, list: res.data?.list?.filter((v) => v.id !== 18672) };
};

const commonBasicGetPortApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/basic/port/${payload.id}`,
        params: { searchKeyWord: payload.searchKeyWord },
        method: 'GET',
    });

    return res.data;
};

const commonBasicPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/basic/${payload.type}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const commonBasicGetIdSaga = createAsyncSaga(
    commonBasicGetIdAsyncAction,
    commonBasicGetIdApi
);

const commonBasicGetListsSaga = createAsyncSaga(
    commonBasicGetListsAsyncAction,
    commonBasicGetListsApi
);

const commonBasicGetPagesSaga = createAsyncSaga(
    commonBasicGetPagesAsyncAction,
    commonBasicGetPagesApi
);

const commonBasicGetCountriesSaga = createAsyncSaga(
    commonBasicGetCountriesAsyncAction,
    commonBasicGetCountriesApi
);
const commonBasicGetCitiesSaga = createAsyncSaga(
    commonBasicGetCitiesAsyncAction,
    commonBasicGetCitiesApi
);
const commonBasicGetUomSaga = createAsyncSaga(
    commonBasicGetUomAsyncAction,
    commonBasicGetUomApi
);
const commonBasicGetPortSaga = createAsyncSaga(
    commonBasicGetPortAsyncAction,
    commonBasicGetPortApi
);
const commonBasicPostSaga = createAsyncSaga(
    commonBasicPostAsyncAction,
    commonBasicPostApi
);

export function* watchCommonBasicSaga() {
    yield takeLatest(ASYNC_COMMON_BASIC_GET_ID.REQUEST, commonBasicGetIdSaga);
    yield takeLatest(
        ASYNC_COMMON_BASIC_GET_LISTS.REQUEST,
        commonBasicGetListsSaga
    );
    yield takeLatest(
        ASYNC_COMMON_BASIC_GET_PAGES.REQUEST,
        commonBasicGetPagesSaga
    );

    yield takeLatest(
        ASYNC_COMMON_BASIC_GET_COUNTRIES.REQUEST,
        commonBasicGetCountriesSaga
    );
    yield takeLatest(
        ASYNC_COMMON_BASIC_GET_CITIES.REQUEST,
        commonBasicGetCitiesSaga
    );
    yield takeLatest(ASYNC_COMMON_BASIC_GET_UOM.REQUEST, commonBasicGetUomSaga);
    yield takeLatest(
        ASYNC_COMMON_BASIC_GET_PORT.REQUEST,
        commonBasicGetPortSaga
    );

    yield takeLatest(ASYNC_COMMON_BASIC_POST.REQUEST, commonBasicPostSaga);
}
