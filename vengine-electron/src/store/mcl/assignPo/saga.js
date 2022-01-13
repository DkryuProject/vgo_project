import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MCL_ASSIGN_PO_GET_LISTS,
    mclAssignPoGetListsAsyncAction,
    ASYNC_MCL_ASSIGN_PO_POST,
    mclAssignPoPostAsyncAction,
    ASYNC_MCL_ASSIGN_PO_DELETE,
    mclAssignPoDeleteAsyncAction,
} from './reducer';

const mclAssignPoGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/assign/po/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclAssignPoPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/assign/po/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclAssignPoDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/pre-booking-po/${payload}`,
        method: 'DELETE',
    });

    return res.data;
};

const mclAssignPoGetListsSaga = createAsyncSaga(
    mclAssignPoGetListsAsyncAction,
    mclAssignPoGetListsApi
);

const mclAssignPoPostSaga = createAsyncSaga(
    mclAssignPoPostAsyncAction,
    mclAssignPoPostApi
);

const mclAssignPoDeleteSaga = createAsyncSaga(
    mclAssignPoDeleteAsyncAction,
    mclAssignPoDeleteApi
);

export function* watchMclAssignPoSaga() {
    yield takeEvery(
        ASYNC_MCL_ASSIGN_PO_GET_LISTS.REQUEST,
        mclAssignPoGetListsSaga
    );
    yield takeEvery(ASYNC_MCL_ASSIGN_PO_POST.REQUEST, mclAssignPoPostSaga);
    yield takeEvery(ASYNC_MCL_ASSIGN_PO_DELETE.REQUEST, mclAssignPoDeleteSaga);
}
