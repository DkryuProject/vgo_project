import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MCL_ADHOC_GET_PAGES,
    mclAdhocGetPagesAsyncAction,
    ASYNC_MCL_ADHOC_GET_ID,
    mclAdhocGetIdAsyncAction,
    ASYNC_MCL_ADHOC_POST_ID,
    mclAdhocPostIdAsyncAction,
    ASYNC_MCL_ADHOC_POST_REORDER_ID,
    mclAdhocPostReorderIdAsyncAction,
    ASYNC_MCL_ADHOC_POST_MATERIAL,
    mclAdhocPostMaterialAsyncAction,
    ASYNC_MCL_ADHOC_POST_EMAIL,
    mclAdhocPostEmailAsyncAction,
    ASYNC_MCL_ADHOC_PUT_CANCELED,
    mclAdhocPutCanceledAsyncAction,
} from './reducer';

const mclAdhocGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/adhoc/order`,
        params: {
            page: payload.current,
            size: payload.pageSize,
            searchKeyWord: payload.searchKeyword,
            status: payload.status,
        },
        method: 'GET',
    });

    return res.data;
};

const mclAdhocGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/adhoc/order/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclAdhocPostIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/adhoc/order`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const mclAdhocPostReorderIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/adhoc/reorder/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclAdhocPostMaterialApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/adhoc/order/material`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const mclAdhocPostEmailApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/adhoc/order/email/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclAdhocPutCanceledApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/adhoc/order/canceled`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const mclAdhocGetPagesSaga = createAsyncSaga(
    mclAdhocGetPagesAsyncAction,
    mclAdhocGetPagesApi
);

const mclAdhocGetIdSaga = createAsyncSaga(
    mclAdhocGetIdAsyncAction,
    mclAdhocGetIdApi
);

const mclAdhocPostIdSaga = createAsyncSaga(
    mclAdhocPostIdAsyncAction,
    mclAdhocPostIdApi
);

const mclAdhocPostReorderIdSaga = createAsyncSaga(
    mclAdhocPostReorderIdAsyncAction,
    mclAdhocPostReorderIdApi
);

const mclAdhocPostMaterialSaga = createAsyncSaga(
    mclAdhocPostMaterialAsyncAction,
    mclAdhocPostMaterialApi
);

const mclAdhocPostEmailSaga = createAsyncSaga(
    mclAdhocPostEmailAsyncAction,
    mclAdhocPostEmailApi
);

const mclAdhocPutCanceledSaga = createAsyncSaga(
    mclAdhocPutCanceledAsyncAction,
    mclAdhocPutCanceledApi
);

export function* watchMclAdhocSaga() {
    yield takeEvery(ASYNC_MCL_ADHOC_GET_PAGES.REQUEST, mclAdhocGetPagesSaga);
    yield takeEvery(ASYNC_MCL_ADHOC_GET_ID.REQUEST, mclAdhocGetIdSaga);
    yield takeEvery(ASYNC_MCL_ADHOC_POST_ID.REQUEST, mclAdhocPostIdSaga);
    yield takeEvery(
        ASYNC_MCL_ADHOC_POST_REORDER_ID.REQUEST,
        mclAdhocPostReorderIdSaga
    );
    yield takeEvery(
        ASYNC_MCL_ADHOC_POST_MATERIAL.REQUEST,
        mclAdhocPostMaterialSaga
    );
    yield takeEvery(ASYNC_MCL_ADHOC_POST_EMAIL.REQUEST, mclAdhocPostEmailSaga);
    yield takeEvery(
        ASYNC_MCL_ADHOC_PUT_CANCELED.REQUEST,
        mclAdhocPutCanceledSaga
    );
}
