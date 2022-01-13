import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_BUYER_ORDER_GET_PAGES,
    buyerOrderGetPagesAsyncAction,
    ASYNC_BUYER_ORDER_GET_ID,
    buyerOrderGetIdAsyncAction,
    ASYNC_BUYER_ORDER_GET_SEARCH,
    buyerOrderGetSearchAsyncAction,
    ASYNC_BUYER_ORDER_POST_EXCEL_UPLOAD,
    buyerOrderPostExcelUploadAsyncAction,
} from './reducer';

const buyerOrderGetPagesApi = async () => {
    const res = await apiUtil({
        url: `/v1/buyer/orders`,
        method: 'GET',
    });

    return res.data;
};

const buyerOrderGetIdApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/buyer/orders/${payload}`,
        method: 'GET',
    });

    return res.data;
};

const buyerOrderGetSearchApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/garment/po/${payload.searchType}/${payload.searchKeyword}`,
        method: 'GET',
    });

    return res.data;
};

const buyerOrderPostExcelUploadApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/order/excel`,
        params: payload,
        method: 'POST',
    });

    return res.data;
};

const buyerOrderGetPagesSaga = createAsyncSaga(
    buyerOrderGetPagesAsyncAction,
    buyerOrderGetPagesApi
);

const buyerOrderGetIdSaga = createAsyncSaga(
    buyerOrderGetIdAsyncAction,
    buyerOrderGetIdApi
);

const buyerOrderGetSearchSaga = createAsyncSaga(
    buyerOrderGetSearchAsyncAction,
    buyerOrderGetSearchApi
);

const buyerOrderPostExcelUploadSaga = createAsyncSaga(
    buyerOrderPostExcelUploadAsyncAction,
    buyerOrderPostExcelUploadApi
);

export function* watchBuyerOrderSaga() {
    yield takeEvery(
        ASYNC_BUYER_ORDER_GET_PAGES.REQUEST,
        buyerOrderGetPagesSaga
    );
    yield takeEvery(ASYNC_BUYER_ORDER_GET_ID.REQUEST, buyerOrderGetIdSaga);
    yield takeEvery(
        ASYNC_BUYER_ORDER_GET_SEARCH.REQUEST,
        buyerOrderGetSearchSaga
    );

    yield takeEvery(
        ASYNC_BUYER_ORDER_POST_EXCEL_UPLOAD.REQUEST,
        buyerOrderPostExcelUploadSaga
    );
}
