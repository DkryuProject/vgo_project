import { takeLatest } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_COMMON_ENUMS_GET_LISTS,
    commonEnumsGetListsAsyncAction,
} from './reducer';

const commonEnumsGetListsApi = async () => {
    const res = await apiUtil({
        url: `/v1/common/enums`,
        method: 'GET',
    });

    return res.data;
};

const commonEnumsGetListsSaga = createAsyncSaga(
    commonEnumsGetListsAsyncAction,
    commonEnumsGetListsApi
);

export function* watchCommonEnumsSaga() {
    yield takeLatest(
        ASYNC_COMMON_ENUMS_GET_LISTS.REQUEST,
        commonEnumsGetListsSaga
    );
}
