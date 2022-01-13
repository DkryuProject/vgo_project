import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MATERIAL_OPTION_GET_LISTS,
    materialOptionGetListsAsyncAction,
    ASYNC_MATERIAL_OPTION_GET_PAGES,
    materialOptionGetPagesAsyncAction,
    ASYNC_MATERIAL_OPTION_GET_ID,
    materialOptionGetIdAsyncAction,
    ASYNC_MATERIAL_OPTION_GET_INFO_ID,
    materialOptionGetInfoIdAsyncAction,
    ASYNC_MATERIAL_OPTION_POST,
    materialOptionPostAsyncAction,
    ASYNC_MATERIAL_OPTION_PUT_DELETE,
    materialOptionPutDeleteAsyncAction,
} from './reducer';

const materialOptionGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/options`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const materialOptionGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/options`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const materialOptionGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/option/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialOptionGetInfoIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/option/info/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialOptionPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/option`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const materialOptionPutDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/option`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const materialOptionGetListsSaga = createAsyncSaga(
    materialOptionGetListsAsyncAction,
    materialOptionGetListsApi
);

const materialOptionGetPagesSaga = createAsyncSaga(
    materialOptionGetPagesAsyncAction,
    materialOptionGetPagesApi
);

const materialOptionGetIdSaga = createAsyncSaga(
    materialOptionGetIdAsyncAction,
    materialOptionGetIdApi
);

const materialOptionGetInfoIdSaga = createAsyncSaga(
    materialOptionGetInfoIdAsyncAction,
    materialOptionGetInfoIdApi
);

const materialOptionPostSaga = createAsyncSaga(
    materialOptionPostAsyncAction,
    materialOptionPostApi
);

const materialOptionPutDeleteSaga = createAsyncSaga(
    materialOptionPutDeleteAsyncAction,
    materialOptionPutDeleteApi
);

export function* watchMaterialOptionSaga() {
    yield takeEvery(
        ASYNC_MATERIAL_OPTION_GET_LISTS.REQUEST,
        materialOptionGetListsSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_OPTION_GET_PAGES.REQUEST,
        materialOptionGetPagesSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_OPTION_GET_ID.REQUEST,
        materialOptionGetIdSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_OPTION_GET_INFO_ID.REQUEST,
        materialOptionGetInfoIdSaga
    );

    yield takeEvery(ASYNC_MATERIAL_OPTION_POST.REQUEST, materialOptionPostSaga);
    yield takeEvery(
        ASYNC_MATERIAL_OPTION_PUT_DELETE.REQUEST,
        materialOptionPutDeleteSaga
    );
}
