import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MCL_OPTION_GET_LISTS,
    mclOptionGetListsAsyncAction,
    ASYNC_MCL_OPTION_GET_ID,
    mclOptionGetIdAsyncAction,
    ASYNC_MCL_OPTION_DOCUMENT_GET_ID,
    mclOptionDocumentGetIdAsyncAction,
    ASYNC_MCL_OPTION_POST,
    mclOptionPostAsyncAction,
    ASYNC_MCL_OPTION_PUT,
    mclOptionPutAsyncAction,
    ASYNC_MCL_OPTION_PUT_STATUS,
    mclOptionPutStatusAsyncAction,
    ASYNC_MCL_OPTION_DELETE,
    mclOptionDeleteAsyncAction,
} from './reducer';

const mclOptionGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/option/cbd/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclOptionGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/option/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclOptionDocumentGetIdApi = async (payload) => {
    if (!payload) return;
    const res = await apiUtil({
        url: `/v1/mcl/document/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclOptionPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/option`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const mclOptionPutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/option/${payload.id}`,
        data: payload.data,
        method: 'PUT',
    });
    return res.data;
};

const mclOptionPutStatusApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/option/status/${payload.id}`,
        params: { status: payload.data },
        method: 'PUT',
    });

    return res.data;
};

const mclOptionDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/option/${payload}`,
        method: 'DELETE',
    });

    return res.data;
};

const mclOptionGetListsSaga = createAsyncSaga(
    mclOptionGetListsAsyncAction,
    mclOptionGetListsApi
);

const mclOptionGetIdSaga = createAsyncSaga(
    mclOptionGetIdAsyncAction,
    mclOptionGetIdApi
);

const mclOptionDocumentGetIdSaga = createAsyncSaga(
    mclOptionDocumentGetIdAsyncAction,
    mclOptionDocumentGetIdApi
);

const mclOptionPostSaga = createAsyncSaga(
    mclOptionPostAsyncAction,
    mclOptionPostApi
);

const mclOptionPutSaga = createAsyncSaga(
    mclOptionPutAsyncAction,
    mclOptionPutApi
);

const mclOptionPutStatusSaga = createAsyncSaga(
    mclOptionPutStatusAsyncAction,
    mclOptionPutStatusApi
);

const mclOptionDeleteSaga = createAsyncSaga(
    mclOptionDeleteAsyncAction,
    mclOptionDeleteApi
);

export function* watchMclOptionSaga() {
    yield takeEvery(ASYNC_MCL_OPTION_GET_LISTS.REQUEST, mclOptionGetListsSaga);
    yield takeEvery(ASYNC_MCL_OPTION_GET_ID.REQUEST, mclOptionGetIdSaga);
    yield takeEvery(
        ASYNC_MCL_OPTION_DOCUMENT_GET_ID.REQUEST,
        mclOptionDocumentGetIdSaga
    );
    yield takeEvery(ASYNC_MCL_OPTION_POST.REQUEST, mclOptionPostSaga);
    yield takeEvery(ASYNC_MCL_OPTION_PUT.REQUEST, mclOptionPutSaga);
    yield takeEvery(
        ASYNC_MCL_OPTION_PUT_STATUS.REQUEST,
        mclOptionPutStatusSaga
    );
    yield takeEvery(ASYNC_MCL_OPTION_DELETE.REQUEST, mclOptionDeleteSaga);
}
