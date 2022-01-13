import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MATERIAL_SUBSIDIARY_GET_LISTS,
    materialSubsidiaryGetListsAsyncAction,
    ASYNC_MATERIAL_SUBSIDIARY_GET_PAGES,
    materialSubsidiaryGetPagesAsyncAction,
    ASYNC_MATERIAL_SUBSIDIARY_GET_ID,
    materialSubsidiaryGetIdAsyncAction,
    ASYNC_MATERIAL_SUBSIDIARY_GET_INFO_ID,
    materialSubsidiaryGetInfoIdAsyncAction,
    ASYNC_MATERIAL_SUBSIDIARY_POST,
    materialSubsidiaryPostAsyncAction,
    ASYNC_MATERIAL_SUBSIDIARY_PUT_DELETE,
    materialSubsidiaryPutDeleteAsyncAction,
} from './reducer';

const materialSubsidiaryGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/subsidarys`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const materialSubsidiaryGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/subsidarys`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const materialSubsidiaryGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/subsidary/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialSubsidiaryGetInfoIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/subsidary/info/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialSubsidiaryPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/subsidary`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const materialSubsidiaryPutDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/subsidary`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const materialSubsidiaryGetListsSaga = createAsyncSaga(
    materialSubsidiaryGetListsAsyncAction,
    materialSubsidiaryGetListsApi
);

const materialSubsidiaryGetPagesSaga = createAsyncSaga(
    materialSubsidiaryGetPagesAsyncAction,
    materialSubsidiaryGetPagesApi
);

const materialSubsidiaryGetIdSaga = createAsyncSaga(
    materialSubsidiaryGetIdAsyncAction,
    materialSubsidiaryGetIdApi
);

const materialSubsidiaryGetInfoIdSaga = createAsyncSaga(
    materialSubsidiaryGetInfoIdAsyncAction,
    materialSubsidiaryGetInfoIdApi
);

const materialSubsidiaryPostSaga = createAsyncSaga(
    materialSubsidiaryPostAsyncAction,
    materialSubsidiaryPostApi
);

const materialSubsidiaryPutDeleteSaga = createAsyncSaga(
    materialSubsidiaryPutDeleteAsyncAction,
    materialSubsidiaryPutDeleteApi
);

export function* watchMaterialSubsidiarySaga() {
    yield takeEvery(
        ASYNC_MATERIAL_SUBSIDIARY_GET_LISTS.REQUEST,
        materialSubsidiaryGetListsSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_SUBSIDIARY_GET_PAGES.REQUEST,
        materialSubsidiaryGetPagesSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_SUBSIDIARY_GET_ID.REQUEST,
        materialSubsidiaryGetIdSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_SUBSIDIARY_GET_INFO_ID.REQUEST,
        materialSubsidiaryGetInfoIdSaga
    );

    yield takeEvery(
        ASYNC_MATERIAL_SUBSIDIARY_POST.REQUEST,
        materialSubsidiaryPostSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_SUBSIDIARY_PUT_DELETE.REQUEST,
        materialSubsidiaryPutDeleteSaga
    );
}
