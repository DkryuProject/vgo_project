import { takeEvery } from 'redux-saga/effects';
import createAsyncSaga from 'core/utils/reduxUtil';
import apiUtil from 'core/utils/apiUtil';
import {
    ASYNC_SUPPLIER_ORDER_GET_PAGES,
    supplierOrderGetPagesAsyncAction,
    ASYNC_SUPPLIER_ORDER_POST,
    supplierOrderPostAsyncAction,
} from './reducer';

const supplierOrderGetPagesApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/supplier/order`,
        params: {
            page: payload.current,
            size: payload.pageSize,
            searchKeyWord: payload.searchKeyword,
        },
        method: 'GET',
    });

    return res.data;
};

const supplierOrderPostApi = async (payload) => {
    const res = await apiUtil({
        url: `/v1/supplier/order`,
        data: payload,
        method: 'POST',
    });

    return res.data;
};

const supplierOrderGetPagesSaga = createAsyncSaga(
    supplierOrderGetPagesAsyncAction,
    supplierOrderGetPagesApi
);

const supplierOrderPostSaga = createAsyncSaga(
    supplierOrderPostAsyncAction,
    supplierOrderPostApi
);

export function* watchSupplierOrderSaga() {
    yield takeEvery(
        ASYNC_SUPPLIER_ORDER_GET_PAGES.REQUEST,
        supplierOrderGetPagesSaga
    );
    yield takeEvery(ASYNC_SUPPLIER_ORDER_POST.REQUEST, supplierOrderPostSaga);
}
