import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MATERIAL_INFO_GET_LISTS,
    materialInfoGetListsAsyncAction,
    ASYNC_MATERIAL_INFO_GET_PAGES,
    materialInfoGetPagesAsyncAction,
    ASYNC_MATERIAL_INFO_GET_ID,
    materialInfoGetIdAsyncAction,
    ASYNC_MATERIAL_INFO_GET_CHIEF,
    materialInfoGetChiefAsyncAction,
    ASYNC_MATERIAL_INFO_POST,
    materialInfoPostAsyncAction,
    ASYNC_MATERIAL_INFO_POST_FILTER,
    materialInfoPostFilterAsyncAction,
    ASYNC_MATERIAL_INFO_POST_EXCEL_UPLOAD,
    materialInfoPostExcelUploadAsyncAction,
    ASYNC_MATERIAL_INFO_PUT_DELETE,
    materialInfoPutDeleteAsyncAction,
} from './reducer';

const materialInfoGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/info-list`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const materialInfoGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/info/page`,
        params: {
            page: payload.current,
            size: payload.pageSize,
            searchKeyWord: payload.searchKeyword,
            type: payload.type,
        },
        method: 'GET',
    });

    return res.data;
};

const materialInfoGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/info/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialInfoGetChiefApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/chief-contents`,
        method: 'GET',
    });
    return res.data;
};

const materialInfoPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/info`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const materialInfoPostFilterApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/info/filter`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const materialInfoPostExcelUploadApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/excel/save/${payload.type}`,
        params: payload.data,
        method: 'POST',
    });

    return res.data;
};

const materialInfoPutDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/info`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const materialInfoGetListsSaga = createAsyncSaga(
    materialInfoGetListsAsyncAction,
    materialInfoGetListsApi
);

const materialInfoGetPagesSaga = createAsyncSaga(
    materialInfoGetPagesAsyncAction,
    materialInfoGetPagesApi
);

const materialInfoGetIdSaga = createAsyncSaga(
    materialInfoGetIdAsyncAction,
    materialInfoGetIdApi
);

const materialInfoGetChiefSaga = createAsyncSaga(
    materialInfoGetChiefAsyncAction,
    materialInfoGetChiefApi
);

const materialInfoPostSaga = createAsyncSaga(
    materialInfoPostAsyncAction,
    materialInfoPostApi
);

const materialInfoPostFilterSaga = createAsyncSaga(
    materialInfoPostFilterAsyncAction,
    materialInfoPostFilterApi
);

const materialInfoPostExcelUploadSaga = createAsyncSaga(
    materialInfoPostExcelUploadAsyncAction,
    materialInfoPostExcelUploadApi
);

const materialInfoPutDeleteSaga = createAsyncSaga(
    materialInfoPutDeleteAsyncAction,
    materialInfoPutDeleteApi
);

export function* watchMaterialInfoSaga() {
    yield takeEvery(
        ASYNC_MATERIAL_INFO_GET_LISTS.REQUEST,
        materialInfoGetListsSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_INFO_GET_PAGES.REQUEST,
        materialInfoGetPagesSaga
    );
    yield takeEvery(ASYNC_MATERIAL_INFO_GET_ID.REQUEST, materialInfoGetIdSaga);
    yield takeEvery(
        ASYNC_MATERIAL_INFO_GET_CHIEF.REQUEST,
        materialInfoGetChiefSaga
    );
    yield takeEvery(ASYNC_MATERIAL_INFO_POST.REQUEST, materialInfoPostSaga);
    yield takeEvery(
        ASYNC_MATERIAL_INFO_POST_FILTER.REQUEST,
        materialInfoPostFilterSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_INFO_POST_EXCEL_UPLOAD.REQUEST,
        materialInfoPostExcelUploadSaga
    );

    yield takeEvery(
        ASYNC_MATERIAL_INFO_PUT_DELETE.REQUEST,
        materialInfoPutDeleteSaga
    );
}
