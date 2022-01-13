import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MCL_ORDER_QTY_GET_ID,
    mclOrderQtyGetIdAsyncAction,
    ASYNC_MCL_ORDER_QTY_POST,
    mclOrderQtyPostAsyncAction,
} from './reducer';

const mclOrderQtyGetIdApi = async (payload) => {
    if (payload === undefined) return;
    const res = await apiUtil({
        url: `/v1/mcl/order/qty/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclOrderQtyPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/order/qty/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclOrderQtyGetIdSaga = createAsyncSaga(
    mclOrderQtyGetIdAsyncAction,
    mclOrderQtyGetIdApi
);

const mclOrderQtyPostSaga = createAsyncSaga(
    mclOrderQtyPostAsyncAction,
    mclOrderQtyPostApi
);

export function* watchMclOrderQtySaga() {
    yield takeEvery(ASYNC_MCL_ORDER_QTY_GET_ID.REQUEST, mclOrderQtyGetIdSaga);
    yield takeEvery(ASYNC_MCL_ORDER_QTY_POST.REQUEST, mclOrderQtyPostSaga);
}
