import { takeLatest } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_COMMON_YEAR_GET_LISTS,
    commonYearGetListsAsyncAction,
} from './reducer';

const commonYearGetListsApi = async () => {
    const res = await apiUtil({
        url: `/v1/common/years/`,
        method: 'GET',
    });

    return res.data;
};

const commonYearGetListsSaga = createAsyncSaga(
    commonYearGetListsAsyncAction,
    commonYearGetListsApi
);

export function* watchCommonYearSaga() {
    yield takeLatest(
        ASYNC_COMMON_YEAR_GET_LISTS.REQUEST,
        commonYearGetListsSaga
    );
}
