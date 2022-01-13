import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_CBD_COSTING_GET_LISTS,
    cbdCostingGetListsAsyncAction,
    ASYNC_CBD_COSTING_GET_ID,
    cbdCostingGetIdAsyncAction,
    ASYNC_CBD_COSTING_POST,
    cbdCostingPostAsyncAction,
    ASYNC_CBD_COSTING_DELETE,
    cbdCostingDeleteAsyncAction,
} from './reducer';

const cbdCostingGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/costing/${payload.type}/${payload.id}`,
        method: 'GET',
    });
    return {
        type: payload.type,
        data: res.data,
    };
};

const cbdCostingGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/costing/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const cbdCostingPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/costing`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const cbdCostingDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/costing`,
        data: payload,
        method: 'DELETE',
    });

    return res.data;
};

const cbdCostingGetListsSaga = createAsyncSaga(
    cbdCostingGetListsAsyncAction,
    cbdCostingGetListsApi
);

const cbdCostingGetIdSaga = createAsyncSaga(
    cbdCostingGetIdAsyncAction,
    cbdCostingGetIdApi
);

const cbdCostingPostSaga = createAsyncSaga(
    cbdCostingPostAsyncAction,
    cbdCostingPostApi
);

const cbdCostingDeleteSaga = createAsyncSaga(
    cbdCostingDeleteAsyncAction,
    cbdCostingDeleteApi
);

export function* watchCbdCostingSaga() {
    yield takeEvery(
        ASYNC_CBD_COSTING_GET_LISTS.REQUEST,
        cbdCostingGetListsSaga
    );
    yield takeEvery(ASYNC_CBD_COSTING_GET_ID.REQUEST, cbdCostingGetIdSaga);
    yield takeEvery(ASYNC_CBD_COSTING_POST.REQUEST, cbdCostingPostSaga);
    yield takeEvery(ASYNC_CBD_COSTING_DELETE.REQUEST, cbdCostingDeleteSaga);
}
