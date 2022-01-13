import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MCL_PLANNING_GET_LISTS,
    mclPlanningGetListsAsyncAction,
    ASYNC_MCL_PLANNING_GET_ID,
    mclPlanningGetIdAsyncAction,
    ASYNC_MCL_PLANNING_POST_NEW,
    mclPlanningPostNewAsyncAction,
    ASYNC_MCL_PLANNING_POST_ID,
    mclPlanningPostIdAsyncAction,
    ASYNC_MCL_PLANNING_POST_COPY,
    mclPlanningPostCopyAsyncAction,
    ASYNC_MCL_PLANNING_POST_THREAD,
    mclPlanningPostThreadAsyncAction,
    ASYNC_MCL_PLANNING_PUT_ID,
    mclPlanningPutIdAsyncAction,
    ASYNC_MCL_PLANNING_PUT_OPTION,
    mclPlanningPutOptionAsyncAction,
    ASYNC_MCL_PLANNING_PUT_SUBSIDIARY,
    mclPlanningPutSubsidiaryAsyncAction,
    ASYNC_MCL_PLANNING_PUT_STATUS,
    mclPlanningPutStatusAsyncAction,
    ASYNC_MCL_PLANNING_DELETE,
    mclPlanningDeleteAsyncAction,
} from './reducer';

const mclPlanningGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/material/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclPlanningGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/material/detail/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const mclPlanningPostNewApi = async (payload) => {
    const { type, id, data } = payload;
    const res = await apiUtil({
        url: `/v1/mcl/material/new/${type}/${id}`,
        data: data,
        method: 'POST',
    });

    return res.data;
};

const mclPlanningPostIdApi = async (payload) => {
    const { id, data } = payload;
    const res = await apiUtil({
        url: `/v1/mcl/material/${id}`,
        data: data,
        method: 'POST',
    });

    return res.data;
};

const mclPlanningPostCopyApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/material/copy/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const mclPlanningPostThreadApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/material/${payload}`,
        method: 'POST',
    });

    return res.data;
};

const mclPlanningPutIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/material/${payload.id}`,
        data: payload.data,
        method: 'PUT',
    });

    return res.data;
};

const mclPlanningPutOptionApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/material/option/${payload.id}`,
        params: { materialOptionId: payload.data },
        method: 'PUT',
    });

    return res.data;
};

const mclPlanningPutSubsidiaryApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/material/size/${payload.id}`,
        params: { materialSizeId: payload.data },
        method: 'PUT',
    });

    return res.data;
};

const mclPlanningPutStatusApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/material/status/${payload.id}`,
        params: { status: payload.data },
        method: 'PUT',
    });
    return res.data;
};

const mclPlanningDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/mcl/material/${payload}`,
        method: 'DELETE',
    });

    return res.data;
};

const mclPlanningGetListsSaga = createAsyncSaga(
    mclPlanningGetListsAsyncAction,
    mclPlanningGetListsApi
);

const mclPlanningGetIdSaga = createAsyncSaga(
    mclPlanningGetIdAsyncAction,
    mclPlanningGetIdApi
);

const mclPlanningPostNewSaga = createAsyncSaga(
    mclPlanningPostNewAsyncAction,
    mclPlanningPostNewApi
);

const mclPlanningPostIdSaga = createAsyncSaga(
    mclPlanningPostIdAsyncAction,
    mclPlanningPostIdApi
);

const mclPlanningPostCopySaga = createAsyncSaga(
    mclPlanningPostCopyAsyncAction,
    mclPlanningPostCopyApi
);

const mclPlanningPostThreadSaga = createAsyncSaga(
    mclPlanningPostThreadAsyncAction,
    mclPlanningPostThreadApi
);

const mclPlanningPutIdSaga = createAsyncSaga(
    mclPlanningPutIdAsyncAction,
    mclPlanningPutIdApi
);

const mclPlanningPutOptionSaga = createAsyncSaga(
    mclPlanningPutOptionAsyncAction,
    mclPlanningPutOptionApi
);

const mclPlanningPutSubsidiarySaga = createAsyncSaga(
    mclPlanningPutSubsidiaryAsyncAction,
    mclPlanningPutSubsidiaryApi
);

const mclPlanningPutStatusSaga = createAsyncSaga(
    mclPlanningPutStatusAsyncAction,
    mclPlanningPutStatusApi
);

const mclPlanningDeleteSaga = createAsyncSaga(
    mclPlanningDeleteAsyncAction,
    mclPlanningDeleteApi
);

export function* watchMclPlanningSaga() {
    yield takeEvery(ASYNC_MCL_PLANNING_GET_ID.REQUEST, mclPlanningGetIdSaga);
    yield takeEvery(
        ASYNC_MCL_PLANNING_GET_LISTS.REQUEST,
        mclPlanningGetListsSaga
    );

    yield takeEvery(
        ASYNC_MCL_PLANNING_POST_NEW.REQUEST,
        mclPlanningPostNewSaga
    );

    yield takeEvery(ASYNC_MCL_PLANNING_POST_ID.REQUEST, mclPlanningPostIdSaga);

    yield takeEvery(
        ASYNC_MCL_PLANNING_POST_COPY.REQUEST,
        mclPlanningPostCopySaga
    );

    yield takeEvery(
        ASYNC_MCL_PLANNING_POST_THREAD.REQUEST,
        mclPlanningPostThreadSaga
    );

    yield takeEvery(ASYNC_MCL_PLANNING_PUT_ID.REQUEST, mclPlanningPutIdSaga);

    yield takeEvery(
        ASYNC_MCL_PLANNING_PUT_OPTION.REQUEST,
        mclPlanningPutOptionSaga
    );

    yield takeEvery(
        ASYNC_MCL_PLANNING_PUT_SUBSIDIARY.REQUEST,
        mclPlanningPutSubsidiarySaga
    );

    yield takeEvery(
        ASYNC_MCL_PLANNING_PUT_STATUS.REQUEST,
        mclPlanningPutStatusSaga
    );

    yield takeEvery(ASYNC_MCL_PLANNING_DELETE.REQUEST, mclPlanningDeleteSaga);
}
