import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_MATERIAL_OFFER_GET_LISTS,
    materialOfferGetListsAsyncAction,
    ASYNC_MATERIAL_OFFER_GET_PAGES,
    materialOfferGetPagesAsyncAction,
    ASYNC_MATERIAL_OFFER_GET_ID,
    materialOfferGetIdAsyncAction,
    ASYNC_MATERIAL_OFFER_GET_INFO_ID,
    materialOfferGetInfoIdAsyncAction,
    ASYNC_MATERIAL_OFFER_POST,
    materialOfferPostAsyncAction,
    ASYNC_MATERIAL_OFFER_PUT_DELETE,
    materialOfferPutDeleteAsyncAction,
} from './reducer';

const materialOfferGetListsApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offers`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const materialOfferGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offers`,
        params: payload,
        method: 'GET',
    });

    return res.data;
};

const materialOfferGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offer/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialOfferGetInfoIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offer/info/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const materialOfferPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offer/${payload.id}`,
        data: payload.data,
        method: 'POST',
    });

    return res.data;
};

const materialOfferPutDeleteApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/material/offer`,
        data: payload,
        method: 'PUT',
    });

    return res.data;
};

const materialOfferGetListsSaga = createAsyncSaga(
    materialOfferGetListsAsyncAction,
    materialOfferGetListsApi
);

const materialOfferGetPagesSaga = createAsyncSaga(
    materialOfferGetPagesAsyncAction,
    materialOfferGetPagesApi
);

const materialOfferGetIdSaga = createAsyncSaga(
    materialOfferGetIdAsyncAction,
    materialOfferGetIdApi
);

const materialOfferGetInfoIdSaga = createAsyncSaga(
    materialOfferGetInfoIdAsyncAction,
    materialOfferGetInfoIdApi
);

const materialOfferPostSaga = createAsyncSaga(
    materialOfferPostAsyncAction,
    materialOfferPostApi
);

const materialOfferPutDeleteSaga = createAsyncSaga(
    materialOfferPutDeleteAsyncAction,
    materialOfferPutDeleteApi
);

export function* watchMaterialOfferSaga() {
    yield takeEvery(
        ASYNC_MATERIAL_OFFER_GET_LISTS.REQUEST,
        materialOfferGetListsSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_OFFER_GET_PAGES.REQUEST,
        materialOfferGetPagesSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_OFFER_GET_ID.REQUEST,
        materialOfferGetIdSaga
    );
    yield takeEvery(
        ASYNC_MATERIAL_OFFER_GET_INFO_ID.REQUEST,
        materialOfferGetInfoIdSaga
    );

    yield takeEvery(ASYNC_MATERIAL_OFFER_POST.REQUEST, materialOfferPostSaga);
    yield takeEvery(
        ASYNC_MATERIAL_OFFER_PUT_DELETE.REQUEST,
        materialOfferPutDeleteSaga
    );
}
