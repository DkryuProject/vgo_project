import { takeLatest } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_SIGN_CHECK_GET_EMAIL,
    signCheckGetEmailAsyncAction,
    ASYNC_SIGN_CHECK_GET_DOMAIN,
    signCheckGetDomainAsyncAction,
} from './reducer';

const signCheckGetEmailApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/emailcheck`,
        params: payload,
        method: 'GET',
    });
    return res.data;
};

const signCheckGetDomainApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/domaincheck`,
        params: payload,
        method: 'GET',
    });
    return res.data;
};

const signCheckGetEmailSaga = createAsyncSaga(
    signCheckGetEmailAsyncAction,
    signCheckGetEmailApi
);

const signCheckGetDomainSaga = createAsyncSaga(
    signCheckGetDomainAsyncAction,
    signCheckGetDomainApi
);

export function* watchSignCheckSaga() {
    yield takeLatest(ASYNC_SIGN_CHECK_GET_EMAIL.REQUEST, signCheckGetEmailSaga);
    yield takeLatest(
        ASYNC_SIGN_CHECK_GET_DOMAIN.REQUEST,
        signCheckGetDomainSaga
    );
}
