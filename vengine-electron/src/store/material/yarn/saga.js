import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MATERIAL_YARN_GET_LISTS,
    materialYarnGetListsAsyncAction,
    ASYNC_MATERIAL_YARN_GET_PAGES,
    materialYarnGetPagesAsyncAction,
    ASYNC_MATERIAL_YARN_GET_ID,
    materialYarnGetIdAsyncAction,
    ASYNC_MATERIAL_YARN_GET_INFO_ID,
    materialYarnGetInfoIdAsyncAction,
    ASYNC_MATERIAL_YARN_POST,
    materialYarnPostAsyncAction,
    ASYNC_MATERIAL_YARN_PUT_DELETE,
    materialYarnPutDeleteAsyncAction,
} from './reducer';

const materialYarnGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/yarns`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const materialYarnGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/yarns`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const materialYarnGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/yarn/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialYarnGetInfoIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/yarn/info/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialYarnPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/yarn`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const materialYarnPutDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/yarn`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const materialYarnGetListsSaga = createAsyncSaga(
    materialYarnGetListsAsyncAction,
    materialYarnGetListsApi
);

const materialYarnGetPagesSaga = createAsyncSaga(
    materialYarnGetPagesAsyncAction,
    materialYarnGetPagesApi
);

const materialYarnGetIdSaga = createAsyncSaga(
    materialYarnGetIdAsyncAction,
    materialYarnGetIdApi
);

const materialYarnGetInfoIdSaga = createAsyncSaga(
    materialYarnGetInfoIdAsyncAction,
    materialYarnGetInfoIdApi
);

const materialYarnPostSaga = createAsyncSaga(
    materialYarnPostAsyncAction,
    materialYarnPostApi
);

const materialYarnPutDeleteSaga = createAsyncSaga(
    materialYarnPutDeleteAsyncAction,
    materialYarnPutDeleteApi
);

export function* watchMaterialYarnSaga() {
    yield takeEvery(
        ASYNC_MATERIAL_YARN_GET_LISTS.REQUEST,
        materialYarnGetListsSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_YARN_GET_PAGES.REQUEST,
        materialYarnGetPagesSaga
    );
    yield takeEvery(ASYNC_MATERIAL_YARN_GET_ID.REQUEST, materialYarnGetIdSaga);
    yield takeEvery(
        ASYNC_MATERIAL_YARN_GET_INFO_ID.REQUEST,
        materialYarnGetInfoIdSaga
    );

    yield takeEvery(ASYNC_MATERIAL_YARN_POST.REQUEST, materialYarnPostSaga);
    yield takeEvery(
        ASYNC_MATERIAL_YARN_PUT_DELETE.REQUEST,
        materialYarnPutDeleteSaga
    );
}
