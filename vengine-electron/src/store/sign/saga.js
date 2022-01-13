import { takeLatest } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_SIGNIN_POST,
    signinPostAsyncAction,
    ASYNC_SIGNUP_POST,
    signupPostAsyncAction,
    ASYNC_INVITE_POST,
    invitePostAsyncAction,
} from './reducer';

export const signinPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/signin`,
        params: payload,
        method: 'POST',
    });

    localStorage.setItem('email', payload.email);
    localStorage.setItem('authToken', res.data.data);

    return res.data;
};

const signupPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/signup/${payload.type}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const invitePostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/invite`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const signinPostSaga = createAsyncSaga(signinPostAsyncAction, signinPostApi);
const signupPostSaga = createAsyncSaga(signupPostAsyncAction, signupPostApi);
const invitePostSaga = createAsyncSaga(invitePostAsyncAction, invitePostApi);

export function* watchSignSaga() {
    yield takeLatest(ASYNC_SIGNIN_POST.REQUEST, signinPostSaga);
    yield takeLatest(ASYNC_SIGNUP_POST.REQUEST, signupPostSaga);
    yield takeLatest(ASYNC_INVITE_POST.REQUEST, invitePostSaga);
}
