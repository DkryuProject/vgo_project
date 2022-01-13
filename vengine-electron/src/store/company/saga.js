import { takeLatest } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_COMPANY_GET_LISTS,
    companyGetListsAsyncAction,
    ASYNC_COMPANY_GET_ID,
    companyGetIdAsyncAction,
    ASYNC_COMPANY_GET_CODE,
    companyGetCodeAsyncAction,
    ASYNC_COMPANY_GET_NAME,
    companyGetNameAsyncAction,
    ASYNC_COMPANY_GET_RELATION_TYPE,
    companyGetRelationTypeAsyncAction,
    ASYNC_COMPANY_GET_ADDRESS,
    companyGetAddressAsyncAction,
    companyGetBrandAsyncAction,
    ASYNC_COMPANY_GET_BRAND,
    companyGetSearchAsyncAction,
    ASYNC_COMPANY_GET_SEARCH,
    ASYNC_COMPANY_PUT,
    companyPutAsyncAction,
    ASYNC_COMPANY_POST_IMAGE,
    companyPostImageAsyncAction,
} from './reducer';

const companyGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/companys`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const companyGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company`,
        params: { id: payload },
        method: 'GET',
    });

    return res.data;
};

const companyGetCodeApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/findByCompanyCode`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const companyGetNameApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/name/page`,
        params: {
            page: payload.current,
            size: payload.pageSize,
            searchKeyword: payload.searchKeyword,
        },
        method: 'GET',
    });

    return res.data;
};

export const companyGetRelationTypeApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const companyGetAddressApi = async (payload) => {
    if (!payload) return;
    const res = await apiUtil({
        url: `/v1/company/address/list/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const companyGetBrandApi = async (payload) => {
    if (!payload) return;
    const res = await apiUtil({
        url: `/v1/brand/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const companyGetSearchApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company/search/${payload.type}`,
        params: {
            page: payload.current,
            size: payload.pageSize,
            searchKeyword: payload.searchKeyword,
        },
        method: 'GET',
    });

    return res.data;
};

const companyPutApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/company`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const companyPostImageApi = async (payload) => {
    const formData = new FormData();
    formData.append('file', payload.file);

    const res = await apiUtil({
        url: `/v1/company/file`,
        data: formData,
        method: 'POST',
    });

    return res.data;
};

const companyGetListsSaga = createAsyncSaga(
    companyGetListsAsyncAction,
    companyGetListsApi
);

const companyGetIdSaga = createAsyncSaga(
    companyGetIdAsyncAction,
    companyGetIdApi
);

const companyGetCodeSaga = createAsyncSaga(
    companyGetCodeAsyncAction,
    companyGetCodeApi
);

const companyGetNameSaga = createAsyncSaga(
    companyGetNameAsyncAction,
    companyGetNameApi
);

const companyGetRelationTypeSaga = createAsyncSaga(
    companyGetRelationTypeAsyncAction,
    companyGetRelationTypeApi
);

const companyGetBrandSaga = createAsyncSaga(
    companyGetBrandAsyncAction,
    companyGetBrandApi
);

const companyGetAddressSaga = createAsyncSaga(
    companyGetAddressAsyncAction,
    companyGetAddressApi
);

const companyGetSearchSaga = createAsyncSaga(
    companyGetSearchAsyncAction,
    companyGetSearchApi
);

const companyPutSaga = createAsyncSaga(companyPutAsyncAction, companyPutApi);

const companyPostImageSaga = createAsyncSaga(
    companyPostImageAsyncAction,
    companyPostImageApi
);

export function* watchCompanySaga() {
    yield takeLatest(ASYNC_COMPANY_GET_LISTS.REQUEST, companyGetListsSaga);
    yield takeLatest(ASYNC_COMPANY_GET_ID.REQUEST, companyGetIdSaga);
    yield takeLatest(ASYNC_COMPANY_GET_CODE.REQUEST, companyGetCodeSaga);
    yield takeLatest(ASYNC_COMPANY_GET_NAME.REQUEST, companyGetNameSaga);
    yield takeLatest(
        ASYNC_COMPANY_GET_RELATION_TYPE.REQUEST,
        companyGetRelationTypeSaga
    );
    yield takeLatest(ASYNC_COMPANY_GET_BRAND.REQUEST, companyGetBrandSaga);
    yield takeLatest(ASYNC_COMPANY_GET_ADDRESS.REQUEST, companyGetAddressSaga);
    yield takeLatest(ASYNC_COMPANY_GET_SEARCH.REQUEST, companyGetSearchSaga);
    yield takeLatest(ASYNC_COMPANY_PUT.REQUEST, companyPutSaga);
    yield takeLatest(ASYNC_COMPANY_POST_IMAGE.REQUEST, companyPostImageSaga);
}
