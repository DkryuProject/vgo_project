import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MCL_GARMENT_SIZE_GET_LISTS,
    mclGarmentSizeGetListsAsyncAction,
    ASYNC_MCL_GARMENT_SIZE_POST,
    mclGarmentSizePostAsyncAction,
    ASYNC_MCL_GARMENT_SIZE_PUT,
    mclGarmentSizePutAsyncAction,
    ASYNC_MCL_GARMENT_SIZE_DELETE,
    mclGarmentSizeDeleteAsyncAction,
} from './reducer';

const mclGarmentSizeGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/size/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclGarmentSizePostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/size/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclGarmentSizePutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/size`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const mclGarmentSizeDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/size`,
        data: payload,
        method: 'DELETE',
    });

    return res.data;
};

const mclGarmentSizeGetListsSaga = createAsyncSaga(
    mclGarmentSizeGetListsAsyncAction,
    mclGarmentSizeGetListsApi
);

const mclGarmentSizePostSaga = createAsyncSaga(
    mclGarmentSizePostAsyncAction,
    mclGarmentSizePostApi
);

const mclGarmentSizePutSaga = createAsyncSaga(
    mclGarmentSizePutAsyncAction,
    mclGarmentSizePutApi
);

const mclGarmentSizeDeleteSaga = createAsyncSaga(
    mclGarmentSizeDeleteAsyncAction,
    mclGarmentSizeDeleteApi
);

export function* watchMclGarmentSizeSaga() {
    yield takeEvery(
        ASYNC_MCL_GARMENT_SIZE_GET_LISTS.REQUEST,
        mclGarmentSizeGetListsSaga
    );
    yield takeEvery(
        ASYNC_MCL_GARMENT_SIZE_POST.REQUEST,
        mclGarmentSizePostSaga
    );
    yield takeEvery(ASYNC_MCL_GARMENT_SIZE_PUT.REQUEST, mclGarmentSizePutSaga);
    yield takeEvery(
        ASYNC_MCL_GARMENT_SIZE_DELETE.REQUEST,
        mclGarmentSizeDeleteSaga
    );
}
