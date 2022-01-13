import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MCL_GARMENT_COLOR_GET_LISTS,
    mclGarmentColorGetListsAsyncAction,
    ASYNC_MCL_GARMENT_COLOR_POST,
    mclGarmentColorPostAsyncAction,
    ASYNC_MCL_GARMENT_COLOR_PUT,
    mclGarmentColorPutAsyncAction,
    ASYNC_MCL_GARMENT_COLOR_DELETE,
    mclGarmentColorDeleteAsyncAction,
} from './reducer';

const mclGarmentColorGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/color/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclGarmentColorPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/color/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclGarmentColorPutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/color`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const mclGarmentColorDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/color`,
        data: payload,
        method: 'DELETE',
    });

    return res.data;
};

const mclGarmentColorGetListsSaga = createAsyncSaga(
    mclGarmentColorGetListsAsyncAction,
    mclGarmentColorGetListsApi
);

const mclGarmentColorPostSaga = createAsyncSaga(
    mclGarmentColorPostAsyncAction,
    mclGarmentColorPostApi
);

const mclGarmentColorPutSaga = createAsyncSaga(
    mclGarmentColorPutAsyncAction,
    mclGarmentColorPutApi
);

const mclGarmentColorDeleteSaga = createAsyncSaga(
    mclGarmentColorDeleteAsyncAction,
    mclGarmentColorDeleteApi
);

export function* watchMclGarmentColorSaga() {
    yield takeEvery(
        ASYNC_MCL_GARMENT_COLOR_GET_LISTS.REQUEST,
        mclGarmentColorGetListsSaga
    );
    yield takeEvery(
        ASYNC_MCL_GARMENT_COLOR_POST.REQUEST,
        mclGarmentColorPostSaga
    );
    yield takeEvery(
        ASYNC_MCL_GARMENT_COLOR_PUT.REQUEST,
        mclGarmentColorPutSaga
    );
    yield takeEvery(
        ASYNC_MCL_GARMENT_COLOR_DELETE.REQUEST,
        mclGarmentColorDeleteSaga
    );
}
