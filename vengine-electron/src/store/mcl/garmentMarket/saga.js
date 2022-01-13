import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MCL_GARMENT_MARKET_GET_LISTS,
    mclGarmentMarketGetListsAsyncAction,
    ASYNC_MCL_GARMENT_MARKET_POST,
    mclGarmentMarketPostAsyncAction,
    ASYNC_MCL_GARMENT_MARKET_PUT,
    mclGarmentMarketPutAsyncAction,
    ASYNC_MCL_GARMENT_MARKET_DELETE,
    mclGarmentMarketDeleteAsyncAction,
} from './reducer';

const mclGarmentMarketGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/market/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclGarmentMarketPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/market/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclGarmentMarketPutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/market`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const mclGarmentMarketDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/market`,
        data: payload,
        method: 'DELETE',
    });

    return res.data;
};

const mclGarmentMarketGetListsSaga = createAsyncSaga(
    mclGarmentMarketGetListsAsyncAction,
    mclGarmentMarketGetListsApi
);

const mclGarmentMarketPostSaga = createAsyncSaga(
    mclGarmentMarketPostAsyncAction,
    mclGarmentMarketPostApi
);

const mclGarmentMarketPutSaga = createAsyncSaga(
    mclGarmentMarketPutAsyncAction,
    mclGarmentMarketPutApi
);

const mclGarmentMarketDeleteSaga = createAsyncSaga(
    mclGarmentMarketDeleteAsyncAction,
    mclGarmentMarketDeleteApi
);

export function* watchMclGarmentMarketSaga() {
    yield takeEvery(
        ASYNC_MCL_GARMENT_MARKET_GET_LISTS.REQUEST,
        mclGarmentMarketGetListsSaga
    );
    yield takeEvery(
        ASYNC_MCL_GARMENT_MARKET_POST.REQUEST,
        mclGarmentMarketPostSaga
    );
    yield takeEvery(
        ASYNC_MCL_GARMENT_MARKET_PUT.REQUEST,
        mclGarmentMarketPutSaga
    );
    yield takeEvery(
        ASYNC_MCL_GARMENT_MARKET_DELETE.REQUEST,
        mclGarmentMarketDeleteSaga
    );
}
