import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_CBD_OPTION_GET_LISTS,
    cbdOptionGetListsAsyncAction,
    ASYNC_CBD_OPTION_GET_ID,
    cbdOptionGetIdAsyncAction,
    ASYNC_CBD_OPTION_DOCUMENT_GET_ID,
    cbdOptionDocumentGetIdAsyncAction,
    ASYNC_CBD_OPTION_SIMULATION_GET_ID,
    cbdOptionSimulationGetIdAsyncAction,
    ASYNC_CBD_OPTION_POST,
    cbdOptionPostAsyncAction,
    ASYNC_CBD_OPTION_POST_COPY,
    cbdOptionPostCopyAsyncAction,
    ASYNC_CBD_OPTION_PUT,
    cbdOptionPutAsyncAction,
    ASYNC_CBD_OPTION_DELETE,
    cbdOptionDeleteAsyncAction,
} from './reducer';

const cbdOptionGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/option/cover/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const cbdOptionGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/option/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const cbdOptionDocumentGetIdApi = async (payload) => {
    if (!payload) {
        return;
    }
    const res = await apiUtil({
        url: `/v1/cbd/document/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const cbdOptionSimulationGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/option/simulation/${payload.cbdOptionId}`,
        params: { targetProfit: payload.targetProfit },
        method: 'GET',
    });

    return res.data;
};

const cbdOptionPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/option`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const cbdOptionPostCopyApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/option/copy/${payload?.cbdOptionId}`,
        params: {
            cbdCoverId: payload?.cbdCoverId,
            cbdOptionName: payload?.cbdOptionName,
            targetProfit: payload?.targetProfit,
        },
        method: 'POST',
    });

    return res.data;
};

const cbdOptionPutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/option/status/${payload.id}`,
        params: { status: payload.data },
        method: 'PUT',
    });

    return res.data;
};

const cbdOptionDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/option/${payload}`,
        method: 'DELETE',
    });

    return res.data;
};

const cbdOptionGetListsSaga = createAsyncSaga(
    cbdOptionGetListsAsyncAction,
    cbdOptionGetListsApi
);

const cbdOptionGetIdSaga = createAsyncSaga(
    cbdOptionGetIdAsyncAction,
    cbdOptionGetIdApi
);

const cbdOptionDocumentGetIdSaga = createAsyncSaga(
    cbdOptionDocumentGetIdAsyncAction,
    cbdOptionDocumentGetIdApi
);

const cbdOptionSimulationGetIdSaga = createAsyncSaga(
    cbdOptionSimulationGetIdAsyncAction,
    cbdOptionSimulationGetIdApi
);

const cbdOptionPostSaga = createAsyncSaga(
    cbdOptionPostAsyncAction,
    cbdOptionPostApi
);

const cbdOptionPostCopySaga = createAsyncSaga(
    cbdOptionPostCopyAsyncAction,
    cbdOptionPostCopyApi
);

const cbdOptionPutSaga = createAsyncSaga(
    cbdOptionPutAsyncAction,
    cbdOptionPutApi
);

const cbdOptionDeleteSaga = createAsyncSaga(
    cbdOptionDeleteAsyncAction,
    cbdOptionDeleteApi
);

export function* watchCbdOptionSaga() {
    yield takeEvery(ASYNC_CBD_OPTION_GET_LISTS.REQUEST, cbdOptionGetListsSaga);
    yield takeEvery(ASYNC_CBD_OPTION_GET_ID.REQUEST, cbdOptionGetIdSaga);
    yield takeEvery(
        ASYNC_CBD_OPTION_DOCUMENT_GET_ID.REQUEST,
        cbdOptionDocumentGetIdSaga
    );
    yield takeEvery(
        ASYNC_CBD_OPTION_SIMULATION_GET_ID.REQUEST,
        cbdOptionSimulationGetIdSaga
    );
    yield takeEvery(ASYNC_CBD_OPTION_POST.REQUEST, cbdOptionPostSaga);
    yield takeEvery(ASYNC_CBD_OPTION_POST_COPY.REQUEST, cbdOptionPostCopySaga);
    yield takeEvery(ASYNC_CBD_OPTION_PUT.REQUEST, cbdOptionPutSaga);
    yield takeEvery(ASYNC_CBD_OPTION_DELETE.REQUEST, cbdOptionDeleteSaga);
}
