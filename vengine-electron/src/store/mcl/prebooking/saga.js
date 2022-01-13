import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MCL_PREBOOKING_GET_LISTS,
    mclPrebookingGetListsAsyncAction,
    ASYNC_MCL_PREBOOKING_POST,
    mclPrebookingPostAsyncAction,
    ASYNC_MCL_PREBOOKING_PUT,
    mclPrebookingPutAsyncAction,
    ASYNC_MCL_PREBOOKING_DELETE,
    mclPrebookingDeleteAsyncAction,
} from './reducer';

const mclPrebookingGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/pre-bookings/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclPrebookingPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/pre-booking`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const mclPrebookingPutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/pre-booking/${payload.id}`,
        params: { cbdOptionID: payload.cbdOptionId },
        method: 'PUT',
    });

    return res.data;
};

const mclPrebookingDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/pre-booking/${payload}`,
        method: 'DELETE',
    });

    return res.data;
};

const mclPrebookingGetListsSaga = createAsyncSaga(
    mclPrebookingGetListsAsyncAction,
    mclPrebookingGetListsApi
);

const mclPrebookingPostSaga = createAsyncSaga(
    mclPrebookingPostAsyncAction,
    mclPrebookingPostApi
);

const mclPrebookingPutSaga = createAsyncSaga(
    mclPrebookingPutAsyncAction,
    mclPrebookingPutApi
);

const mclPrebookingDeleteSaga = createAsyncSaga(
    mclPrebookingDeleteAsyncAction,
    mclPrebookingDeleteApi
);

export function* watchMclPrebookingSaga() {
    yield takeEvery(
        ASYNC_MCL_PREBOOKING_GET_LISTS.REQUEST,
        mclPrebookingGetListsSaga
    );
    yield takeEvery(ASYNC_MCL_PREBOOKING_POST.REQUEST, mclPrebookingPostSaga);
    yield takeEvery(ASYNC_MCL_PREBOOKING_PUT.REQUEST, mclPrebookingPutSaga);
    yield takeEvery(
        ASYNC_MCL_PREBOOKING_DELETE.REQUEST,
        mclPrebookingDeleteSaga
    );
}
