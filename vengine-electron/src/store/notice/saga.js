import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_NOTICE_GET_PAGES,
    noticeGetPagesAsyncAction,
    ASYNC_NOTICE_POST,
    noticePostAsyncAction,
    ASYNC_NOTICE_PUT,
    noticePutAsyncAction,
} from './reducer';

export const noticeGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/notice`,
        params: {
            page: payload.current,
            size: payload.pageSize,
        },
        method: 'GET',
    });

    return res.data;
};

export const noticePostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/notice`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

export const noticePutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/notice/${payload.id}`,
        data: payload.data,
        method: 'PUT',
    });

    return res.data;
};

const noticeGetPagesSaga = createAsyncSaga(
    noticeGetPagesAsyncAction,
    noticeGetPagesApi
);
const noticePostSaga = createAsyncSaga(noticePostAsyncAction, noticePostApi);
const noticePutSaga = createAsyncSaga(noticePutAsyncAction, noticePutApi);

export function* watchNoticeSaga() {
    yield takeEvery(ASYNC_NOTICE_GET_PAGES.REQUEST, noticeGetPagesSaga);
    yield takeEvery(ASYNC_NOTICE_POST.REQUEST, noticePostSaga);
    yield takeEvery(ASYNC_NOTICE_PUT.REQUEST, noticePutSaga);
}
