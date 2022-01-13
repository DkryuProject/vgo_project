import { takeLatest } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_SIGN_VERIFY_POST_MAIL,
    signVerifyPostMailAsyncAction,
    ASYNC_SIGN_VERIFY_POST_CODE,
    signVerifyPostCodeAsyncAction,
} from './reducer';

const signVerifyPostMailApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mail/verify`,
        params: payload,
        method: 'POST',
    });

    return res.data;
};

const signVerifyPostCodeApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/verify`,
        params: payload,
        method: 'POST',
    });

    return res.data;
};

const signVerifyPostMailSaga = createAsyncSaga(
    signVerifyPostMailAsyncAction,
    signVerifyPostMailApi
);

const signVerifyPostCodeSaga = createAsyncSaga(
    signVerifyPostCodeAsyncAction,
    signVerifyPostCodeApi
);

export function* watchSignVerifySaga() {
    yield takeLatest(
        ASYNC_SIGN_VERIFY_POST_MAIL.REQUEST,
        signVerifyPostMailSaga
    );

    yield takeLatest(
        ASYNC_SIGN_VERIFY_POST_CODE.REQUEST,
        signVerifyPostCodeSaga
    );
}
