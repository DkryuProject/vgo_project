import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_CBD_INFO_GET_LISTS,
    cbdInfoGetListsAsyncAction,
    ASYNC_CBD_INFO_GET_ID,
    cbdInfoGetIdAsyncAction,
    ASYNC_CBD_INFO_POST,
    cbdInfoPostAsyncAction,
    ASYNC_CBD_INFO_POST_ASSIGN,
    cbdInfoPostAssignAsyncAction,
    ASYNC_CBD_INFO_PUT,
    cbdInfoPutAsyncAction,
    ASYNC_CBD_INFO_PUT_OPTION,
    cbdInfoPutOptionAsyncAction,
    ASYNC_CBD_INFO_PUT_SUBSIDIARY,
    cbdInfoPutSubsidiaryAsyncAction,
    ASYNC_CBD_INFO_DELETE,
    cbdInfoDeleteAsyncAction,
} from './reducer';

const cbdInfoGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/info/${payload.type}/${payload.id}`,
        method: 'GET',
    });
    return {
        type: payload.type,
        data: res.data,
    };
};

const cbdInfoGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/info/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const cbdInfoPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/info/${payload.type}/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const cbdInfoPostAssignApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/info/assign`,
        params: payload,
        method: 'POST',
    });

    return res.data;
};

const cbdInfoPutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/info/${payload.id}`,
        data: payload.data,
        method: 'PUT',
    });

    return res.data;
};

const cbdInfoPutOptionApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/material/option/${payload.id}`,
        params: { materialOptionId: payload.data },
        method: 'PUT',
    });

    return res.data;
};

const cbdInfoPutSubsidiaryApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/material/size/${payload.id}`,
        params: { materialSizeId: payload.data },
        method: 'PUT',
    });

    return res.data;
};

const cbdInfoDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/cbd/info/${payload}`,
        method: 'DELETE',
    });

    return res.data;
};

const cbdInfoGetListsSaga = createAsyncSaga(
    cbdInfoGetListsAsyncAction,
    cbdInfoGetListsApi
);

const cbdInfoGetIdSaga = createAsyncSaga(
    cbdInfoGetIdAsyncAction,
    cbdInfoGetIdApi
);

const cbdInfoPostSaga = createAsyncSaga(cbdInfoPostAsyncAction, cbdInfoPostApi);

const cbdInfoPostAssignSaga = createAsyncSaga(
    cbdInfoPostAssignAsyncAction,
    cbdInfoPostAssignApi
);

const cbdInfoPutSaga = createAsyncSaga(cbdInfoPutAsyncAction, cbdInfoPutApi);
const cbdInfoPutOptionSaga = createAsyncSaga(
    cbdInfoPutOptionAsyncAction,
    cbdInfoPutOptionApi
);
const cbdInfoPutSubsidiarySaga = createAsyncSaga(
    cbdInfoPutSubsidiaryAsyncAction,
    cbdInfoPutSubsidiaryApi
);

const cbdInfoDeleteSaga = createAsyncSaga(
    cbdInfoDeleteAsyncAction,
    cbdInfoDeleteApi
);

export function* watchCbdInfoSaga() {
    yield takeEvery(ASYNC_CBD_INFO_GET_LISTS.REQUEST, cbdInfoGetListsSaga);
    yield takeEvery(ASYNC_CBD_INFO_GET_ID.REQUEST, cbdInfoGetIdSaga);
    yield takeEvery(ASYNC_CBD_INFO_POST.REQUEST, cbdInfoPostSaga);
    yield takeEvery(ASYNC_CBD_INFO_POST_ASSIGN.REQUEST, cbdInfoPostAssignSaga);
    yield takeEvery(ASYNC_CBD_INFO_PUT.REQUEST, cbdInfoPutSaga);
    yield takeEvery(ASYNC_CBD_INFO_PUT_OPTION.REQUEST, cbdInfoPutOptionSaga);
    yield takeEvery(
        ASYNC_CBD_INFO_PUT_SUBSIDIARY.REQUEST,
        cbdInfoPutSubsidiarySaga
    );
    yield takeEvery(ASYNC_CBD_INFO_DELETE.REQUEST, cbdInfoDeleteSaga);
}
