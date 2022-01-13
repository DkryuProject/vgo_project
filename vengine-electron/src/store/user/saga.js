import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_USER_GET_EMAIL,
    userGetEmailAsyncAction,
    ASYNC_USER_GET_ID,
    userGetIdAsyncAction,
    ASYNC_USER_GET_PAGES,
    userGetPagesAsyncAction,
    ASYNC_USER_GET_LEVEL,
    userGetLevelAsyncAction,
    ASYNC_USER_GET_RESET_EMAIL,
    userGetResetEmailAsyncAction,
    ASYNC_USER_PUT,
    userPutAsyncAction,
    ASYNC_USER_PUT_STATUS,
    userPutStatusAsyncAction,
} from './reducer';

export const userGetEmailApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/user/email`,
        params: payload,
        method: 'GET',

        headers: {
            'X-AUTH-TOKEN': localStorage.getItem('authToken'),
        },
    });

    return res.data;
};

const userGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/user`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const userGetPagesApi = async (payload) => {
    // const userId = payload.userId;

    const res = await apiUtil({
        url: `/v1/users`,
        params: {
            page: payload.current,
            size: payload.pageSize,
        },
        method: 'GET',
    });

    // const newData = res.data.page.content.filter((v) => v.userId !== userId);

    // if (userId) {
    //     res.data.page.content = newData;
    // }

    return res.data;
};

const userGetLevelApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/user/level/list`,
        method: 'GET',
    });

    return res.data;
};

const userGetResetEmailApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/user/reset/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const userPutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/user`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const userPutStatusApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/user/status`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const userGetEmailSaga = createAsyncSaga(
    userGetEmailAsyncAction,
    userGetEmailApi
);

const userGetIdSaga = createAsyncSaga(userGetIdAsyncAction, userGetIdApi);

const userGetPagesSaga = createAsyncSaga(
    userGetPagesAsyncAction,
    userGetPagesApi
);

const userGetLevelSaga = createAsyncSaga(
    userGetLevelAsyncAction,
    userGetLevelApi
);

const userGetResetEmailSaga = createAsyncSaga(
    userGetResetEmailAsyncAction,
    userGetResetEmailApi
);

const userPutSaga = createAsyncSaga(userPutAsyncAction, userPutApi);
const userPutStatusSaga = createAsyncSaga(
    userPutStatusAsyncAction,
    userPutStatusApi
);

export function* watchUserSaga() {
    yield takeEvery(ASYNC_USER_GET_EMAIL.REQUEST, userGetEmailSaga);
    yield takeEvery(ASYNC_USER_GET_ID.REQUEST, userGetIdSaga);
    yield takeEvery(ASYNC_USER_GET_PAGES.REQUEST, userGetPagesSaga);
    yield takeEvery(ASYNC_USER_GET_LEVEL.REQUEST, userGetLevelSaga);
    yield takeEvery(ASYNC_USER_GET_RESET_EMAIL.REQUEST, userGetResetEmailSaga);
    yield takeEvery(ASYNC_USER_PUT.REQUEST, userPutSaga);
    yield takeEvery(ASYNC_USER_PUT_STATUS.REQUEST, userPutStatusSaga);
}
