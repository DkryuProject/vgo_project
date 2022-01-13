import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MCL_CBD_ASSIGN_GET_LISTS,
    mclCbdAssignGetListsAsyncAction,
    ASYNC_MCL_CBD_ASSIGN_GET_OPTION,
    mclCbdAssignGetOptionAsyncAction,
    ASYNC_MCL_CBD_ASSIGN_POST,
    mclCbdAssignPostAsyncAction,
    ASYNC_MCL_CBD_ASSIGN_DELETE,
    mclCbdAssignDeleteAsyncAction,
} from './reducer';

const mclCbdAssignGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/assign/cbd/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclCbdAssignGetOptionApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/assign/cbd/option/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclCbdAssignPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/assign/cbd/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclCbdAssignDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/assign/cbd/${payload}`,
        method: 'DELETE',
    });

    return res.data;
};

const mclCbdAssignGetListsSaga = createAsyncSaga(
    mclCbdAssignGetListsAsyncAction,
    mclCbdAssignGetListsApi
);

const mclCbdAssignGetOptionSaga = createAsyncSaga(
    mclCbdAssignGetOptionAsyncAction,
    mclCbdAssignGetOptionApi
);

const mclCbdAssignPostSaga = createAsyncSaga(
    mclCbdAssignPostAsyncAction,
    mclCbdAssignPostApi
);

const mclCbdAssignDeleteSaga = createAsyncSaga(
    mclCbdAssignDeleteAsyncAction,
    mclCbdAssignDeleteApi
);

export function* watchMclCbdAssignSaga() {
    yield takeEvery(
        ASYNC_MCL_CBD_ASSIGN_GET_LISTS.REQUEST,
        mclCbdAssignGetListsSaga
    );
    yield takeEvery(
        ASYNC_MCL_CBD_ASSIGN_GET_OPTION.REQUEST,
        mclCbdAssignGetOptionSaga
    );
    yield takeEvery(ASYNC_MCL_CBD_ASSIGN_POST.REQUEST, mclCbdAssignPostSaga);
    yield takeEvery(
        ASYNC_MCL_CBD_ASSIGN_DELETE.REQUEST,
        mclCbdAssignDeleteSaga
    );
}
