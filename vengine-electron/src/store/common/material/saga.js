import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_COMMON_MATERIAL_GET_LISTS,
    commonMaterialGetListsAsyncAction,
    ASYNC_COMMON_MATERIAL_GET_PAGES,
    commonMaterialGetPagesAsyncAction,
    ASYNC_COMMON_MATERIAL_GET_ID,
    commonMaterialGetIdAsyncAction,
    ASYNC_COMMON_MATERIAL_POST,
    commonMaterialPostAsyncAction,
    ASYNC_COMMON_MATERIAL_PUT,
    commonMaterialPutAsyncAction,
} from './reducer';

const commonMaterialGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/material/types/list`,
        method: 'GET',
    });

    return res.data;
};

const commonMaterialGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/material/types/page?page=${
            payload.pagination?.current || payload.current
        }&size=${payload.pagination?.pageSize || payload.pageSize}`,
        method: 'GET',
    });

    return res.data;
};

const commonMaterialGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/material/type/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const commonMaterialPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/material/type`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const commonMaterialPutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/common/material/type/${payload.id}`,
        params: payload.body,
        method: 'PUT',
    });

    return res.data;
};

const commonMaterialGetListsSaga = createAsyncSaga(
    commonMaterialGetListsAsyncAction,
    commonMaterialGetListsApi
);

const commonMaterialGetPagesSaga = createAsyncSaga(
    commonMaterialGetPagesAsyncAction,
    commonMaterialGetPagesApi
);

const commonMaterialGetIdSaga = createAsyncSaga(
    commonMaterialGetIdAsyncAction,
    commonMaterialGetIdApi
);

const commonMaterialPostSaga = createAsyncSaga(
    commonMaterialPostAsyncAction,
    commonMaterialPostApi
);

const commonMaterialPutSaga = createAsyncSaga(
    commonMaterialPutAsyncAction,
    commonMaterialPutApi
);

export function* watchCommonMaterialSaga() {
    yield takeEvery(
        ASYNC_COMMON_MATERIAL_GET_LISTS.REQUEST,
        commonMaterialGetListsSaga
    );
    yield takeEvery(
        ASYNC_COMMON_MATERIAL_GET_PAGES.REQUEST,
        commonMaterialGetPagesSaga
    );
    yield takeEvery(
        ASYNC_COMMON_MATERIAL_GET_ID.REQUEST,
        commonMaterialGetIdSaga
    );
    yield takeEvery(ASYNC_COMMON_MATERIAL_POST.REQUEST, commonMaterialPostSaga);
    yield takeEvery(ASYNC_COMMON_MATERIAL_PUT.REQUEST, commonMaterialPutSaga);
}
